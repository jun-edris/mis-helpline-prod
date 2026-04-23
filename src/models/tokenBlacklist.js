const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
	jti: { type: String, required: true, unique: true, index: true },
	expiresAt: { type: Date, required: true },
});

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
