import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: (typeof window !== 'undefined')? localStorage.getItem('userdata')?JSON.parse(localStorage.getItem('userdata')):{}:{}                     
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        ADD_USER: (state, action)=>{


            localStorage.setItem('userdata', JSON.stringify(action.payload))
            
            
            //state.user = {user:{...action.payload}}
            //state.user.user = {...state.user, ...action.payload};
            // let path = {...state.user.user}
            // return {path, ...action.payload}
            //state.user =  {...action.payload};
            // let data = {...state}
            // data.user = action.payload;
            // localStorage.setItem('userdata', JSON.stringify(data.user))
           
        },
        UPDATE_USER: (state, action)=>{
            return{
                ...state,
                user: {
                        ...state.user,
                        ...action.payload
                    }
            }
        }
    }
})

export const {ADD_USER, UPDATE_USER} = userSlice.actions
export default userSlice.reducer

