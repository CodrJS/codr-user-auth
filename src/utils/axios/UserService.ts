import axios from "axios";

const UserService = axios.create({
  // baseURL: "user.codr.svc.cluster.local:3000/api",
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
});

export default UserService;
