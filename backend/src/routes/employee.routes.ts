import { Router, Request, Response, RequestHandler } from "express";
import Employee from "../models/employee";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:employeeId", authMiddleware, (async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ _id: employeeId }, { password: 0 });

        res.json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

// Get all employees
router.get("/", authMiddleware, (async (req: Request, res: Response) => {
    try {
        const { search = "", department, page = "1", limit = "10" } = req.query;

        const query: any = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } }
            ];
        }

        if (department) {
            query.department = department;
        }

        // Pagination
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        const total = await Employee.countDocuments(query);

        const employees = await Employee.find(query, { password: 0 })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.json({
            employees,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

router.delete("/:employeeId", authMiddleware, (async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { employeeId } = req.params;

        if (employeeId === req.employeeId) {
            return res
                .status(400)
                .json({ message: "Cannot delete your own account" });
        }

        const employee = await Employee.findByIdAndDelete(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

// Update employee details
router.put("/:employeeId", authMiddleware, (async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { employeeId } = req.params;
        const { firstName, lastName, email, password, role } = req.body;

        // Prevent updating yourself
        if (employeeId === req.employeeId) {
            return res
                .status(400)
                .json({ message: "Cannot update your own account" });
        }

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            updateData.email = email;
        }
        if (password) {
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ message: "Password must be at least 6 characters long" });
            }
            updateData.password = password;
        }
        if (role) updateData.role = role;

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updateData },
            { new: true, select: "-password" }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ employee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Server error" });
    }
}) as RequestHandler);

export default router;
