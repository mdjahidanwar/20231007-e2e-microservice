import React, { useState ,useEffect} from 'react'
import { Card, Button } from 'antd'
import { CSVLink } from "react-csv";
import axios from 'axios'

import "./bulk.scss"


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
function BulkExport() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get("/product/downloadbulk")
        .then((res) => {
            setProducts(res.data.products)
       })
       .catch(err=>{
           console.log(err);
           alert('Something went wrong');
       })
    }, [])
    return (
        <Card title="Download product csv">
            <div className="bulk_info">
                <li>1. Attributes and variations will not be added with csv file</li>
                <li>2. All products will be simple products.</li>
            </div>
            <div style={{ marginTop: "15px" }}>
                <CSVLink
                    data={products}
                    headers={headers}
                    asyncOnClick={true}
                    onClick={(event, done) => {
                        products.length>0?done()
                        :done(false) 
                    }}
                >
                    <Button disabled={products.length===0} type="primary">Download products CSV</Button>
                </CSVLink>
            </div>
        </Card>
    )
}

export default BulkExport
