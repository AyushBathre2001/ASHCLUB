import { useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';


export default function UserProfileModal() {
    const selectedChat = useSelector((state) => state.chatSelect)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")))

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div style={{ backgroundColor: "#333", borderRadius: "15px" }} className="modal-dialog">
          <div style={{ backgroundColor: "#333", color: "white", borderRadius: "15px" }} className="modal-content">
            <div className="modal-header">
                {
                    selectedChat[0].users[0]._id === user.user._id ?<h1 className="modal-title fs-5" id="staticBackdropLabel">{selectedChat[0].users[1].name}</h1> :<h1 className="modal-title fs-5" id="staticBackdropLabel">{selectedChat[0].users[0].name}</h1>


                }
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div style={{display:"flex", alignItems:"center",justifyContent:"center"}} className="modal-body">
                <div className="img_box" style={{width:"320px", height:"320px", borderRadius:"50%"}}>

                {
                    selectedChat[0].users[0]._id === user.user._id ? <img style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} src={selectedChat[0].users[1].pic} alt="" /> : <img style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} src={selectedChat[0].users[0].pic} alt="" />
                    
                    
                }
                </div>
            </div>
            <div style={{display:"flex", alignItems:"center",justifyContent:"flex-start"}} className="modal-footer">
               { 
            selectedChat[0].users[0]._id === user.user._id ? <p>Email: {selectedChat[0].users[1].email}</p> : <p>Email: {selectedChat[0].users[0].email}</p>
               }
            </div>
            
          </div>
        </div>
      </div>
      

    )
}
