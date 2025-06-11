import { Router, Request, Response, RequestHandler } from "express";
import Employee from "../models/employee";
import { createJWTToken } from "../utils/lib";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();
router.post("/register", (async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        let employee = await Employee.findOne({ email });
        if (employee) return res.status(400).json({ message: "Employee already exists" });

        employee = new Employee({ firstName, lastName, email, password });
        await employee.save();

        const token = createJWTToken(employee._id);
        const employeeToReturn = { firstName, lastName, email }

        res.status(201).json({ employee: employeeToReturn, token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

router.post("/login", (async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await employee.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = createJWTToken(employee._id);
        const employeeToReturn = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email
        }

        res.json({ employee: employeeToReturn, token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

router.post('/validate-token', authMiddleware, (async (req: AuthRequest, res: Response) => {
    const employeeId = req.employeeId;

    if (!employeeId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const employee = await Employee.findOne({ _id:employeeId });
    if (!employee) {
        return res.status(400).json({ message: "Employee Not Found" });
    }

    const employeeToReturn = {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email
    }

    res.json({ employee:employeeToReturn });
}) as RequestHandler);


export default router;
