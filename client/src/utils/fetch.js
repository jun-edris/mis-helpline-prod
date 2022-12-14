import axios from 'axios';

const baseURL =
	process.env.NODE_ENV === 'production'
		? process.env.REACT_APP_API_URL
		: 'http://localhost:3001/api';

const publicFetch = axios.create({
	baseURL: baseURL,
	withCredentials: true,
	credentials: 'include',
	headers: {
		'Access-Control-Allow-Credentials': true,
		'Content-Type': 'application/json',
	},
});

export { publicFetch, baseURL };
