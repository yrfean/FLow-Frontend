import { Delete, Edit, Search } from "lucide-react";
import ProgressiveCircleBar from "../../Components/ProgressiveCircleBar";
import { useAllData, useDeleteProject } from "../../Query/QueryAndMutation";
import NewProjectInput from "./NewProjectInput";
import { useEffect, useState } from "react";
import EditProjectInput from "./EditProjectInput";

const HomeProjects = ({ setProject }: any) => {
  const { data } = useAllData();
  const [editProject, setEditProject] = useState<any>(false);
  const deleteProject = useDeleteProject();
  const [projects, setProjects] = useState(data?.allProjects);
  const [placeholderIndex, setPlaceHolderIndex] = useState(0);
  const [trans, setTrans] = useState(true);
  const [plus, setPlus] = useState(true);

  const placeHolders = ["title", "description", "team lead"];

  const handleFilterChange = (e: any) => {
    const value = e.target.value;
    setPlus(false);

    if (value === "all") {
      setPlus(true);
      return setProjects(data?.allProjects);
    }

    const filteredProjects = data?.allProjects.filter(
      (p: any) => p.status === value
    );

    setProjects(filteredProjects);
  };

  const handleSearchChange = (e: any) => {
    const searchText = e.target.value.toLowerCase();
    setPlus(false);
    if (searchText === "") setPlus(true);

    const leads = data?.allUsers.filter((user: any) =>
      user.name.toLowerCase().includes(searchText)
    );
    const leadIds = leads.map((lead: any) => lead._id);

    let filteredProjects =
      data?.allProjects.filter(
        (p: any) =>
          p.title.toLowerCase().includes(searchText) ||
          p.description.toLowerCase().includes(searchText)
      ) || [];

    const leadProjects =
      data?.allProjects.filter((p: any) => leadIds.includes(p.teamLead)) || [];

    const uniqueLeadProjects = leadProjects.filter(
      (lp: any) => !filteredProjects.some((fp: any) => fp._id === lp._id)
    );

    setProjects([...filteredProjects, ...uniqueLeadProjects]);
  };

  useEffect(() => {
    if (!data) return;
    setProjects(data?.allProjects);
  }, [data]);

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
  return (
    <div className="w-full p-4">
      <div className="flex gap-3 items-center justify-between w-full mt-1 mb-3">
        <h1 className="text-3xl ml-3 font-bold text-violet-500 tracking-wider">
          Projects
        </h1>
        <div className="flex gap-3 mr-5">
          <div className="relative shadow">
            <Search className="absolute top-1 left-2 mt-[2px] size-5 text-gray-300" />
            <input
              onChange={handleSearchChange}
              placeholder={`Search by ${placeHolders[placeholderIndex]}...`}
              type="text"
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
          <select
            name="filter"
            onChange={handleFilterChange}
            className="px-1 shadow py-1 font-semibold rounded text-gray-500 outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="completed">completed</option>
            <option value="incompleted">Incompleted</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full p-2 gap-5">
        {projects?.map((project: any) => {
          const relatedTasks = data?.allTasks.filter(
            (task: any) => task.project === project._id
          );

          const totalTasks = relatedTasks.length;
          const completedTasks = relatedTasks.filter(
            (task: any) => task.status === "completed"
          ).length;

          const progress =
            totalTasks === 0
              ? 0
              : Math.round((completedTasks / totalTasks) * 100);

          return (
            <>
              {project._id === editProject._id ? (
                <EditProjectInput
                  project={editProject}
                  setEditProject={setEditProject}
                />
              ) : (
                <div
                  onClick={() => setProject(project._id)}
                  key={project._id}
                  className="rounded relative bg-gray-100 max-h-[350px]  min-h-[260px] shadow-md p-3 flex gap-2 items-center justify-between cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute size-16 flex gap-6 top-5 right-5  text-gray-300">
                    <Edit
                      className="hover:text-violet-500 transition-all"
                      onClick={(e) => {
                        setEditProject(project);
                        e.stopPropagation();
                      }}
                    />
                    <Delete
                      onClick={(e) => {
                        deleteProject.mutate(project._id);
                        e.stopPropagation();
                      }}
                      className="hover:text-red-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold mb-2">
                      {project.title.charAt(0).toUpperCase() +
                        project.title.slice(1)}
                    </h1>
                    <p className="text-justify mb-1 font-semibold text-gray-700">
                      {project.description.charAt(0).toUpperCase() +
                        project.description.slice(1)}
                    </p>

                    <div className="flex gap-2 my-2 group w-fit">
                      <p className="text-lg text-gray-600">Team Lead:</p>
                      <img
                        src={
                          data?.allUsers.find(
                            (user: any) => user._id === project.teamLead
                          ).dp
                        }
                        alt="lead dp"
                        className="rounded-full w-7 h-7 object-cover outline outline-violet-500"
                      />
                      <span className="group-hover:opacity-100 cursor-default opacity-0 text-white bg-gray-500 rounded-r rounded-tl h-7 px-3 -ml-4 -mt-3">
                        {
                          data?.allUsers.find(
                            (user: any) => user._id === project.teamLead
                          ).name
                        }
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <strong
                        className={`${
                          project.status === "incompleted"
                            ? "bg-gray-400"
                            : project.status === "pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                        } px-2 rounded`}
                      >
                        {project.status}
                      </strong>

                      <h1 className="font-medium text-gray-400">
                        {`Due date: ${new Date(
                          project.dueDate
                        ).toLocaleDateString()}`}
                      </h1>
                    </div>

                    {project.document && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `http://localhost:3000/projectDocuments/${project.document}`,
                            "_blank"
                          );
                        }}
                        className="bg-white shadow px-2 text-gray-600 hover:bg-violet-100 transition-all duration-300 text-center w-[100%] py-1 rounded font-semibold cursor-pointer"
                      >
                        Open Document
                      </div>

                      
                    )}
                  </div>

                  <div className="">
                    <ProgressiveCircleBar progress={progress} />
                  </div>
                </div>
              )}
            </>
          );
        })}
        <div>
          <NewProjectInput plus={plus} />
        </div>
      </div>
    </div>
  );
};

export default HomeProjects;
