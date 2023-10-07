import React, { useState } from 'react'
import { Card, Button, Modal, Input,Alert } from 'antd'
import './settings.scss'
import axios from 'axios'

function ImportDemo() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading,setLoading] = useState(false)

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if(!password){
            return alert("pasword is required")
        }
        setLoading(true)
        axios.post('/seeder/create',{password})
        .then(res=>{
            if(res.data.success){
                alert("imported successfully")
                setLoading(false)
                handleCancel()
            }
        })
        .catch(err=>{
            setLoading(false)
            err && err.response && setError(err.response.data)
        })

    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setError(null)
        setPassword("")
    };
    return (
        <div className='demo'>
            <Card title="Import demo">
                <div className="demo_info">
                    <strong>Rules:</strong>
                    <li>1. Demo data will remove your existing Products,Brands,Attributes,Categories.</li>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <Button onClick={()=>showModal()} size='large' type='primary'>Import Now</Button>
                </div>
            </Card>



            <Modal 
            zIndex={1111}
            title="Confirm password" 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[
                <Button onClick={()=>handleCancel()} >Cancel</Button>,
                <Button loading={loading} onClick={()=>handleOk()} type='primary'>Import</Button>
            ]}
            >
                {
                    error && <Alert style={{marginBottom:"10px"}} message={error.error} type="error" />
                }
                <Input  value={password} onChange={e=>setPassword(e.target.value)} placeholder='Enter your password'></Input>
            </Modal>
        </div>
    )
}

export default ImportDemo
