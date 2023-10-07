import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Input, Button, Switch } from 'antd'
import './settings.scss'


function LiveChat() {
    const [isEnable, setIsEnable] = useState("")
    const [websiteId, setWebsiteId] = useState("")

    const saveLiveChat = () => {
        if (!websiteId) {
            return alert("Website ID is required")
        }
        let data = {
            isEnable,
            websiteId,
        }
        axios.post('/settings/livechat', { crisp: data })
            .then(res => {
                res.data.success && alert("updated")
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        
        axios.get('/settings/livechat')
            .then(res => {
                //console.log(res.data.otp);
                let { crisp } = res.data.liveChat
                setIsEnable(crisp?.isEnable)
                setWebsiteId(crisp?.websiteId)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className='otp_settings'>
            <Card title='Crisp(crisp.chat) Credentials'>
                <div className="otp_container">
                    <table>
                        <tbody>
                            <tr>
                                <td>Enable:</td>
                                <td><Switch checked={isEnable} onChange={(e) => setIsEnable(e)} /></td>
                            </tr>
                            <tr>
                                <td>Website ID</td>
                                <td><Input disabled value={websiteId} onChange={(e) => setWebsiteId(e.target.value)} placeholder="Crisp website ID" /></td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <div>
                        <Button onClick={() => saveLiveChat()} className='save' type="primary">Save</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default LiveChat
