'use client';

import { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// These departments match the backend's default department and common departments
const departments = [
    'General',
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations'
];

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('All');
    const [currentPage, setCurrentPage] = useState('1');
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage('1'); // Reset to first page on search
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const queryParams = new URLSearchParams({
                    search: debouncedSearch,
                    page: currentPage,
                    limit: '10',
                    ...(department !== 'All' && { department })
                });

                const response = await fetch(`http://localhost:3001/api/employees?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch employees');
                }

                const data = await response.json();
                setEmployees(data.employees);
                setTotalEmployees(data.total);
                setTotalPages(data.pages);
            } catch (err) {
                setError('Failed to fetch employees');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [debouncedSearch, department, currentPage]);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Employees</h1>
                <div className="text-sm text-gray-600">
                    Total: {totalEmployees} employees
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Departments</SelectItem>
                        {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Employees List */}
            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No employees found</div>
            ) : (
                <div className="grid gap-4">
                    {employees.map((employee) => (
                        <Card key={employee._id} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {employee.firstName} {employee.lastName}
                                    </h3>
                                    <p className="text-gray-600">{employee.email}</p>
                                    <div className="mt-2 flex gap-2">
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
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => String(Math.max(1, parseInt(p) - 1)))}
                        disabled={currentPage === '1'}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage((p) => String(Math.min(totalPages, parseInt(p) + 1)))}
                        disabled={currentPage === String(totalPages)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
} 