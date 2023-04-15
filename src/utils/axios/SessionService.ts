import Config from "@codrjs/config";
import axios from "axios";

const SessionService = axios.create({
  // baseURL: "http://user-session.codr-test.svc.cluster.local:8000/v1",
  // baseURL: "http://session.codr.local/v1",
  // baseURL: "http://localhost:8001/v1",
  baseURL: `${Config.codr.svc.user.session}/v1`,
});

export default SessionService;
