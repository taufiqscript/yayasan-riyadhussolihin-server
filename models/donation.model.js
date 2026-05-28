const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
    donateId: { type: String, required: true, unique: true },
    name: { type: String, default: "Orang Baik" },
    phone: { type: String },
    email: { type: String },
    pesan: { type: String },
    grossAmount: { type: Number, required: true },
    paymentType: { type: String, default: 'pending' },
    transactionStatus: { type: String, default: 'pending' },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('Donation', donationSchema)