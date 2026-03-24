import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await forgotPassword(forgotEmail);
        if (result.success) {
            setForgotMsg(`Reset token: ${result.resetToken || 'Check your email'}`);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            <div className="login-box glass animate-fadeIn">
                <div className="login-header">
                    <div className="login-icon"><FaGraduationCap /></div>
                    <h2>{forgotMode ? 'Reset Password' : 'Welcome Back'}</h2>
                    <p>{forgotMode ? 'Enter your email to reset' : 'Sign in to Campus Navigator'}</p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {forgotMsg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{forgotMsg}</div>}

                {!forgotMode ? (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label><FaEnvelope /> Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required disabled={loading} />
                        </div>
                        <div className="input-group">
                            <label><FaLock /> Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required disabled={loading} />
                        </div>
                        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                            <button type="button" onClick={() => { setForgotMode(true); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-400)', cursor: 'pointer', fontSize: '13px' }}>
                                Forgot password?
                            </button>
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? <><div className="loading-spinner" />Signing in...</> : <>Sign In <FaArrowRight /></>}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword} className="login-form">
                        <div className="input-group">
                            <label><FaEnvelope /> Email</label>
                            <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="your@email.com" required disabled={loading} />
                        </div>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? <><div className="loading-spinner" />Sending...</> : <>Send Reset Link <FaArrowRight /></>}
                        </button>
                        <button type="button" onClick={() => { setForgotMode(false); setError(''); setForgotMsg(''); }} style={{ width: '100%', marginTop: '8px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                            Back to Login
                        </button>
                    </form>
                )}

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}
