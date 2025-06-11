import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import employeeRoutes from "./routes/employee.routes";
import connectDB from "./utils/mongoose";
import { checkENV } from "./utils/lib";
import { FRONTEND_URL } from "./utils/constants";

dotenv.config({ path: '.env.local' });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true, 
}));

checkENV();
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the backend server!");
});

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes)

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
