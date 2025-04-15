import { useEffect, useState } from "react";
import { useAllData } from "../Query/QueryAndMutation";

const UserDps = ({
  project,
  changeTasks,
}: {
  project: any;
  changeTasks: any;
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const { data } = useAllData();

  useEffect(() => {
    if (!data || !project) return;

    const findMembers = () => {
      if (!Array.isArray(project.members)) return;
      const mem =
        data.allUsers?.filter((user: any) =>
          project.members.includes(user._id)
        ) || [];
      setUsers(mem);
    };

    const findTeamLead = () => {
      const tl = data.allUsers?.find(
        (user: any) => user._id === project.teamLead
      );
      if (tl) {
        setUsers((prevUser: any) => [...prevUser, tl]);
        // console.log(setProfiles)
      }
    };

    findMembers();
    findTeamLead();
  }, [data, project]);

  // console.log(users);
  return (
    <div className="flex items-center ml-3">
      {users?.map((user, index) => (
        <img
          key={user._id}
          src={user.dp}
          className={`w-12 h-12 rounded-full object-cover hover:shadow hover:scale-105 transition ease-in-out cursor-pointer border-2 border-white shadow-lg ${
            index === 0 ? "ml-0" : "-ml-3"
          }`}
          onClick={() => changeTasks(user._id)}
        />
      ))}
    </div>
  );
};

export default UserDps;
