import { MessageSquareWarning } from "lucide-react";
import { useAllData } from "../Query/QueryAndMutation";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useNotificaions from "../CustomHooks.tsx/Notification";

const Header = () => {
  const { data } = useAllData();
  const [isAdmin, setIsAdmin] = useState(false);
  const [outPopup, setOutPopup] = useState(false);
  const { notification } = useNotificaions();
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const handleLogout = () => {
    navigate("/login");
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  };

  return (
    <div className="h-[10%] w-full flex items-center bg-gray-200 shadow-sm">
      {/* Left Logo Section */}
      <div className="h-full w-[22%] flex items-center justify-center">
        <img
          src="./Flow_logo_211215.png"
          alt="flow logo"
          className="h-[30%] opacity-85"
        />
      </div>

      {/* Right Header Section */}
      <div className="flex items-center h-full w-full outline outline-1 outline-gray-300 px-6 relative">
        {/* Notifications */}
        <div className="ml-auto flex items-center gap-6">
          <div
            onClick={() => navigate("/messages")}
            className="relative text-gray-500 cursor-pointer group hover:text-violet-500 hover:scale-110 transition-all ease-in-out"
          >
            {notification?.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] px-1.5 py-[2px] rounded-full font-semibold min-w-[16px] text-center">
                {notification?.length > 9 ? "9+" : notification?.length}
              </div>
            )}
            <MessageSquareWarning className="w-6 h-6" />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-lg font-semibold">{data?.user?.name}</h1>
              <p className="text-sm text-gray-400">
                {!isAdmin && !data?.user?.location
                  ? "set ur location in settings"
                  : data?.user?.location}
              </p>
            </div>
            <img
              src={!isAdmin && !data?.user?.dp ? "./man.png" : data?.user?.dp}
              alt="pfp"
              className="w-9 h-9 rounded-full object-cover cursor-pointer hover:scale-110 transition duration-200"
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setOutPopup(true)}
            className="bg-violet-500 text-white hover:text-violet-500 hover:bg-white border border-violet-500 transition-all px-5 py-1 rounded font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Logout Confirmation Popup */}
        {outPopup && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-gray-100 p-6 rounded-md shadow-md z-50 w-[280px] text-center">
            <p className="text-lg font-medium mb-4 text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-1 rounded"
                onClick={() => setOutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-1 rounded"
                onClick={handleLogout}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
