import axios from "axios";

const SessionService = axios.create({
  baseURL: "session.codr.svc.cluster.local:8000/api",
});

export default SessionService;
