import { useEffect, useMemo, useState } from "react";
import { useAllData } from "../../Query/QueryAndMutation";
import Skelton from "../../Components/Skelton";

const UserProjects = ({ setProject }: any) => {
  const { data, isLoading } = useAllData();
  const userId = sessionStorage.getItem("_id");
  const [pending, setPending] = useState<any>(false);
  const userProjects = useMemo(() => {
    if (!data) return;
    return data?.allProjects.filter(
      (p: any) => p.members.includes(userId) || p.teamLead === userId
    );
  }, [data, userId]);
  const [filteredProjects, setFilteredProjects] = useState(userProjects);

  const user = useMemo(() => {
    if (!data) return;
    return data?.allUsers.find((u: any) => u._id === userId);
  }, [data, userId]);

  const handleChangeOfFilter = (e: any) => {
    const value = e.target.value;

    if (value === "all") {
      setFilteredProjects(userProjects);
    } else {
      const fp = userProjects.filter((p: any) => p.status === value);
      setFilteredProjects(fp);
    }
  };

  useEffect(() => {
    setFilteredProjects(userProjects);
  }, [userProjects]);
  useEffect(() => {
    const pendingProjects = userProjects?.filter(
      (p: any) => p.status === "pending"
    );
    if (pendingProjects) setPending(pendingProjects);
  }, []);

  if (isLoading) {
    return (
      <div>
        <Skelton />
      </div>
    );
  }
  return (
    <div className="w-full h-full p-3">
      {/* Pendinf popup */}
      {pending && (
        <div className="fixed rounded-lg bg-gray-100 gap-4 w-[300px] p-4 top-1/4 flex flex-col items-center justify-center left-1/2 -translate-x-1/2 shadow-md">
          <h1 className="font-semibold text-center text-red-400">
            Please be aware that you are part of a pending project!
          </h1>
          <button
            onClick={() => setPending(false)}
            className="px-3 hover:scale-105 transition-all duration-300 py-1 shadow rounded font-semibold bg-gray-300"
          >
            okay
          </button>
        </div>
      )}

      {/* name and filteringgs */}
      <div className="m-1 mb-2 flex items-center gap-5 ">
        <h1 className="text-3xl font-bold tracking-wide p-1 text-violet-500">
          Projects of {user?.name}
        </h1>
        <select
          onChange={handleChangeOfFilter}
          className="h-7 bg-gray-100 rounded cursor-pointer mt-1 font-semibold outline-none text-gray-600"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incompleted">Incompleted</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      {/* projects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 m-3">
        {filteredProjects?.map((p: any) => (
          <div
            key={p._id}
            onClick={() => setProject(p)}
            className="rounded-xl bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-violet-600">
                {p.title.charAt(0).toUpperCase() + p.title.slice(1)}
              </h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.status === "completed"
                    ? "bg-green-100 text-green-600"
                    : p.status === "pending"
                    ? "bg-red-100 text-red-500"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 line-clamp-2">
              {p.description.charAt(0).toUpperCase() + p.description.slice(1)}
            </p>

            <div className="text-sm text-gray-400 mt-auto flex justify-between items-center">
              <span>Due: {new Date(p.dueDate).toLocaleDateString()}</span>
              {p.teamLead === userId && (
                <span className="italic text-xs underline text-gray-500">
                  Team Lead
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProjects;
