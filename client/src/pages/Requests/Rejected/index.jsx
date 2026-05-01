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
import { rejectedRequest } from '../../../constants/table-headers';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';
import StatusBadge from '../../../components/common/StatusBadge';

const Rejected = () => {
	const fetchContext = useContext(FetchContext);
	const authContext = useContext(AuthContext);
	const [records, setRecords] = useState([]);

	const getRejectedRequests = async () => {
		fetchContext.authAxios
			.get(`/requests/rejected`)
			.then(({ data }) => {
				setRecords(data.requests);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		try {
			getRejectedRequests();
			const requestChannel = authContext.pusher.subscribe('request');
			const refresh = () => { getRejectedRequests(); fetchContext.setRefreshKey(k => k + 1); };
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
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box>
					<Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: '#1C1C1C' }}>
						Rejected Requests
					</Typography>
					<Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#64748B', mt: 0.5 }}>
						Tickets that did not meet requirements for approval
					</Typography>
				</Box>
				<TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
					<Table>
						<TableHead>
							<TableRow>
								{rejectedRequest.map((req, index) => (
									<TableCell key={index}>{req.label}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{records.length === 0 && (
								<TableRow>
									<TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
										No rejected requests
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
										<TableCell><StatusBadge label="Rejected" /></TableCell>
										<TableCell>{record?.reason}</TableCell>
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

export default Rejected;
