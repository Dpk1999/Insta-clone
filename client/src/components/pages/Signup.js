
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css'

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const postData = () => {
        if (name.length < 3) {
            return M.toast({ html: 'Name should contain atleast 3 characters', classes: '#e53935 red darken-1' })
        }
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: 'Invalid email', classes: '#e53935 red darken-1' })
        }
        if (password.length < 6) {
            return M.toast({ html: 'Password is too short', classes: '#e53935 red darken-1' })
        }
        fetch("/signup", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: '#e53935 red darken-1' })
                }
                else {
                    M.toast({ html: data.message, classes: '#66bb6a green lighten-1' })
                    navigate('/signin');
                }

            })
    }

    return (
        <div className='mycard'>
            <div className="auth-card">
                <h2 className="brand-logo">Instagram</h2>
                <input
                    type='text'
                    placeholder="Please enter name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input
                    type='email'
                    placeholder="Please enter email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    type='password'
                    placeholder="Please enter password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br /><br />
                <button className="btn waves-effect waves-light"
                    onClick={() => postData()}
                >
                    Signup
                </button>
                <h6>
                    <Link to='/signin'>Already have an accout?</Link>
                </h6>
            </div>
        </div>
    )

}

export default Signup;