import { useState, createContext, useRef } from 'react';
import Pusher from 'pusher-js';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
	const userInfo = localStorage.getItem('userInfo');
	const expiresAt = localStorage.getItem('expiresAt');

	const pusherRef = useRef(null);
	if (!pusherRef.current) {
		pusherRef.current = new Pusher(import.meta.env.VITE_APP_KEY, {
			cluster: import.meta.env.VITE_CLUSTER,
		});
	}
	const pusher = pusherRef.current;

	const [authState, setAuthState] = useState({
		token: null,
		expiresAt: expiresAt ? Number(expiresAt) : null,
		userInfo: userInfo ? JSON.parse(userInfo) : {},
	});

	const setAuthInfo = ({ userInfo, expiresAt }) => {
		localStorage.setItem('userInfo', JSON.stringify(userInfo));
		localStorage.setItem('expiresAt', expiresAt);
		setAuthState({
			userInfo,
			expiresAt: Number(expiresAt),
		});
	};

	const logout = () => {
		localStorage.removeItem('userInfo');
		localStorage.removeItem('expiresAt');
		pusher.disconnect();
		setAuthState({
			token: null,
			expiresAt: null,
			userInfo: {},
		});
	};

	const isAuthenticated = () => {
		if (!authState.expiresAt) return false;
		return new Date().getTime() / 1000 < authState.expiresAt;
	};

	const isSuperAdmin = () => authState.userInfo.role === 'superAdmin';
	const isAdmin = () => authState.userInfo.role === 'admin';
	const isStaff = () => authState.userInfo.role === 'staff';
	const isStudent = () => authState.userInfo.role === 'student';
	const isFaculty = () => authState.userInfo.role === 'faculty';
	const isAuthorized = () =>
		authState.userInfo.role === 'superAdmin' ||
		authState.userInfo.role === 'admin';

	return (
		<Provider
			value={{
				authState,
				setAuthState: (authInfo) => setAuthInfo(authInfo),
				isAuthenticated,
				logout,
				isStaff,
				isFaculty,
				isAuthorized,
				isSuperAdmin,
				isAdmin,
				isStudent,
				pusher,
			}}
		>
			{children}
		</Provider>
	);
};

export { AuthContext, AuthProvider };