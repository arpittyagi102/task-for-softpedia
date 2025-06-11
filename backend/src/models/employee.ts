import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IEmployee extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'employee' | 'admin';
    department?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const EmployeeSchema: Schema<IEmployee> = new Schema({
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true,trim: true, default: 'employee'},
    department: { type: String, required: false, trim: true, default: 'General'}
});

// Hash password before saving
EmployeeSchema.pre<IEmployee>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
EmployeeSchema.methods.comparePassword = function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
