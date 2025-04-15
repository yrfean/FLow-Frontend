import { useState } from "react";
import UserProjects from "./UserProjects";
import UserTasks from "./ProjectTasks";

const Home = () => {
  const [project, setProject] = useState();
  return (
    <>
      <div className="w-[82.1%] h-full">
        {project ? (
          <UserTasks project={project} setProject={setProject} />
        ) : (
          <UserProjects setProject={setProject} />
        )}
      </div>
    </>
  );
};

export default Home;
