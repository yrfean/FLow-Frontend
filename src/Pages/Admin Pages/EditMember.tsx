import { useFormik } from "formik";
import { useUpdateUser } from "../../Query/QueryAndMutation";
import * as yup from "yup";
import { Edit } from "lucide-react";
import { useRef } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const backendUri = import.meta.env.VITE_BACKEND_PORT;

const validateForm = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  password: yup.string(),
});
const EachMember = ({ clickedUser, setClickedUser }: any) => {
  const updateUser = useUpdateUser();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);

  const user = clickedUser;
  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      location: user?.location || "",
      phone: user?.phone || "",
    },
    enableReinitialize: true,
    validationSchema: validateForm,
    onSubmit: (data) => {
      console.log(data);
      updateUser.mutate({ data, id: user._id });
    },
  });

  const handleClick = () => {
    if (ref.current) ref.current.click();
  };
  const handleChange = async (e: any) => {
    const dp = e.target.files[0];

    const formData = new FormData();
    formData.append("dp", dp);

    const response = await axios.put(
      `${backendUri}/updateUser/${clickedUser._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    queryClient.invalidateQueries({ queryKey: ["All data"] });
    window.location.reload();
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* change profile */}
      <div
        onClick={handleClick}
        className="flex relative hover:shadow-lg shadow-md rounded-full mt-2 justify-center itmes-center cursor-pointer group"
      >
        <div className="group-hover:bg-black/20 flex items-center transition justify-center  rounded-full bg-black/0 absolute z-10 w-full h-full">
          <Edit className="size-6 text-white group-hover:opacity-70 opacity-0 transition-all" />
        </div>
        <img
          src={user.dp}
          alt="user dp"
          className="rounded-full outline outline-white object-cover w-32 h-32"
        />
        <input
          type="file"
          onChange={handleChange}
          className="hidden"
          ref={ref}
        />
      </div>
      <p className="text-sm text-black/30 mt-1">tap dp to change it</p>

      <div className="mt-1 w-full flex flex-col gap-4 items-center">
        <div className="flex flex-col w-[50%]">
          <label
            htmlFor="name"
            className="text-xl font-semibold text-gray-600 ml-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded px-3 py-1 outline-none font-semibold"
          />
        </div>
        <div className="flex flex-col w-[50%]">
          <label
            htmlFor="email"
            className="text-xl  font-semibold text-gray-600 ml-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded px-3 py-1 outline-none font-semibold"
          />
        </div>
        <div className="flex flex-col w-[50%]">
          <label
            htmlFor="location"
            className="text-xl  font-semibold text-gray-600 ml-1"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded px-3 py-1 outline-none font-semibold"
          />
        </div>
        <div className="flex flex-col w-[50%]">
          <label
            htmlFor="phone"
            className="text-xl  font-semibold text-gray-600 ml-1"
          >
            Phone N.
          </label>
          <input
            type="text"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="rounded px-3 py-1 outline-none font-semibold"
          />
        </div>
        <button
          onClick={() => {
            formik.handleSubmit();
            setClickedUser(false);
          }}
          type="submit"
          className="bg-violet-500 text-white px-7 shadow py-1 text-xl rounded hover:bg-white hover:text-violet-500 transition-all duration-500 font-semibold"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EachMember;
