import React, { useState, useEffect } from 'react'
import { Select, Col, Card, Input, Button, Table, Tag, Space, Image, Switch, Popconfirm, Modal, DatePicker } from 'antd';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import AddToCamp from './AddToCamp';
const { Option } = Select;



function Campaign() {
    let params = useParams()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [products, setProducts] = useState([])

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])


    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [brands, setBrands] = useState([])
    const [brand, setBrand] = useState('')

    const fetchCategories = () => {
        axios.get("/category/getcategory")
            .then(res => {
                setCategories(res.data.categories)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchBrands = () => {
        axios.get('/brand/get')
            .then(res => {
                // console.log(res.data.brands);
                setBrands(res.data.brands)
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    const fetchProducts = () => {
        axios.get('/campaign/getselectedproduct/' + params.campaignid)
            .then(res => {
                setProducts(res.data.products)
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }


    useEffect(() => {
        fetchCategories()
        fetchBrands()
        fetchProducts()
    }, [])

    //category actions
    useEffect(() => {
        if (category) {
            let filterd = categories.filter(cat => cat._id === category)
            setSubCategories(filterd[0]?.children)
            setSubCategory('')

        } else {
            setSubCategories([])
            setSubCategory('')

        }
    }, [category])


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const getValueDiscount = (_id) => {
        // console.log(_id);
        let campaigns = products.filter(prod => prod._id === _id)[0].campaigns

        let discount = campaigns.filter(camp => camp.campaign === params.campaignid)[0].discount
        return discount

    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Thumbnail',
            key: 'thumbnail',
            dataIndex: 'thumbnail',
            render: thumbnail => <Image
                width={30}
                src={thumbnail}
                fallback="data:image/png;base64,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"
            />
        },
        {
            title: 'price',
            dataIndex: 'price',
            key: 'price',
            render: price =>
                <span>$ {price}</span>

        },
        {
            title: 'Previous Discount',
            key: 'discount',
            dataIndex: 'discount',
            render: (discount) =>
                discount.value > 0 ?
                    discount.discountType === 'flat' ?
                        <span className="new-price">$ {discount.value}</span> :
                        <span className="new-price">{discount.value} %</span>
                    : <span>$ 0</span>
        },
        {
            title: 'Campaign Discount',
            dataIndex: '_id',
            key: '_id',
            render: _id =>
                <>
                    <Input
                        defaultValue={getValueDiscount(_id).value}
                        style={{ width: "50%", marginRight: "10px" }}
                        onChange={(e) => handleColumnValue(e.target.value, _id, "discountvalue")}
                        type='number'
                        disabled={!selectedRowKeys.includes(_id)}

                    >

                    </Input>
                    <Select
                        dropdownStyle={{ zIndex: "1111" }}
                        style={{ width: "45%" }}
                        placeholder="Select discount type"
                        onChange={(value) => handleColumnValue(value, _id, "discounttype")}
                        defaultValue={getValueDiscount(_id).discountType}
                        //value={discountType}
                        disabled={!selectedRowKeys.includes(_id)}

                    >
                        <Option value="flat">Flat</Option>
                        <Option value="percent">Percent</Option>
                    </Select>
                </>

        },
    ];



    const handleColumnValue = (value, _id, type) => {

        if (type === 'discountvalue') {
            let selected = [...selectedRows]
            let index = selected.findIndex(r => r._id === _id)
            selected[index] = { ...selected[index], campDiscountValue: value }
            setSelectedRows(selected)
        }
        if (type === 'discounttype') {
            let selected = [...selectedRows]
            let index = selected.findIndex(r => r._id === _id)
            selected[index] = { ...selected[index], campDiscountType: value }
            setSelectedRows(selected)
        }
    }


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };



    const updateToCamp = () => {
        let campaignId = params.campaignid
        selectedRows.map(rows => {
            let data = {
                campaignId: campaignId,
                productId: rows._id,
                value: rows.campDiscountValue,
                discountType: rows.campDiscountType
            }
            axios.patch(`/campaign/updateproducttocampaign`, data)
                .then(res => {
                    let array = [...products]
                    let index = array.findIndex(a=>a._id === res.data.product._id)
                    array[index] = res.data.product
                    setProducts(array)
                    setSelectedRows(prev => prev.filter(prod => prod._id !== res.data.product._id))
                    setSelectedRowKeys(prev => prev.filter(_id => _id !== res.data.product._id))
                })
                .catch(err => {
                    err && err.response && console.log(err.response.data)
                })
        })
    }


    const removeFromCamp = () => {
        let campaignId = params.campaignid
        selectedRows.map(rows => {
            let data = {
                campaignId: campaignId,
                productId: rows._id,
            }
            axios.patch(`/campaign/removeproductfromcampaign`, data)
                .then(res => {
                    setProducts(prev=>prev.filter(prod => prod._id !== res.data.product._id))
                    setSelectedRows(prev => prev.filter(prod => prod._id !== res.data.product._id))
                    setSelectedRowKeys(prev => prev.filter(_id => _id !== res.data.product._id))
                })
                .catch(err => {
                    err && err.response && console.log(err.response.data)
                })
        })
    }

    return (
        <div className='campaign'>
            <Button onClick={() => showModal()}>Add products</Button>
            <Card style={{ marginTop: "15px" }} title="Products" >
                <div className='campaign_wrapper'>

                    <Button style={{marginRight:"10px"}} onClick={() => updateToCamp()} disabled={selectedRows.length === 0} type='primary'>Update Products</Button>
                    <Button onClick={() => removeFromCamp()} disabled={selectedRows.length === 0} type='danger'>Remove Products</Button>
                    {selectedRows.length > 0 && <strong style={{ marginLeft: "10px" }}>{selectedRows.length} products seleted</strong>}
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={products}
                        rowKey="_id"

                    />
                </div>
            </Card>
            <AddToCamp
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                handleOk={handleOk}
                params={params}
                sendProduct={(prod)=>setProducts(prev=>[prod,...prev])}
            />

        </div>
    )
}

export default Campaign
