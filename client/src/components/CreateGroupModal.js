import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../redux/actions/chatsActions';

export default function CreateGroupModal() {

  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  // const [userName, setUserName] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [groupMembers , setGroupMembers] = useState([])
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")))


  const handleSearch = async (value) => {

    let config = {
      headers: {
        token: user.token,
      }
    }
    const users = await axios.get(`http://localhost:5500/user/find?search=${value}`, config)
    setSearchResults(users.data)

  }
  const onChange = (e) => {
    setGroupName(e.target.value)
  }

  const createGroup = async () => {

    const members = selectedUsers.map((user)=>{
      return user.id
    })
    setGroupMembers(members)
    let config = {
      headers: {
        token: user.token,
        ContentType: 'application/json'
      }
    }

    const chat = await axios.post('http://localhost:5500/chat/group/create', {
      "name": groupName,
      "users": JSON.stringify(members)
    }, config)

    dispatch(fetchChats())
  }
  return (
    <>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ backgroundColor: "#333", borderRadius: "15px" }} className="modal-dialog">
          <div style={{ backgroundColor: "#333", color: "white", borderRadius: "15px" }} className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create New Group</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <input type="text" placeholder='Add group name...' className="form-control" id="groupname" name='groupname' value={groupName} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <input type="text" placeholder='Select users...' className='form-control' value={search} id='search' name='search' onChange={(e) => { setSearch(e.target.value); handleSearch(search) }} />
                </div>
              </form>
              {
                selectedUsers.map((item) => {

                  return <button type="button" className="btn btn-primary mx-1 my-1" style={{backgroundColor:"black", border:"none"}}>
    
                    {item.name} <span className="badge text-bg-secondary"  onClick={(e) => {
                      setSelectedUsers(selectedUsers.filter((val) => {
                        return e.target.id !== val.id
                      }))
                    }}> <i id={item.id} className="ri-close-line"></i></span>
                  </button>

                })
              }

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
                        <i id={item._id} onClick={() => { setSelectedUsers([...selectedUsers, {name:item.name, id:item._id}])}} className="ri-add-line"></i>
                      </div>
                    </div>
                  </div>
                })
              }
            </div>
            <div className="modal-footer">
              <button onClick={() => { setSearchResults([]); setSearch(''); setGroupName(''); setSelectedUsers([]) }} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button onClick={() => {createGroup(); setSearchResults([]); setSearch(''); setGroupName(''); setSelectedUsers([]) }} type="button" data-bs-dismiss="modal" className="btn btn-primary">Create</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
