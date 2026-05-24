const route = require('express').Router()
const donateController = require('../controllers/donation.controller')

route.post('/create-transaction', donateController.createDonation)
route.post('/notification', donateController.handleNotification)

route.get('/donation/total', donateController.getTotalByPaymentType)
route.get('/donation/message', donateController.getMessage)

module.exports = route