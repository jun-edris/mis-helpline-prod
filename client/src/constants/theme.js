import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#00B67A',
			dark: '#1F8463',
			light: '#79E4C1',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#F97316',
			contrastText: '#ffffff',
		},
		background: {
			default: '#F5F6FA',
			paper: '#ffffff',
		},
		text: {
			primary: '#1C1C1C',
			secondary: '#64748B',
		},
		success: {
			main: '#00B67A',
			contrastText: '#ffffff',
		},
		error: {
			main: '#FF3B30',
		},
		warning: {
			main: '#F5A623',
		},
		info: {
			main: '#4F46E5',
		},
		divider: '#E2E8F0',
	},
	typography: {
		fontFamily: "'Inter', 'Poppins', sans-serif",
		h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
		h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
		h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
		h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
		h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
		h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
		button: { fontFamily: "'Poppins', sans-serif", fontWeight: 500 },
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					textTransform: 'none',
					fontFamily: "'Poppins', sans-serif",
					fontWeight: 500,
					fontSize: 13,
					padding: '8px 16px',
				},
				containedPrimary: {
					backgroundColor: '#00B67A',
					'&:hover': { backgroundColor: '#1F8463' },
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: '#ffffff',
					color: '#1C1C1C',
					boxShadow: 'none',
					borderBottom: '1px solid #E2E8F0',
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					backgroundColor: '#F5F6FA',
					'& .MuiTableCell-head': {
						color: '#00B67A',
						fontWeight: 600,
						fontSize: 11,
						fontFamily: "'Inter', sans-serif",
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: '1px solid #E2E8F0',
					fontFamily: "'Inter', sans-serif",
					fontSize: 13,
					color: '#3A4452',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 999,
					fontSize: 11,
					fontWeight: 500,
					fontFamily: "'Inter', sans-serif",
					height: 22,
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						borderRadius: 8,
						fontFamily: "'Inter', sans-serif",
						'&:hover fieldset': { borderColor: '#00B67A' },
						'&.Mui-focused fieldset': { borderColor: '#00B67A' },
					},
					'& label.Mui-focused': { color: '#00B67A' },
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontFamily: "'Inter', sans-serif",
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: '#ffffff',
					borderRight: '1px solid #E2E8F0',
					boxShadow: 'none',
				},
			},
		},
	},
});

export default customTheme;
