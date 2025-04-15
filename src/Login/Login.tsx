import { useFormik } from "formik";
import * as yup from "yup";
import { useLoginMutation } from "../Query/QueryAndMutation";
import { useNavigate } from "react-router-dom";

const ValidationSchema = yup.object({
  email: yup.string().email("it has to be email").required("fill email please"),
  password: yup.string().required("please enter password"),
});

export type formValues = {
  email: string;
  password: string | number;
};

const Login = () => {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const formik = useFormik<formValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: (values: formValues) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-around ">
        <div className="flex items-center background w-[80%] h-[80%] rounded shadow-2xl">
          <div className="h-full w-[60%] object-cover overflow-y-hidden">
            <img
              src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1742205277~exp=1742208877~hmac=8f128193f7e1a4be0dff53c24eb63e3a1b42e54f176b2aaab418bc7f1a5bc68d&w=900"
              alt=""
            />
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex h-full flex-col justify-center items-center w-[40%]"
          >
            <div className="mb-12 w-[70%] text-center">
              <h1 className=" text-3xl font-bold text-white">LOG IN</h1>
              <p className="text-gray-300 opacity-90">
                Enter your Account Details...
              </p>
            </div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-[70%] h-9 px-3 py-2 rounded focus:outline-none shadow hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl"
            />
            <p className="h-4 opacity-70 text-red-700 ">
              {formik.touched.email && formik.errors.email
                ? `${formik.errors.email}!`
                : ""}
            </p>

            <input
              type="text"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-[70%] h-9 px-3 py-2 rounded mt-2 focus:outline-none shadow hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl"
            />
            <p className="h-5 opacity-70 text-red-700">
              {formik.touched.password && formik.errors.password
                ? `${formik.errors.password}!`
                : ""}
            </p>
            <div className="flex w-full gap-3 justify-around">
              <button
                onClick={() => navigate("/forgotPassword")}
                className=" text-white opacity-60 hover:underline"
              >
                forgot password?
              </button>
              <button
                onClick={() => navigate("/signUp")}
                className=" text-white opacity-60 hover:underline"
              >
                Create account
              </button>
            </div>

            <button
              type="submit"
              className="text-white outline outline-white font-semibold shadow mt-4 bg-whit w-[35%] rounded-full h-12 text-xl hover:scale-105 hover:bg-white hover:text-blue-500 animation duration-150 ease-in"
            >
              Less GO!
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
