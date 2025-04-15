import { useState } from "react";
import AllMembers from "./AllMembers";
import EachMember from "./EditMember";

const MembersHome = () => {
  const [clickedUser, setClickedUser] = useState<any>(false);
  return (
    <div className="w-[82.1%] p-4 overflow-y-scroll">
      {clickedUser ? (
        <EachMember clickedUser={clickedUser} setClickedUser={setClickedUser} />
      ) : (
        <AllMembers setClickedUser={setClickedUser} />
      )}
    </div>
  );
};

export default MembersHome;
