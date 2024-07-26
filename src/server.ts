import dotenv from 'dotenv'
import startBot from './bot'
import { connectDB } from '@/config/db'
import cors from 'cors'
import express, { Express } from 'express'

dotenv.config()
const app: Express = express()
const port: number = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000
app.set('trust proxy', true)
//@ts-expect-error no check
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

connectDB()
app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
    startBot(app)
})
