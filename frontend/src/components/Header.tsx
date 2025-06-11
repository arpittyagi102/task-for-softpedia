"use client"
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/slices/userSlice';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.user);

    const handleSignOut = () => {
        localStorage.removeItem('token')
        dispatch(clearUser());
        router.push('/auth/login');
    };

    return (
        <header className="bg-neutral-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold">Employee Management App</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <span className="text-gray-800">
                                    Hello {user.firstName} 👋
                                </span>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin/employees"
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Manage Employees
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 