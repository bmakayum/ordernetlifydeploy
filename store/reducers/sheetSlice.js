import { createSlice } from '@reduxjs/toolkit';



const sheetSlice = createSlice({
    name: 'sheet',
    initialState:[],
    reducers:{
        ADD_SHEET: (state, action)=>{

           
        },
        UPDATE_SHEET: (state, action)=>{
            // return{
            //     ...state,
            //     user: {
            //             ...state.user,
            //             ...action.payload
            //         }
            // }

            return [
                ...state,
                ...action.payload
            ];
        }
    }
})

export const {ADD_SHEET, UPDATE_SHEET} = sheetSlice.actions
export default sheetSlice.reducer