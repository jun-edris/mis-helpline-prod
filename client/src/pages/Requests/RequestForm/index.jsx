import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	FormControl,
	FormControlLabel,
	Radio,
	Typography,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import AlbumIcon from '@mui/icons-material/Album';
import StorageIcon from '@mui/icons-material/Storage';
import LanguageIcon from '@mui/icons-material/Language';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputField from '../../../components/common/InputField';
import { Formik, Form, Field } from 'formik';
import { Link, useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import RadioGroupFormik from '../../../components/common/RadioGroupFormik';
import { useContext, useState } from 'react';
import { FetchContext } from '../../../context/FetchContext';
import { requestSchema } from '../../../schema/schema';
import PopupDialog from '../../../components/common/PopupDialog';
import { SnackbarError, SnackbarSuccess } from '../../../components/SnackBars';
import Ticket from '../../../components/Ticket';
import CustomButton from '../../../components/common/CustomButton';

const dataOptions = [
	'backup',
	'recovery',
	'website content',
	'social media content',
];
const softwareOptions = ['installation', 'maintenance'];
const hardwareOptions = ['setup', 'maintenance'];
const networkOptions = ['setup', 'configure', 'repair', 'maintenance'];

const TYPE_ICON = {
	data: <StorageIcon sx={{ fontSize: 24 }} />,
	software: <AlbumIcon sx={{ fontSize: 24 }} />,
	hardware: <MemoryIcon sx={{ fontSize: 24 }} />,
	network: <LanguageIcon sx={{ fontSize: 24 }} />,
	others: <MoreVertIcon sx={{ fontSize: 24 }} />,
};

const RequestForm = () => {
	const { type } = useParams();
	const [openPopup, setOpenPopup] = useState(false);
	const [ticketNo, setTicketNo] = useState('');
	const [reqType, setReqType] = useState('');
	const [reqId, setReqId] = useState('');
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const [successMessage, setSuccessMessage] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const fetchContext = useContext(FetchContext);
	const [loading, setLoading] = useState(false);

	const handleClose = () => setOpenPopup(false);

	const submitRequest = async (values, resetForm) => {
		try {
			setLoading(true);
			const { data } = await fetchContext.authAxios.post(`/requests`, values);
			setSuccessMessage(data.message);
			setTicketNo(data.ticketNo);
			setReqType(data.reqType);
			setReqId(data._id);
			setSuccess(true);
			setErrorMessage('');
			resetForm(true);
			setLoading(false);
			if (data?.ticketNo) {
				setOpenPopup(true);
			}
		} catch (e) {
			const { data } = e.response;
			setErrorMessage(data.message);
			setError(true);
			setSuccessMessage('');
			setLoading(false);
		}
	};

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
			<Header />
			<Container maxWidth="md" sx={{ mb: 8 }}>
				<Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
					{/* Page header */}
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
							Submit a Request
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Inter', sans-serif",
								fontSize: 14,
								color: '#64748B',
								mt: 0.5,
							}}
						>
							Fill out the form below to submit your IT support request
						</Typography>
					</Box>

					<Formik
						initialValues={{ title: type, reqType: '', description: '' }}
						validationSchema={requestSchema}
						onSubmit={(values, { resetForm }) => submitRequest(values, resetForm)}
					>
						{(formik) => (
							<Form>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
									{/* Request type card */}
									<Box
										sx={{
											bgcolor: '#ffffff',
											border: '1px solid #E2E8F0',
											borderRadius: '8px',
											boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
											p: 3,
											display: 'flex',
											alignItems: 'center',
											gap: 2,
											justifyContent: 'space-between',
										}}
									>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
											<Box
												sx={{
													width: 48,
													height: 48,
													bgcolor: '#EDFFF9',
													borderRadius: '10px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#00B67A',
													flexShrink: 0,
												}}
											>
												{TYPE_ICON[type] ?? <MoreVertIcon sx={{ fontSize: 24 }} />}
											</Box>
											<Box>
												<Typography
													sx={{
														fontFamily: "'Poppins', sans-serif",
														fontSize: 14,
														fontWeight: 600,
														color: '#1C1C1C',
														textTransform: 'capitalize',
													}}
												>
													{type} Request
												</Typography>
												<Typography
													sx={{
														fontFamily: "'Inter', sans-serif",
														fontSize: 12,
														color: '#64748B',
													}}
												>
													Select the specific request subtype below
												</Typography>
											</Box>
										</Box>
										<Link to="/home" style={{ textDecoration: 'none' }}>
											<Button
												variant="outlined"
												size="small"
												startIcon={<ArrowBackIcon />}
												sx={{
													borderColor: '#E2E8F0',
													color: '#64748B',
													fontFamily: "'Poppins', sans-serif",
													fontSize: 12,
													'&:hover': { borderColor: '#00B67A', color: '#00B67A' },
												}}
											>
												Change
											</Button>
										</Link>
									</Box>

									{/* Subtype selection */}
									<Box
										sx={{
											bgcolor: '#ffffff',
											border: '1px solid #E2E8F0',
											borderRadius: '8px',
											boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
											p: 3,
										}}
									>
										<Typography
											sx={{
												fontFamily: "'Poppins', sans-serif",
												fontSize: 13,
												fontWeight: 600,
												color: '#1C1C1C',
												mb: 2,
											}}
										>
											Request Subtype
										</Typography>
										{type !== 'others' && (
											<Field name="reqType">
												{({ field, form }) => (
													<RadioGroupFormik form={form} field={field}>
														{type === 'data' && dataOptions.map((o) => (
															<FormControlLabel key={o} value={o} control={<Radio />} label={o} />
														))}
														{type === 'hardware' && hardwareOptions.map((o) => (
															<FormControlLabel key={o} value={o} control={<Radio />} label={o} />
														))}
														{type === 'software' && softwareOptions.map((o) => (
															<FormControlLabel key={o} value={o} control={<Radio />} label={o} />
														))}
														{type === 'network' && networkOptions.map((o) => (
															<FormControlLabel key={o} value={o} control={<Radio />} label={o} />
														))}
													</RadioGroupFormik>
												)}
											</Field>
										)}
										{type === 'others' && (
											<FormControl fullWidth>
												<InputField
													margin="dense"
													required
													fullWidth
													label="Please specify..."
													name="reqType"
													autoComplete="off"
													type="text"
													onKeyDown={(evt) => {
														const alpha = /^[a-zA-Z\s]$/;
														if (!alpha.test(evt.key) && evt.key !== 'Backspace' && evt.key !== 'Delete') {
															evt.preventDefault();
														}
													}}
												/>
											</FormControl>
										)}

										{formik.values.reqType === 'social media content' && (
											<Box sx={{ mt: 2 }}>
												<Button
													variant="outlined"
													size="small"
													sx={{ borderColor: '#00B67A', color: '#00B67A', mb: 1.5 }}
												>
													<a
														target="_blank"
														rel="noreferrer"
														href="https://bit.ly/MISRequestForm"
														style={{ color: 'inherit', textDecoration: 'none', fontFamily: "'Poppins', sans-serif", fontSize: 13 }}
													>
														Download Info Request Form
													</a>
												</Button>
												<Alert severity="info" sx={{ fontSize: 13 }}>
													Download this form for posting and have it signed by the
													persons involved. This form is required for approval.
												</Alert>
											</Box>
										)}
									</Box>

									{/* Description */}
									<Box
										sx={{
											bgcolor: '#ffffff',
											border: '1px solid #E2E8F0',
											borderRadius: '8px',
											boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
											p: 3,
										}}
									>
										<Typography
											sx={{
												fontFamily: "'Poppins', sans-serif",
												fontSize: 13,
												fontWeight: 600,
												color: '#1C1C1C',
												mb: 2,
											}}
										>
											Issue Description
										</Typography>
										<InputField
											multiline
											fullWidth
											rows={5}
											name="description"
											label="Describe your issue in detail..."
										/>
									</Box>

									<Box>
										<CustomButton
											variant="contained"
											type="submit"
											disabled={loading}
											startIcon={loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
										>
											Send Request
										</CustomButton>
									</Box>
								</Box>
							</Form>
						)}
					</Formik>
				</Box>
			</Container>

			<PopupDialog openPopup={openPopup} handleClose={handleClose}>
				<Ticket
					handleClose={handleClose}
					ticketNo={ticketNo}
					reqType={reqType}
					id={reqId}
				/>
			</PopupDialog>
		</>
	);
};

export default RequestForm;
