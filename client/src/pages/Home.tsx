import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Landing from '../components/Landing';
import Nav from '../components/Nav';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            localStorage.setItem('userId', userId);
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/');
        } else {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        }
    }, [searchParams, navigate]);

    if (!isLoggedIn) {
        return <Landing />;
    }

    return (
        <div>
            <Nav />
            <h1>Home Page</h1>
            <p>Welcome back! Explore what's new!</p>
        </div>
    );
}

export default Home;