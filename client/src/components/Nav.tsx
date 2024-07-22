import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Nav;