import { useEffect, useState } from "react";
import { useAllData } from "../../Query/QueryAndMutation";
import Priority from "../../Components/Priority";
import { MoveLeft } from "lucide-react";

const HomeTasks = ({ projectId, setProject }: any) => {
  const { data } = useAllData();
  const [tasks, setTasks] = useState<any>();
  const [projectt, setProjectt] = useState<any>();

  useEffect(() => {
    const tasks = data?.allTasks.filter(
      (task: any) => task.project === projectId
    );
    setTasks(tasks);

    const project = data?.allProjects.find(
      (project: any) => project._id === projectId
    );
    setProjectt(project);
  }, [projectId]);
  if (tasks) console.log(tasks);
  return (
    <div className="w-full p-4">
      <div className="mb-2 ml-4 text-2xl flex gap-2 items-center">
        <MoveLeft
          className="translate-y-1 size-7 cursor-pointer hover:text-violet-500 hover:scale-x-110 transition duration-200"
          onClick={() => setProject(false)}
        />
        <h1 className=" font-bold text-violet-500 tracking-wider ">
          {`Tasks of ${projectt?.title} `}
        </h1>
      </div>
      <div className="flex items center gap-2 mt-6 ml-4 text-lg font-bold text-gray-600">
        <p className="text-gray-500">
          Team lead:{" "}
          <span className="text-gray-800">
            {
              data?.allUsers.find(
                (user: any) => user._id === projectt?.teamLead
              )?.name
            }
          </span>
        </p>
        <img
          src={
            data?.allUsers.find((user: any) => user._id === projectt?.teamLead)
              ?.dp
          }
          alt="lead dp"
          className="w-7 h-7 rounded-full object-cover outline outline-violet-500"
        />
      </div>
      {/* task container  */}
      <Priority />
      <div className="grid grid-cols-3 gap-5 w-full p-2">
        {tasks?.map((task: any) => {
          return (
            <div
              className={`shadow-md p-3 rounded font-semibold space-y-2 ${
                task.priority === "low"
                  ? "bg-yellow-200"
                  : task.priority === "high"
                  ? "bg-red-400"
                  : task.priority === "urgent"
                  ? "bg-violet-500"
                  : "bg-gray-100"
              }`}
            >
              <h1 className="text-gray-400 text-lg">
                Title: <span className="text-gray-700">{task?.title}</span>
              </h1>
              <div className="flex gap-3 items-center ">
                <p className="text-gray-400">
                  Assigned to:{" "}
                  <span className="text-gray-700">
                    {
                      data?.allUsers.find(
                        (user: any) => user._id === task.assignedTo
                      )?.name
                    }
                  </span>
                </p>
                <img
                  src={
                    data?.allUsers.find(
                      (user: any) => user._id === task.assignedTo
                    )?.dp
                  }
                  alt="user dp"
                  className="w-7 h-7 mb-2 rounded-full object-cover outline outline-violet-500"
                />
              </div>
              <div
                className={`w-full px-2 py-1   text-gray-100 rounded text-center shadow ${task.status==="completed"?"bg-green-400":task.status==="to-do"?"bg-red-500":"bg-gray-400"}`}
              >
                {task.status}
              </div>
              <div className="flex gap-5 w-full p-1 justify-around">
                <p className="text-gray-400">
                  Assigned at:{" "}
                  <span className="text-gray-700">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-gray-400">
                  Due to:{" "}
                  <span className="text-gray-700">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeTasks;
