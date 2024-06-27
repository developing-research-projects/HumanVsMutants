import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.Authorization;
  }
};

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return Promise.reject(failedRequest);
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/refresh-token`, { refreshToken });
    const { accessToken } = response.data;
    setAuthToken(accessToken);
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + accessToken;
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

axiosInstance.interceptors.response.use(response => response, async (error) => {
  const { config, response } = error;
  if (response?.status === 401) {
    await refreshAuthLogic(error);
    return axiosInstance(config);
  }
  return Promise.reject(error);
});

export { axiosInstance, setAuthToken };
