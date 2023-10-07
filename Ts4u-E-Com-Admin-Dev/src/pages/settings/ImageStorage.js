import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Input, Button, Switch } from 'antd'
import './settings.scss'


function ImageStorage() {
    const [name,setName] = useState("")
    const [key,setKey] = useState("")
    const [secret,setSecret] = useState("")

    const saveCloudinary=()=>{
        if(!name || !key || !secret){
            return alert("Name, key and secret is required")
        }
        let data={
            name,
            key,
            secret
        }
        axios.post('/settings/storage', { cloudinary: data })
        .then(res => {
            res.data.success && alert("updated")
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get('/settings/storage')
        .then(res=>{
         //console.log(res.data.otp);
         let {cloudinary} = res.data.storage
         setName(cloudinary?.name)
         setKey(cloudinary?.key)
         setSecret(cloudinary?.secret)
        })
        .catch(err=>{
            console.log(err);
        })
     }, [])

    return (
        <div  className='otp_settings'>
            <Card title='Cloudinary Credentials'>
                <div className="otp_container">
                    <table>
                        <tbody>
                            <tr>
                                <td>Cloud Name:</td>
                                <td><Input disabled value={name} onChange={(e) => setName(e.target.value)} placeholder="Cloud name" /></td>
                            </tr>
                            <tr>
                                <td>Cloud API Key</td>
                                <td><Input disabled value={key} onChange={(e) => setKey(e.target.value)} placeholder="Api key" /></td>
                            </tr>
                            <tr>
                                <td>Cloud API Secret</td>
                                <td><Input disabled value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Api secret" /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <Button onClick={() => saveCloudinary()} className='save' type="primary">Save</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ImageStorage
