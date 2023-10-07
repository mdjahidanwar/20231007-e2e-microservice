import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'



import axios from 'axios'


import { Card, Button, Table, Space, Image, Switch, Popconfirm, Select } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

const { Option } = Select;

const ProductList = () => {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [products, setProducts] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const [selectedOption, setSelectedOption] = useState("")



    useEffect(() => {
        setIsLoading(true)
        axios.get('/product/getproductsall')
            .then(res => {
                setProducts(res.data.products)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err);
            })
    }, [])

    const deleteProduct=(id)=>{
        axios.delete(`/product/delete/${id}`)
        .then(res=>{
            setProducts(prev=>prev.filter(prod=>prod._id !== id))
        })
        .catch(err=>{
            console.log(err);
        })
    }

    // const handleSearch = e => {
    //     let target = e.target;
    //     setFilterFn({
    //         fn: items => {
    //             if (target.value == "")
    //                 return items;
    //             else
    //                 return items.filter(x => x.name.toLowerCase().includes(target.value))
    //         }
    //     })
    // }



    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };




    const columns = [

        {
            title: 'Product Image',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: thumbnail => <Image
                width={100}

                src={thumbnail}
                fallback="data:image/png;base64,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"
            />
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Num of Sale',
            dataIndex: 'sales',
            key: 'sales',
            sorter: (a, b) => a.sales - b.sales,
        },
        {
            title: 'Total Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            render: price =>
                <span>$ {price}</span>

        },
        {
            title: 'Discount',
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
            title: 'Published',
            key: 'isActive',
            dataIndex: 'isActive',
            //sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
            render: isActive => (
                <>
                    <Switch checked={isActive} onChange={null} />
                </>
            ),
            filters: [
                { text: 'Published', value:true },
                { text: 'Unpublished', value: false },
            ],
            onFilter: (value, record) => record.isActive === value
        },
        {
            title: 'Featured',
            key: 'isFeatured',
            dataIndex: 'isFeatured',
            //sorter: (a, b) => Number(a.isFeatured) - Number(b.isFeatured),
            render: isFeatured => (
                <>
                    <Switch checked={isFeatured} onChange={null} />
                </>
            ),
            filters: [
                { text: 'Featured', value:true },
                { text: 'Unfeatured', value: false },
            ],
            onFilter: (value, record) => record.isFeatured === value
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => history.push(`/product/edit/${record.slug}`)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteProduct(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];

    let join=async(updated)=>{
        let array = [...products]
        updated.map(u=>{
            let index = array.findIndex(arr=>arr._id === u._id)
            array[index] = u
        })
        return array
    }


    let Filter=async(ids)=>{
        let array = [...products]
        ids.map(id=>{
            array = array.filter(arr=>arr._id !==id)
        })
        return array
    }

    const bulkDelete=()=>{
        setIsLoadingButton(true)
        let data = {
            ids :selectedRowKeys
        }

        axios.patch("/product/bulkdelete",data)
        .then(async(res)=>{
          
           let filtered =await Filter(selectedRowKeys)
           setProducts(filtered)
           setSelectedRowKeys([])
           setSelectedRows([])
           setIsLoadingButton(false)
           
        }).catch(err=>{
            setIsLoadingButton(false)
            console.log(err);
        })
    }


    const bulkAction =async (option) => {
        if(option === 'delete'){
            return alert("You are in guest mode.So you can't perform this action")
            return bulkDelete()
        }


        setIsLoadingButton(true)

        let data = {
            ids :selectedRowKeys
        }
        if(option === "publish"){
            data["isActive"] = true
        }
        if(option === "unpublish"){
            data["isActive"] = false
        }
        if(option === "feature"){
            data["isFeatured"] = true
        }
        if(option === "unfeature"){
            data["isFeatured"] = false
        }
        axios.patch("/product/bulkedit",data)
        .then(async(res)=>{
          
           let updated = res.data.products
           let prod =await join(updated)
           setProducts(prod)
           setSelectedRowKeys([])
           setSelectedRows([])
           setIsLoadingButton(false)
           
        }).catch(err=>{
            setIsLoadingButton(false)
            console.log(err);
        })
    }


    return (
        <Card title="All Products">


            <Select disabled={selectedRows.length === 0} style={{ width: "180px" }} onChange={value => setSelectedOption(value)} placeholder='Select a action'>
                <Option value="publish">Make Publish</Option>
                <Option value="unpublish">Make Unpublish</Option>
                <Option value="feature">Make Featured</Option>
                <Option value="unfeature">Make Unfeatured</Option>
                <Option value="delete">Delete</Option>
            </Select>

            <Button loading={isLoadingButton} style={{ marginLeft: "10px" }} onClick={() => bulkAction(selectedOption)} disabled={selectedRows.length === 0 || selectedOption === ''} type='primary'>Bulk action</Button>

            {selectedRows.length > 0 && <strong style={{ marginLeft: "10px" }}>{selectedRows.length} Product seleted</strong>}




            <Table
                rowKey="_id"
                rowSelection={rowSelection}
                loading={isLoading}
                columns={columns}
                dataSource={products}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true }}
            />
        </Card>
    );
};

export default ProductList;

