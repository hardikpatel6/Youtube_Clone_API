import API from "./axios";

export const signupApi = (data) => API.post("/users/register", data);
export const loginApi = (data) => API.post("/users/login", data);
export const refreshTokenApi = () => API.post("/users/refreshToken");
export const logoutApi = () => API.post("/users/logout");
export const getProfileApi = () => API.get("/users/profile");
