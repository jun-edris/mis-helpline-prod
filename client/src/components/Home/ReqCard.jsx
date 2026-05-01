import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ReqCard = ({ title, icon, content, url }) => {
	return (
		<Box
			sx={{
				bgcolor: '#ffffff',
				border: '1px solid #E2E8F0',
				borderRadius: '8px',
				boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
				p: 3,
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				transition: 'box-shadow 0.15s, border-color 0.15s',
				'&:hover': {
					boxShadow: '0 4px 12px rgba(0,182,122,0.12)',
					borderColor: '#00B67A',
				},
			}}
		>
			{/* Icon */}
			<Box
				sx={{
					width: 52,
					height: 52,
					bgcolor: '#EDFFF9',
					borderRadius: '12px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					mb: 2,
					color: '#00B67A',
					'& svg': { fontSize: 26 },
				}}
			>
				{icon}
			</Box>

			{/* Title */}
			<Typography
				sx={{
					fontFamily: "'Poppins', sans-serif",
					fontSize: 14,
					fontWeight: 600,
					color: '#1C1C1C',
					mb: 1,
				}}
			>
				{title}
			</Typography>

			{/* Content */}
			<Box sx={{ flex: 1, mb: 3 }}>
				{content.map((item, index) => (
					<Typography
						key={index}
						sx={{
							fontFamily: "'Inter', sans-serif",
							fontSize: 13,
							color: '#64748B',
							lineHeight: 1.6,
						}}
					>
						{item}
					</Typography>
				))}
			</Box>

			{/* CTA */}
			<Link to={url} style={{ textDecoration: 'none' }}>
				<Box
					sx={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '6px',
						color: '#00B67A',
						fontFamily: "'Poppins', sans-serif",
						fontSize: 13,
						fontWeight: 500,
						'&:hover': { gap: '10px' },
						transition: 'gap 0.15s',
					}}
				>
					Submit request
					<ArrowForwardIcon sx={{ fontSize: 16 }} />
				</Box>
			</Link>
		</Box>
	);
};

export default ReqCard;
