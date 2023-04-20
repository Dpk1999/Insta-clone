import M from "materialize-css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [img, setImg] = useState('')

    const uploadImg = (url) => {
        fetch('/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                title,
                body,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: '#e53935 red darken-1' })
                }
                else {
                    M.toast({ html: "Post created successfully", classes: '#66bb6a green lighten-1' })
                    navigate('/');
                }
            })
    }

    const postDetails = () => {
        const data = new FormData();
        data.append('file', img)
        data.append('upload_preset', 'insta-clone')
        data.append('cloud-name', 'dpkg')
        fetch('https://api.cloudinary.com/v1_1/dpkg/image/upload', {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                uploadImg(data.url)
            }).catch(err => console.log(err))
    }
    return (
        <div className="card-input-filed" style={{
            margin: '10px auto',
            maxWidth: '500px',
            padding: '20px',
            textAlign: 'center'
        }}>
            <input
                type='text'
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
            <input
                type='text'
                placeholder="body"
                value={body}
                onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input type="file"
                        onChange={(e) => setImg(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light"
                onClick={() => postDetails()}>
                Submit
            </button>
        </div>
    )
}

export default CreatePost;