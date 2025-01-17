import express from 'express'
import dotev from "dotenv"
import { connectDB } from './DB/connection.js'

dotev.config()
const app = express()
const port = process.env.PORT
//parse 
app.use(express.json())
// db connection
await connectDB()
// CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader("Access-Control-Allow-Headers","*")
    res.setHeader("Access-Control-Allow-Methods","*")
    res.setHeader("Access-Control-Private-Network",true)
    return next()
})
// routers

// page not found hanle
app.all('*',(req,res,next)=>{
    return next( new Error("page not Found",{cause:404}))
})

// global error handler
app.use((error,req,res,next)=>{
    const statusCode = error.cause || 500
    return res.status(statusCode).json({
        sucess : false ,
        message : error.message,
        stack: error.stack

    })
})

app.listen(port, () => console.log(` App listening on port ${port}!`))