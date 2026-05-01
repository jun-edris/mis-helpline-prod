import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
	return (
		<Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
			<Sidebar />
			<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
				<Header />
				<Box
					component="main"
					sx={{
						flex: 1,
						overflowY: 'auto',
						px: 3,
						py: 3,
						bgcolor: '#F5F6FA',
						'&::-webkit-scrollbar': { width: 5 },
						'&::-webkit-scrollbar-track': { background: 'transparent' },
						'&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: 2 },
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
};

export default MainLayout;
