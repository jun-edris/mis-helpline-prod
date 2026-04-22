import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../utils/fetch';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
	const history = useNavigate();
	const authContext = useContext(AuthContext);
	const [refreshKey, setRefreshKey] = useState(0);

	const authAxios = axios.create({
		baseURL,
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	authAxios.interceptors.response.use(null, async (error) => {
		const status = error.response?.status;
		if (status === 401 || status === 403) {
			try {
				await authAxios.post('/logout');
				authContext.logout();
				history('/', { replace: true });
			} catch {
				// logout best-effort
			}
		}
		return Promise.reject(error);
	});

	return (
		<Provider value={{ authAxios, refreshKey, setRefreshKey }}>
			{children}
		</Provider>
	);
};

export { FetchContext, FetchProvider };