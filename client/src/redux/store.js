import { configureStore } from "@reduxjs/toolkit";
import { chatsReducer } from "./reducers/chatsReducer";
import chatsSaga from "./saga/chatsSaga";
import createSagaMiddleware from "@redux-saga/core";
import { chatSelectReducer } from "./reducers/chatSelectReducer";


const sagaMiddleware = createSagaMiddleware()


const store = configureStore({
    reducer:{
        chatsReducer:chatsReducer,
        chatSelect:chatSelectReducer,
        
    },
    middleware:()=>[sagaMiddleware]

})

sagaMiddleware.run(chatsSaga)
export default store