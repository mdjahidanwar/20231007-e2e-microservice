
let init ={
    user:{},
    authenticated: false,
  
}

const authReducer = (state=init, action)=>{
    switch (action.type) {
        case "SET_USER":
       return{
           ...state,
           user:action.payload,
           authenticated: true
        }
        case "LOGOUT":
        return{
            user:{},
            authenticated: false,
            loading: false,
            snack:{open:false,message:"",type:''}
            }
      
    
        default:
            return state;
    }
}

export default authReducer