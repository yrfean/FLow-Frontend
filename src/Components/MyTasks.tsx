import { useEffect, useMemo, useState } from "react";
import { useUpdateTask } from "../Query/QueryAndMutation";
import { ImageIcon, Paperclip, Search } from "lucide-react";

const MyTasks = ({ projectTasks }: any) => {
  const [fileteredTasks, setFilteredTasks] = useState([]);
  const [highestIssue, setHighestIssue] = useState<any>();
  const userId = useMemo(() => sessionStorage.getItem("_id"), []);
  const updateTask = useUpdateTask();

  const handleSearchChange = (e: any) => {
    const textValue = e.target.value.toLowerCase();
    if (textValue === "") return setFilteredTasks(userTasks);

    const ft = fileteredTasks.filter(
      (task: any) =>
        task.title.toLowerCase().includes(textValue) ||
        task.description.toLowerCase().includes(textValue)
    );

    setFilteredTasks(ft);
  };

  const handleStatusFilter = (e: any) => {
    const status = e.target.value;
    if (status === "all") return setFilteredTasks(userTasks);

    const ft = fileteredTasks.filter((task: any) => task.status === status);
    setFilteredTasks(ft);
  };

  const handleIssueFilter = (e: any) => {
    const issue = e.target.value;
    if (issue === "all") return setFilteredTasks(userTasks);
    const ft = userTasks.filter((task: any) => task.issue === issue);

    setFilteredTasks(ft);
  };

  const userTasks = useMemo(() => {
    return (projectTasks || []).filter(
      (task: any) => task.assignedTo === userId
    );
  }, [projectTasks, userId]);

  useEffect(() => {
    setFilteredTasks(userTasks);
  }, [userTasks]);

  useEffect(() => {
    const issue = projectTasks.map((task: any) => task.issue);
    const hI = Math.max(...issue);
    setHighestIssue(hI);
  }, [projectTasks]);

  return (
    <div className="p-3">
      <div className="flex justify-between mb-3">
        <div className="relative shadow">
          <Search className="absolute size-5 text-violet-300 mt-[6px] left-2" />
          <input
            type="text"
            onChange={handleSearchChange}
            placeholder="Search task title and desc.."
            className="w-[337px]
              rounded outline-none px-2 pl-9 py-1 font-semibold
             transition-all duration-500 
             placeholder:transition-all placeholder:duration-500 placeholder:ease-in-out"
          />
        </div>
        <div className="flex gap-5 mr-1">
          <div>
            <select
              onChange={handleStatusFilter}
              className="px-2 font-semibold shadow text-violet-500 h-full rounded outline-none cursor-pointer"
            >
              <option value="all" selected>
                All
              </option>
              <option value="to-do">To-do</option>
              <option value="in-progress">In-progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <select
              onChange={handleIssueFilter}
              className="h-full px-1 rounded shadow font-semibold text-violet-500 cursor-pointer outline-none"
            >
              <option disabled selected hidden>
                ---Select an Issue---
              </option>
              <option value="all">All</option>
              {Array.from({ length: highestIssue }, (_, i) => {
                return (
                  <>
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  </>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fileteredTasks?.map((task: any) => {
          const priorityColors = {
            low: "bg-yellow-100 border-l-4 border-yellow-500",
            high: "bg-red-100 border-l-4 border-red-500",
            urgent: "bg-violet-100 border-l-4 border-violet-500",
            default: "bg-gray-100 border-l-4 border-gray-500",
          };
          const statusColors = {
            "to-do": "bg-gray-200 text-gray-800",
            "in-progress": "bg-blue-200 text-blue-800",
            completed: "bg-green-200 text-green-800",
          };

          return (
            <div
              key={task._id}
              className={`rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg ${
                priorityColors[task.priority as keyof typeof priorityColors] ||
                priorityColors.default
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {task.title.charAt(0).toUpperCase() + task.title.slice(1)}
                    </h2>
                    <div className="flex items-center mt-1">
                      <select
                        onChange={(e) =>
                          updateTask.mutate({
                            id: task._id,
                            details: { status: e.target.value },
                          })
                        }
                        className={`text-xs px-2 py-1 rounded-full cursor-pointer outline-none ${
                          statusColors[task.status as keyof typeof statusColors]
                        }`}
                      >
                        <option selected disabled hidden>
                          {task.status}{" "}
                        </option>
                        <option value="to-do">To do</option>
                        <option value="in-progress">In progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <span className="ml-2 text-xs text-gray-500">
                        Priority: {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">
                    {task?.description?.charAt(0).toUpperCase() +
                      task?.description?.slice(1)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium">
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Issue</p>
                    <p className="text-sm font-medium pl-2">{task.issue}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/taskDocuments/${task.document}`,
                        "_blank"
                      )
                    }
                    disabled={!task.document}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                      task.document
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Paperclip className="size-4" />
                    {task.document ? "Document" : "No document"}
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/taskImages/${task.image}`,
                        "_blank"
                      )
                    }
                    disabled={!task.image}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1 ${
                      task.image
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ImageIcon className="size-4" />
                    {task.image ? "Image" : "No image"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTasks;
