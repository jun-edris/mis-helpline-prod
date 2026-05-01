import {
	Box,
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
import { pendingRequest } from '../../../constants/table-headers';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import StatusBadge from '../../../components/common/StatusBadge';

const Pending = () => {
	const fetchContext = useContext(FetchContext);
	const authContext = useContext(AuthContext);
	const [records, setRecords] = useState([]);

	const getPendingRequests = async () => {
		fetchContext.authAxios
			.get(`/requests/pending`)
			.then(({ data }) => {
				setRecords(data.requests);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		try {
			getPendingRequests();

			const requestChannel = authContext.pusher.subscribe('request');

			requestChannel.bind('created', (newReq) => {
				setRecords((records) => [...records, newReq]);
				fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
			});

			requestChannel.bind('updated', (updateReq) => {
				setRecords(
					records.map((request) =>
						request._id === updateReq._id ? { ...records, updateReq } : request
					)
				);
				fetchContext.setRefreshKey((fetchContext.refreshKey = +1));
			});

			requestChannel.bind('deleted-req', (deletedReq) => {
				setRecords(
					records.filter((req, index) => req._id !== deletedReq[index]._id)
				);
				fetchContext.setRefreshKey(fetchContext.refreshKey + 1);
			});

			return () => {
				requestChannel.unbind_all();
				requestChannel.unsubscribe('request');
			};
		} catch (error) {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchContext.refreshKey]);
	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box>
					<Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: '#1C1C1C' }}>
						Pending Requests
					</Typography>
					<Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#64748B', mt: 0.5 }}>
						Requests that are currently assigned and in progress
					</Typography>
				</Box>

				<TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
					<Table>
						<TableHead>
							<TableRow>
								{pendingRequest.map((req, index) => (
									<TableCell key={index}>{req.label}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{records?.map((record, index) => {
								const date = new Date(record?.createdAt);
								const month = String(date.getMonth() + 1).padStart(2, '0');
								const day = String(date.getDate()).padStart(2, '0');
								return (
									<TableRow key={index} sx={{ '&:hover': { bgcolor: '#F5F6FA' } }}>
										<TableCell>{`${month} - ${day}`}</TableCell>
										<TableCell>
											<Typography sx={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#1C1C1C' }}>
												{record?.ticketNo}
											</Typography>
										</TableCell>
										<TableCell>{`${record?.user?.firstName} ${record?.user?.lastName}`}</TableCell>
										<TableCell>{record?.title}</TableCell>
										<TableCell>{record?.reqType}</TableCell>
										<TableCell>
											<StatusBadge label="Pending" />
										</TableCell>
										<TableCell>{`${record?.personnel?.firstName} ${record?.personnel?.lastName}`}</TableCell>
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

export default Pending;