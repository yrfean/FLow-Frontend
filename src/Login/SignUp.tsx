import { useFormik } from "formik";
import * as yup from "yup";
import { useCreateUser } from "../Query/QueryAndMutation";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  phone: yup.string().required("Phone number is required"),
  location: yup.string().required("Location is required"),
  role: yup.string().required("Role is required"),
});

// Type for form values
type FormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: string;
};

const SignUp = () => {
  const createUser = useCreateUser();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      role: "",
    },
    validationSchema,
    onSubmit: (values) => {
      createUser.mutate(values);
    },
  });

  // Keys of the form fields
  const fields: (keyof FormValues)[] = [
    "name",
    "email",
    "password",
    "phone",
    "location",
    "role",
  ];

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-4 px-3 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {fields.map((field) => ( 
          <div key={field} className="mb-4">
            <label
              htmlFor={field}
              className="block text-gray-700 font-semibold capitalize mb-1"
            >
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-5 py-2 border rounded-md outline-none focus:ring-2 ring-violet-400"
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-violet-500 text-white py-2 rounded-md font-semibold hover:bg-violet-600 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUp;
