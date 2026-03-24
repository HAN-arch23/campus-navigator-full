import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import './LoginPage.css';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const { resetPassword } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await resetPassword(token, password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/study-spaces');
            }, 2000);
        } else {
            setError(result.message);
            setLoading(false);
        }
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
                        <h2>Password Reset Successful!</h2>
                        <p>Redirecting you to the app...</p>
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
                    <h2>Reset Password</h2>
                    <p>Enter your new password</p>
                </div>

                {error && (
                    <div className='error-message'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='form-group'>
                        <label htmlFor='password'>
                            <FaLock /> New Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter new password'
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='confirmPassword'>
                            <FaCheckCircle /> Confirm Password
                        </label>
                        <input
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Re-enter new password'
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
                                Resetting...
                            </>
                        ) : (
                            <>
                                Reset Password <FaArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <div className='login-footer'>
                    <p>
                        <Link to='/login'>Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
