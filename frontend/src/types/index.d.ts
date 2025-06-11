interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "employee";
  department?: string;
}

interface UserCredentials extends User {
  password: string;
}

interface Employee extends User {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EmployeesResponse {
  employees: Employee[];
  total: number;
  page: number;
  pages: number;
}

export type { User, UserCredentials, Employee, EmployeesResponse };
