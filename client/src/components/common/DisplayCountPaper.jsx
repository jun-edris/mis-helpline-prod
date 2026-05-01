import { Box, Typography } from '@mui/material';

const DisplayCountPaper = ({ count, title, icon, accent }) => {
	return (
		<Box
			sx={{
				bgcolor: '#ffffff',
				border: '1px solid #E2E8F0',
				borderRadius: '8px',
				boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
				padding: '18px 20px',
				display: 'flex',
				flexDirection: 'column',
				gap: '8px',
				position: 'relative',
				overflow: 'hidden',
				height: '100%',
			}}
		>
			{accent && (
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '3px',
						height: '100%',
						bgcolor: accent,
						borderRadius: '8px 0 0 8px',
					}}
				/>
			)}
			<Typography
				sx={{
					fontFamily: "'Inter', sans-serif",
					fontSize: 12,
					color: '#64748B',
					fontWeight: 500,
					pl: accent ? '8px' : 0,
				}}
			>
				{title}
			</Typography>
			<Typography
				sx={{
					fontFamily: "'Exo 2', sans-serif",
					fontSize: 34,
					fontWeight: 400,
					color: '#1C1C1C',
					lineHeight: 1,
					pl: accent ? '8px' : 0,
				}}
			>
				{count ?? 0}
			</Typography>
			{icon && (
				<Box
					sx={{
						position: 'absolute',
						bottom: -8,
						right: -8,
						opacity: 0.06,
						color: '#081021',
						'& svg': { width: 80, height: 80 },
					}}
				>
					{icon}
				</Box>
			)}
		</Box>
	);
};

export default DisplayCountPaper;
