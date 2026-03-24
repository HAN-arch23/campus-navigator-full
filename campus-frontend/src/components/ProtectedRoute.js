import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'var(--gray-50)'
            }}>
                <div className='loading-spinner-large'></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    if (adminOnly && !isAdmin) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'var(--gray-50)',
                padding: '2rem'
            }}>
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <button className='btn btn-primary' onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
