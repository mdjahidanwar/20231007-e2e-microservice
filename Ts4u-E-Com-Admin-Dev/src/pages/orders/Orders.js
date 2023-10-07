import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useHistory } from 'react-router-dom'
import { Card, Button, Table, Space, Input } from 'antd';
import { EyeOutlined } from '@ant-design/icons'
const Search = Input.Search;







function Orders() {
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(false)

    const [orders, setOrders] = useState([])
    const [records, setRecords] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])


    useEffect(() => {
        setIsLoading(true)
        axios.get("order/allorders")
            .then(res => {
                setOrders(res.data.orders);
                setRecords(res.data.orders);
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }, [])


    const handleSearch = val => {
       
                if (val == "")
                    setOrders(records);
                else
                setOrders(records.filter(x => x.invoice.includes(val)))
            
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {

            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };


    const columns = [
        {
            title: 'Invoice',
            dataIndex: 'invoice',
            key: 'invoice',
        },
        {
            title: 'Num of Products',
            dataIndex: 'items',
            key: 'items',
            sorter: (a, b) => a.items.length - b.items.length,
            render: items =>
                <span>{items.length}</span>
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            key: 'user',
            render: user =>
                <span>{user?.name}</span>
        },
        {
            title: 'Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: amount =>
                <span>$ {amount}</span>

        },
        {
            title: 'Delivery Status',
            key: 'orderStatus',
            dataIndex: 'orderStatus',
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Processing', value: 'processing' },
                { text: 'Packed', value: 'packed' },
                { text: 'Shipped', value: 'shipped' },
                { text: 'Delivered', value: 'delivered' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.orderStatus.includes(value)
        },
        {
            title: 'Payment Status',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            filters: [
                { text: 'Unpaid', value: 'unpaid' },
                { text: 'Paid', value: 'paid' },
                { text: 'COD', value: 'cod' },
                { text: 'Partial', value: 'partial' },
                { text: 'Refund Requested', value: 'refundRequested' },
                { text: 'Refunded', value: 'refunded' },
            ],
            onFilter: (value, record) => record.paymentStatus.includes(value) && record.paymentStatus === value && record.paymentStatus.includes(value)
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => history.push(`/order/details/${record.invoice}`)} className='d-center' type='primary' icon={<EyeOutlined />}></Button>

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card title="All Orders">



                <Search
                    placeholder="Enter Invoice"
                    onSearch={handleSearch}
                    style={{ width: 200 }}
                />
                <Table
                    rowKey="_id"
                    //rowSelection={rowSelection}
                    loading={isLoading}
                    columns={columns}
                    dataSource={orders}
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true }}
                />
            </Card>
        </div>
    )
}

export default Orders
