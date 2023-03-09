import axios from 'axios'
import React, {useRef, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchChats } from '../redux/actions/chatsActions';


export default function SideBar() {
    const [data, setData] = useState('')
    const [items, setItems] = useState([])
    const dispatch = useDispatch()
    const [user,setUser] = useState(JSON.parse(localStorage.getItem('userinfo')))
    const ref = useRef(null)

    const handleSearch = async (e) => {
        e.preventDefault()
        let config = {
            headers: {
                token:user.token       }
        }
        const users = await axios.get(`http://localhost:5500/user/find?search=${data}`, config)

        setItems(users.data)
    }

    const onChange = (e) => {
        setData(e.target.value)
    }

    const accessChat = async (id)=>{
       ref.current.click()
       setData('')
       setItems([])
        let config = {
            headers: {
                token:user.token         }
        }
        const chat = await axios.post('http://localhost:5500/chat/access',{
            "userId":id
        },config)

        dispatch(fetchChats())

    }

    return (

        <div style={{ padding: "20px", background: "rgb(27, 27, 27)" }} className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <button style={{display:"none"}} ref={ref} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={data} onChange={onChange} />
                <button className="btn btn-outline-success" onClick={handleSearch} type="submit">Search</button>
            </form>

            <div className="offcanvas-body mt-3">

                {
                    items.map((item) => {
    
                        return <div key={item._id} className="res_user mb-3">
                            <div className="ls">
                                <img src={item.pic} alt="" />
                            </div>
                            <div className="rs">
                                <div className="info">
                                    <h6>{item.name}</h6>
                                    <p>{item.email}</p>

                                </div>
                                <div className="add">
                                    <i id={item._id} onClick = {(e)=>{accessChat(e.target.id)}} className="ri-add-line"></i>
                                </div>
                            </div>
                        </div>
                    })
                }


            </div>
        </div>

    )
}
