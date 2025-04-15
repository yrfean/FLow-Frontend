import { useEffect, useMemo, useState } from "react";
import {
  useAllData,
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from "../../Query/QueryAndMutation";
import { Field, Form, Formik } from "formik";
import { Axe, Delete, Edit, ImageIcon, Paperclip, Search } from "lucide-react";
import Priority from "../../Components/Priority";

const LeadAllTasks = ({ projectTasks, project }: any) => {
  const { data } = useAllData();

  const [newTask, setNewTask] = useState<any>();
  const [editTask, setEditTask] = useState<any>(false);
  const [trans, setTrans] = useState(true);
  const [placeholderIndex, setPlaceHolderIndex] = useState(0);
  const leadId = sessionStorage.getItem("_id");
  const [highestIssue, setHighestIssue] = useState<any>();
  const [fileteredTasks, setFilteredTasks] = useState(projectTasks);

  const allMembers = useMemo(() => {
    return data?.allUsers.filter(
      (user: any) =>
        project.members.includes(user._id) || project.teamLead === user._id
    );
  }, [data]);

  const handleSearchChange = (e: any) => {
    const textValue = e.target.value.toLowerCase();
    if (textValue === "") return setFilteredTasks(projectTasks);

    const ft = fileteredTasks.filter(
      (task: any) =>
        task.title.toLowerCase().includes(textValue) ||
        task.description.toLowerCase().includes(textValue)
    );

    const mt = fileteredTasks.filter((task: any) => {
      const user = data?.allUsers.find((u: any) => u._id === task.assignedTo);
      return user?.name?.toLowerCase().includes(textValue);
    });

    const uniqueMts = mt.filter(
      (membertask: any) =>
        !ft.some((ftTask: any) => ftTask._id === membertask._id)
    );

    setFilteredTasks([...ft, ...uniqueMts]);
  };

  const handleStatusFilter = (e: any) => {
    const status = e.target.value;
    if (status === "all") return setFilteredTasks(projectTasks);

    const ft = fileteredTasks.filter((task: any) => task.status === status);
    setFilteredTasks(ft);
  };

  const handleIssueFilter = (e: any) => {
    const issue = e.target.value;
    if (issue === "all") return setFilteredTasks(projectTasks);
    const ft = projectTasks.filter((task: any) => task.issue === issue);

    setFilteredTasks(ft);
  };

  //Muatations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    const issues = fileteredTasks.map((ft: any) => ft.issue);
    const highestI = Math.max(...issues);
    setHighestIssue(highestI.toString());
  }, [projectTasks, project]);

  const placeHolders = ["title", "description", "assigned member"];
  useEffect(() => {
    const interval = setInterval(() => {
      setTrans(false);

      setTimeout(() => {
        setPlaceHolderIndex((prev) => (prev + 1) % placeHolders.length);
        setTrans(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredTasks(projectTasks);
  }, [projectTasks]);

  return (
    <>
      <div className="mb-3 flex justify-between gap-">
        <div className="relative px-3 flex gap-2  h-full py-1 hover:text-violet-500 hover:bg-white transition-all duration-500 bg-violet-500 text-white shadow w-fit rounded font-semibold">
          <Axe />
          <button className="" onClick={() => setNewTask(true)}>
            Create new task!
          </button>
        </div>

        <div className="flex gap-3 mr-10">
          <div className="relative shadow">
            <Search className="absolute size-5 text-violet-300 mt-[6px] left-2" />
            <input
              type="text"
              onChange={handleSearchChange}
              placeholder={`Search by ${placeHolders[placeholderIndex]}...`}
              className={`w-[337px]
              rounded outline-none px-2 pl-9 py-1 font-semibold
             transition-all duration-500 
             placeholder:transition-all placeholder:duration-500 placeholder:ease-in-out 
         ${
           trans
             ? "placeholder:opacity-100 placeholder:translate-y-0"
             : "placeholder:opacity-0 placeholder:-translate-y-4"
         }
`}
            />
          </div>
          <div>
            <select
              onChange={handleStatusFilter}
              className="px-2 font-semibold shadow text-violet-600 h-full rounded outline-none cursor-pointer"
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
              className="h-full px-1 rounded shadow font-semibold text-violet-600 cursor-pointer outline-none"
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
      {newTask || editTask ? (
        <div className="w-full h-full justify-center items-center">
          <Formik
            initialValues={{
              title: editTask ? editTask.title : "",
              description: editTask ? editTask.description : "",
              project: project._id,
              issue: editTask ? editTask.issue : "",
              assignedTo: editTask ? editTask.assignedTo : "",
              assignedBy: leadId,
              document: editTask ? editTask.document : (null as File | null),
              image: editTask ? editTask.image : (null as File | null),
              priority: editTask ? editTask.priority : "medium",
              dueDate: editTask ? editTask.dueDate.slice(0, 10) : "",
            }}
            onSubmit={(values) => {
              const formData = new FormData();

              for (const key in values) {
                const value = (values as any)[key];
                if (value !== null && value !== "") {
                  formData.append(key, value);
                }
              }
              editTask
                ? (updateTask.mutate({ id: editTask._id, details: formData }),
                  setEditTask(false))
                : (createTask.mutate(formData), setNewTask(false));
            }}
          >
            {({ setFieldValue, values }) => (
              <Form
                encType="multipart/formData"
                className="w-[45%] translate-x-1/2"
              >
                <div className="p-4 shadow w-full space-y-5 rounded-md">
                  <h1 className="font-bold text-2xl text-violet-500 text-center">
                    Create New Task{" "}
                  </h1>
                  <Field
                    name="title"
                    required
                    placeholder="Enter task title..."
                    className="outline-none px-2 w-full font-semibold shadow-sm py-1 rounded"
                  />
                  <Field
                    name="description"
                    as="textarea"
                    required
                    placeholder="Enter task description..."
                    className="outline-none px-2 w-full font-semibold shadow-sm py-1 rounded"
                  />
                  <Field
                    required
                    as="select"
                    name="assignedTo"
                    className="outline-none px-2 py-1 w-[47%] font-semibold text-gray-700 rounded-md cursor-pointer"
                  >
                    <option value="" disabled selected hidden>
                      -- Select a member --
                    </option>
                    {allMembers.map((member: any) => (
                      <option key={member._id} value={member._id}>
                        {member?.name}, ({member?.role}){" "}
                      </option>
                    ))}
                  </Field>
                  <Field
                    name="issue"
                    type="number"
                    step="1"
                    required
                    placeholder="Enter issue number..."
                    min="1"
                    className="outline-none ml-6 px-2 py-1 w-[47%] font-semibold text-gray-700 rounded-md"
                  />
                  <Field
                    as="select"
                    required
                    name="priority"
                    className="px-2 py-1 w-[47%] rounded-md cursor-pointer text-gray-700 outline-none font-semibold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Field>
                  <Field
                    type="date"
                    required
                    name="dueDate"
                    className="px-2 py-1 w-[47%] outline-none ml-6 text-gray-700 rounded-md cursor-pointer font-semibold"
                  />
                  <div className="w-full grid grid-cols-2">
                    <div className="">
                      <label className="font-semibold shadow px-7 py-1 cursor-pointer bg-white rounded text-gray-700 ">
                        Choose a document
                        <input
                          type="file"
                          name="document"
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue(
                                "document",
                                e.currentTarget.files[0]
                              );
                            }
                          }}
                        />
                      </label>
                      {values.document?.name && (
                        <p className="text-sm p-2 text-gray-600 ">
                          Chosen doc: {values.document?.name}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <label className="font-semibold px-8 ml-3 cursor-pointer rounded bg-white shadow  py-1 text-gray-700 ">
                        Choose an image
                        <input
                          type="file"
                          name="image"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.currentTarget.files) {
                              setFieldValue("image", e.currentTarget.files[0]);
                            }
                          }}
                        />
                      </label>
                      {values.image?.name && (
                        <p className="text-sm p-2 text-gray-600 ">
                          Chosen img: {values.image?.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 ml-3 text-center">
                    Now u can attach docs and imgs with tasks...
                  </span>
                  <div className="flex items-center justify-around">
                    <button
                      type="button"
                      className="underline text-gray-600"
                      onClick={() => {
                        newTask ? setNewTask(false) : setEditTask(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="shadow px-3 py-1 text-white font-semibold hover:bg-opacity-80 bg-violet-500 rounded"
                      type="submit"
                    >
                      {`${newTask ? "Create!" : "Update!"}`}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        //ALL TASKS-------------------------------------------

        <>
          <Priority />
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fileteredTasks.map((task: any) => {
              const assignedUser = data?.allUsers.find(
                (u: any) => task.assignedTo === u._id
              );
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
                    priorityColors[
                      task.priority as keyof typeof priorityColors
                    ] || priorityColors.default
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {task.title.charAt(0).toUpperCase() +
                            task.title.slice(1)}
                        </h2>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              statusColors[
                                task.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {task.status.replace("-", " ")}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            Priority: {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditTask(task)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="Edit task"
                        >
                          <Edit className="size-5" />
                        </button>
                        <button
                          onClick={() => deleteTask.mutate(task._id)}
                          className="text-gray-500 hover:text-red-600 transition-colors"
                          aria-label="Delete task"
                        >
                          <Delete className="size-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700">
                        {task?.description?.charAt(0).toUpperCase() +
                          task?.description?.slice(1)}
                      </p>
                    </div>

                    <div className="flex items-center mb-4">
                      {assignedUser?.dp && (
                        <img
                          src={assignedUser.dp}
                          alt={`${assignedUser.name}'s profile`}
                          className="w-8 h-8 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                        />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Assigned to</p>
                        <p className="font-medium text-gray-800">
                          {assignedUser?.name || "Unassigned"}
                        </p>
                      </div>
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
                          {new Date(task.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
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
        </>
      )}
    </>
  );
};

export default LeadAllTasks;
