import axios from "axios";

const apiAddress = process.env.TASKS_API_ADDRESS;
const apiPort = process.env.TASKS_API_PORT;

export default axios.create({
  baseURL: `http://${apiAddress}:${apiPort}/users`
});
