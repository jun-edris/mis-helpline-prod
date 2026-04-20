require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const superAdminRoute = require('./routes/superAdmin');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet());
app.use(
	cors({
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
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

app.use('/api/login', authLimiter);
app.use('/api/signup', authLimiter);

app.use('/api', userRoute);
app.use('/api', adminRoute);
app.use('/api', superAdminRoute);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build/index.html'));
	});
}

mongoose.set('strictQuery', true);

mongoose
	.connect(process.env.ATLAS_URL)
	.then(() => {
		app.listen(port, () => {
			console.log(`API listening on localhost:${port}`);
		});
	})
	.catch((err) => {
		console.error(err.message);
	});
