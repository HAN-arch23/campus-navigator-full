import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        const result = await signup(form.name, form.email, form.password);
        if (result.success) {
            navigate('/dashboard');
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
                    <h2>Create Account</h2>
                    <p>Join Campus Navigator</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label><FaUser /> Full Name</label>
                        <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" required disabled={loading} />
                    </div>
                    <div className="input-group">
                        <label><FaEnvelope /> Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required disabled={loading} />
                    </div>
                    <div className="input-group">
                        <label><FaLock /> Password</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required disabled={loading} />
                    </div>
                    <div className="input-group">
                        <label><FaLock /> Confirm Password</label>
                        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required disabled={loading} />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? <><div className="loading-spinner" />Creating account...</> : <>Create Account <FaArrowRight /></>}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
