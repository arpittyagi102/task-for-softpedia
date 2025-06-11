'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            // If not authenticated, redirect to login
            router.push('/auth/login');
        } else if (user?.role !== 'admin') {
            // If authenticated but not admin, redirect to home
            router.push('/');
        }
    }, [isAuthenticated, user, router]);

    // Show nothing while checking authentication/role
    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    // If authenticated and admin, render the children
    return <>{children}</>;
};

export default AdminRoute; 