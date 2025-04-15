import { useMemo } from "react";
import { useAllData, useUpdateProject } from "../../Query/QueryAndMutation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const projectSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string(),
  dueDate: Yup.date().required("Required"),
  teamLead: Yup.string().required("Required"),
  members: Yup.array().of(Yup.string()),
});

const EditProjectInput = ({ project, setEditProject }: any) => {
  const { data } = useAllData();
  const updateProject = useUpdateProject();

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
  //   (user: any) =>
  //     !assignedUserIds.includes(user._id) ||
  //     user._id === project?.teamLead ||
  //     project?.members?.includes(user._id)
  // );
  
  return (
    <div className="w-[488px] p-4 bg-gray-300 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold">Edit Project</h2>

      <Formik
        initialValues={{
          title: project?.title || "",
          description: project?.description || "",
          priority: project?.priority || "medium",
          dueDate: project?.dueDate?.split("T")[0] || "",
          teamLead: project?.teamLead || "",
          document: null as File | null,
          members: project?.members || [],
          status: project?.status || "incompleted",
        }}
        enableReinitialize
        validationSchema={projectSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          for (const key in values) {
            if (key === "members") {
              values.members.forEach((m: any) => formData.append("members", m));
            } else if (key === "document" && values.document) {
              formData.append("document", values.document);
            } else {
              formData.append(key, (values as any)[key]);
            }
          }

          updateProject.mutate({ id: project._id, values: formData });
          setEditProject(false);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-3" encType="multipart/formData">
            <div>
              <Field
                name="title"
                placeholder="Title"
                className="w-full border p-2 rounded-xl outline-none"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
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
              <ErrorMessage
                name="dueDate"
                component="div"
                className="text-red-500 text-sm"
              />
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
                    {`${user.name}, ${user.role}`}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="teamLead"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* select members*/}
            <div role="group" aria-labelledby="checkbox-group">
              <label className="block font-medium mb-1">Members</label>
              {allUsers
                .filter((user: any) => user._id !== values.teamLead)
                .map((user: any) => (
                  <label key={user._id} className="block mb-1 cursor-pointer">
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

            <div className="">
              <label className="text-center block bg-white px-2 py-1 font-semibold cursor-pointer text-gray-600 rounded">
                Choose document
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  name="document"
                  onChange={(e) => {
                    if (e.currentTarget.files) {
                      setFieldValue("document", e.currentTarget.files[0]);
                    }
                  }}
                />
              </label>
              <span className="text-xs text-gray-500 mt-1">
                Now you can send documents about the project. Ensure the file is
                relevant and properly named.
              </span>
            </div>
            {values.document && (
              <span className="text-sm mt-1 text-gray-600">
                {`Chosen file: ${values.document.name}`}
              </span>
            )}

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-violet-500 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditProject(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProjectInput;
