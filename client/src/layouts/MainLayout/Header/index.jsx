import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import { Typography } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const HEADER_HEIGHT = 64;

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

const getBreadcrumb = (pathname) => {
	const map = {
		'/dashboard': 'Dashboard',
		'/requests/all': 'All Requests',
		'/requests/pending': 'Pending Requests',
		'/requests/completed': 'Completed Requests',
		'/requests/rejected': 'Rejected Requests',
		'/requests/assign': 'Assigned Requests',
		'/users': 'Users',
		'/users/student': 'Students',
		'/users/staff': 'Staff',
		'/users/faculty': 'Faculty',
		'/users/admin': 'Admins',
		'/users/team': 'Team',
	};
	return map[pathname] ?? 'Dashboard';
};

const Header = () => {
	const [anchorElUser, setAnchorElUser] = useState(null);
	const history = useNavigate();
	const location = useLocation();
	const authContext = useContext(AuthContext);
	const fetchContext = useContext(FetchContext);

	const { firstName, lastName, role } = authContext.authState.userInfo;
	const fullName = `${firstName} ${lastName}`;
	const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
	const breadcrumb = getBreadcrumb(location.pathname);

	const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
	const handleCloseUserMenu = () => setAnchorElUser(null);

	const handleLogOut = async () => {
		try {
			await fetchContext.authAxios.post('/logout');
			authContext.logout();
			history('/');
		} catch (error) {
			console.log(error?.response?.message);
		}
	};

	return (
		<Box
			sx={{
				height: HEADER_HEIGHT,
				bgcolor: '#ffffff',
				borderBottom: '1px solid #E2E8F0',
				display: 'flex',
				alignItems: 'center',
				px: 3,
				gap: 2,
				flexShrink: 0,
			}}
		>
			{/* Breadcrumb */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
				<Typography
					sx={{
						fontFamily: "'Poppins', sans-serif",
						fontSize: 13,
						fontWeight: 500,
						color: '#64748B',
					}}
				>
					MIS Helpdesk
				</Typography>
				<Typography sx={{ fontSize: 13, color: '#64748B' }}>/</Typography>
				<Typography
					sx={{
						fontFamily: "'Poppins', sans-serif",
						fontSize: 13,
						fontWeight: 500,
						color: '#1C1C1C',
					}}
				>
					{breadcrumb}
				</Typography>
			</Box>

			{/* Spacer */}
			<Box sx={{ flex: 1 }} />

			{/* Actions */}
			<Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
				<Box
					component="button"
					aria-label="Notifications"
					sx={{
						width: 32,
						height: 32,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#64748B',
						cursor: 'pointer',
						borderRadius: '8px',
						position: 'relative',
						border: 'none',
						background: 'transparent',
						'&:hover': { bgcolor: '#F5F6FA' },
					}}
				>
					<NotificationsNoneIcon sx={{ fontSize: 20 }} />
				</Box>

				{/* Profile */}
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
			</Box>
		</Box>
	);
};

export default Header;
