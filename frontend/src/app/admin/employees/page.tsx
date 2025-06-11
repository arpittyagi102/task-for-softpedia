'use client';

import { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';

const departments = [
    'General',
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
];

const roles = ['employee', 'admin'];

interface EmployeeFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    department: string;
}

const initialFormData: EmployeeFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'General'
};

const AdminEmployeesPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/employees', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();
            setEmployees(data.employees);
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create employee');
            }

            toast.success('Employee created successfully');
            setIsCreateDialogOpen(false);
            setFormData(initialFormData);
            fetchEmployees();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create employee');
        }
    };

    const handleUpdateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        console.log("Updating employee:", selectedEmployee._id);

        try {
            const response = await fetch(`http://localhost:3001/api/employees/${selectedEmployee._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update employee');
            }

            toast.success('Employee updated successfully');
            setIsEditDialogOpen(false);
            setSelectedEmployee(null);
            setFormData(initialFormData);
            fetchEmployees();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update employee');
        }
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/employees/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete employee');
            }

            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
        }
    };

    const openEditDialog = (employee: Employee) => {
        setSelectedEmployee(employee);
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: '', // Don't pre-fill password
            role: employee.role,
            department: employee.department
        });
        setIsEditDialogOpen(true);
    };

    return (
        <AdminRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold mb-6">Manage Employees</h1>
                <div className="flex justify-between items-center mb-8">
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Employee</DialogTitle>
                            </DialogHeader>
                            <EmployeeForm
                                onSubmit={handleCreateEmployee}
                                isEdit={false}
                                formData={formData}
                                setFormData={setFormData}
                                setIsCreateDialogOpen={setIsCreateDialogOpen}
                                setIsEditDialogOpen={setIsEditDialogOpen}
                                initialFormData={initialFormData}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No employees found</div>
                ) : (
                    <div className="grid gap-4">
                        {employees.map((employee) => (
                            <Card key={employee._id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
                                        <p className="text-gray-600">{employee.email}</p>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {employee.department}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-sm ${employee.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {employee.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => openEditDialog(employee)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDeleteEmployee(employee._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Employee</DialogTitle>
                        </DialogHeader>
                        <EmployeeForm
                            onSubmit={handleUpdateEmployee}
                            isEdit={true}
                            formData={formData}
                            setFormData={setFormData}
                            setIsCreateDialogOpen={setIsCreateDialogOpen}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            initialFormData={initialFormData}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </AdminRoute>
    );
};

const EmployeeForm = ({
    onSubmit,
    isEdit = false,
    formData,
    setFormData,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    initialFormData
}: {
    onSubmit: (e: React.FormEvent) => void,
    isEdit?: boolean,
    formData: any,
    setFormData: any,
    setIsCreateDialogOpen: any,
    setIsEditDialogOpen: any,
    initialFormData: any
}) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">{isEdit ? 'New Password (leave blank to keep current)' : 'Password'}</Label>
            <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!isEdit}
                minLength={6}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    setIsCreateDialogOpen(false);
                    setIsEditDialogOpen(false);
                    setFormData(initialFormData);
                }}
            >
                Cancel
            </Button>
            <Button type="submit">
                {isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
        </div>
    </form>
);

export default AdminEmployeesPage;