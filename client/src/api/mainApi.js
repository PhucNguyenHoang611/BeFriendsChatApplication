import axios from 'axios';

export const mainApi = axios.create({
    baseURL: "http://localhost:5000/api"
});

export const hostURL = "http://localhost:5000"
export const baseURL = "http://localhost:5000/api";