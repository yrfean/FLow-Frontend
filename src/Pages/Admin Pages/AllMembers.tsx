import { BadgeMinus, BadgePlus, Delete, Edit } from "lucide-react";
import {
  useAllData,
  useBlockUser,
  useDeleteUser,
  useUnBlockUser,
} from "../../Query/QueryAndMutation";
import { useState } from "react";

const AllMembers = ({ setClickedUser }: any) => {
  const { data } = useAllData();
  const deleteUser = useDeleteUser();
  const blockUser = useBlockUser();
  const unBlockUser = useUnBlockUser();

  const [popup, setPopup] = useState<boolean | string>(false);
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredUsers = data?.allUsers.filter((user: any) => {
    if (user.name === "admin") return false;

    const matchesSearch = user.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesSearch && matchesRole;
  });

  const roles = [
    ...new Set(
      data?.allUsers
        .filter((u: any) => u.name !== "admin")
        .map((u: any) => u.role)
    ),
  ];

  return (
    <>
      <div className="w-full relative">
        {/* popup */}
        {popup && (
          <div className="fixed shadow-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 w-[300px] bg-gray-300 rounded-md">
            <p className="leading-6 tracking-wide m-2 text-center font-semibold mb-4">
              {`Are u sure u want to ${popup} ${userName}?, just know that ${
                popup === "block" ? "blocking" : "deleting"
              } user will ${
                popup === "block"
                  ? "restrict user from loging-in"
                  : "remove user forever"
              }`}
            </p>
            <div className="flex justify-around w-full">
              <button
                onClick={() => setPopup(false)}
                className="px-2 py-1 bg-white font-semibold rounded hover:bg-white/50 shadow transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (popup === "delete") {
                    deleteUser.mutate(userId);
                  } else {
                    blockUser.mutate(userId);
                  }
                  setPopup(false);
                }}
                className="px-2 py-1 bg-white text-red-400 hover:text-white font-semibold rounded hover:bg-red-400 transition-all duration-300 shadow"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        <h1 className="text-2xl m-1 mb-3 -mt-1 font-bold text-violet-500 tracking-wider">
          Employees
        </h1>

        {/* Search and filter */}
        <div className="flex gap-5 mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="px-2 py-1 rounded border outline-none border-gray-300 shadow-sm w-1/2"
          />
          <select
            className="p-2 rounded border outline-none border-gray-300 shadow-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Filter by role</option>
            {roles.map((role) => (
              <option value={role as string} key={role as string}>
                {role as string}
              </option>
            ))}
          </select>
        </div>

        {/* User list container */}
        <div className="grid grid-cols-3 gap-5 w-full">
          {filteredUsers?.map((user: any) => (
            <div
              key={user._id}
              className={`bg-gray-100 font-semibold text-gray-700 cursor-pointer transition-all hover:scale-[1.02] duration-300 shadow-md hover:shadow-lg rounded p-4 flex flex-col gap-3 items-center justify-center ${
                user.blocked ? "bg-black/20" : ""
              }`}
            >
              <img
                src={user.dp}
                alt="user dp"
                className="rounded-full object-cover w-32 h-32 outline outline-violet-400"
              />
              <strong className="text-xl text-gray-900">{user.name}</strong>
              <h1>{user.email}</h1>
              <p className="text-lg">{user.role}</p>
              <p>Phone No: {user.phone || "not disclosed"}</p>
              <p>Location: {user.location || "not disclosed"}</p>
              <div className="flex gap-10 text-gray-300">
                <Edit
                  onClick={() => {
                    setClickedUser(user);
                  }}
                  className="size-5 hover:scale-105 transition duration-300 hover:text-violet-500"
                />
                {user.blocked ? (
                  <BadgePlus
                    onClick={() => unBlockUser.mutate(user._id)}
                    className="size-5 hover:scale-105 transition duration-300 hover:text-green-500"
                  />
                ) : (
                  <BadgeMinus
                    onClick={() => {
                      setUserName(user.name);
                      setUserId(user._id);
                      setPopup("block");
                    }}
                    className="size-5 hover:scale-105 transition duration-300 hover:text-red-500"
                  />
                )}
                <Delete
                  onClick={() => {
                    setUserName(user.name);
                    setUserId(user._id);
                    setPopup("delete");
                  }}
                  className="size-5 hover:scale-105 transition duration-300 hover:text-red-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllMembers;
