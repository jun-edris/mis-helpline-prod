/* eslint-disable react-hooks/exhaustive-deps */
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useContext, useEffect, useState } from 'react';
import Approve from './../../../components/Request/Approve';
import Reject from './../../../components/Request/Reject';
import CustomButton from '../../../components/common/CustomButton';
import PopupDialog from '../../../components/common/PopupDialog';
import StatusBadge from '../../../components/common/StatusBadge';
import { allRequest } from '../../../constants/table-headers';
import { AuthContext } from '../../../context/AuthContext';
import { FetchContext } from '../../../context/FetchContext';

const All = () => {
	const fetchContext = useContext(FetchContext);
	const authContext = useContext(AuthContext);
	const [records, setRecords] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState({});
	const [openRejectPopup, setOpenRejectPopup] = useState(false);

	const getRequests = () => {
		fetchContext.authAxios
			.get(`/requests`)
			.then(({ data }) => setRecords(data.requests))
			.catch((error) => console.log(error));
	};

	const handleClose = () => {
		setOpenPopup(false);
		setOpenRejectPopup(false);
	};

	const getStatusLabel = (record) => {
		if (record?.approved === false && record?.rejected === false) return 'In Evaluation';
		if (record?.completed === true) return 'Completed';
		if (record?.approved === true) return 'Approved';
		if (record?.pending === true) return 'Pending';
		if (record?.rejected === true) return 'Rejected';
		return 'In Evaluation';
	};

	useEffect(() => {
		try {
			getRequests();
			const requestChannel = authContext.pusher.subscribe('request');
			const refresh = () => { getRequests(); fetchContext.setRefreshKey(k => k + 1); };
			requestChannel.bind('created', refresh);
			requestChannel.bind('updated', refresh);
			requestChannel.bind('approved', refresh);
			requestChannel.bind('rejected', refresh);
			requestChannel.bind('deleted-req', refresh);
			return () => {
				requestChannel.unbind_all();
				authContext.pusher.unsubscribe('request');
			};
		} catch (error) {}
	}, [fetchContext.refreshKey]);

	return (
		<>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Box>
					<Typography
						sx={{
							fontFamily: "'Poppins', sans-serif",
							fontSize: 26,
							fontWeight: 700,
							color: '#1C1C1C',
							lineHeight: 1.2,
						}}
					>
						All Requests
					</Typography>
					<Typography
						sx={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 14,
							color: '#64748B',
							mt: 0.5,
						}}
					>
						Review and manage all submitted support tickets
					</Typography>
				</Box>

				<TableContainer
					component={Paper}
					sx={{
						border: '1px solid #E2E8F0',
						borderRadius: '8px',
						boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								{allRequest.map((req, index) => (
									<TableCell key={index}>{req.label}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{records?.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#64748B', fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
										No requests found
									</TableCell>
								</TableRow>
							)}
							{records?.map((record, index) => {
								const date = new Date(record?.createdAt);
								const month = String(date.getMonth() + 1).padStart(2, '0');
								const day = String(date.getDate()).padStart(2, '0');
								const year = date.getFullYear();

								return (
									<TableRow key={index} sx={{ '&:hover': { bgcolor: '#F5F6FA' } }}>
										<TableCell>{`${month}/${day}/${year}`}</TableCell>
										<TableCell>
											<Typography
												sx={{
													fontFamily: "'IBM Plex Mono', monospace",
													fontSize: 12,
													color: '#1C1C1C',
												}}
											>
												{record?.ticketNo}
											</Typography>
										</TableCell>
										<TableCell>{`${record?.user?.firstName} ${record?.user?.lastName}`}</TableCell>
										<TableCell>{record?.title}</TableCell>
										<TableCell>{record?.reqType}</TableCell>
										<TableCell>
											<StatusBadge label={getStatusLabel(record)} />
										</TableCell>
										{!record?.approved && !record?.rejected ? (
											<TableCell>
												<Box sx={{ display: 'flex', gap: 1 }}>
													<CustomButton
														color="success"
														size="small"
														startIcon={<CheckCircleIcon />}
														onClick={() => {
															setSelectedRecord(record);
															setOpenPopup(true);
														}}
													>
														Approve
													</CustomButton>
													<CustomButton
														color="error"
														size="small"
														startIcon={<CancelIcon />}
														onClick={() => {
															setSelectedRecord(record);
															setOpenRejectPopup(true);
														}}
													>
														Reject
													</CustomButton>
												</Box>
											</TableCell>
										) : (
											<TableCell />
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<PopupDialog
				title="By clicking Submit, you are approving the following request"
				openPopup={openPopup}
				handleClose={handleClose}
			>
				<Approve record={selectedRecord} handleClose={handleClose} />
			</PopupDialog>
			<PopupDialog
				title="Why reject this request?"
				openPopup={openRejectPopup}
				handleClose={handleClose}
			>
				<Reject record={selectedRecord} handleClose={handleClose} />
			</PopupDialog>
		</>
	);
};

export default All;
