import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const Navigate = useNavigate()
  return (
    <div className='Navbar'>
      <div className="navhead">
        <h3>ASHCLUB</h3>
     
        <div className="search">
        {
          localStorage.getItem('userinfo') ? <button data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">Search user  <i className="ri-search-2-line"></i> </button>: <></>

        }
        </div>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/">About</Link></li>
          <li><Link to="/">Contact</Link></li>
        </ul>
      </nav>
      <div className="auth">
        {
          localStorage.getItem('userinfo') ? <>
            <button onClick={() => { Navigate('/login'); localStorage.removeItem('userinfo') }} className='btn btn-danger'>Logout</button>
          </> : <>
            <button onClick={() => { Navigate('/login') }} className='login_btn'>Login</button>
            <button onClick={() => { Navigate('/signup') }} className='signup_btn'>Signup</button>

          </>
        }
      </div>
    </div>
  )
}
