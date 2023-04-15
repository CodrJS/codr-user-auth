import Config from "@codrjs/config";
import axios from "axios";

const UserService = axios.create({
  // baseURL: "http://user-entity.codr-test.svc.cluster.local:8000/v1",
  // baseURL: "http://user.codr.local/v1",
  // baseURL: "http://localhost:8000/v1",
  baseURL: `${Config.codr.svc.user.user}/v1`,
  withCredentials: false,
});

export default UserService;
