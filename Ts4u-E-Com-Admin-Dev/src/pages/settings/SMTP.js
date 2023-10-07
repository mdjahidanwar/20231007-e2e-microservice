import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card ,Input,Button,Switch} from 'antd'
import './settings.scss'

function SMTP() {
    const [host, setHost] = useState("")
    const [port, setPort] = useState(587)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [secure, setSecure] = useState(false)
    const [mail, setMail] = useState('')

    const [otpsettings, setOtpSettings] = useState({order:false,payment:false,delivery:false,cancel:false})

    const saveSMTP = () => {
        if(!host || !port || !username || !password || !mail){
           return alert("All fields are required")
        }
        let smtp={
            host,
            port,
            username,
            password,
            secure,
            mail
        }
        axios.post('/settings/updatesmtp',{smtp})
        .then(res=>{
            if(res.data.success){
                alert("Updated")
            }
        })
    }

    const saveSettings=()=>{
        axios.post('/settings/updatesmtp',{settings:otpsettings})
        .then(res=>{
            if(res.data.success){
                alert("Updated")
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    useEffect(() => {
       axios.get('/settings/smtp')
       .then(res=>{
        //console.log(res.data.otp);
        let {settings,clients} = res.data.smtp
        setHost(clients?.smtp.host)
        setPort(clients?.smtp.port)
        setUsername(clients?.smtp.username)
        setPassword(clients?.smtp.password)
        setSecure(clients?.smtp.secure)
        setMail(clients?.smtp.mail)
        setOtpSettings(settings)
       })
       .catch(err=>{
           console.log(err);
       })
    }, [])
    return (
        <div className='otp_settings'>
            <Card title="SMTP Credentials" >
                <div className="otp_container">
                <table>
                    <tbody>
                        <tr>
                            <td>Mail HOST:</td>
                            <td><Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="Mail Host" /></td>
                        </tr>
                        <tr>
                            <td>Mail PORT:</td>
                            <td><Input value={port} onChange={(e) => setPort(e.target.value)} placeholder="587" /></td>
                        </tr>
                        <tr>
                            <td>Mail USERNAME:</td>
                            <td><Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Mail Username" /></td>
                        </tr>
                        <tr>
                            <td>MAIL PASSWORD:</td>
                            <td><Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mail Passowrd" /></td>
                        </tr>
                        <tr>
                            <td>SECURE:</td>
                            <td><Switch checked={secure} onChange={(e) => setSecure(e)} /></td>
                        </tr>
                        <tr>
                            <td>MAIL FROM ADDRESS:</td>
                            <td><Input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Mail From Passowrd" /></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button onClick={() => saveSMTP()} className='save' type="primary">Save</Button>
                </div>
                </div>
            </Card>



            <Card title="Email will be sent for?" style={{marginTop:"20px"}}>
                <div className="otp_container">
                <table>
                    <tbody>
                        <tr>
                            <td>Order Placement:</td>
                            <td><Switch checked={otpsettings.order} onChange={(e) => setOtpSettings(prev=>({...prev,order:e}))} /></td>
                        </tr>
                        <tr>
                            <td>Payment Status Change</td>
                            <td><Switch checked={otpsettings.payment} onChange={(e) =>  setOtpSettings(prev=>({...prev,payment:e}))} /></td>
                        </tr>
                        <tr>
                            <td>Order Delivery</td>
                            <td><Switch checked={otpsettings.delivery} onChange={(e) =>  setOtpSettings(prev=>({...prev,delivery:e}))} /></td>
                        </tr>
                        <tr>
                            <td>Order Cancel</td>
                            <td><Switch checked={otpsettings.cancel} onChange={(e) =>  setOtpSettings(prev=>({...prev,cancel:e}))} /></td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button onClick={() => saveSettings()} className='save' type="primary">Save</Button>
                </div>
                </div>
               
            </Card>
        </div>
    )
}

export default SMTP
