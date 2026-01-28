import axios from "axios";
import storage from "./storage";

const baseURL =
    import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // flip to true if you need cookies
});

api.interceptors.request.use(
    (config) => {
        const token = storage.get("token"); // or Context, Redux, etc.
        console.log("api - token", token);
        if (token) config.headers.Authorization = `Bearer ${token ? token : ""}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => {
        return {
            status: res.status,
            payload: res.data,
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

const get = (url, params = {}, config = {}) =>
    api.get(url, { params, ...config });
const post = (url, data = {}, config = {}) => api.post(url, data, config);
const put = (url, data = {}, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

// Export them in whatever shape you like
export { get, post, put, del };
export default api;
