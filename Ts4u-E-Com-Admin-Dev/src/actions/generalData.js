import axios from 'axios'

export const setCategories = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: "CATEGORY_LOADING_START" })
            let res = await axios.get(`${process.env.REACT_APP_API}/category/getcategory`)

            dispatch({
                type: "SET_CATEGORIES",
                payload: res.data.categories
            })
            dispatch({ type: "CATEGORY_LOADING_FINISHED" })
        } catch (error) {
            dispatch({ type: "CATEGORY_LOADING_FINISHED" })
            console.log(error);
        }


    };
};

export const setBrands = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: "BRAND_LOADING_START" })
            let res = await axios.get(`${process.env.REACT_APP_API}/brand/get`)

            dispatch({
                type: "SET_BRANDS",
                payload: res.data.brands
            })
            dispatch({ type: "BRAND_LOADING_FINISHED" })
        } catch (error) {
            dispatch({ type: "BRAND_LOADING_FINISHED" })
            console.log(error);
        }


    };
};


export const setMedia = () => {
    return async (dispatch) => {
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/media/getall`)

            dispatch({
                type: "SET_MEDIA",
                payload: res.data.data
            })
        } catch (error) {
            console.log(error);
        }


    };
};