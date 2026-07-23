import express from 'express'
import cookieParser from 'cookie-parser';
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import empRoutes from './routes/empRoutes.js'
import assetRoutes from './routes/assetRoutes.js'
import CategoryRoutes from './routes/CategoryRoutes.js'
import { errorHandler } from './middlewares/errorMiddleware.js'
import dotenv from 'dotenv'
dotenv.config();

const app = express();

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
connectDB();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employee", empRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/categories', CategoryRoutes);

app.use(errorHandler);
app.listen(PORT, () => console.log(`Server is Running on ${PORT}`));

export default app;
