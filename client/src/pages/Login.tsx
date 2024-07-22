import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Login successful', data);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', data.userId);
            navigate('/');
        } else {
            const errorData = await response.json();
            console.error('Login failed', errorData.message);
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <p>Or</p>
            <button onClick={() => window.location.href = 'http://localhost:3001/api/auth/github'}>Login with GitHub</button>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}

export default Login;