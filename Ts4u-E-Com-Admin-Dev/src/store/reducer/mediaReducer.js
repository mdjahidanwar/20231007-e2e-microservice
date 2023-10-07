
let init ={
    media:[],
  
}

const mediaReducer = (state=init, action)=>{
    switch (action.type) {
        case "SET_MEDIA":
       return{
           ...state,
           media:action.payload,
        }

        case "ADD_MEDIA":
            return{
                ...state,
                media:  [action.payload,...state.media],
             }
        case "UPDATE_MEDIA":
            let array = [...state.media]
            let index = array.findIndex(m=>m._id === action.payload)
            array.splice(index,1)
            return{
                ...state,
                media: array,
             }
    
        default:
            return state;
    }
}

export default mediaReducer