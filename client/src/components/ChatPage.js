import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../redux/actions/chatsActions';
import { chatSelectAction } from '../redux/actions/chatSelectAction';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';
import axios from 'axios';


import io from 'socket.io-client'
import UserProfileModal from './UserProfileModal';
var socket, selectedChatCompare
const ENDPOINT = "http://localhost:5500"

export default function ChatPage() {

  //redux 
  const dispatch = useDispatch()
  const chats = useSelector((state) => state.chatsReducer)
  const selectedChat = useSelector((state) => state.chatSelect)
  
  
  //states
  const [newMessage, setNewMessage] = useState()
  const [allMessages, setAllMessages] = useState([])
  const [fetchagain, setFetchagain] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")))
  const [socketConnected, setSocketConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [chatName,setChatName] = useState()


  //methods
  const selectChat = (id) => {
    const temp = chats.filter((ele) => {
      return ele._id === id
    })
    dispatch(chatSelectAction(temp))
    
  }

  const onChange = (e) => {
    setNewMessage(e.target.value)
  }

  const sendMessages = async (event) => {

    event.preventDefault()

    const config = {
      headers: {
        token: user.token
      }
    }

    setNewMessage("")
    const data = await axios.post('http://localhost:5500/message/send', {
      "content": newMessage,
      "chatId": selectedChat[0]._id
    }, config)
    socket.emit("new message", data.data)
    setAllMessages([...allMessages, data.data])
    fetchMessages(selectedChat[0]._id)
  }


  const fetchMessages = async (id) => {

    if(!selectedChat[0]._id){return}
    setLoading(true)
    const config = {
      headers: {
        token: user.token
      }
    }

    const data = await axios.get(`http://localhost:5500/message/fetch/${id}`, config)
    setAllMessages(data.data)
    setLoading(false)
    socket.emit("join chat", selectedChat[0]._id)

  }

  useEffect(() => {
    if (chats.length === 0) {
      setLoading(true)
    }
    else {
      setLoading(false)
    }
  }, [chats])


  // socket.io
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user.user)
    socket.on("connected", () => setSocketConnected(true))
  }, [])

 

  useEffect(() => {
    socket.on("message recieved", (message) => {

      if (!selectedChatCompare || selectedChatCompare[0]._id !== message.chat._id) {
        //give notifications
      }
      else {
        setAllMessages([...allMessages, message])
  
        fetchMessages(selectedChat[0]._id)

      }
    })
  })


  useEffect(() => {
      fetchMessages(selectedChat[0]._id);
      selectedChatCompare = selectedChat
  }, [selectedChat]);

  useEffect(() => {
    dispatch(fetchChats())
    setChatName(selectedChat[0].chatName)
  },[])

  return (
    <>
      <SideBar />
      <CreateGroupModal />
      {
        selectedChat[0].isGroupChat === false ?<UserProfileModal/> : <EditGroupModal/>
      }
      <div className='chatpage'>
        <div className="usersBox">
          <div className="ur_head">
            <h2>My Chats</h2>
            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop" >New Group Chat </button>
          </div>
          <div style={{justifyContent: loading === true  && chats.length === 0 ? "center" : "flex-start"}}  className="users">
            {
              loading === true && chats.length === 0 ?
                <> <div style={{width:"50px",height:"50px"}} className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                </> :

                chats.map((chat) => {

                  return <div style={{ background: chat._id === selectedChat[0]._id ? 'rgb(0, 134, 211)' : '#333' }} id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id); setAllMessages([]) }} key={chat._id} className="user_box mt-3">
                    <div className='ls' id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>
                      {
                        chat.isGroupChat === false ? <>{
                          chat.users[0]._id === user.user._id ? <><img id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }} src={chat.users[1].pic} alt="" /></> : <><img id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }} src={chat.users[0].pic} alt="" /></>}
                        </> : <>
                          <img id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }} src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" alt="" />
                        </>
                      }
                    </div>
                    <div className='rs' id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>
                      <div className="info" id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>
                        
                        {
                          chat.isGroupChat === false ? chat.users[0]._id === user.user._id ? <><h6 style={{ fontWeight: "700" }} id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>{chat.users[1].name}</h6></> : <><h6 style={{ fontWeight: "700" }} id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>{chat.users[0].name}</h6></> : <h6  style={{ fontWeight: "700" }} id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>{chat.chatName}</h6>
                        }
                        {
                          chat.isGroupChat === false ? chat.users[0]._id === user.user._id ? <><p id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>{chat.users[1].email}</p></> : <><p id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>{chat.users[0].email}</p></> : <p id={chat._id} onClick={(e) => { selectChat(e.target.id); fetchMessages(e.target.id) }}>Created - {chat.createdAt}</p>

                        }
                      </div>
                    </div>
                  </div>
                })

            }
          </div>
        </div>

        <div className="chatBox">
          {
            selectedChat[0].users.length === 0 ? <h1>Click on a user to start chatting</h1> : <>
              <div className="cb_head">
                <h2>Messages</h2>
                <div className="view">
                  <i className="ri-eye-line" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                </div>
              </div>
              <div className="chat">
                <div style={{justifyContent: loading === true && allMessages.length === 0 ? "center" : "flex-end"}} className="messages">

                  {
                    loading ===  true && allMessages.length === 0 ?
                      <> <div style={{width:"80px", height:"80px"}} className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      </> :

                      allMessages.map((item,index) => {

                        return <div key={index}  style={{ alignItems: "center", "justifyContent": item.sender._id === user.user._id ? "flex-end" : "flex-start" }} className="line">
                          <div style={{ backgroundColor: item.sender._id === user.user._id ? "rgb(15, 142, 222)" : "white", color: item.sender._id === user.user._id ? "white" : "black" }} className="content">
                            {
                              item.sender._id === user.user._id ? <h6>{item.content}</h6> : <h6><span style={{fontWeight:"700", color:"#333"}}>{item.sender.name}:  </span>{item.content}</h6>

                            }

                          </div>

                        </div>
                      })}
                
                </div>
                <form onSubmit={sendMessages}>
                  <input type="text" placeholder='Enter your message...' id='sendmessage' name='sendmessage' onChange={onChange} value={newMessage} />
                </form>
              </div>
            </>
          }

        </div>

      </div>
    </>
  )
}
