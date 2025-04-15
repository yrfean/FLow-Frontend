import { CheckCheck, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useAllData } from "../Query/QueryAndMutation";
import axios from "axios";

const backendUri = import.meta.env.VITE_BACKEND_PORT;

interface Message {
  _id: string;
  senderId: string;
  recieverId: string;
  message: string;
  seen?: boolean;
}

const ChatArea = ({
  user,
  onlineUsers,
}: {
  user: { _id: string; dp: string; name: string } | null;
  onlineUsers: any;
}) => {
  const { data } = useAllData();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = data?.user?._id;
  const textInputRef = useRef<any>(null);
  const chatEndRef = useRef<any>(null);

  useEffect(() => {
    if (!user || !currentUserId) return;
    textInputRef.current.focus();

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${backendUri}/getMessages/${currentUserId}/${user._id}`
        );
        setMessages(response.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("recieveMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);

      // Emit `markAsSeen` if message is from the current chat user
      if (newMessage.senderId === user._id) {
        socket.emit("markAsSeen", {
          senderId: newMessage.senderId,
          recieverId: currentUserId,
        });
      }
    });

    socket.on("messageDeleted", (deletedMessageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMessageId));
    });

    socket.on("messageSeen", ({ senderId, recieverId }) => {
      if (senderId === currentUserId || recieverId === currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === senderId && msg.recieverId === recieverId
              ? { ...msg, seen: true }
              : msg
          )
        );
      }
    });

    return () => {
      socket.off("recieveMessage");
      socket.off("messageDeleted");
      socket.off("messageSeen");
    };
  }, [user, currentUserId]);

  // Emit `markAsSeen` when user opens the chat if messages are unread
  useEffect(() => {
    if (!user || !currentUserId) return;

    const unreadMessages = messages.some(
      (msg) => msg.senderId === user._id && !msg.seen
    );

    if (unreadMessages) {
      socket.emit("markAsSeen", {
        senderId: user._id,
        recieverId: currentUserId,
      });
    }
  }, [messages, user, currentUserId]);

  const handleSendMessage = () => {
    if (!text.trim() || !currentUserId || !user?._id) return;

    const messageData = {
      senderId: currentUserId,
      message: text,
      recieverId: user._id,
    };

    socket.emit("sendMessage", messageData);
    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        _id: Math.random().toString(),
        seen: false,
        createdAt: Date.now(),
      },
    ]);
    setText("");
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`${backendUri}/deleteMessage/${messageId}`);
      socket.emit("deleteMessage", messageId);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="w-[70%] relative mt-[1px] p-2 bg-gray-200">
      {user ? (
        <>
          {/* User details */}
          <div className="h-[8%] border-b border-gray-300 flex items-center pl-4 gap-3">
            <img
              src={user.dp}
              alt="user dp"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <h1 className="font-semibold text-lg text-gray-700">
                {user.name}
              </h1>
              {onlineUsers.includes(user._id) && (
                <p className="text-green-400 text-sm opacity-85 -mt-1 ml-1">
                  online
                </p>
              )}
            </div>
          </div>

          {/* Message section */}
          <div className="h-[85%] overflow-y-auto py-2 px-4 custom-scrollbar">
            {messages.map((message: any) => {
              const isSent = message.senderId === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex mb-3 ${
                    isSent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] gap-2 ${
                      isSent ? "flex-row-reverse" : ""
                    } group`}
                  >
                    {/* Message bubble */}
                    <div
                      className={`px-4 py-2 rounded-2xl relative ${
                        isSent
                          ? "bg-violet-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      } shadow-sm group transition-all duration-200 hover:shadow-md`}
                    >
                      <p className="text-sm break-words">{message.message}</p>

                      {/* Message status and timestamp */}
                      <div
                        className={`flex items-center justify-end mt-1 space-x-1 ${
                          isSent ? "text-violet-200" : "text-gray-400"
                        }`}
                      >
                        <span className="text-xs">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isSent && (
                          <CheckCheck
                            className={`w-3 h-3 ${
                              message.seen ? "text-blue-300" : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Message actions */}
                    <div className="flex mt-4 flex-col justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSent && (
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="z-10 w-full flex h-[8%] border-t border-gray-300 items-center justify-center gap-3 pr-2">
            <input
              ref={textInputRef}
              placeholder="Type a message"
              type="text"
              className="bg-white w-[90%] px-3 py-1 outline-none rounded"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              disabled={!text.trim()}
              onClick={handleSendMessage}
              className="hover:text-violet-500 hover:scale-105 transition-all"
            >
              <Send
                className={
                  text.trim()
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
              />
            </button>
          </div>
        </>
      ) : (
        <div className="flex w-[100%] flex-col gap-1 justify-center items-center h-[80%]">
          <h1 className="text-2xl font-semibold">Start Messaging Now!</h1>
          <p className="text-sm text-gray-400">
            Send messages to anyone and anytime with realtime connections...
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
