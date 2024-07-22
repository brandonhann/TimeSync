import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', data.userId);
            console.log('Registration successful', data);
            navigate("/")
        } else {
            console.error('Registration failed', data.message);
        }
    };

    return (
        <div>
            <h1>Signup Page</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>Or</p>
            <button onClick={() => window.location.href = 'http://localhost:3001/api/auth/github'}>
                Register with GitHub
            </button>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}

export default Signup;