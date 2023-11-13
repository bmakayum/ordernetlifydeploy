import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import sheetReducer from './reducers/sheetSlice'

export const store = configureStore({
  reducer: {
    user:userReducer,
    sheet:sheetReducer,
  }
})
