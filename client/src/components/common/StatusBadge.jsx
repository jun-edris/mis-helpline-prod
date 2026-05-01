import { Box, Typography } from '@mui/material';

const STATUS_MAP = {
	'In Evaluation': { bg: '#FFF6E8', color: '#F5A623' },
	Approved:        { bg: '#EDFFF9', color: '#00B67A' },
	Pending:         { bg: '#EEF2FF', color: '#4F46E5' },
	Completed:       { bg: '#EDFFF9', color: '#00B67A' },
	Rejected:        { bg: '#FFF1F0', color: '#FF3B30' },
	'In Progress':   { bg: '#FFF7ED', color: '#F97316' },
	New:             { bg: '#FFF6E8', color: '#F5A623' },
	Open:            { bg: '#EEF2FF', color: '#4F46E5' },
	Closed:          { bg: '#FFF1F0', color: '#FF3B30' },
	Resolved:        { bg: '#EDFFF9', color: '#00B67A' },
};

const StatusBadge = ({ label }) => {
	const style = STATUS_MAP[label] ?? { bg: '#F5F6FA', color: '#64748B' };
	return (
		<Box
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '5px',
				padding: '2px 9px',
				borderRadius: '999px',
				bgcolor: style.bg,
			}}
		>
			<Box
				sx={{
					width: 6,
					height: 6,
					borderRadius: '50%',
					bgcolor: style.color,
					flexShrink: 0,
				}}
			/>
			<Typography
				sx={{
					fontFamily: "'Inter', sans-serif",
					fontSize: 11,
					fontWeight: 500,
					color: style.color,
				}}
			>
				{label}
			</Typography>
		</Box>
	);
};

export default StatusBadge;
