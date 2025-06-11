"use client"
import React from 'react';
import Header from '@/components/Header';
import { useInitializeAuth } from '@/store/hooks';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export default function Home() {
    useInitializeAuth();

    return (
        <main className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col items-center justify-center p-40">
                <UserStatus />
            </div>
        </main>
    );
}

function UserStatus() {
    const { isAuthenticated } = useAppSelector((state) => state.user);

    if(!isAuthenticated) {
        return (<h1 className='text-3xl px-8 py-3 rounded-xl bg-neutral-400'>Please <Link href="/auth/login" className="text-blue-500">Login</Link> or <Link href="/auth/signup" className="text-blue-500">Sign Up</Link> to get started</h1>);
    }

    return (
        <div>
            <h1 className='text-3xl px-8 py-3 rounded-xl bg-neutral-400'>Lets go to <Link href="/employees" className="text-blue-500">Employees Page</Link></h1>
        </div>
    );
}