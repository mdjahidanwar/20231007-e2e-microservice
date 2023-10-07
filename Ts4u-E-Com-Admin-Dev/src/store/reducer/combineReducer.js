import {combineReducers} from 'redux'
import authReducers from './authReducer'
import mediaReducer from './mediaReducer'
import generalData from './generalData'

const rootReducer = combineReducers({
    auth: authReducers,
    media:mediaReducer,
    data:generalData
})

export default rootReducer