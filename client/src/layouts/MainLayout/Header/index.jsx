import { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import { Grid, Typography } from '@mui/material';

const Header = () => {
	const [anchorElUser, setAnchorElUser] = useState(null);
	const history = useNavigate();
	const authContext = useContext(AuthContext);
	const fetchContext = useContext(FetchContext);

	const stringToColor = (string) => {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	};

	const stringAvatar = (name) => {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(' ')[0][0]}${name.split(' ').pop()[0]}`,
		};
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogOut = async () => {
		try {
			await fetchContext.authAxios.get('/logout');
			authContext.logout();
			history('/');
		} catch (error) {
			console.log(error?.response?.message);
		}
	};

	return (
		<AppBar position="static">
			<Toolbar disableGutters sx={{ paddingRight: 2 }}>
				<Box sx={{ flexGrow: 0, marginLeft: 'auto', display: 'flex', gap: 2 }}>
					<Grid container direction="column" alignItems="flex-end">
						<Grid item>
							<Typography variant="subtitle1">{`${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`}</Typography>
						</Grid>
						<Typography variant="caption">
							{authContext.authState.userInfo.role}
						</Typography>
					</Grid>
					<Tooltip title="Open settings">
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar
								{...stringAvatar(
									`${authContext.authState.userInfo.firstName} ${authContext.authState.userInfo.lastName}`
								)}
							/>
						</IconButton>
					</Tooltip>
					<Menu
						sx={{ mt: '45px' }}
						id="menu-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
					>
						<MenuItem onClick={handleLogOut}>
							<ExitToAppIcon />
							&nbsp;Logout
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
