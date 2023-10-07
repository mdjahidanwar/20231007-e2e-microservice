import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Switch, Input, Button, Select } from 'antd';
import "./analytics.scss"

import axios from 'axios'



function Analytics() {
    const [isAnalyticsActive, setIsAnalyticsActive] = useState(false)
    const [isPixelActive, setIsPixelActive] = useState(false)

    const [pixelId, setPixelId] = useState("")
    const [analyticsId, setAnalyticsId] = useState("")

    const savePixel=()=>{
        if(!pixelId){
            return alert("pixel id is requiredd")
        }
        let pixel={
            isActive:isPixelActive,
            id:pixelId
        }
        axios.post("/settings/analytics",{pixel})
        .then(res=>{
            alert("updated")
        })
        .catch(err=>{
            alert("error")
            console.log(err);
        })
    }
    const saveAnalytics=()=>{
        if(!analyticsId){
            return alert("Analytics id is requiredd")
        }
        let ga={
            isActive:isAnalyticsActive,
            id:analyticsId
        }
        axios.post("/settings/analytics",{ga})
        .then(res=>{
            alert("updated")
        })
        .catch(err=>{
            alert("error")
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get("/settings/analytics")
        .then(res=>{
            const {ga, pixel} = res.data.analytics
            setIsPixelActive(pixel?.isActive)
            setPixelId(pixel?.id)
            
            setIsAnalyticsActive(ga?.isActive)
            setAnalyticsId(ga?.id)
        })
        .catch(err=>{
            alert("error")
            console.log(err);
        })
    }, [])

    return (
        <div>
            <div className='analytics'>
            <Row gutter={16}>
                <Col span={12}>
                <Card title="Facebook Pixel Setting">
                        <table style={{width:"100%"}}>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={isPixelActive} onChange={(e) => setIsPixelActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Facebook Pixel ID:</td>
                                    <td><Input value={pixelId} onChange={(e) => setPixelId(e.target.value)} placeholder="Facebook Pixel ID" /></td>
                                </tr>

                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => savePixel()} className='save' type="primary">Save</Button>
                        </div>
                    </Card>

                </Col>
               
                <Col span={12}>
                    <Card title="Google Analytics Setting">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={isAnalyticsActive} onChange={(e) => setIsAnalyticsActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Tracking ID:</td>
                                    <td><Input value={analyticsId} onChange={(e) => setAnalyticsId(e.target.value)} placeholder="Tracking ID" /></td>
                                </tr>

                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => saveAnalytics()} className='save' type="primary">Save</Button>
                        </div>
                    </Card>

                </Col>
            </Row>
        </div>
        </div>
    )
}

export default Analytics
