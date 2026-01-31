import axios from "axios";

const axiosPrivate = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})

axiosPrivate.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
},
    (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const res = await axios.post('http://localhost:5000/api/refresh', {}, {withCredentials: true})

                const newAccessToken = res.data.token
                localStorage.setItem('token', newAccessToken)

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return axiosPrivate(originalRequest)
            }
            catch(refreshErr) {
                localStorage.removeItem('token')
                window.location.href = '/login'
                return Promise.reject(refreshErr)
            }
        }

        return Promise.reject(error)
    }
)

export default axiosPrivate