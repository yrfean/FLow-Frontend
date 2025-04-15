import { ChevronsLeft, MoveLeft } from "lucide-react";
import { useAllData } from "../../Query/QueryAndMutation";
import Skelton from "../../Components/Skelton";
import { useEffect, useState } from "react";
import ProjectPopup from "../../Components/ProjectPopup";
import LeadAllTasks from "./LeadAllTasks";
import MyTasks from "../../Components/MyTasks";

const ProjectTasks = ({ project, setProject }: any) => {
  const { data, isLoading } = useAllData();
  const [projectPopup, setProjectPopup] = useState(false);
  // const [user, setUser] = useState();
  const [lead, setLead] = useState(false);
  const [allTasks, setAllTasks] = useState(true);
  const [projectTasks, setProjectTasks] = useState([]);

  // check if user is lead or memmber
  useEffect(() => {
    if (project) {
      const lead = project?.teamLead === data?.user._id;
      if (lead) {
        setLead(true);
        // console.log("oh its lead");
      }
    }
  }, [data, project]);

  useEffect(() => {
    if (!data) return;
    const pt = data?.allTasks.filter(
      (task: any) => task.project === project._id
    );
    setProjectTasks(pt);
  }, [data]);
  console.log(projectTasks);

  if (isLoading) {
    return <Skelton />;
  }
  return (
    <div className="w-full h-full relative p-4 overflow-x-hidden overflow-y-auto custom-scrollbar">
      {/* Project Popup */}
      <div
        onMouseEnter={() => setProjectPopup(true)}
        onMouseLeave={() => setProjectPopup(false)}
        className={`absolute w-1/2 opacity-90 h-[85%] z-10 top-5 bg-white rounded-l right-0 ease-in-out transform transition-all duration-300 ${
          projectPopup ? `translate-x-0` : `translate-x-full`
        }`}
      >
        <ProjectPopup project={project} />
      </div>

      <div className="flex justify-between  mb-3 ">
        <MoveLeft
          className="translate-y-1 size-7 text-gray-500 cursor-pointer hover:text-violet-500 hover:scale-x-110 transition duration-200"
          onClick={() => setProject(false)}
        />
        <div
          className="cursor-pointer hover:text-violet-500 flex gap-3 items-center"
          onMouseEnter={() => setProjectPopup(true)}
          onMouseLeave={() => setProjectPopup(false)}
        >
          <h1 className="text-4xl font-serif ml- transition-all duration-200">
            {project?.title.charAt(0).toUpperCase() + project?.title.slice(1) ||
              "No Title"}
          </h1>
          <ChevronsLeft
            className={`mt-2 hover:-translate-x-1 transition-all duration-200 ${
              projectPopup ? `-translate-x-1 transition-all duration-200` : ""
            }`}
          />
        </div>
        {/* filtering */}
        <div className="mr-10"></div>
      </div>

      {lead ? (
        // all tasks
        <>
          {/* nav bar for my task and all tasks */}
          <div className=" h-[20px] mb-5 flex justify-center items-center mr-14">
            <div
              onClick={() => setAllTasks(true)}
              className={`border-r-2 shadow border-white transition-colors duration-200 text-end w-[40%] cursor-pointer text-white font-semibold px-4 py-1 rounded-l ${
                allTasks
                  ? "bg-violet-400 hover:bg-violet-300"
                  : "bg-gray-300 hover:bg-gray-200"
              }`}
            >
              All Tasks
            </div>
            <div
              onClick={() => setAllTasks(false)}
              className={`border-l-2 shadow border-white w-[40%] transition-colors duration-200 cursor-pointer text-white font-semibold px-4 py-1 rounded-r ${
                allTasks
                  ? "bg-gray-300 hover:bg-gray-200"
                  : "bg-violet-400 hover:bg-violet-300"
              }`}
            >
              My Tasks
            </div>
          </div>

          {allTasks ? (
            <div className="">
              <LeadAllTasks
                projectTasks={projectTasks}
                project={project}
                setLead={setLead}
              />
            </div>
          ) : (
            <div className="mt-4">
              <MyTasks projectTasks={projectTasks} />
            </div>
          )}
        </>
      ) : (
        <div className="mt-4">
          <MyTasks projectTasks={projectTasks} project={project} />
        </div>
      )}
    </div>
  );
};

export default ProjectTasks;
