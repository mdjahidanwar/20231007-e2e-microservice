import React from 'react'
import { FileLibraryListItem, ReactMediaLibrary, FileMeta } from 'react-media-library';
import { useSelector,useDispatch } from 'react-redux'
import './media.scss'
import { dataURIToBlob, resizeFile } from '../components/imageResize'
import axios from 'axios'


function MediaLibrary({ display, onHide, selectCallback }) {

    const { media } = useSelector(state => state.media)
    const dispatch = useDispatch()

    async function uploadCallback(fileBase64, fileMeta) {
        // TODO Upload file to backend APIs
        
        const imageConverted = await resizeFile( dataURIToBlob(fileBase64));
       
       
        let formData = new FormData();
        formData.append("media", dataURIToBlob(imageConverted),fileMeta.fileName);

        let res = await axios.post('/media/upload',formData)
        if(res.status===200){
            dispatch({
                type:"ADD_MEDIA",
                payload:res.data.data
            })
            return true;
        }else{
            return false;
        }

    }


    async function deleteCallback(item) {
       // console.log(item);

        let res = await axios.delete(`/media/delete/${item._id}`)
        if(res.data.success){
            dispatch({
                type:"UPDATE_MEDIA",
                payload:item._id
            })
        }
        // Delete the data from your database
        // Also remember to update the fileLibraryList prop with a new list
    }

    return (
            <>
                <ReactMediaLibrary

                    show={display}
                    onHide={onHide}
                    fileUploadCallback={uploadCallback}
                    fileLibraryList={media}
                    fileSelectCallback={selectCallback}
                    fileDeleteCallback={deleteCallback}
                />
            </>
        )
    }

    export default MediaLibrary
