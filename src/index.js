require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const superAdminRoute = require('./routes/superAdmin');

const requiredEnvVars = ['ATLAS_URL', 'JWT_SECRET_KEY', 'APP_ID', 'APP_KEY', 'APP_SECRET', 'APP_CLUSTER'];
for (const key of requiredEnvVars) {
	if (!process.env[key]) {
		console.error(`Missing required environment variable: ${key}`);
		process.exit(1);
	}
}

const app = express();
const port = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(',')
	: ['http://localhost:3000'];

app.use(helmet());
app.use(cors({
	origin: allowedOrigins,
	credentials: true,
	optionsSuccessStatus: 200,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: { message: 'Too many attempts, please try again later.' },
	standardHeaders: true,
	legacyHeaders: false,
});

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);

app.use('/api', userRoute);
app.use('/api', adminRoute);
app.use('/api', superAdminRoute);

if (isProd) {
	const distPath = path.join(__dirname, '../client/dist');
	app.use(express.static(distPath));
	app.get('*', (req, res) => {
		res.sendFile(path.join(distPath, 'index.html'));
	});
}

mongoose.set('strictQuery', true);

mongoose
	.connect(process.env.ATLAS_URL)
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(port, () => {
			console.log(`API listening on port ${port}`);
		});
	})
	.catch((err) => {
		console.error('Database connection failed:', err.message);
		process.exit(1);
	});