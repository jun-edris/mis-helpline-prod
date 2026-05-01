import {
	Box,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AuthContext } from '../context/AuthContext';
import { FetchContext } from '../context/FetchContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stringToColor = (string) => {
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	return color;
};

const LogoIcon = () => (
	<Box
		sx={{
			width: 32,
			height: 32,
			bgcolor: '#00B67A',
			borderRadius: '8px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexShrink: 0,
		}}
	>
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
			<rect x="2" y="2" width="6" height="6" rx="1.2" fill="white" />
			<rect x="10" y="2" width="6" height="6" rx="1.2" fill="white" />
			<rect x="2" y="10" width="6" height="6" rx="1.2" fill="white" />
			<rect x="10" y="10" width="6" height="6" rx="1.2" fill="rgba(255,255,255,0.5)" />
		</svg>
	</Box>
);

const Header = () => {
	const history = useNavigate();
	const [anchorElUser, setAnchorElUser] = useState(null);
	const authContext = useContext(AuthContext);
	const fetchContext = useContext(FetchContext);

	const { firstName, lastName, role } = authContext.authState.userInfo;
	const fullName = `${firstName} ${lastName}`;
	const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

	const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
	const handleCloseUserMenu = () => setAnchorElUser(null);

	const handleLogOut = async () => {
		try {
			await fetchContext.authAxios.post('/logout');
			authContext.logout();
			history('/');
		} catch (error) {}
	};

	return (
		<Box
			sx={{
				height: 64,
				bgcolor: '#ffffff',
				borderBottom: '1px solid #E2E8F0',
				display: 'flex',
				alignItems: 'center',
			}}
		>
			<Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				{/* Logo */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
					<LogoIcon />
					<Typography
						sx={{
							fontFamily: "'Poppins', sans-serif",
							fontSize: 15,
							fontWeight: 600,
							color: '#00B67A',
						}}
					>
						MIS Helpdesk
					</Typography>
				</Box>

				<Box sx={{ flex: 1 }} />

				{/* User profile */}
				<Box
					onClick={handleOpenUserMenu}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						cursor: 'pointer',
						padding: '4px 8px',
						borderRadius: '8px',
						'&:hover': { bgcolor: '#F5F6FA' },
					}}
				>
					<Box
						sx={{
							width: 30,
							height: 30,
							borderRadius: '50%',
							background: `linear-gradient(135deg, ${stringToColor(fullName)}, #1F8463)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 11,
							fontWeight: 600,
							color: '#fff',
							fontFamily: "'Poppins', sans-serif",
							flexShrink: 0,
						}}
					>
						{initials}
					</Box>
					<Box>
						<Typography
							sx={{
								fontFamily: "'Poppins', sans-serif",
								fontSize: 13,
								fontWeight: 500,
								color: '#1C1C1C',
								lineHeight: 1.2,
							}}
						>
							{fullName}
						</Typography>
						<Typography
							sx={{
								fontSize: 11,
								color: '#64748B',
								fontFamily: "'Inter', sans-serif",
								textTransform: 'capitalize',
								lineHeight: 1.2,
							}}
						>
							{role}
						</Typography>
					</Box>
				</Box>

				<Menu
					sx={{ mt: '45px' }}
					id="menu-appbar"
					anchorEl={anchorElUser}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
					keepMounted
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					open={Boolean(anchorElUser)}
					onClose={handleCloseUserMenu}
				>
					<MenuItem onClick={handleLogOut} sx={{ gap: 1, fontSize: 13 }}>
						<ExitToAppIcon sx={{ fontSize: 18 }} />
						Logout
					</MenuItem>
				</Menu>
			</Container>
		</Box>
	);
};

export default Header;
