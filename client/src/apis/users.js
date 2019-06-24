import axios from "axios";

const apiURL = process.env.TASKS_API_URL;

export default axios.create({
  baseURL: `${apiURL}/users`
});
