import React from 'react'
import ch03 from '../images/ch03.png'
import ch01 from '../images/ch01.png'
import ch02 from '../images/ch02.png'
import ch04 from '../images/ch04.png'
import { useNavigate } from 'react-router-dom'
export default function Homepage() {

  const Navigate = useNavigate()
  return (
    <div className='homepage'>
      <div className="maintxt">
        <h4>One Click No Friction <img src={ch04} alt="" /></h4>
      </div>
       <img src={ch02} alt="" />
        <div className="left">
            <div className="txt">
                <h1>ASH<span id='fontChange'>CLUB.</span></h1>
                <h4>A Real Time Chat Application</h4>
                <p>Make friends and chat with them using this amazing chat application which provides you the one on one as well as group chat functionality.</p>
                <img src={ch01} alt="" />
            </div>
        </div>
        <div className="right">
            <img src={ch03} alt="" />
            <div className="cred">
              <button onClick={()=>{Navigate('/login')}} className='mx-1' id='login'>Login</button>
              <button onClick={()=>{Navigate('/signup')}} className='mx-1' id='signup'>Signup</button>
            </div>
        </div>
    </div>
  )
}
