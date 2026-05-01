import { Button } from '@mui/material';

const CustomButton = ({ children, ...props }) => {
	return (
		<Button variant="contained" {...props}>
			{children}
		</Button>
	);
};

export default CustomButton;
