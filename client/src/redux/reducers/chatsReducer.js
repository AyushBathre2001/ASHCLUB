let users = []
export const chatsReducer = (state = users,action)=>{
    switch (action.type) {
        case 'SET_CHATS':
            users.concat(...users,action.data)
            return action.data
            break;
    
        default:
            return state
            break;
    }
}