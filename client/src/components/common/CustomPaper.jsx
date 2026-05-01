import { Paper } from '@mui/material';

const CustomPaper = ({ children, ...props }) => {
	return (
		<Paper
			sx={{
				borderRadius: '8px',
				border: '1px solid #E2E8F0',
				backgroundColor: '#ffffff',
				boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
			}}
			{...props}
		>
			{children}
		</Paper>
	);
};

export default CustomPaper;
