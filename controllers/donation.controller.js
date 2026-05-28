require('dotenv').config()
const midtransClient = require('midtrans-client')
const Donation = require('../models/donation.model')
const { OK, ERR } = require('../response')

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
})

const createDonation = async (req, res) => {
    try {
        console.log(req.body)
        const { donate_id, gross_amount, name, phone, email, pesan } = req.body

        let parameter = {
            transaction_details: {
                order_id: donate_id,
                gross_amount: gross_amount
            },
            customer_details: {
                first_name: name,
                email: email,
                phone: phone,
            }
        }

        await Donation.create({
            donateId: donate_id,
            name: name,
            phone: phone,
            email: email,
            pesan,
            grossAmount: gross_amount,
            transactionStatus: 'pending',
            paymentType: 'pending'
        })

        const transaction = await snap.createTransaction(parameter)

        return OK(res, 201, {
            token: transaction.token,
            name: name,
            grossAmount: gross_amount,
            redirect_url: transaction.redirect_url,
        }, "Transaction Success..")
    } catch (error) {
        return ERR(res, 500, error.message)
    }
}

const handleNotification = async (req, res) => {
    try {
        const notification = req.body
        const { order_id, transaction_status, payment_type, transaction_id } = notification

        await Donation.findOneAndUpdate(
            { donateId: order_id },
            {
                transactionStatus: transaction_status,
                paymentType: payment_type,
                transactionId: transaction_id
            }, { new: true }
        )

        return OK(res, 200, null, "OK")
    } catch (error) {
        console.error('Error handle notofication!', error)
        return ERR(res, 500, error.message)
    }
}

const getTotalByPaymentType = async (req, res) => {
    try {
        const result = await Donation.aggregate([
            {
                $match: {
                    transactionStatus: { $in: ["settlement", "capture"] }
                }
            },
            {
                $group: {
                    _id: "$paymentType",
                    totalAmount: { $sum: "$grossAmount" },
                    totalTransaksi: { $sum: 1 }
                }
            }
        ])

        return OK(res, 200, result, "Success get summary by payment type")
    } catch (error) {
        return ERR(res, 500, error.message)
    }
}

const getMessage = async (req, res) => {
    try {
        const msg = await Donation.find({
            transactionStatus: { $in: ["settlement", "capture"] }
        }).sort({ createdAt: -1 })

        return OK(res, 200, msg, "Getting message success")
    } catch (error) {
        console.log(error.message)
        return ERR(res, 500, error.message)
    }
}

module.exports = {
    createDonation,
    handleNotification,
    getTotalByPaymentType,
    getMessage
}