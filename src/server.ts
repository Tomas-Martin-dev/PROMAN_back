import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db";
import router from "./routes/projectRoutes"
import authRouter from "./routes/authRouter"
import cors from "cors";
import morgan from "morgan";
import cron from "node-cron";

dotenv.config()

connectDB()

const app = express()

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// Logging
app.use(morgan('dev'))

app.use(express.json())

// Routes
app.use("/api/auth", authRouter)
app.use("/api/projects", router)

// Route for CronJob
app.get('/ping', (req, res) => {
  res.send('Servidor activo ✅');
});

cron.schedule('*/59 * * * *', () => {
  console.log('⏰ Ejecutando tarea interna...');
});

export default app