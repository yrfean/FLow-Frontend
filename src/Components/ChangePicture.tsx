import { useRef } from "react";
import { useAllData } from "../Query/QueryAndMutation";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const backendUri = import.meta.env.VITE_BACKEND_PORT;

const ChangePicture = () => {
  const queryClient = useQueryClient();
  const { data } = useAllData();
  const fileInput = useRef<any>(null);

  const handleChange = async (e: any) => {
    const image = e.target.files[0];
    if (!image) return;
    const formData = new FormData();
    formData.append("dp", image);
    try {
      const response = await axios.put(
        `${backendUri}/updateUser/${data?.user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    fileInput.current.click();
  };
  return (
    <div className="w-full flex justify-center">
      <div className="py-3 px-4 bg-violet-500 flex w-[75%] items-center rounded-xl justify-between">
        <div className="ml-3 flex gap-4 items-center">
          <img
            src={data?.user.dp}
            alt="user dp"
            className="w-14 h-14 outline outline-white object-cover rounded-full"
          />
          <p className="font-semibold text-xl">{data?.user.name}</p>
        </div>
        {/* invisible input for changing photo */}
        <input
          onChange={(e) => handleChange(e)}
          type="file"
          ref={fileInput}
          className="hidden"
        />
        <button
          onClick={() => handleClick()}
          className="px-3 h-10 bg-gray-100 rounded mr-8 font-semibold text-violet-500 hover:text-white hover:shadow hover:bg-violet-300 transition-all duration-300"
        >
          Change photo
        </button>
      </div>
    </div>
  );
};

export default ChangePicture;
