import axios from 'axios';

const baseURL = import.meta.env.PROD
	? import.meta.env.VITE_API_URL
	: 'http://localhost:3001/api';

const publicFetch = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

export { publicFetch, baseURL };