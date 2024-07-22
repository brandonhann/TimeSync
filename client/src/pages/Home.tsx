import { useState, useEffect } from 'react';
import Landing from '../components/Landing';
import Nav from '../components/Nav';

function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

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