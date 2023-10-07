import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Table, Tag, Space, Image, Switch, Popconfirm } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import "./attribute.scss"
import axios from 'axios'
import ChipInput from 'material-ui-chip-input'



function Attributes() {
  
    
    const [editId, setEditId] = useState(null)
    
    const [attributes, setAttributes] = useState([])
    const [values, setValues] = useState([])

    const [attributeName, setAttributeName] = useState('')

    const clearFields = () => {
        setAttributeName('')
        setValues([])
        setEditId(null)
    }

    const handleRemoveValues=(value,index)=>{
     
        setValues(prev=>prev.filter(v=>v !== value))
    }


    const createAttribute = () => {
        let data = {
            name: attributeName,
            values
        }
        axios.post('/attribute/create', data)
            .then(res => {
                setAttributes(prev => [...prev, res.data.attribute]);
                clearFields()
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    const getAttributes = () => {
        axios.get('/attribute/get')
            .then(res => {
                setAttributes(res.data.attributes)
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }
    const deleteAttribute = (id) => {
        axios.delete(`/attribute/delete/${id}`)
            .then(res => {
                getAttributes()
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    const setEditAttr = (attr) => {

        setEditId(attr._id)
        setAttributeName(attr.name)
        setValues(attr.values)
        
    }

    const updateAttribute = () => {
        let data = {
            name: attributeName,
            values
        }
        axios.patch(`/attribute/update/${editId}`, data)
            .then(res => {
                if (res.data.success) {
                    let attrArray = [...attributes]
                    let index = attrArray.findIndex(a => a._id === res.data.attribute._id)
                    attrArray[index] = res.data.attribute
                    setAttributes(attrArray)
                    clearFields()
                }
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    useEffect(() => {
        getAttributes()
    }, [])






    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Values',
            key: 'values',
            dataIndex: 'values',
            render: values => (
                <>
                    {
                        values.map((value, index) => {
                            return (
                                <Tag key={index} color="green">{value}</Tag>
                            )
                        })

                    }
                </>
            ),
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => setEditAttr(record)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteAttribute(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];
    return (
        <div className='attributes'>
            <Row gutter={16}>
                <Col className="gutter-row" lg={14} md={24} sm={24}>
                    <Card style={{ marginTop: "15px" }} title="Attributes" >
                        <Table columns={columns} dataSource={attributes} />
                    </Card>
                </Col>
                <Col className="gutter-row" lg={10} md={24} sm={24}>

                    <Card style={{ marginTop: "15px" }} title={editId ? "Update Attribute" : "Create Attribute"} >
                        <div className='attribute_wrapper'>
                            <div className='input_item'>
                                <label>Attribute name <span className='required'>*</span></label>
                                <Input
                                    value={attributeName}
                                    onChange={(e) => setAttributeName(e.target.value)}
                                    type="text"
                                    placeholder='Enter attribute name'>
                                </Input>

                            </div>

                            <div className='input_item'>
                                <label>Attribute values <span className='required'>*</span></label>

                                <ChipInput
                                alwaysShowPlaceholde={true}
                                placeholder="Provide values and hit enter"
                                    value={values}
                                    onAdd={(chip) => setValues(prev=>[...prev,chip])}
                                    onDelete={(chip, index) => handleRemoveValues(chip, index)}
                                    variant='outlined'
                                    
                                    fullWidth={true}
                                />
                            </div>

                            {/* <div className='input_item'>
                                <label>Active <span className='required'>*</span></label>
                                <Switch checked={status} onChange={(checked)=>setStatus(checked)} />

                            </div> */}
                            {
                                editId ? <>
                                    <Button onClick={() => updateAttribute()} className='submit_btn' type="primary">Update</Button>
                                    <Button onClick={() => clearFields()} className='submit_btn' type="primary" danger>Cancel</Button>
                                </> :
                                    <Button onClick={() => createAttribute()} className='submit_btn' type="primary">Create</Button>
                            }

                        </div>
                    </Card>

                </Col>
            </Row>
        </div>
    )
}

export default Attributes

