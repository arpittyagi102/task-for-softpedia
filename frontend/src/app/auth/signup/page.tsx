"use client";

import React, { useState, FormEvent } from 'react';
import { showToast } from '@/utils/toast';
import { Berkshire_Swash } from "next/font/google";
import { useRouter } from 'next/navigation';
import { signUp } from '@/services/auth';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';

const berkshire_swash = Berkshire_Swash({ subsets: ["latin"], weight: ["400"] });

export default function SignUp(): React.JSX.Element {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState<'employee'|'admin'>('employee'); 
    const [inProgress, setInProgress] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    function validateSignUp(): boolean {
        if (!firstName.trim()) {
            showToast('First Name is required', 'error');
            setErrors(prev => ({ ...prev, firstName: 'First Name is required' }));
            return false;
        }

        if (!lastName.trim()) {
            showToast('Last Name is required', 'error');
            setErrors(prev => ({ ...prev, lastName: 'Last Name is required' }));
            return false;
        }

        if (!email.trim()) {
            showToast('Email is required', 'error');
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showToast('Please enter a valid email address', 'error');
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            return false;
        }

        if (!password) {
            showToast('Password is required', 'error');
            setErrors(prev => ({ ...prev, password: 'Password is required' }));
            return false;
        } else if (password.length < 8) {
            showToast('Password should be at least 8 characters', 'error');
            setErrors(prev => ({ ...prev, password: 'Password should be at least 8 characters' }));
            return false;
        }

        setErrors({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });

        return true;
    }

    async function handleSignUp(e: FormEvent) {
        e.preventDefault();
        setInProgress(true);

        if (!validateSignUp()) {
            setInProgress(false);
            return;
        }

        const response = await signUp({ firstName, lastName, email, password, role, department });

        if (!response.success || !response.employee) {
            showToast(response.message || 'Something went wrong', 'error');
        } else {
            showToast('Sign up successful! Redirecting...', 'success');
            localStorage.setItem('token', response.token);
            dispatch(setUser(response.employee))
            router.push('/');
        }

        setInProgress(false);
    }

    return (
        <div className="min-h-screen flex items-stretch text-white">
            {/* Background Image Section */}
            <div className="lg:flex grow hidden bg-gray-500 bg-no-repeat bg-cover relative items-center backdrop-blur" style={{ backgroundImage: `url(/signup-bg.jpg)` }}>
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Manage Easily</h1>
                    <p className="text-3xl my-4">Find all your Employees data at one place</p>
                </div>
            </div>

            {/* Signup Form Section */}
            <div className="w-full lg:max-w-[600px] flex items-center justify-center text-center px-auto lg:px-36 z-0 bg-white text-black">
                <div className="py-6 z-20 w-[400px]">
                    <h1 className={`logo my-6 text-3xl ${berkshire_swash.className}`}>
                        Employee Management App
                    </h1>

                    {/* Signup Form */}
                    <form className="w-full px-4 lg:px-0" onSubmit={handleSignUp}>
                        <div className='fnln-outer flex justify-between'>
                            <div className="fName w-[45%]">
                                <label className="float-start text-sm">First Name</label>
                                <input
                                    name="first-name"
                                    className={`bg-neutral-300 focus:outline-none p-2 w-full rounded-xl ${errors.firstName ? 'border-2 border-red-500' : ''}`}
                                    placeholder='Arpit'
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value)
                                        e.target.style.border = "none"
                                    }}
                                />
                            </div>
                            <div className="lName w-[45%]">
                                <label className="float-start text-sm">Last Name</label>
                                <input
                                    name="last-name"
                                    className={`bg-neutral-300 focus:outline-none p-2 w-full rounded-xl ${errors.lastName ? 'border-2 border-red-500' : ''}`}
                                    placeholder='Tyagi'
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value)
                                        e.target.style.border = "none"
                                    }}
                                />
                            </div>
                        </div>

                        <div className="pb-1 pt-4">
                            <label className="float-start text-sm">Email</label>
                            <input
                                className={`block w-full p-2 text-md rounded-xl bg-neutral-300 focus:outline-none ${errors.email ? 'border-2 border-red-500' : ''}`}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="arpittyagi102@gmail.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    e.target.style.border = "none"
                                }}
                            />
                        </div>

                        <div className="pb-1 pt-4">
                            <label className="float-start text-sm">Password</label>
                            <input
                                className={`block w-full p-2 text-md rounded-xl bg-neutral-300 focus:outline-none ${errors.password ? 'border-2 border-red-500' : ''}`}
                                type="password"
                                name="password"
                                id="password"
                                placeholder="*************"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    e.target.style.border = "none"
                                }}
                            />
                        </div>

                        {/* Department Selection */}
                        <div className="pb-1 pt-4">
                            <label className="float-start text-sm">Department</label>
                            <select
                                className="block w-full p-2 text-md rounded-xl bg-neutral-300 focus:outline-none"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                            >
                                <option value="General">Select Department</option>
                                <option value="HR">HR</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Finance">Finance</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>

                        {/* Role Selection */}
                        <div className="pb-1 pt-4">
                            <label className="float-start text-sm">Role</label>
                            <input type="radio" name="role" id="employee" value="employee" checked={role === 'employee'} onChange={() => setRole("employee")} />
                            <label htmlFor="employee" className="ml-2">Employee</label>
                            <input type="radio" name="role" id="admin" value="admin" checked={role === 'admin'} onChange={() => setRole("admin")} className="ml-4" />
                            <label htmlFor="admin" className="ml-2">Admin</label>
                        </div>

                        {/* SIGN UP BUTTON */}
                        <div className="px-4 pb-2 pt-4 text-white flex justify-center">
                            <button
                                type='submit'
                                className="w-full p-3 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 flex justify-center cursor-pointer focus:outline-none"
                                disabled={inProgress}
                            >
                                {inProgress ? (
                                    <span className='block w-min'>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                                            </g>
                                        </svg>
                                    </span>
                                ) : (
                                    <span>SIGN UP</span>
                                )}
                            </button>
                        </div>

                        {/* Already have an account? Login */}
                        <div className="pt-2 flex justify-center">
                            <Link
                                className="text-indigo-600 hover:underline text-sm cursor-pointer"
                                href="/auth/login"
                            >
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
