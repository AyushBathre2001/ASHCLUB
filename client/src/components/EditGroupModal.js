import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import React from 'react';
import axios from 'axios';
import { fetchChats } from '../redux/actions/chatsActions';
import { useDispatch } from 'react-redux';

export default function EditGroupModal() {

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [chatName, setChatName] = useState('')
    const selectedChat = useSelector((state) => state.chatSelect)
    const [users, setUsers] = useState([])
    const [currentChatName, setCCN] = useState(selectedChat[0].chatName)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")))

    useEffect(() => {
        setUsers(selectedChat[0].users)
        setCCN(selectedChat[0].chatName)
    },[selectedChat])

    const renameChat = async (e) => {
        e.preventDefault()
        setChatName('')
        let config = {
            headers: {
                token: user.token,
            }
        }
        const users = await axios.put('http://localhost:5500/chat/group/rename', {
            "chatId": selectedChat[0]._id,
            "chatName": chatName
        }, config)

        setCCN(users.data.chatName)
        dispatch(fetchChats)
    }

    const addUser = async (chatId, userId) => {
        setSearchResults([])
        setSearch('')
        let config = {
            headers: {
                token: user.token,
            }
        }
        const users = await axios.put('http://localhost:5500/chat/group/adduser', {
            "chatId": chatId,
            "userId": userId
        }, config)


        setUsers(users.data.users)
        dispatch(fetchChats)


    }

    const removeUser = async (chatId, userId) => {

        let config = {
            headers: {
                token: user.token,
            }
        }
        const users = await axios.put('http://localhost:5500/chat/group/removeuser', {
            "chatId": chatId,
            "userId": userId
        }, config)


        setUsers(users.data.users)
        dispatch(fetchChats())
    }
    const handleSearch = async (value) => {

        let config = {
            headers: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjRkMjA5NjdlZWRhYWI1NTNmYzYyYSIsImlhdCI6MTY3NzAzODQ5Nn0.x4cOcO9Vs5tNJKGdz4mSj4Gt7_NQrbffLxs4I_Vykf0",
            }
        }
        const users = await axios.get(`http://localhost:5500/user/find?search=${value}`, config)
        setSearchResults(users.data)

    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ backgroundColor: "#333", borderRadius: "15px" }} className="modal-dialog">
                <div style={{ backgroundColor: "#333", color: "white", borderRadius: "15px" }} className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">{currentChatName}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        {users.map((user) => {

                         return   user._id !== selectedChat[0].groupAdmin._id ? <button type="button" className="btn btn-primary mx-1 my-2" style={{ backgroundColor: "black", border: "none" }}>
                            {user.name} <span id={user._id} className="badge text-bg-secondary" onClick={(e) => { removeUser(selectedChat[0]._id, e.target.id) }}
                            > <i id={user._id} onClick = {(e)=>{removeUser(selectedChat[0]._id,e.target.id)}}
                            className="ri-close-line"></i></span>
                        </button> : <></>
                           
                        })}
                        <form>
                            <div className="mb-3 d-flex">
                                <input type="text" placeholder='Chat name...' className="form-control" id="groupname" name='groupname' value={chatName} onChange={(e) => { setChatName(e.target.value) }} />
                                <button onClick={renameChat} className='btn btn-primary'>Update</button>
                            </div>
                            <div className="mb-3">
                                <input onChange={(e) => { setSearch(e.target.value); handleSearch(search) }} value={search} type="text" placeholder='Add user...' className='form-control' id='search' name='search' />
                            </div>

                        </form>
                        {
                            searchResults.map((item) => {
                                return <div key={item._id} className="res_user my-2">
                                    <div className="ls">
                                        <img src={item.pic} alt="" />
                                    </div>
                                    <div className="rs">
                                        <div className="info">
                                            <h6>{item.name}</h6>
                                            <p>{item.email}</p>

                                        </div>
                                        <div className="add">
                                            <i id={item._id} onClick={(e) => { addUser(selectedChat[0]._id, e.target.id); }} className="ri-add-line"></i>
                                        </div>
                                    </div>
                                </div>
                            })
                        }

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" onClick={()=>{removeUser(selectedChat[0]._id,user.user._id)}} data-bs-dismiss="modal" className="btn btn-danger">Leave group</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
