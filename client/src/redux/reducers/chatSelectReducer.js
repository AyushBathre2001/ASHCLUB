let selectedChat = [{users:[]}]
export const chatSelectReducer = (state = selectedChat,action)=>{
    switch (action.type) {
        case 'SELECT_CHAT':
            return action.payload
            break;
    
        default:
            return state
            break;
    }
}