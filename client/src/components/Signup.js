import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export default function Signup() {
    const [details, setDetails] = useState({ name: '', email: '', password: '', cpassword: '' })
    const [image, setImage] = useState(null)
    const [errors,setErrors] = useState({lengthErr:'',matchErr:''})
    const Navigate = useNavigate()
  

    const validation = ()=>{
        let validate = true
        if(details.password.length<5){
            validate = false
            setErrors({lengthErr:'Length of password must be 5 or more!'})
            return validate
        }
        else if(details.password !== details.cpassword){
            validate = false
            setErrors({matchErr:'Please enter correct password!'})
            return validate
        }
        else{
            return validate
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()
        const verify = validation()
        if(verify){
            const fd = new FormData()
            fd.append('name', details.name)
            fd.append('email', details.email)
            fd.append('password', details.password)
            fd.append('image', image,image.name)
            const res = await axios.post('http://localhost:5500/user/signup', fd)

        }
           
    }
    const onChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
        setImage(e.target.files[0])
    }
    return (
        <div className='signup'>
            <div style={{ marginBottom: '10px' }} className="auth_txt">
                <h1>ASHCLUB</h1>
                <h3>Sign up</h3>
            </div>
            <form onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name*</label>
                    <input required type="text" className="form-control" id="name" name='name' value={details.name} onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email*</label>
                    <input required type="email" className="form-control" id="email" name='email' value={details.email} onChange={onChange} aria-describedby="emailHelp" />
                    <div style={{ color: 'white' }} id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password*</label>
                    <input required type="password" className="form-control" id="password" name='password' value={details.password} onChange={onChange} />
                    <p style={{color:'red',fontSize:'13px'}}>{errors.lengthErr}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password*</label>
                    <input required type="password" className="form-control" id="cpassword" name='cpassword' value={details.cpassword} onChange={onChange} />
                    <p style={{color:'red',fontSize:'13px'}}>{errors.matchErr}</p>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Profile Pic*</label>
                    <input required type="file" className="form-control" id="image" name='image' onChange={onChange} aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                </div>

                <button type="submit" className="btn btn-primary">Sign up</button>
            </form>
            <p style={{color:"white"}}>or <span onClick={()=>{Navigate('/login')}} style={{ cursor:"pointer",color:'rgb(33, 174, 255)',fontWeight:'600'}}>Login</span></p>
        </div>

    )
}