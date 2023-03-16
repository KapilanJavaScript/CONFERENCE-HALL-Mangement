const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors')
const PORT = process.env.PORT || 5000;


connectDB()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Router
app.use('/users',require('./routes/userRoutes/userRouter'))
app.use('/admin/location',require('./routes/adminRoutes/manageLocation'))
app.use('/admin/users',require('./routes/adminRoutes/manageAdmin'))
app.use('/admin/conferencehall',require('./routes/adminRoutes/manageHall'))
app.use('/users/conferencehall',require('./routes/bookHallRouter'))
app.use('/users/conferencehall',require('./routes/userRoutes/scheduledHallRouter'))
app.use('/users/conferencehall',require('./routes/userRoutes/requestedHallRouter'))


app.use(errorHandler)



app.listen(PORT,()=> {console.log(`server start in PORT:${PORT}`);})