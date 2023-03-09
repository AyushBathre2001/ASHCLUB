import {takeEvery} from 'redux-saga/effects'
import { put } from 'redux-saga/effects'
import axios from 'axios'
function* fetchChats(){
    const user = JSON.parse(localStorage.getItem('userinfo'))
    let config = {
        headers: {
            token: user.token}
    }
    let url = 'http://localhost:5500/chat/fetch'

    const data = yield axios.get(url,config)
    
   
    yield put({type:'SET_CHATS',data:data.data})
}

function* chatsSaga(){
    yield takeEvery('FETCH_CHATS',fetchChats)
}

export default chatsSaga