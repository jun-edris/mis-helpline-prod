import { Box, Grid, Paper, Typography } from '@mui/material';
import {
	blue,
	red,
	teal,
	purple,
	pink,
	green,
	deepPurple,
	cyan,
	lightGreen,
} from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Chart from 'react-apexcharts';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import DisplayCountPaper from '../../components/common/DisplayCountPaper';
import Footer from '../../components/Footer';
import Devs from '../../components/Devs';

const pendingColor = blue[900];
const dataColor = teal[600];
const softwareColor = red[700];
const hardwareColor = purple[900];
const networkColor = pink[400];
const otherColor = deepPurple[700];
const requestColor = cyan[700];
const approveColor = lightGreen[700];
const completeColor = green[700];
const rejectColor = red[900];

const Dashboard = () => {
	const fetchContext = useContext(FetchContext);
	const [counts, setCounts] = useState({
		total: 0,
		approved: 0,
		completed: 0,
		rejected: 0,
		pending: 0,
		data: 0,
		software: 0,
		hardware: 0,
		network: 0,
		other: 0,
	});

	const chart = {
		series: [
			{
				data: [
					counts.data,
					counts.software,
					counts.hardware,
					counts.network,
					counts.other,
				],
			},
		],
		options: {
			title: {
				style: {
					color: '#ffffff',
				},
			},
			chart: {
				type: 'line',
			},
			plotOptions: {
				bar: {
					borderRadius: 4,
					columnWidth: '20%',
				},
			},
			dataLabels: {
				enabled: true,
			},
			xaxis: {
				categories: [
					'Data Request',
					'Software Request',
					'Hardware Request',
					'Network Request',
					'Other Request',
				],
			},
		},
	};

	useEffect(() => {
		fetchContext.authAxios
			.get('/requests/counts')
			.then(({ data }) => setCounts(data))
			.catch((error) => console.log(error));
	}, [fetchContext.refreshKey]);

	return (
		<div>
			<Box>
				<Typography variant="h6">Pending Requests</Typography>
				<Box mt={2}>
					<Grid container direction="row" alignItems="stretch" spacing={2}>
						<Grid item xs={12} sm={12} md={12} lg={4}>
							<DisplayCountPaper
								pending="true"
								title="Pending Requests"
								count={counts.pending}
								icon={
									<PendingActionsIcon
										sx={{
											position: 'absolute',
											top: 0,
											right: -40,
											opacity: 0.12,
											width: 190,
											height: 190,
										}}
									/>
								}
								bgColor={pendingColor}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12} lg={8}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={12} md={4}>
									<DisplayCountPaper
										title="Data Requests"
										count={counts.data}
										icon={
											<PendingActionsIcon
												sx={{
													position: 'absolute',
													top: 0,
													right: -24,
													opacity: 0.12,
													width: 120,
													height: 120,
												}}
											/>
										}
										bgColor={dataColor}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={4}>
									<DisplayCountPaper
										title="Software Requests"
										count={counts.software}
										icon={
											<PendingActionsIcon
												sx={{
													position: 'absolute',
													top: 0,
													right: -24,
													opacity: 0.12,
													width: 120,
													height: 120,
												}}
											/>
										}
										bgColor={softwareColor}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={4}>
									<DisplayCountPaper
										title="Hardware Requests"
										count={counts.hardware}
										icon={
											<PendingActionsIcon
												sx={{
													position: 'absolute',
													top: 0,
													right: -24,
													opacity: 0.12,
													width: 120,
													height: 120,
												}}
											/>
										}
										bgColor={hardwareColor}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={4}>
									<DisplayCountPaper
										title="Network Requests"
										count={counts.network}
										icon={
											<PendingActionsIcon
												sx={{
													position: 'absolute',
													top: 0,
													right: -24,
													opacity: 0.12,
													width: 120,
													height: 120,
												}}
											/>
										}
										bgColor={networkColor}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={4}>
									<DisplayCountPaper
										title="Other Requests"
										count={counts.other}
										icon={
											<PendingActionsIcon
												sx={{
													position: 'absolute',
													top: 0,
													right: -24,
													opacity: 0.12,
													width: 120,
													height: 120,
												}}
											/>
										}
										bgColor={otherColor}
									/>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Box>
				<Box mt={7}>
					<Typography variant="h6">Requests</Typography>
					<Box mt={2}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm>
								<DisplayCountPaper
									title="All Requests"
									count={counts.total}
									icon={
										<AssignmentIcon
											sx={{
												position: 'absolute',
												top: 0,
												right: -24,
												opacity: 0.12,
												width: 120,
												height: 120,
											}}
										/>
									}
									bgColor={requestColor}
								/>
							</Grid>
							<Grid item xs={12} sm>
								<DisplayCountPaper
									title="Approved Requests"
									count={counts.approved}
									icon={
										<FactCheckIcon
											sx={{
												position: 'absolute',
												top: 0,
												right: -24,
												opacity: 0.12,
												width: 120,
												height: 120,
											}}
										/>
									}
									bgColor={approveColor}
								/>
							</Grid>
							<Grid item xs={12} sm>
								<DisplayCountPaper
									title="Completed Requests"
									count={counts.completed}
									icon={
										<AssignmentTurnedInIcon
											sx={{
												position: 'absolute',
												top: 0,
												right: -24,
												opacity: 0.12,
												width: 120,
												height: 120,
											}}
										/>
									}
									bgColor={completeColor}
								/>
							</Grid>
							<Grid item xs={12} sm>
								<DisplayCountPaper
									title="Rejected Requests"
									count={counts.rejected}
									icon={
										<AssignmentLateIcon
											sx={{
												position: 'absolute',
												top: 0,
												right: -24,
												opacity: 0.12,
												width: 120,
												height: 120,
											}}
										/>
									}
									bgColor={rejectColor}
								/>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Box mt={7} mb={10}>
					<Typography variant="h6" component="h4">
						Request Turnout
					</Typography>
					<Paper elevation={8}>
						<Box mt={3} p={3}>
							<Chart
								options={chart.options}
								series={chart.series}
								type="bar"
								height={350}
							/>
						</Box>
					</Paper>
				</Box>
				<Box mt={7}>
					<Devs />
				</Box>
			</Box>
			<Footer />
		</div>
	);
};

export default Dashboard;