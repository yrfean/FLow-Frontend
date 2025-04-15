import { Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useAllData, useCreateProject } from "../../Query/QueryAndMutation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const projectSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string(),
  dueDate: Yup.date().required("Required"),
  teamLead: Yup.string().required("Required"),
  members: Yup.array().of(Yup.string()),
  document: Yup.mixed().nullable(),
});

const NewProjectInput = ({ plus }: any) => {
  const [inputPopup, setInputPopup] = useState(false);
  const { data } = useAllData();
  const newProjectMutate = useCreateProject();

  const allUsers = data?.allUsers.filter((u: any) => u.name !== "admin") || [];
  const allProjects = data?.allProjects || [];

  const assignedUserIds = useMemo(() => {
    const assigned = new Set<string>();
    allProjects.forEach((proj: any) => {
      if (proj.teamLead) assigned.add(proj.teamLead.toString());
      proj.members?.forEach((id: string) => assigned.add(id));
    });

    return [...assigned, "67f2e0562bd15b4490158116"];
  }, [allProjects]);

  // const availableUsers = allUsers.filter(
  //   (user: any) => !assignedUserIds.includes(user._id)
  // );

  return (
    <>
      {inputPopup ? (
        <div className="w-[488px] p-4 bg-gray-300 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-xl font-bold">New Project</h2>

          <Formik
            initialValues={{
              title: "",
              description: "",
              priority: "medium",
              dueDate: "",
              teamLead: "",
              members: [],
              status: "incompleted",
              document: null as File | null,
            }}
            validationSchema={projectSchema}
            onSubmit={(values) => {
              const formData = new FormData();

              for (const key in values) {
                if (key === "members") {
                  values.members.forEach((member) =>
                    formData.append("members", member)
                  );
                } else if (key === "document" && values.document) {
                  formData.append("document", values.document);
                } else {
                  formData.append(key, (values as any)[key]);
                }
              }

              newProjectMutate.mutate(formData);
              setInputPopup(false);
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="space-y-3" encType="multipart/form-data">
                <div>
                  <Field
                    name="title"
                    placeholder="Title"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm">{errors.title}</div>
                  )}
                </div>

                <div>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Due date</label>
                  <Field
                    type="date"
                    name="dueDate"
                    className="w-full border p-2 rounded-xl outline-none"
                  />
                  {errors.dueDate && touched.dueDate && (
                    <div className="text-red-500 text-sm">{errors.dueDate}</div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-1">Team Lead</label>
                  <Field
                    as="select"
                    name="teamLead"
                    className="w-full border p-2 rounded-xl outline-none"
                  >
                    <option value="">Select Team Lead</option>
                    {allUsers.map((user: any) => (
                      <option key={user._id} value={user._id}>
                        {`${user.name}, ${user.role}${
                          !assignedUserIds.includes(user._id)
                            ? `, (Recommended)`
                            : ``
                        }`}
                      </option>
                    ))}
                  </Field>
                  {errors.teamLead && touched.teamLead && (
                    <div className="text-red-500 text-sm">
                      {errors.teamLead}
                    </div>
                  )}
                </div>

                <div role="group" aria-labelledby="checkbox-group">
                  <label className="block font-medium mb-1">Members</label>
                  {allUsers
                    .filter((user: any) => user._id !== values.teamLead)
                    .map((user: any) => (
                      <label
                        key={user._id}
                        className="block mb-1 cursor-pointer"
                      >
                        <Field
                          type="checkbox"
                          name="members"
                          value={user._id}
                          className="mr-2"
                        />
                        {`${user.name}, ${user.role}${
                          !assignedUserIds.includes(user._id)
                            ? " (Recommended)"
                            : ""
                        }`}
                      </label>
                    ))}
                </div>

                <div className="flex flex-col">
                  <label className="bg-white text-gray-700 text-center rounded font-semibold cursor-pointer px-2 py-1 ">
                    {" "}
                    Upload Document
                    <input
                      type="file"
                      name="document"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.csv"
                      onChange={(e) => {
                        if (e.currentTarget.files) {
                          setFieldValue("document", e.currentTarget.files[0]);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-gray-500 mt-1">
                    Now you can send documents about the project. Ensure the
                    file is relevant and properly named.
                  </span>
                  {values.document && (
                    <span className="text-sm text-gray-600 mt-1">
                      {`Chosen File: ${values.document.name}`}
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-violet-500 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputPopup(false)}
                    className="text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        plus && (
          <div
            onClick={() => setInputPopup(true)}
            className="min-w-[475px] max-h-[300px] outline-4 outline-dashed outline-gray-300 group min-h-[248px] h-full flex items-center justify-center hover:shadow-xl cursor-pointer bg-gray-200 hover:bg-gray-100 transition-all rounded shadow-lg"
          >
            <Plus className="size-12 text-gray-400 group-hover:text-gray-500 transition-all" />
          </div>
        )
      )}
    </>
  );
};

export default NewProjectInput;
