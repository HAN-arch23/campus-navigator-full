import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import './LoginPage.css';

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setSuccess(true);
            setResetToken(result.resetToken); // For development only
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className='login-container'>
                <div className='login-background'>
                    <div className='orb orb-1'></div>
                    <div className='orb orb-2'></div>
                </div>

                <div className='login-box glass animate-fadeIn'>
                    <div className='login-header'>
                        <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>
                            <FaCheckCircle />
                        </div>
                        <h2>Check Your Email</h2>
                        <p>We've sent password reset instructions to {email}</p>
                    </div>

                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                            <strong>Development Mode:</strong> In production, you would receive an email.
                            For now, use this link:
                        </p>
                        <Link
                            to={`/reset-password/${resetToken}`}
                            style={{
                                color: '#10b981',
                                wordBreak: 'break-all',
                                display: 'block',
                                marginTop: '0.5rem'
                            }}
                        >
                            Reset Password Link
                        </Link>
                    </div>

                    <div className='login-footer'>
                        <p>
                            <Link to='/login'>Back to Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='login-container'>
            <div className='login-background'>
                <div className='orb orb-1'></div>
                <div className='orb orb-2'></div>
            </div>

            <div className='login-box glass animate-fadeIn'>
                <div className='login-header'>
                    <h2>Forgot Password?</h2>
                    <p>Enter your email to reset your password</p>
                </div>

                {error && (
                    <div className='error-message'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='form-group'>
                        <label htmlFor='email'>
                            <FaEnvelope /> Email Address
                        </label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='your.email@kabarak.ac.ke'
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type='submit'
                        className='login-button'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className='loading-spinner'></div>
                                Sending...
                            </>
                        ) : (
                            <>
                                Send Reset Link <FaArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <div className='login-footer'>
                    <p>
                        Remember your password? <Link to='/login'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
