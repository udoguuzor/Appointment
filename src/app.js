import express from "express";
import cors from "cors"
import dotenv from 'dotenv'
import router from './route/router.js'
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});