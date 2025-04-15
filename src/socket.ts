import { io } from "socket.io-client";
const backendUri = import.meta.env.VITE_BACKEND_PORT;
export const socket = io(backendUri);
