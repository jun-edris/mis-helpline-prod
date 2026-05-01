import { Box, Grid, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import StorageIcon from '@mui/icons-material/Storage';
import LaptopIcon from '@mui/icons-material/Laptop';
import MemoryIcon from '@mui/icons-material/Memory';
import WifiIcon from '@mui/icons-material/Wifi';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Chart from 'react-apexcharts';
import { useContext, useEffect, useState } from 'react';
import { FetchContext } from '../../context/FetchContext';
import DisplayCountPaper from '../../components/common/DisplayCountPaper';

const Dashboard = () => {
	const fetchContext = useContext(FetchContext);
	const [reqCount, setReqCount] = useState(0);
	const [approveReqCount, setApproveReqCount] = useState(0);
	const [completeReqCount, setCompleteReqCount] = useState(0);
	const [rejectedReqCount, setRejectedReqCount] = useState(0);
	const [pendingReqCount, setPendingReqCount] = useState(0);
	const [dataCount, setDataCount] = useState(0);
	const [softwareCount, setSoftwareCount] = useState(0);
	const [hardwareCount, setHardwareCount] = useState(0);
	const [networkCount, setNetworkCount] = useState(0);
	const [otherCount, setOtherCount] = useState(0);

	const chart = {
		series: [{ name: 'Requests', data: [dataCount, softwareCount, hardwareCount, networkCount, otherCount] }],
		options: {
			chart: { type: 'bar', toolbar: { show: false }, fontFamily: "'Inter', sans-serif" },
			colors: ['#00B67A'],
			plotOptions: {
				bar: { borderRadius: 4, columnWidth: '40%' },
			},
			dataLabels: { enabled: false },
			grid: { borderColor: '#E2E8F0', strokeDashArray: 4 },
			xaxis: {
				categories: ['Data', 'Software', 'Hardware', 'Network', 'Other'],
				axisBorder: { show: false },
				axisTicks: { show: false },
				labels: { style: { colors: '#64748B', fontSize: '12px' } },
			},
			yaxis: { labels: { style: { colors: '#64748B', fontSize: '12px' } } },
			tooltip: { theme: 'light' },
		},
	};

	const fetchCount = (url, setter) =>
		fetchContext.authAxios.get(url).then(({ data }) => setter(data.requests)).catch(() => {});

	useEffect(() => {
		fetchCount('/requests/count', setReqCount);
		fetchCount('/requests/count/approve', setApproveReqCount);
		fetchCount('/requests/count/complete', setCompleteReqCount);
		fetchCount('/requests/count/rejected', setRejectedReqCount);
		fetchCount('/requests/count/pending', setPendingReqCount);
		fetchCount('/requests/count/data', setDataCount);
		fetchCount('/requests/count/software', setSoftwareCount);
		fetchCount('/requests/count/hardware', setHardwareCount);
		fetchCount('/requests/count/network', setNetworkCount);
		fetchCount('/requests/count/other', setOtherCount);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchContext.refreshKey]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
					Admin Dashboard
				</Typography>
				<Typography
					sx={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 14,
						color: '#64748B',
						mt: 0.5,
					}}
				>
					Monitor your support ticket system with real-time data
				</Typography>
			</Box>

			{/* Summary stat cards */}
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6} md={3}>
					<DisplayCountPaper
						title="All Requests"
						count={reqCount}
						accent="#00B67A"
						icon={<AssignmentIcon />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<DisplayCountPaper
						title="Approved"
						count={approveReqCount}
						accent="#4F46E5"
						icon={<FactCheckIcon />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<DisplayCountPaper
						title="Completed"
						count={completeReqCount}
						accent="#1F8463"
						icon={<AssignmentTurnedInIcon />}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<DisplayCountPaper
						title="Rejected"
						count={rejectedReqCount}
						accent="#FF3B30"
						icon={<AssignmentLateIcon />}
					/>
				</Grid>
			</Grid>

			{/* Pending highlight + type breakdown */}
			<Grid container spacing={2} alignItems="stretch">
				<Grid item xs={12} md={4}>
					<Box
						sx={{
							bgcolor: '#00B67A',
							borderRadius: '8px',
							p: 3,
							height: '100%',
							position: 'relative',
							overflow: 'hidden',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-end',
							minHeight: 160,
						}}
					>
						<PendingActionsIcon
							sx={{
								position: 'absolute',
								top: -10,
								right: -10,
								opacity: 0.12,
								width: 140,
								height: 140,
								color: 'white',
							}}
						/>
						<Typography
							sx={{
								fontFamily: "'Exo 2', sans-serif",
								fontSize: 52,
								fontWeight: 400,
								color: '#ffffff',
								lineHeight: 1,
							}}
						>
							{pendingReqCount}
						</Typography>
						<Typography
							sx={{
								fontFamily: "'Poppins', sans-serif",
								fontSize: 14,
								fontWeight: 500,
								color: 'rgba(255,255,255,0.85)',
								mt: 0.5,
							}}
						>
							Pending Requests
						</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} md={8}>
					<Grid container spacing={2}>
						{[
							{ title: 'Data Requests', count: dataCount, accent: '#F97316', icon: <StorageIcon /> },
							{ title: 'Software Requests', count: softwareCount, accent: '#4F46E5', icon: <LaptopIcon /> },
							{ title: 'Hardware Requests', count: hardwareCount, accent: '#F5A623', icon: <MemoryIcon /> },
							{ title: 'Network Requests', count: networkCount, accent: '#00B67A', icon: <WifiIcon /> },
							{ title: 'Other Requests', count: otherCount, accent: '#64748B', icon: <HelpOutlineIcon /> },
						].map((item) => (
							<Grid item xs={12} sm={6} key={item.title}>
								<DisplayCountPaper
									title={item.title}
									count={item.count}
									accent={item.accent}
									icon={item.icon}
								/>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>

			{/* Chart */}
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
						fontSize: 14,
						fontWeight: 600,
						color: '#1C1C1C',
						mb: 0.25,
					}}
				>
					Request Volume by Type
				</Typography>
				<Typography
					sx={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 12,
						color: '#64748B',
						mb: 2,
					}}
				>
					Total submitted requests per category
				</Typography>
				<Chart
					options={chart.options}
					series={chart.series}
					type="bar"
					height={240}
				/>
			</Box>
		</Box>
	);
};

export default Dashboard;
