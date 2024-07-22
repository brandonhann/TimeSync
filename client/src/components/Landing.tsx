import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div>
            <h1>Welcome to the App!</h1>
            <p>Join us today and explore more.</p>
            <Link to="/register" className="App-link">Register</Link>
            <Link to="/login" className="App-link">Login</Link>
        </div>
    );
}

export default Landing;