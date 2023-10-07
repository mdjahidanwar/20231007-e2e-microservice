import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Switch, Input, Button, Select } from 'antd';

import './payment.scss'
import axios from 'axios'
const { Option } = Select;

function PaymentMethod() {

    const [codIsActive, setCodIsActive] = useState(false)

    const [paypalIsActive, setPaypalIsActive] = useState(false)
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [isSandbox, setIsSandbox] = useState(true)

    const [isVenmoActive, setIsVenmoActive] = useState(false)
    const [venmoText, setVenmoText] = useState("")

    const [isCashAppActive, setIsCashAppActive] = useState(false)
    const [cashAppText, setCashAppText] = useState("")

    const [isZelleActive, setIsZelleActive] = useState(false)
    const [zelleText, setZelleText] = useState("")






    const savePaypal = () => {

        if (!clientId || !clientSecret) {
            return alert("Client Id and secret is required")
        }
        const data = {
            isActive: paypalIsActive,
            clientId,
            clientSecret,
            isSandbox
        }
        axios.post('/settings/paymentmethod', { paypal: data })
            .then(res => {
                res.data.success && alert("updated")
            })
    }

    const saveCod = () => {

        const data = {
            isActive: codIsActive,
        }
        axios.post('/settings/paymentmethod', { cod: data })
            .then(res => {
                res.data.success && alert("updated")
            })
    }


    const saveVenmo = () => {
        if(!venmoText){
            return alert("Please enter some instruction")
        }
        const data = {
            isActive: isVenmoActive,
            text:venmoText
        }
        axios.post('/settings/paymentmethod', { venmo: data })
            .then(res => {
                res.data.success && alert("updated")
            })
    }

    const saveCashApp = () => {
        if(!cashAppText){
            return alert("Please enter some instruction")
        }
        const data = {
            isActive: isCashAppActive,
            text:cashAppText
        }
        axios.post('/settings/paymentmethod', { cashApp: data })
            .then(res => {
                res.data.success && alert("updated")
            })
    }

    const saveZelle = () => {
        if(!zelleText){
            return alert("Please enter some instruction")
        }
        const data = {
            isActive: isZelleActive,
            text:zelleText
        }
        axios.post('/settings/paymentmethod', { zelle: data })
            .then(res => {
                res.data.success && alert("updated")
            })
    }





    useEffect(() => {
        axios.get("/settings/getpaymentmethods")
            .then(res => {
                const { paypal, cod ,venmo,cashApp,zelle} = res.data.methods
                setCodIsActive(cod?.isActive)

                setPaypalIsActive(paypal?.isActive)
                setClientId(paypal?.clientId)
                setClientSecret(paypal?.clientSecret)
                setIsSandbox(paypal?.isSandbox)

                setIsVenmoActive(venmo?.isActive)
                setVenmoText(venmo?.text)

                setIsCashAppActive(cashApp?.isActive)
                setCashAppText(cashApp?.text)

                setIsZelleActive(zelle?.isActive)
                setZelleText(zelle?.text)

            })
    }, [])



    return (
        <div className='paymentmethod'>
            <Row gutter={16}>

                <Col style={{ marginBottom: "10px" }} span={12}>
                    <Card title="Venmo">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={isVenmoActive} onChange={(e) => setIsVenmoActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>instruction:</td>
                                    <td><Input value={venmoText} onChange={(e) => setVenmoText(e.target.value)} placeholder="Enter Venmo info" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => saveVenmo()} className='save' type="primary">Save</Button>
                        </div>

                    </Card>
                </Col>
                <Col style={{ marginBottom: "10px" }} span={12}>
                    <Card title="Cash app">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={isCashAppActive} onChange={(e) => setIsCashAppActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>instruction:</td>
                                    <td><Input value={cashAppText} onChange={(e) => setCashAppText(e.target.value)} placeholder="Enter Cash app info" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => saveCashApp()} className='save' type="primary">Save</Button>
                        </div>

                    </Card>
                </Col>
                <Col style={{ marginBottom: "10px" }} span={12}>
                    <Card title="Zelle">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={isZelleActive} onChange={(e) => setIsZelleActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>instruction:</td>
                                    <td><Input value={zelleText} onChange={(e) => setZelleText(e.target.value)} placeholder="Enter Zelle info" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => saveZelle()} className='save' type="primary">Save</Button>
                        </div>

                    </Card>
                </Col>

                <Col span={12}>
                    <Card title="Cash on delivery">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={codIsActive} onChange={(e) => setCodIsActive(e)} /></td>
                                </tr>

                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => saveCod()} className='save' type="primary">Save</Button>
                        </div>
                    </Card>

                </Col>
                <Col span={12}>
                    <Card title="Paypal Credential">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Enable:</td>
                                    <td><Switch checked={paypalIsActive} onChange={(e) => setPaypalIsActive(e)} /></td>
                                </tr>
                                <tr>
                                    <td>Client Id:</td>
                                    <td><Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Enter your client id" /></td>
                                </tr>
                                <tr>
                                    <td>Client secret:</td>
                                    <td><Input value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Enter your client secret" /></td>
                                </tr>
                                <tr>
                                    <td>Sandbox Mode:</td>
                                    <td><Switch checked={isSandbox} onChange={(e) => setIsSandbox(e)} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <Button onClick={() => savePaypal()} className='save' type="primary">Save</Button>
                        </div>

                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PaymentMethod
