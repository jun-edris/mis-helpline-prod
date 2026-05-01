import React from 'react';
import Header from '../../components/Header';
import { Box, Container, Grid, Typography } from '@mui/material';
import ReqCard from '../../components/Home/ReqCard';
import reqCardData from '../../constants/reqCardContent/reqCard-data';
import { Link } from 'react-router-dom';
import CustomButton from '../../components/common/CustomButton';
import Footer from '../../components/Footer';

const Home = () => {
	return (
		<Box sx={{ minHeight: '100vh', bgcolor: '#F5F6FA', display: 'flex', flexDirection: 'column' }}>
			<Header />

			{/* Hero */}
			<Box
				sx={{
					bgcolor: '#ffffff',
					borderBottom: '1px solid #E2E8F0',
					py: 8,
					px: 3,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<Box
					sx={{
						width: 64,
						height: 64,
						bgcolor: '#00B67A',
						borderRadius: '16px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mb: 3,
					}}
				>
					<svg width="34" height="34" viewBox="0 0 18 18" fill="none">
						<rect x="2" y="2" width="6" height="6" rx="1.2" fill="white" />
						<rect x="10" y="2" width="6" height="6" rx="1.2" fill="white" />
						<rect x="2" y="10" width="6" height="6" rx="1.2" fill="white" />
						<rect x="10" y="10" width="6" height="6" rx="1.2" fill="rgba(255,255,255,0.5)" />
					</svg>
				</Box>
				<Typography
					sx={{
						fontFamily: "'Poppins', sans-serif",
						fontSize: { xs: 28, md: 40 },
						fontWeight: 700,
						color: '#081021',
						mb: 1,
					}}
				>
					How may I help you?
				</Typography>
				<Typography
					sx={{
						fontFamily: "'Inter', sans-serif",
						fontSize: 16,
						color: '#64748B',
						mb: 4,
						maxWidth: 480,
					}}
				>
					Submit and track your IT support requests with the MIS Helpdesk system.
				</Typography>
				<Link to="/request" style={{ textDecoration: 'none' }}>
					<CustomButton variant="contained" size="large">
						View My Requests
					</CustomButton>
				</Link>
			</Box>

			{/* Request type cards */}
			<Box sx={{ py: 6, flex: 1 }}>
				<Container maxWidth="lg">
					<Typography
						sx={{
							fontFamily: "'Poppins', sans-serif",
							fontSize: 14,
							fontWeight: 500,
							color: '#64748B',
							textAlign: 'center',
							mb: 3,
						}}
					>
						Choose a request type to get started
					</Typography>
					<Grid container spacing={2} alignItems="stretch">
						{reqCardData.map((reqData, index) => (
							<Grid key={index} item xs={12} sm={6} md={4} lg>
								<ReqCard
									title={reqData?.title}
									icon={reqData?.icon}
									content={reqData?.content}
									url={reqData?.url}
								/>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<Footer />
		</Box>
	);
};

export default Home;
