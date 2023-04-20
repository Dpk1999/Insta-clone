import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.clear('')
        dispatch({ type: 'CLEAR' })
        navigate('/signin')
        M.toast({ html: 'Logged out successfully', classes: '#e53935 red darken-1' })
    }
    const renderList = () => {
        if (state) {
            return [
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/createPost">Create Post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light"
                        onClick={() => logOut()}>
                        Logout
                    </button>
                </li >
            ]
        }
        else {
            return [<li><Link to="/signin">Signin</Link></li>,
            <li><Link to="/signup">SignUp</Link></li>]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white" style={{ color: 'black' }}>
                <Link to={state ? '/' : 'signin'} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;