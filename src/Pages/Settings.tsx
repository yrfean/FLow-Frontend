
import ChangePicture from "../Components/ChangePicture";
import { useAllData, useUpdateUser } from "../Query/QueryAndMutation";
import { useFormik } from "formik";
import * as yup from "yup";


const validateForm = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
  location: yup.string().notRequired(),
  phone: yup.string().notRequired(),
});

const Settings = () => {
  const { data, isLoading } = useAllData();
  const updateUser = useUpdateUser();
  

  const user = data?.user;
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[82.1%] relative overflow-y-scroll p-3">
      <h1 className="text-left text-gray-700 text-2xl font-bold mb-5">
        Edit profile
      </h1>
      <ChangePicture />
      <div className="mt-4 w-full flex flex-col gap-4 items-center">
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
          onClick={() => formik.handleSubmit()}
          className="bg-violet-500 text-white px-7 shadow py-1 text-xl rounded hover:bg-white hover:text-violet-500 transition-all duration-500 font-semibold"
        >
          Submit
        </button>
      </div>
      <div className="mt-2">
        <h1 className="text-left text-gray-700 text-2xl font-bold mb-2">
          About
        </h1>
        <p className="text-justify leading-relaxed font-medium text-gray-600 p-2">
          FLOW is a dynamic and intuitive project management web application
          designed to streamline task delegation, collaboration, and progress
          tracking within teams. The app features a hierarchical structure with
          three key roles: Admin, Team Lead, and Team Members, ensuring clear
          responsibility distribution for efficient project execution. Admins
          oversee the entire system, creating projects and assigning Team Leads,
          who then manage their respective teams by breaking down tasks and
          delegating them to members. Team Members receive assigned tasks,
          update their progress, and communicate with leads, fostering
          transparency and accountability. With a clean, user-friendly
          interface, FLOW simplifies project workflows, reducing confusion and
          boosting productivity. Real-time updates, task prioritization, and
          progress visualization keep everyone aligned, making it an ideal tool
          for academic, professional, or personal projects. Though built as a
          school project (and let’s be honest, the teacher probably won’t read
          this deeply), FLOW demonstrates robust functionality and practical
          utility, mimicking real-world project management tools like Trello or
          Asana—just with less corporate jargon and more "I definitely didn’t
          code this the night before the deadline" energy.
        </p>
      </div>
    </div>
  );
};

export default Settings;
