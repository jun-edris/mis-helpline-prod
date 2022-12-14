-require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const path = require('path');
const superAdminRoute = require('./routes/superAdmin');

const app = express();
const port = process.env.PORT || 3001;

app.use(
	cors({
		optionsSuccessStatus: 200,
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', adminRoute);
app.use('/api', superAdminRoute);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

mongoose
	.connect(process.env.ATLAS_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useStrictQuery: true,
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`API listening on localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log(err.message);
	});
