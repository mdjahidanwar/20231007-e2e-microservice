import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Table, Tag, Space, Image, Switch, Popconfirm } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import "./brand.scss"
import axios from 'axios'
import MediaLibrary from '../../components/MediaLibrary';
import { CSVLink } from "react-csv";
import {useSelector,useDispatch} from 'react-redux'


const headers = [
    { label: "name *", key: "name" },
    { label: "image", key: "image" },

];



function Brand() {
    const {brands,isBrandLoading} = useSelector(state => state.data)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)
    const [display, setDisplay] = useState(false)
    const [csv, setCsv] = useState(null)

    const [brandName, setBrandName] = useState('')
    const [brandImg, setBrandImg] = useState('')
    const [status, setStatus] = useState(true)

    const [editId, setEditId] = useState(null)


    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    //console.log(brands);


    const clearFields = () => {
        setBrandName('')
        setBrandImg('')
        setStatus(true)
        setEditId(null)
    }


    const createBrand = () => {
        let data = {
            name: brandName,
            image: brandImg,
            status
        }
        axios.post('/brand/create', data)
            .then(res => {
                dispatch({
                    type:"ADD_NEW_BRAND",
                    payload:res.data.brand
                })
                clearFields()
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    // const getBrands = () => {
    //     setIsLoading(true)
    //     axios.get('/brand/get')
    //         .then(res => {
    //             setIsLoading(false)
    //             setBrands(res.data.brands)
    //         })
    //         .catch(err => {
    //             setIsLoading(false)
    //             err && err.response && console.log(err.response.data)
    //         })
    // }
    const deleteBrand = (id) => {
        axios.delete(`/brand/delete/${id}`)
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type:"DELETE_BRAND",
                        payload:id
                    })
                }
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    const setEditBrand = (brand) => {

        setEditId(brand._id)
        setBrandName(brand.name)
        setBrandImg(brand.image)
        setStatus(brand.status)
    }

    const updateBrand = () => {
        let data = {
            name: brandName,
            image: brandImg,
            status
        }
        axios.patch(`/brand/update/${editId}`, data)
            .then(res => {
                if (res.data.success) {
                    dispatch({
                        type:"UPDATE_BRAND",
                        payload:res.data.brand
                    })
                    clearFields()
                }
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }
    //console.log(brands);


    let join = async (updated) => {
        let array = [...brands]
        updated.map(u => {
            let index = array.findIndex(arr => arr._id === u._id)
            array[index] = u
        })
        return array
    }


    const bulkEdit = (value) => {
        setIsLoading(true)
        let data = {
            ids: selectedRowKeys,
            status: value
        }
        axios.patch("/brand/bulkedit", data)
            .then(async (res) => {

                let updated = res.data.brands
                let newBrands = await join(updated)
                dispatch({
                    type:"SET_BRANDS",
                    payload:newBrands
                })
                setSelectedRowKeys([])
                setSelectedRows([])
                setIsLoading(false)

            }).catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }

    let Filter = async (ids) => {
        let array = [...brands]
        ids.map(id => {
            array = array.filter(arr => arr._id !== id)
        })
        return array
    }

    const bulkDelete = () => {
        setIsLoading(true)
        let data = {
            ids: selectedRowKeys
        }

        axios.patch("/brand/bulkdelete", data)
            .then(async (res) => {

                let filtered = await Filter(selectedRowKeys)
                dispatch({
                    type:"SET_BRANDS",
                    payload:filtered
                })
                setSelectedRowKeys([])
                setSelectedRows([])
                setIsLoading(false)

            }).catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }



    const handleImageselect = (item) => {
        setBrandImg(item.thumbnailUrl);
        setDisplay(false)
    }




    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <>
                    {
                        status == true ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
                    }
                </>
            ),
        },
        {
            title: 'Image',
            key: 'image',
            dataIndex: 'image',
            render: image => <Image
                width={100}

                src={image}
                fallback="data:image/png;base64,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"
            />
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => setEditBrand(record)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteBrand(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];




    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };




    const handleSaveCsv = () => {
        setIsLoadingUpload(true)
        let formData = new FormData()
        formData.append('file', csv)
        axios.post('/brand/bulkupload', formData)
            .then(res => {
                alert(`${res.data.brands.length} brands added`)
                setCsv(null)
                dispatch({
                    type:"SET_BRANDS",
                    payload:[...brands,...res.data.brands]
                })
                setIsLoadingUpload(false)
            })
            .catch(err => {
                setIsLoadingUpload(false)
                err && err.response && alert(err.response.data.error)
            })
    }


    return (
        <div className='brand'>

            <MediaLibrary display={display} onHide={() => setDisplay(false)} selectCallback={(item) => handleImageselect(item)} />
            <Row gutter={16}>
                <Col className="gutter-row" lg={14} md={24} sm={24}>
                    <Card style={{ marginTop: "15px" }} title="Brands" >

                        <Button style={{ marginRight: "10px" }} onClick={() => bulkEdit(true)} disabled={selectedRows.length === 0} type='primary'>Make Active</Button>
                        <Button style={{ marginRight: "10px" }} onClick={() => bulkEdit(false)} disabled={selectedRows.length === 0} type='primary'>Make Inactive</Button>
                        <Button onClick={() => bulkDelete()} disabled={selectedRows.length === 0} type='danger'>Deletes</Button>
                        {selectedRows.length > 0 && <strong style={{ marginLeft: "10px" }}>{selectedRows.length} Brands seleted</strong>}
                        <Table
                            rowKey="_id"
                            rowSelection={rowSelection}
                            loading={isLoading || isBrandLoading}
                            columns={columns}
                            dataSource={brands}
                            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true }}
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" lg={10} md={24} sm={24}>

                    <Card style={{ marginTop: "15px" }} title={editId ? "Update Brand" : "Create Brand"} >
                        <div className='brand_wrapper'>
                            <div className='input_item'>
                                <label>Brand name <span className='required'>*</span></label>
                                <Input
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    type="text"
                                    placeholder='Enter brand name'>
                                </Input>

                            </div>

                            <div className='input_item'>
                                <label>Brand image <span className='required'>*</span></label>
                                <div style={{ width: "100%" }}>
                                    <Button className='d-center' onClick={() => setDisplay(true)} type="primary" shape="round" icon={<UploadOutlined />} size={"size"} >Upload image </Button>


                                    {
                                        brandImg && <>
                                            <div className='image_container'>
                                                <span onClick={() => setBrandImg('')}>X</span>
                                                <img src={brandImg}></img>
                                            </div>
                                        </>
                                    }


                                </div>

                            </div>

                            <div className='input_item'>
                                <label>Active <span className='required'>*</span></label>
                                <Switch checked={status} onChange={(checked) => setStatus(checked)} />

                            </div>
                            {
                                editId ? <>
                                    <Button onClick={() => updateBrand()} className='submit_btn' type="primary">Update</Button>
                                    <Button onClick={() => clearFields()} className='submit_btn' type="primary" danger>Cancel</Button>
                                </> :
                                    <Button onClick={() => createBrand()} className='submit_btn' type="primary">Create</Button>
                            }

                        </div>
                    </Card>




                    <Card style={{ marginTop: "15px" }} title='Bulk export' >
                        <div className="bulk_info">
                            <li>1. Click the button to download all brands</li>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <CSVLink
                                data={brands}
                                headers={headers}
                                asyncOnClick={true}
                                onClick={(event, done) => {
                                    brands.length > 0 ? done()
                                        : done(false)
                                }}
                            >
                                <Button disabled={brands.length === 0} type="primary">Download brands CSV</Button>
                            </CSVLink>
                        </div>
                    </Card>




                    <Card title="Upload file" style={{ marginTop: "20px" }}>
                        <div className="bulk_info">
                            <strong>Step 1:</strong>
                            <li>1. Download the skeleton file and fill it with proper data.</li>
                            <li>2. You can download the example file to understand how the data must be filled.</li>
                            <li>3. Once you have downloaded and filled the skeleton file, upload it in the form below and submit.</li>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <CSVLink
                                data={[]}
                                headers={headers}
                            >
                                <Button type="primary">Download skeleton CSV</Button>
                            </CSVLink>
                        </div>
                        <label class="file" >
                            <input onChange={(e) => setCsv(e.target.files[0])} type="file" id="file" aria-label="Browse csv file" accept='.csv' />
                            <span class="file-custom">{csv && csv.name}</span>
                        </label>
                        <Button disabled={!csv} loading={isLoadingUpload} onClick={() => handleSaveCsv()} className='d-center' type="primary" icon={<UploadOutlined />} size={"size"} >Upload File </Button>
                    </Card>

                </Col>
            </Row>
        </div>
    )
}

export default Brand
