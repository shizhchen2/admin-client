import {combineReducers} from 'redux'


const initUser={
    username:'',
    password:''
}

function user(state=initUser,action){
    switch(action.type){
        default:
            return state
    }
}

export default combineReducers({
    user
})

