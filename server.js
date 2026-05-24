require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const donateRoute = require('./routes/donation.route')

const { MONGO_URL } = process.env

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(MONGO_URL).catch(err => {
    if (err) {
        console.log('Tidak dapat terkoneksi ke database!')
        throw err
    } else {
        console.log('Connecting database...')
    }
})

app.use('/api', donateRoute)

app.listen(5000, () => {
    console.log('Backend running on port ' + 5000)
})