import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'

const app=express()


app.use(cors());
app.use(express.json())

app.use('/api/auth',authRoutes)

app.use('/portfolio',portfolioRoutes)

app.listen(4000,()=>{
    console.log("server is running on 4000")
})