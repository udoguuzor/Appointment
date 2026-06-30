import dotenv from 'dotenv'; // 1. Import dotenv first
dotenv.config();           // 2. Run config immediately so variables are available to all files below!

import express from "express";
import cors from "cors";
import router from './route/router.js';
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
    console.log("--- Env Verification ---");
    console.log("Database URL Target:", process.env.DATABASE_URL);
    console.log("Model API Key Loaded:", process.env.MONGODB_MODEL_API_KEY ? "Yes ✅" : "No ❌");
});