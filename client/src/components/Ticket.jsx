import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FetchContext } from '../context/FetchContext';

const Ticket = ({ ticketNo, reqType, handleClose, id }) => {
	const history = useNavigate();
	const fetchContext = useContext(FetchContext);
	const [loading, setLoading] = useState(false);

	const sendTicket = async () => {
		try {
			setLoading(true);
			await fetchContext.authAxios.patch(`/request/${id}`, { ticketNo });
			setLoading(false);
		} catch {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
			<Box
				sx={{
					width: 56,
					height: 56,
					bgcolor: '#EDFFF9',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#00B67A',
				}}
			>
				<CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
			</Box>

			<Typography
				sx={{
					fontFamily: "'Poppins', sans-serif",
					fontSize: 16,
					fontWeight: 600,
					color: '#1C1C1C',
					textAlign: 'center',
				}}
			>
				Request Submitted
			</Typography>

			<Typography
				sx={{
					fontFamily: "'Inter', sans-serif",
					fontSize: 13,
					color: '#64748B',
					textAlign: 'center',
					maxWidth: 300,
				}}
			>
				Your <strong>{reqType}</strong> request is on its way. Your ticket number is:
			</Typography>

			<Box
				sx={{
					bgcolor: '#F5F6FA',
					border: '1px solid #E2E8F0',
					borderRadius: '8px',
					px: 4,
					py: 2,
					textAlign: 'center',
				}}
			>
				<Typography
					sx={{
						fontFamily: "'IBM Plex Mono', monospace",
						fontSize: 28,
						fontWeight: 600,
						color: '#00B67A',
						letterSpacing: '0.05em',
					}}
				>
					{ticketNo}
				</Typography>
			</Box>

			<Button
				variant="contained"
				disabled={loading}
				startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
				onClick={() => {
					sendTicket();
					if (!loading) {
						history('/request', { replace: true });
						handleClose();
					}
				}}
				sx={{ mt: 1, minWidth: 140 }}
			>
				Continue
			</Button>
		</Box>
	);
};

export default Ticket;
