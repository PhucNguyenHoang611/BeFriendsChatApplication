import axios from 'axios';

export const mainApi = axios.create({
    baseURL: "https://befriends-api.onrender.com/api" // http://localhost:5000/api
});

export const hostURL = "https://befriends-api.onrender.com"
export const baseURL = "https://befriends-api.onrender.com/api";