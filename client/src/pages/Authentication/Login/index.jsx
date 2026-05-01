import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	Typography,
	CircularProgress,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/common/InputField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { loginSchema } from '../../../schema/schema';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicFetch } from '../../../utils/fetch';
import { SnackbarError, SnackbarSuccess } from '../../../components/SnackBars';
import { AuthContext } from '../../../context/AuthContext';

const LogoIcon = () => (
	<Box
		sx={{
			width: 40,
			height: 40,
			bgcolor: '#00B67A',
			borderRadius: '10px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<svg width="22" height="22" viewBox="0 0 18 18" fill="none">
			<rect x="2" y="2" width="6" height="6" rx="1.2" fill="white" />
			<rect x="10" y="2" width="6" height="6" rx="1.2" fill="white" />
			<rect x="2" y="10" width="6" height="6" rx="1.2" fill="white" />
			<rect x="10" y="10" width="6" height="6" rx="1.2" fill="rgba(255,255,255,0.5)" />
		</svg>
	</Box>
);

const Login = () => {
	const history = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const [successMessage, setSuccessMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [loading, setLoading] = useState(false);
	const authContext = useContext(AuthContext);

	const login = async (values, resetForm) => {
		try {
			setLoading(true);
			const { data } = await publicFetch.post(`/login`, values);
			authContext.setAuthState(data);
			setSuccessMessage(data.message);
			setSuccess(true);
			setErrorMessage('');
			resetForm(true);
			setLoading(false);
		} catch (e) {
			const { data } = e.response;
			setErrorMessage(data.message);
			setError(true);
			setSuccessMessage('');
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!authContext.isAuthenticated()) {
			history('/', { replace: true });
		} else {
			history('/dashboard', { replace: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{successMessage && (
				<SnackbarSuccess
					open={success}
					setOpen={setSuccess}
					successMessage={successMessage}
				/>
			)}
			{errorMessage && (
				<SnackbarError
					open={error}
					setOpen={setError}
					errorMessage={errorMessage}
				/>
			)}

			<Box
				sx={{
					minHeight: '100vh',
					bgcolor: '#F5F6FA',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: 2,
				}}
			>
				<Box
					sx={{
						width: '100%',
						maxWidth: 420,
						bgcolor: '#ffffff',
						border: '1px solid #E2E8F0',
						borderRadius: '12px',
						boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
						p: 4,
					}}
				>
					{/* Logo + brand */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
						<LogoIcon />
						<Box>
							<Typography
								sx={{
									fontFamily: "'Poppins', sans-serif",
									fontWeight: 700,
									fontSize: 18,
									color: '#081021',
									lineHeight: 1.2,
								}}
							>
								MIS Helpdesk
							</Typography>
							<Typography
								sx={{
									fontFamily: "'Inter', sans-serif",
									fontSize: 12,
									color: '#64748B',
								}}
							>
								IT Support Ticketing System
							</Typography>
						</Box>
					</Box>

					<Typography
						sx={{
							fontFamily: "'Poppins', sans-serif",
							fontWeight: 600,
							fontSize: 22,
							color: '#1C1C1C',
							mb: 0.5,
						}}
					>
						Sign in
					</Typography>
					<Typography
						sx={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: '#64748B',
							mb: 3,
						}}
					>
						Use your BISU institutional email
					</Typography>

					<Formik
						initialValues={{ email: '', password: '' }}
						validationSchema={loginSchema}
						onSubmit={(values, { resetForm }) => login(values, resetForm)}
					>
						{() => (
							<Form autoComplete="off" noValidate>
								<FormControl fullWidth sx={{ mb: 2 }}>
									<InputField
										required
										fullWidth
										id="email"
										label="BISU Email"
										name="email"
										autoComplete="off"
									/>
								</FormControl>
								<FormControl fullWidth sx={{ mb: 3 }}>
									<InputField
										name="password"
										type={showPassword ? 'text' : 'password'}
										label="Password"
										autoComplete="off"
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														aria-label="toggle password visibility"
														onClick={() => setShowPassword(v => !v)}
														onMouseDown={(e) => e.preventDefault()}
														edge="end"
													>
														{showPassword ? <Visibility /> : <VisibilityOff />}
													</IconButton>
												</InputAdornment>
											),
										}}
									/>
								</FormControl>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									disabled={loading}
									startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
									sx={{ py: 1.2 }}
								>
									Sign In
								</Button>
							</Form>
						)}
					</Formik>

					<Box sx={{ mt: 3, textAlign: 'center' }}>
						<Typography
							sx={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 13,
								color: '#64748B',
							}}
						>
							No account yet?{' '}
							<Link
								to="/signup"
								style={{ color: '#00B67A', textDecoration: 'none', fontWeight: 500 }}
							>
								Sign up here
							</Link>
						</Typography>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Login;
