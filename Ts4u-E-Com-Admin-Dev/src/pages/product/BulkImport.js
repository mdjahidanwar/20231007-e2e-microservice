import React, { useState, useEffect } from 'react'
import { Card, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'
import { CSVLink } from "react-csv";

import './bulk.scss'

const headers = [
    { label: "name *", key: "name" },
    { label: "thumbnail *", key: "thumbnail" },
    { label: "gallery", key: "gallery" },
    { label: "category *", key: "categories.category" },
    { label: "brand", key: "brand" },
    { label: "Price *", key: "price" },
    { label: "discount_type_(flat/percent)", key: "discount.discountType" },
    { label: "discount_value", key: "discount.value" },
    { label: "tax_type (flat/percent)", key: "tax.taxType" },
    { label: "tax_value", key: "tax.value" },
    { label: "unit *", key: "unit" },
    { label: "sku *", key: "sku" },
    { label: "stock *", key: "stock" },
    { label: "description", key: "description" },
    { label: "shipping_fee", key: "shipping.cost" },
    { label: "tags", key: "tags" },
    { label: "meta_title", key: "meta.title" },
    { label: "meta_description", key: "meta.description" },
    { label: "meta_image", key: "meta.image" },

];


const brandHeaders = [
    { label: "name *", key: "name" },
    { label: "ID *", key: "_id" },

];


const categoriesHeaders = [
    { label: "name *", key: "name" },
    { label: "ID *", key: "_id" },

];


function BulkImport() {
    const [csv, setCsv] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])



    const getBrands = () => {
        axios.get('/brand/downloadbulk')
            .then(res => {
                setBrands(res.data.brands);
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }

    const getCategories = () => {
        axios.get('/category/downloadbulk')
            .then(res => {
                setCategories(res.data.categories);
            })
            .catch(err => {
                err && err.response && alert(err.response.data.error)
            })
    }


    useEffect(() => {
        getBrands()
        getCategories()
    }, [])


    const handleSaveCsv = () => {
        setIsLoading(true)
        let formData = new FormData()
        formData.append('file', csv)
        axios.post('/product/bulkupload', formData)
            .then(res => {
                alert(`${res.data.count} products added`)
                setCsv(null)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                err && err.response && alert(err.response.data.error)
            })
    }


    return (
        <>
            <Card title="Product Bulk Upload ">
                <div className="bulk_info">
                    <strong>Step 1:</strong>
                    <li>1. Download the skeleton file and fill it with proper data.</li>
                    <li>2. You can download the example file to understand how the data must be filled.</li>
                    <li>3. Once you have downloaded and filled the skeleton file, upload it in the form below and submit.</li>
                    <li>4. After uploading products you need to edit them and set product's variations.</li>
                </div>
                <div style={{ marginTop: "15px" }}>
                    <CSVLink
                        data={[]}
                        headers={headers}
                    >
                        <Button type="primary">Download skeleton CSV</Button>
                    </CSVLink>
                </div>
                <div className="bulk_info">
                    <strong>Step 2:</strong>
                    <li>1. Category and Brand should be in id.</li>
                    <li>2. You can download the JSON to get Category and Brand id.</li>
                </div>
                <div style={{ marginTop: "15px" }}>


                    <CSVLink
                        data={categories}
                        headers={categoriesHeaders}
                        asyncOnClick={true}
                        onClick={(event, done) => {
                            categories.length > 0 ? done()
                                : done(false)
                        }}
                    >
                        <Button disabled={categories.length===0} type="primary" style={{ marginRight: "20px" }}>Download Category</Button>
                    </CSVLink>

                    <CSVLink
                        data={brands}
                        headers={brandHeaders}
                        asyncOnClick={true}
                        onClick={(event, done) => {
                            brands.length > 0 ? done()
                                : done(false)
                        }}
                    >
                    <Button disabled={brands.length===0} type="primary">Download Brand</Button>
                    </CSVLink>
                </div>
            </Card>
            <Card title="Upload file" style={{ marginTop: "20px" }}>
                <label class="file">
                    <input onChange={(e) => setCsv(e.target.files[0])} type="file" id="file" aria-label="Browse csv file" accept='.csv' />
                    <span class="file-custom">{csv && csv.name}</span>
                </label>
                <br></br>
                <Button  disabled={!csv} loading={isLoading} onClick={() => handleSaveCsv()} className='d-center' type="primary" icon={<UploadOutlined />} size={"size"} >Upload File </Button>
            </Card>
        </>
    )
}

export default BulkImport
