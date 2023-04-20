import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
    const [mypics, setMyPics] = useState([]);
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    console.log('useriddd', userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log('result', result)
            })
    }, []);
    return (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: "18px 0px",
                borderBottom: '1px solid grey'
            }}>
                <div>
                    <img style={{ width: '160px', height: '160px', borderRadius: '80px' }}
                        src="https://images.unsplash.com/photo-1656348281437-ebd2b19aab4f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                        alt="profileImg" />
                </div>
                <div>
                    {state ? state.name : ''}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>
            <div className='gallary'>
                {mypics.map(item => {
                    return (
                        <img key={item._id} className='item' src={item.photo} alt={item.title} />
                    )
                })}
            </div>
        </div>
    )
}

export default Profile;