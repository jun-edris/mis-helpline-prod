import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Forms from './Form';

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

const Signup = () => {
	const [selectedRole, setSelectedRole] = useState('student');

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: '#F5F6FA',
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'center',
				px: 2,
				py: 6,
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: 560,
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
					Create an account
				</Typography>
				<Typography
					sx={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 13,
						color: '#64748B',
						mb: 3,
					}}
				>
					Register with your BISU institutional email
				</Typography>

				<FormControl fullWidth sx={{ mb: 3 }}>
					<InputLabel id="user-type-label">User Type</InputLabel>
					<Select
						labelId="user-type-label"
						id="userType"
						label="User Type"
						name="userType"
						onChange={(e) => setSelectedRole(e.target.value)}
						value={selectedRole}
					>
						<MenuItem value="staff">Staff</MenuItem>
						<MenuItem value="faculty">Faculty</MenuItem>
						<MenuItem value="student">Student</MenuItem>
					</Select>
				</FormControl>

				<Forms userType={selectedRole} />

				<Box sx={{ mt: 3, textAlign: 'center' }}>
					<Typography
						sx={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: '#64748B',
						}}
					>
						Already have an account?{' '}
						<Link
							to="/"
							style={{ color: '#00B67A', textDecoration: 'none', fontWeight: 500 }}
						>
							Sign in here
						</Link>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Signup;
