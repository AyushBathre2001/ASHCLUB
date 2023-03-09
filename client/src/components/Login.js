import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
    const [details,setDetails] = useState({username:'',password:''})
    const [invalid,setInvalid] = useState()

    const Navigate = useNavigate()

    const handleClick = async (e)=>{
        e.preventDefault()
        const res = await axios.post('http://localhost:5500/user/login',{
            "username":details.username,
            "password":details.password
        })
        if(res.data.success === false){
            setInvalid('Invalid user credentials!')
        }
        else{
            
            localStorage.setItem("userinfo",JSON.stringify(res.data.auth))
            Navigate('/chat')
        }
    }
    const onChange = (e)=>{
        setDetails({...details,[e.target.name]:e.target.value})
    }

    return (
        <div className='login'>
            <div className="auth_txt">
                <h1>ASHCLUB</h1>
                <h3>Login</h3>
            </div>
            <p style={{color:'red',fontSize:'14px'}}>{invalid}</p>

            <form onSubmit={handleClick}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username*</label>
                    <input type="email" className="form-control" id="username" name='username' value={details.username} onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password*</label>
                    <input type="password" className="form-control" id="password" name='password' value={details.password} onChange={onChange} />
                </div>
                <div className='mb-3'>
                    <p>Forgot Password?</p>

                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p className='mt-2' style={{color:"white"}}>or <span onClick={()=>{Navigate('/signup')}} style={{cursor:"pointer",color:'rgb(33, 174, 255)',fontWeight:'600'}}>Sign up</span></p>

        </div>
    )
}
