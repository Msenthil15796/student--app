const express = require('express')
const mongoose = require('mongoose')
const dotenv =require('dotenv')
const adminRoutes =require('./routes/adminRoute')
const studentRoutes = require('./routes/studentRoute')
const staffRoutes = require("./routes/staffRoute");
const app = express()
app.use(express.json())
dotenv.config()

mongoose.connect(process.env.MONGO_URL, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("DB connected...")
    }
})

app.use('/admin',adminRoutes)
app.use('/student',studentRoutes)
app.use('/staff',staffRoutes)

app.listen(process.env.PORT, () => {
    console.log('Server running at PORT:8000')
})