import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import folderRoutes from './routes/folder.routes.js'
import imageRoutes from "./routes/image.routes.js";
import statsRoutes from './routes/stats.routes.js'


const app = express();



// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use(
  "/api/images",
  imageRoutes
);
app.use(
  "/api/stats",
  statsRoutes
);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running...",
  });
});



export default app;