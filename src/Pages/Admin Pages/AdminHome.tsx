import { useState } from "react";
import HomeProjects from "./HomeProjects";
import HomeTasks from "./HomeTasks";

const AdminHome = () => {
  const [project, setProject] = useState<string | boolean>(false);

  return (
    <div className="w-[82.1%] overflow-y-scroll custom-scrollbar">
      {project ? (
        <HomeTasks projectId={project} setProject={setProject} />
      ) : (
        <HomeProjects setProject={setProject} />
      )}
    </div>
  );
};

export default AdminHome;
