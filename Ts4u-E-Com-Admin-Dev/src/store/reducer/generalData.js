
let init ={
    categories:[],
    brands:[],
    isCategoryLoading:false,
    isBrandLoading:false,

}

const generalData = (state=init, action)=>{
    switch (action.type) {
        case "SET_CATEGORIES":
       return{
           ...state,
           categories:action.payload
        }
        case "CATEGORY_LOADING_START":
       return{
           ...state,
           isCategoryLoading:true
        }
        case "CATEGORY_LOADING_FINISHED":
       return{
           ...state,
           isCategoryLoading:false
        }
        case "SET_BRANDS":
       return{
           ...state,
           brands:action.payload
        }
        case "ADD_NEW_BRAND":
       return{
           ...state,
           brands:[...state.brands,action.payload]
        }
        case "DELETE_BRAND":
       return{
           ...state,
           brands:state.brands.filter(brand=>brand._id !== action.payload)
        }
        case "UPDATE_BRAND":
            let brandArray = [...state.brands]
            let brandIndex = brandArray.findIndex(brand=>brand._id === action.payload._id)
            brandArray[brandIndex] = action.payload
       return{
           ...state,
           brands:brandArray
        }
        case "BRAND_LOADING_START":
       return{
           ...state,
           isBrandLoading:true
        }
        case "BRAND_LOADING_FINISHED":
       return{
           ...state,
           isBrandLoading:false
        }
      
        default:
            return state;
    }
}

export default generalData