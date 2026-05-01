/* eslint-disable react-hooks/exhaustive-deps */
import {
	Box,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext, useEffect, useState } from 'react';
import { assignedRequest } from '../../../constants/table-headers';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import CustomButton from '../../../components/common/CustomButton';
import StatusBadge from '../../../components/common/StatusBadge';
import { SnackbarError, SnackbarSuccess } from '../../../components/SnackBars';

const Assigned = () => {
	const fetchContext = useContext(FetchContext);
	const authContext = useContext(AuthContext);
	const [records, setRecords] = useState([]);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const [successMessage, setSuccessMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [loading, setLoading] = useState(false);

	const getAssignedRequests = async () => {
		fetchContext.authAxios
			.get(`/requests/assigned`)
			.then(({ data }) => {
				setRecords(data.requests);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const completeReq = async (values) => {
		try {
			setLoading(true);
			const { data } = await fetchContext.authAxios.patch(
				`/request/complete/${values?._id}`,
				values
			);
			setSuccessMessage(data.message);
			setSuccess(true);
			setErrorMessage('');
			setLoading(false);
		} catch (e) {
			const { data } = e.response;
			setErrorMessage(data.message);
			setError(true);
			setSuccessMessage('');
			setLoading(false);
			console.log(e);
		}
	};

	useEffect(() => {
		try {
			getAssignedRequests();
			const requestChannel = authContext.pusher.subscribe('request');
			const refresh = () => { getAssignedRequests(); fetchContext.setRefreshKey(k => k + 1); };
			requestChannel.bind('created', refresh);
			requestChannel.bind('updated', refresh);
			requestChannel.bind('deleted-req', refresh);
			return () => {
				requestChannel.unbind_all();
				authContext.pusher.unsubscribe('request');
			};
		} catch (error) {}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchContext.refreshKey]);

	return (
		<>
			{successMessage && (
				<SnackbarSuccess
					open={success}
					setOpen={setSuccess}
					successMessage={successMessage}
				/>
			)}
			{errorMessage && (
				<SnackbarError
					open={error}
					setOpen={setError}
					errorMessage={errorMessage}
				/>
			)}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box>
					<Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: '#1C1C1C' }}>
						Assigned Requests
					</Typography>
					<Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#64748B', mt: 0.5 }}>
						Requests assigned to you for resolution
					</Typography>
				</Box>
				<TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
					<Table>
						<TableHead>
							<TableRow>
								{assignedRequest.map((req, index) => (
									<TableCell key={index}>{req.label}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{records.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
										No assigned requests
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
											<Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1C1C1C' }}>{record?.ticketNo}</Typography>
										</TableCell>
										<TableCell>{`${record?.user.firstName} ${record?.user.lastName}`}</TableCell>
										<TableCell>{record?.title}</TableCell>
										<TableCell>{record?.reqType}</TableCell>
										<TableCell>
											{record?.completed && !record?.pending
												? <StatusBadge label="Completed" />
												: <StatusBadge label="Pending" />}
										</TableCell>
										<TableCell>
											{record?.pending && (
												<CustomButton
													color="success"
													size="small"
													disabled={loading}
													startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
													onClick={() => completeReq(record)}
												>
													Mark Complete
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
		</>
	);
};

export default Assigned;
