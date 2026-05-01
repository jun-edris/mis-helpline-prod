/* eslint-disable react-hooks/exhaustive-deps */
import {
	Box,
	CircularProgress,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import Header from '../../../components/Header';
import { request } from '../../../constants/table-headers';
import CustomButton from '../../../components/common/CustomButton';
import StatusBadge from '../../../components/common/StatusBadge';
import { SnackbarSuccess } from '../../../components/SnackBars';

const MyRequest = () => {
	const fetchContext = useContext(FetchContext);
	const authContext = useContext(AuthContext);
	const [success, setSuccess] = useState(false);
	const [successMessage, setSuccessMessage] = useState();
	const [loading, setLoading] = useState(false);
	const [records, setRecords] = useState([]);

	const getUserRequests = async () => {
		fetchContext.authAxios
			.get(`/requests/mine`)
			.then(({ data }) => setRecords(data.requests))
			.catch((error) => console.log(error));
	};

	const cancelRequest = async (id) => {
		setLoading(true);
		fetchContext.authAxios
			.delete(`/request/${id}`)
			.then(({ data }) => {
				setSuccessMessage(data.message);
				setSuccess(true);
				setLoading(false);
			})
			.catch((error) => console.log(error));
	};

	const getStatusLabel = (record) => {
		if (record?.completed === true && record?.approved === true) return 'Completed';
		if (record?.approved === true) return 'Approved';
		if (record?.pending === true) return 'Pending';
		if (record?.rejected === true) return 'Rejected';
		return 'In Evaluation';
	};

	useEffect(() => {
		try {
			getUserRequests();
			const requestChannel = authContext?.pusher.subscribe('request');
			const refresh = () => { getUserRequests(); fetchContext.setRefreshKey(k => k + 1); };
			requestChannel.bind('created', refresh);
			requestChannel.bind('approved', refresh);
			requestChannel.bind('rejected', refresh);
			requestChannel.bind('updated', refresh);
			requestChannel.bind('deleted-req', refresh);
			return () => {
				requestChannel.unbind_all();
				authContext.pusher.unsubscribe('request');
			};
		} catch (error) {}
	}, [fetchContext.refreshKey]);

	return (
		<>
			{successMessage && (
				<SnackbarSuccess open={success} setOpen={setSuccess} successMessage={successMessage} />
			)}
			<Header />
			<Container>
				<Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Box>
						<Typography
							sx={{
								fontFamily: "'Poppins', sans-serif",
								fontSize: 26,
								fontWeight: 700,
								color: '#1C1C1C',
							}}
						>
							My Requests
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 14,
								color: '#64748B',
								mt: 0.5,
							}}
						>
							List of your pending and completed requests
						</Typography>
					</Box>

					<TableContainer
						component={Paper}
						sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
					>
						<Table>
							<TableHead>
								<TableRow>
									{request.map((req, index) => (
										<TableCell key={index}>{req.label}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{records.length === 0 && (
									<TableRow>
										<TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
											No requests yet
										</TableCell>
									</TableRow>
								)}
								{records.map((record, index) => {
									const date = new Date(record?.createdAt);
									const month = String(date.getMonth() + 1).padStart(2, '0');
									const day = String(date.getDate()).padStart(2, '0');
									const year = date.getFullYear();
									return (
										<TableRow key={index} sx={{ '&:hover': { bgcolor: '#F5F6FA' } }}>
											<TableCell>{`${month}/${day}/${year}`}</TableCell>
											<TableCell>
												<Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1C1C1C' }}>
													{record?.ticketNo}
												</Typography>
											</TableCell>
											<TableCell>{record?.title}</TableCell>
											<TableCell>{record?.reqType}</TableCell>
											<TableCell>
												<StatusBadge label={getStatusLabel(record)} />
											</TableCell>
											<TableCell>
												{!record?.rejected && !record?.completed && (
													<CustomButton
														color="error"
														size="small"
														onClick={() => cancelRequest(record?._id)}
														disabled={loading}
														startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
													>
														Cancel
													</CustomButton>
												)}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			</Container>
		</>
	);
};

export default MyRequest;
