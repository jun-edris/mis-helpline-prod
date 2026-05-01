import { useContext } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import config from '../../../config';
import requestLinks from './../../../constants/menu-items-dashboard/dashboardRequestLinks';
import usersLinks from './../../../constants/menu-items-dashboard/dashboardUsersLinks';
import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const SIDEBAR_WIDTH = 260;

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

const NavItem = ({ item, isActive }) => {
	return (
		<Box
			component={Link}
			to={`${config.basename}${item.url}`}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: '10px',
				padding: '9px 14px',
				borderRadius: '999px',
				fontFamily: "'Poppins', sans-serif",
				fontSize: 13,
				fontWeight: 500,
				color: isActive ? '#00B67A' : '#64748B',
				backgroundColor: isActive ? '#EDFFF9' : 'transparent',
				textDecoration: 'none',
				transition: 'background 0.12s',
				'&:hover': {
					backgroundColor: isActive ? '#EDFFF9' : 'rgba(0,0,0,0.04)',
				},
			}}
		>
			<Box
				sx={{
					width: 18,
					height: 18,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
					color: isActive ? '#00B67A' : '#64748B',
					'& svg': { fontSize: 18 },
				}}
			>
				{item.icon}
			</Box>
			<Typography
				component="span"
				sx={{
					fontFamily: "'Poppins', sans-serif",
					fontSize: 13,
					fontWeight: 500,
					color: 'inherit',
					whiteSpace: 'nowrap',
				}}
			>
				{item.title}
			</Typography>
		</Box>
	);
};

const SectionLabel = ({ label }) => (
	<Typography
		sx={{
			fontFamily: "'Inter', sans-serif",
			fontSize: 10,
			fontWeight: 600,
			color: '#64748B',
			textTransform: 'uppercase',
			letterSpacing: '0.06em',
			paddingX: '14px',
			paddingY: '6px',
			marginTop: '4px',
		}}
	>
		{label}
	</Typography>
);

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

const dashboardItem = {
	id: 'dashboard',
	title: 'Dashboard',
	url: '/dashboard',
	icon: <DashboardIcon />,
};

const Sidebar = () => {
	const location = useLocation();
	const authContext = useContext(AuthContext);
	const { firstName, lastName, role } = authContext.authState.userInfo;
	const fullName = `${firstName} ${lastName}`;
	const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

	return (
		<Box
			sx={{
				width: SIDEBAR_WIDTH,
				flexShrink: 0,
				height: '100vh',
				bgcolor: '#ffffff',
				borderRight: '1px solid #E2E8F0',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>
			{/* Logo */}
			<Box
				sx={{
					height: 64,
					display: 'flex',
					alignItems: 'center',
					gap: '10px',
					px: '20px',
					borderBottom: '1px solid #E2E8F0',
					flexShrink: 0,
				}}
			>
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

			{/* Navigation */}
			<Box
				sx={{
					flex: 1,
					overflowY: 'auto',
					px: '14px',
					py: '12px',
					display: 'flex',
					flexDirection: 'column',
					gap: '2px',
					'&::-webkit-scrollbar': { width: 4 },
					'&::-webkit-scrollbar-track': { background: 'transparent' },
					'&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: 2 },
				}}
			>
				<NavItem
					item={dashboardItem}
					isActive={location.pathname === dashboardItem.url}
				/>

				{requestLinks?.children?.some((item) =>
					item.allowedRoles.includes(authContext.authState.userInfo.role)
				) && (
					<>
						<Box sx={{ height: 1, bgcolor: '#E2E8F0', my: '6px' }} />
						<SectionLabel label={requestLinks.title} />
						{requestLinks.children.map((item, index) =>
							item.allowedRoles.includes(authContext.authState.userInfo.role) ? (
								<NavItem
									key={index}
									item={item}
									isActive={location.pathname === item.url}
								/>
							) : null
						)}
					</>
				)}

				{authContext.authState.userInfo.role === 'superAdmin' && (
					<>
						<Box sx={{ height: 1, bgcolor: '#E2E8F0', my: '6px' }} />
						<SectionLabel label={usersLinks.title} />
						{usersLinks.children.map((item, index) =>
							item.allowedRoles.includes(authContext.authState.userInfo.role) ? (
								<NavItem
									key={index}
									item={item}
									isActive={location.pathname === item.url}
								/>
							) : null
						)}
					</>
				)}
			</Box>

			{/* User Footer */}
			<Box
				sx={{
					px: '14px',
					py: '12px',
					borderTop: '1px solid #E2E8F0',
					display: 'flex',
					alignItems: 'center',
					gap: '9px',
					flexShrink: 0,
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
						flexShrink: 0,
						fontFamily: "'Poppins', sans-serif",
					}}
				>
					{initials}
				</Box>
				<Box sx={{ minWidth: 0 }}>
					<Typography
						sx={{
							fontFamily: "'Poppins', sans-serif",
							fontSize: 13,
							fontWeight: 600,
							color: '#1C1C1C',
							lineHeight: 1.3,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
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
						}}
					>
						{role}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Sidebar;
