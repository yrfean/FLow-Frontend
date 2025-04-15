// import { useState } from "react";
import {
  Settings,
  LayoutDashboard,
  MessagesSquare,
  Users,
  // Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllData } from "../Query/QueryAndMutation";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { data } = useAllData();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>();

  useEffect(() => {
    const item = sessionStorage.getItem("role");
    if (item === "admin") {
      setIsAdmin(true);
      return;
    }
    const project = data?.allProjects.find(
      (project: any) =>
        project.members.includes(data.user._id) ||
        project.teamLead === data.user._id
    );
    if (project) setProject(project);
  }, [data]);

  return (
    <>
      <div className="w-[17.9%] h-full outline outline-1 outline-gray-300">
        <div className="w-full h-fit pb-5 pt-5 space-y-3">
          <div
            onClick={() => {
              isAdmin ? navigate("/admin") : navigate("/home");
            }}
            className="flex w-ful h-8 pl-11 items-center cursor-pointer mx-3 my- rounded text-gray-500 hover:bg-violet-200 hover:shadow hover:text-black transition-all ease-in"
          >
            <LayoutDashboard className="text-gray-400 w-[24px]" />
            <h1 className="ml-4 text-md font-normal">Dashboard</h1>
          </div>
          <div
            onClick={() => navigate("/messages")}
            className="flex w-ful h-8 pl-11 items-center cursor-pointer mx-3 my-3 rounded text-gray-500 hover:bg-violet-200 hover:shadow hover:text-black transition-all ease-in"
          >
            <MessagesSquare className="text-gray-400 w-[24px]" />
            <h1 className="ml-4 text-md font-normal">Messages</h1>
          </div>
          {/* Only for admin */}
          {isAdmin && (
            <div
              onClick={() => navigate("/admin/members")}
              className="flex w-ful h-8 pl-11 items-center cursor-pointer mx-3 my-3 rounded text-gray-500 hover:bg-violet-200 hover:shadow hover:text-black transition-all ease-in"
            >
              <Users className="w-[24px] text-gray-400" />
              <h1 className="ml-4 text-md font-normal">Members</h1>
            </div>
          )}
          <div
            onClick={() => navigate("/settings")}
            className="flex w-ful h-8 pl-11 items-center cursor-pointer mx-3 my-3 rounded text-gray-500 hover:bg-violet-200 hover:shadow hover:text-black transition-all ease-in"
          >
            <Settings className="font-thin w-6 text-gray-400" />
            <h1 className="ml-4 text-md font-normal">Settings</h1>
          </div>
        </div>
        <div className="w-[90%] ml-3 outline outline-1 outline-gray-300"></div>
      </div>
    </>
  );
};

export default Sidebar;
