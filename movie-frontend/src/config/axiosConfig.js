import axios from "axios";

const axiosInstance = axios.create({
  // Point this to your Spring Boot backend URL
  baseURL: "http://localhost:8080",

  // This is the magic flag that tells the browser to accept the
  // HTTP-Only Set-Cookie header and send it back on future requests
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
