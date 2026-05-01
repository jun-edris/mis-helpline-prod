import { Box, Typography } from '@mui/material';

const Footer = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				py: 4,
				borderTop: '1px solid #E2E8F0',
				mt: 4,
			}}
		>
			<Typography variant="caption" sx={{ color: '#64748B' }}>All Rights Reserved</Typography>
		</Box>
	);
};

export default Footer;
