import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { formValues } from "../Login/Login";
import { useNavigate } from "react-router-dom";
import { getAllDatas } from "../Components/fetchFunction";

const backendUri = import.meta.env.VITE_BACKEND_PORT;
// console.log(backendUri)
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: formValues) => {
      return await axios.post(`${backendUri}/login`, values);
    },
    onSuccess: ({ data }) => {
      console.log("response:", data);
      if (data.existing.name === "admin") {
        sessionStorage.setItem("role", "admin");
      }
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("_id", data.data._id);
      if (data.existing.name === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

//Crerate user
export const useCreateUser = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`${backendUri}/createUser`, data);
      return response.data;
    },
    onSuccess: (data: any) => {
      console.log("User creating successfull");
      console.log(data);
      sessionStorage.setItem("token", data.token);
      navigate("/home");
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await axios.put(`${backendUri}/updateUser/${data.id}`, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

//Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await axios.post(`${backendUri}/createProject`, data);
    },
    onSuccess: () => {
      console.log("successfullly created new project");
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log("error happnd in mutatuon:", err);
    },
  });
};

//Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      await axios.put(`${backendUri}/updateProject/${data.id}`, data.values);
    },
    onSuccess: () => {
      console.log("successfullly created new project");
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log("error happnd in mutatuon:", err);
    },
  });
};

//Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => {
      await axios.delete(`${backendUri}/deleteProject/${id}`);
    },
    onSuccess: () => {
      console.log("successfullly created new project");
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log("error happnd in mutatuon:", err);
    },
  });
};

//To Query get all data
export const useAllData = () => {
  return useQuery({
    queryKey: ["All data"],
    queryFn: getAllDatas,
  });
};

// Create Task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskDetails: any): Promise<any> => {
      const response = await axios.post(
        `${backendUri}/createTask`,
        taskDetails
      );
      return response.data;
    },
    onSuccess: () => {
      // console.log(data);
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (error) => {
      console.log("error creating tasks", error);
    },
  });
};

// Update Task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, details }: { id: any; details: any }) => {
      
      const response = await axios.put(
        `${backendUri}/updateTask/${id}`,
        details
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err: any) => {
      console.log(err);
    },
  });
};

// Delete Task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => {
      const response = await axios.delete(`${backendUri}/deleteTask/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (er: any) => {
      console.log(er);
    },
  });
};

// Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${backendUri}/deleteUser/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.post(`${backendUri}/blockUser/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export const useUnBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.post(`${backendUri}/unBlockUser/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["All data"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
