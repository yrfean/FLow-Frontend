import useNotificaions from "../CustomHooks.tsx/Notification";
import { useAllData } from "../Query/QueryAndMutation";

const ChatList = ({ setClickedUser, onlineUsers }: any) => {
  const { data } = useAllData();
  const { notification } = useNotificaions();
  console.log(notification);

  // removing userself
  const user = data?.allUsers?.filter(
    (user: any) => user._id !== data.user._id
  );

  return (
    <>
      <div className="w-[30%] h-full border-r-2 border-r-gray-300 overflow-y-scroll custom-scrollbar">
        <h1 className="text-4xl font-bold font-serif pt-5 mb-3 ml-6 text-violet-500">
          Messages
        </h1>
        <div className="w-[90%] ml-4 h-1 bg-gray-300" />
        {/* users list container*/}
        <div className="w-full p-2">
          {user?.map((user: any) => {
            return (
              <div
                key={user._id}
                onClick={() => setClickedUser(user)}
                className="w-full h-fit bg-gray-300 flex items-center justify-between py-3 my-2 cursor-pointer hover:shadow hover:scale-105 transition-all duration-300 gap-4 px-4 rounded-lg"
              >
                {/* Profile Picture + Online Dot */}
                <div className="relative p-1">
                  <img
                    src={user.dp ? user.dp : "./man.png"}
                    alt="user dp"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  {onlineUsers?.includes(user._id) && (
                    <div className="absolute w-3 h-3 top-0 right-0 bg-green-500 shadow rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Username & Status */}
                <div className="flex-1">
                  <h1 className="text-base font-semibold">{user.name}</h1>
                  {onlineUsers?.includes(user._id) && (
                    <p className="text-green-500 text-sm">online</p>
                  )}
                </div>

                {/* Notification Count */}
                {notification?.filter((msg: any) => msg.senderId === user._id)
                  ?.length > 0 && (
                  <div className="bg-violet-600 text-white text-xs px-2 py-[2px] rounded-full min-w-[20px] text-center font-semibold">
                    {notification.filter(
                      (msg: any) => msg.senderId === user._id
                    ).length > 9
                      ? "9+"
                      : notification.filter(
                          (msg: any) => msg.senderId === user._id
                        ).length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatList;
