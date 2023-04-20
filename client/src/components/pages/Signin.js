import M from "materialize-css";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../../App'

const Signin = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const postData = () => {
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then((data) => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: '#e53935 red darken-1' })
                }
                else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: 'USER', payload: data.user })
                    M.toast({ html: "Signin successfull", classes: '#66bb6a green lighten-1' })
                    navigate('/');
                }
            })
    }
    return (
        <div className='mycard'>
            <div className="auth-card">
                <h2 className="brand-logo">Instagram</h2>
                <input
                    type='email'
                    placeholder="Please enter email *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder="Please enter password *"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <br /><br />
                <button className="btn waves-effect waves-light"
                    onClick={() => postData()}>
                    Signin
                </button>
                <h6>
                    <Link to='/signup'>Make a new account</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin;