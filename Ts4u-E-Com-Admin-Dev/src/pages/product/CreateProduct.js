import React, { useState, useEffect } from 'react'
import { Card, Form, Input, TreeSelect, Select, Switch, Button, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import "./product.scss"
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill'
import axios from 'axios'
import {useSelector} from 'react-redux'
import MediaLibrary from '../../components/MediaLibrary';

const { TreeNode } = TreeSelect;
const { Option } = Select;











function CreateProduct() {
    const {categories,brands} = useSelector(state => state.data)
    const [display, setDisplay] = useState(false)
    const [imageFor, setImageFor] = useState("thumbnail")

    const [errors, setErrors] = useState([])

    //-----product information---------
    const [name, setName] = useState('')
    //const [brands, setBrands] = useState([])
    const [brand, setBrand] = useState('')
    const [unit, setUnit] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')

    const [productType, setProductType] = useState('simple')

    //categories
    //const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [subSubCategory, setSubSubCategory] = useState('')

    //images
    const [thumbnail, setThumbnail] = useState('')
    const [gallery, setGallery] = useState([])

    //attributes
    const [attributes, setAttributes] = useState([])
    const [selectedAttr, setSelectedAttr] = useState([])
    const [selectedAttrVal, setSelectedAttrVal] = useState([])



    //price
    const [price, setPrice] = useState()
    const [discount, setDiscount] = useState(0)
    const [discountType, setDiscountType] = useState('flat')
    const [tax, setTax] = useState(0)
    const [taxType, setTaxType] = useState('flat')

    //stock
    const [stock, setStock] = useState('50')
    const [sku, setSku] = useState('')


    //variations

    const [variations, setVariations] = useState([])


    //description
    const [description, setDescription] = useState('')

    //shipping
    const [freeShipping, setFreeShipping] = useState(true)
    const [cost, setCost] = useState(0)

    //meta
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')
    const [metaImage, setMetaImage] = useState('')



    //fetch data
 

    const fetchAttributes = () => {
        axios.get('attribute/get')
            .then(res => {
                setAttributes(res.data.attributes)
            })
            .catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {
        fetchAttributes()
    }, [])


    //product type

    const handleChangeProductType = (value) => {
        if (value === 'simple') {
            setSelectedAttr([])
            setSelectedAttrVal([])
            setVariations([])
        }
        setProductType(value)
    }

    //category actions
    useEffect(() => {
        if (category) {
            let filterd = categories.filter(cat => cat._id === category)
            setSubCategories(filterd[0]?.children)
            setSubCategory('')
            setSubSubCategory('')
        } else {
            setSubCategories([])
            setSubCategory('')
            setSubSubCategory('')

        }
    }, [category])


    const handleSetSub = (value) => {
        //console.log(value);
        let values = value.split("@@@")
        if (values.length === 1) {
            //console.log(values[0]);
            setSubCategory(values[0])
        } else if (values.length === 2) {
            setSubCategory(values[0])
            setSubSubCategory(values[1])
        }
    }





    //tags action
    const handleKeyPressTag = (e) => {

        if (e.charCode === 13 || e.charCode === 44) {
            setTags(prev => [...prev, tagInput.replace(',', "")])
            //console.log(tagInput);
            setTagInput('')
        }
    }

    const handleRemoveTag = (tname) => {
        let filtered = tags.filter(t => t !== tname)
        setTags(filtered)
    }


    //----------------attributes--------------------
    const handleChangeAttr = (value) => {
        let filtered = attributes.filter(a => a._id === value)[0]
        setSelectedAttr(prev => [...prev, filtered])
    }
    const handleRemoveAttr = (value) => {

        let filtered = selectedAttr.filter(a => a._id !== value)
        let selected = selectedAttr.filter(a => a._id === value)[0]
        setSelectedAttr(filtered)
        //console.log(selected.name);

        let attrval = [...selectedAttrVal]
        let index = attrval.findIndex(v => v.name === selected.name)
        attrval.splice(index, 1)
        setSelectedAttrVal(attrval)

    }


    //----------------variation-------------------------
    const handleChangeAttrValue = (value) => {

        let newArry = [...selectedAttrVal]
        let index = newArry.findIndex(val => val.name === value.split("@@@")[1])


        if (index === -1) {
            setSelectedAttrVal([...selectedAttrVal, { name: value.split("@@@")[1], values: [value.split("@@@")[0]] }])
        } else {
            let newVal = [...newArry[index].values, value.split("@@@")[0]]
            newArry[index] = { name: value.split("@@@")[1], values: newVal }
            setSelectedAttrVal(newArry)
        }
    }

    const handleRemoveAttrValue = (value) => {

        let newArry = [...selectedAttrVal]
        let index = newArry.findIndex(val => val.name === value.split("@@@")[1])

        if (index === -1) return
        let selected = newArry[index]

        let newVal = selected.values.filter(v => v !== value.split("@@@")[0])


        if (newVal.length === 0) {

            newArry.splice(index, 1)
            setSelectedAttrVal(newArry)
        } else {
            newArry[index] = { name: value.split("@@@")[1], values: newVal }
            setSelectedAttrVal(newArry)
        }


    }




    useEffect(() => {
        if (selectedAttrVal.length < 1) {
            setVariations([])
            return
        }

        var allArraysObj = {}
        selectedAttrVal.map(a => {
            allArraysObj = { ...allArraysObj, [a.name]: a.values }
        })


        let getProducts = (arrays) => {
            if (arrays.length === 0) {
                return [[]];
            }

            let results = [];

            getProducts(arrays.slice(1)).forEach((product) => {
                arrays[0].forEach((value) => {
                    results.push([value].concat(product));
                });
            });

            return results;
        };

        let getAllCombinations = (attributes) => {

            let attributeNames = Object.keys(attributes);

            let attributeValues = attributeNames.map((name) => attributes[name]);

            return getProducts(attributeValues).map((product, index) => {
                let val = []
                let obj = { stock: 0, image: "", price: 0, discount: 0, discountType: "flat", isDefault: false };
                attributeNames.forEach((name, i) => {
                    obj[name] = product[i];
                    val.push(product[i]);


                });
                if (index === 0) {
                    obj['isDefault'] = true
                }
                obj["varname"] = (val.join("--"));
                return obj;
            });
        };
        //console.log(getAllCombinations(allArraysObj));
        setVariations(getAllCombinations(allArraysObj));
    }, [selectedAttrVal, selectedAttr])

    useEffect(() => {
        if (!variations) return

        var sum = variations.reduce(function (a, b) {
            return parseInt(a) + parseInt(b.stock);
        }, 0);
        setStock(sum);
    }, [variations])

    const handleVariantInput = (varname, type, value, isDefault) => {
        if (isDefault) {
            if (type === 'price') {
                setPrice(value)
            } else if (type === 'discount') {
                setDiscount(value)
            } else if (type === 'discountType') {
                setDiscountType(value)
            }
        }
        let filtered = variations.findIndex(v => v.varname === varname)
        let arr = [...variations]
        arr[filtered] = { ...arr[filtered], [type]: value }
        setVariations(arr)
    }

    const handleVariandDefault = (variant, value) => {
        if (value) {
            setPrice(variant.price)
            setDiscount(variant.discount)
            setDiscountType(variant.discountType)
            let arr = []
            variations && variations.map((variation, i) => {
                if (variation.varname === variant.varname) {
                    arr.push({ ...variation, isDefault: true, image: thumbnail })
                } else {
                    arr.push({ ...variation, isDefault: false })
                }
            });

            setVariations(arr)
        } else {
            alert('Select another')
        }

    }


useEffect(() => {
    if(freeShipping){
        setCost(0)
    }
}, [freeShipping])



    const saveProduct = () => {
        let data = {
            name,
            categories: [],
            brand,
            unit,
            tags,
            thumbnail,
            gallery,
            attributes: selectedAttrVal,
            variations: variations || [],
            productType,
            price,
            discount: {
                discountType,
                value: discount
            },
            tax: {
                taxType,
                value: discount
            },
            sku,
            stock,
            description,
            shipping: {
                isFree: freeShipping,
                cost
            },
            meta: {
                title: metaTitle,
                description: metaDescription,
                image: metaImage
            }
        }

        if (category) {
            data.categories.push({ level: 1, category })
        }
        if (subCategory) {
            data.categories.push({ level: 2, category: subCategory })
        }
        if (subSubCategory) {
            data.categories.push({ level: 3, category: subSubCategory })
        }

        if (!category) {
            setErrors({ category: "Please select a category" })
        }

        //console.log(data);

        axios.post('/product/create', data)
            .then(res => {
                alert("product created successfully");
                setErrors([])
            })
            .catch(err => {
                window.scrollTo({
                    top: 100,

                    behavior: 'smooth'
                });
                err && err.response && setErrors(err.response.data)
            })
    }

    const handleImageselect = (item) => {
        if (imageFor === 'thumbnail') {
            setThumbnail(item.thumbnailUrl);
           
        }
        if (imageFor === 'gallery') {
            setGallery(prev => [...prev, item.thumbnailUrl]);
        }
        if (imageFor === 'meta') {
            setMetaImage(item.thumbnailUrl);
        }
        if (imageFor.startsWith('variant@@@')) {
            let varname = imageFor.replace("variant@@@", "")
            handleVariantInput(varname, 'image', item.thumbnailUrl, false)
        }

        setDisplay(false)
    }







    return (
        <div className="product_create">
            <MediaLibrary display={display} onHide={() => setDisplay(false)} selectCallback={(item) => handleImageselect(item)} />
            <Card title="Product Information" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Product Name <span className='required'>*</span></label>
                        <div className='width_100'>
                            <Input className={errors && errors.name && 'error'} value={name} onChange={(e) => setName(e.target.value)} placeholder='Product name'></Input>
                            {errors && errors.name && <span className='error_text'>{errors.name}</span>}


                        </div>

                    </div>

                    {/* -------------------categories-------------- */}
                    <div className='input_item'>
                        <label>Category <span className='required'>*</span></label>
                        <div className='width_100'>
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select a category"
                                optionFilterProp="children"
                                onChange={(value) => setCategory(value)}
                                value={category}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    categories.length > 0 && categories.map((cat, index) => {
                                        return (
                                            <Option key={index} value={cat._id}>{cat.name}</Option>
                                        )

                                    })
                                }


                            </Select>
                            {errors && errors.category && <span className='error_text'>{errors.category}</span>}




                        </div>
                    </div>


                    {/*---------------- sub categories---------- */}
                    {
                        subCategories.length > 0 &&
                        <div className='input_item'>
                            <label>Sub Category <span className='required'>*</span></label>
                            <div className='width_100'>
                                <TreeSelect

                                    style={{ width: '100%' }}
                                    value={subSubCategory ? subCategory + "@@@" + subSubCategory : subCategory}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select a category"
                                    allowClear
                                    treeDefaultExpandAll
                                    onChange={(value) => handleSetSub(value)}
                                >

                                    {
                                        subCategories.length > 0 && subCategories.map((cat, index) => {
                                            return (
                                                <TreeNode key={cat._id} value={cat._id} title={cat.name}>
                                                    {
                                                        cat.children.length > 0 && cat.children.map((sub, index2) => {
                                                            return (
                                                                <TreeNode key={cat._id + "@@@" + sub._id} value={cat._id + "@@@" + sub._id} title={sub.name}>

                                                                </TreeNode>
                                                            )
                                                        })
                                                    }
                                                </TreeNode>
                                            )
                                        })
                                    }

                                </TreeSelect>
                                {errors && errors.category && <span className='error_text'>{errors.category}</span>}
                            </div>
                        </div>
                    }




                    <div className='input_item'>
                        <label>Brand </label>
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Select a Brand"
                            optionFilterProp="children"
                            onChange={(value) => setBrand(value)}

                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                brands.length > 0 && brands.map((b, index) => {
                                    return (
                                        <Option key={index} value={b._id}>{b.name}</Option>
                                    )

                                })
                            }


                        </Select>,
                    </div>

                    <div className='input_item'>
                        <label>Unit <span className='required'>*</span></label>
                        <div className='width_100'>
                            <Input className={errors && errors.name && 'error'} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder='Unit (e.g. KG,Pc etc)'></Input>
                            {errors && errors.unit && <span className='error_text'>{errors.unit}</span>}
                        </div>

                    </div>
                    <div className='input_item'>
                        <label>Tags </label>
                        <div className='tag_fieled'>
                            {
                                tags?.map((tname, index) => {
                                    return (
                                        <span className='tag_item' key={index}>{tname} <span onClick={() => handleRemoveTag(tname)} className='remove'>X</span></span>
                                    )
                                })
                            }
                            <Input onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleKeyPressTag} type='text' value={tagInput} placeholder='Enter tag name and press enter'></Input>
                        </div>
                    </div>
                </div>
            </Card>

            {/* --------product images-------------- */}
            <Card style={{ marginTop: "15px" }} title="Product Images" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Thumbnail image <span className='required'>*</span></label>
                        <div style={{ width: "100%" }}>
                            <Button className='d_center'
                                onClick={() => {
                                    setImageFor("thumbnail")
                                    setDisplay(true)
                                }}
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size={"size"} >
                                Upload thumbnail
                            </Button>
                            <div >
                                {
                                    thumbnail && <div className='image_container'>

                                        <img src={thumbnail}></img>
                                    </div>
                                }


                            </div>
                            {errors && errors.thumbnail && <span className='error_text'>{errors.thumbnail}</span>}
                        </div>


                    </div>

                    <div className='input_item'>
                        <label>Gallery images </label>
                        <div style={{ width: "100%" }}>
                            <Button
                                className='d_center'
                                onClick={() => {
                                    setImageFor("gallery")
                                    setDisplay(true)
                                }}
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size={"size"} >
                                Upload Galary
                            </Button>
                            <div style={{ display: "flex" }}>
                                {
                                    gallery.map((g, index) => {
                                        return (
                                            <div key={index} className='image_container'>
                                                <span onClick={() => {
                                                    let array = [...gallery]
                                                    array.splice(index, 1)
                                                    setGallery(array)
                                                }}>X</span>
                                                <img src={g}></img>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>

                    </div>
                </div>

            </Card>


            {/* -------------product attributes----------------------- */}
            <Card style={{ marginTop: "15px" }} title="Product Variation" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Product Type </label>
                        <Select
                            style={{ width: "100%" }}
                            onChange={(value) => handleChangeProductType(value)}
                            value={productType}
                        >
                            <Option value='simple'>Simple Product</Option>
                            <Option value='variant'>Variant Product</Option>

                        </Select>
                    </div>

                    {
                        productType === 'variant' && <div className='input_item'>
                            <label>Attributes </label>
                            <Select
                                mode="multiple"
                                size="default"
                                placeholder="Please select"
                                onSelect={(value) => handleChangeAttr(value)}
                                style={{ width: '100%' }}
                                onDeselect={(value) => handleRemoveAttr(value)}
                            >
                                {
                                    attributes.map((attr, index) => {
                                        return (
                                            <Option value={attr._id} key={index}>{attr.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                    }


                    {
                        selectedAttr.map((attr, index) => {
                            return (
                                <div key={index} className='input_item'>
                                    <label>{attr.name} <span className='required'>*</span></label>
                                    <Select
                                        mode="multiple"
                                        size="default"
                                        placeholder="Please select"
                                        onSelect={(value) => handleChangeAttrValue(value)}
                                        onDeselect={(value) => handleRemoveAttrValue(value)}
                                        style={{ width: '100%' }}

                                    >
                                        {
                                            attr.values.map((val, index2) => {
                                                return (
                                                    <Option value={val + "@@@" + attr.name} key={index2}>{val}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            )
                        })
                    }
                </div>
            </Card>


            {/* --------product price-------------- */}
            <Card style={{ marginTop: "15px" }} title="Product price + stock" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Unit Price <span className='required'>*</span></label>
                        <div className='width_100'>
                            <Input disabled={productType === 'variant'} className={errors && errors.price && 'error'} value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Product price' type='number'></Input>
                            {errors && errors.price && <span className='error_text'>{errors.price}</span>}
                        </div>

                    </div>
                    <div className='input_item'>
                        <label>Discount </label>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Input disabled={productType === 'variant'} value={discount} onChange={(e) => setDiscount(e.target.value)} style={{ width: "60%" }} placeholder='Discount price' type='number'></Input>
                            <Select
                                style={{ width: "35%" }}
                                placeholder="Select discount type"
                                optionFilterProp="children"
                                onChange={(value) => setDiscountType(value)}
                                value={discountType}
                                disabled={productType === 'variant'}

                            >
                                <Option value="flat">Flat</Option>
                                <Option value="percent">Percent</Option>
                            </Select>
                        </div>

                    </div>
                    <div className='input_item'>
                        <label>Tax </label>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <Input onChange={(e) => setTax(e.target.value)} value={tax} style={{ width: "60%" }} placeholder='Tax value' type='number'></Input>
                            <Select
                                style={{ width: "35%" }}
                                placeholder="Select value type"
                                optionFilterProp="children"
                                onChange={(value) => setTaxType(value)}
                                value={taxType}


                            >
                                <Option value="flat">Flat</Option>
                                <Option value="percent">Percent</Option>
                            </Select>
                        </div>

                    </div>
                    <div className='input_item'>
                        <label>SKU </label>
                        <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder='Product SKU' type='text'></Input>
                    </div>
                    <div className='input_item'>
                        <label>Stock <span className='required'>*</span></label>
                        <Input disabled={productType === 'variant'} value={stock} onChange={(e) => setStock(e.target.value)} placeholder='Product stock' type='number'></Input>
                    </div>

                    {
                        variations && variations.length > 0 &&
                        <table className='variation_table'>
                            <tbody>
                            <tr>
                                <th>Variant</th>
                                <th>Variant Price</th>
                                <th>Discount</th>
                                <th>Discount Type</th>
                                <th>Stock</th>
                                <th>Set Default</th>
                                <th>Photo</th>
                            </tr>
                            {
                                variations && variations.map((variant, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <>
                                                    {
                                                        Object.keys(variant).map((keyName, i) => (
                                                            keyName === 'varname' || keyName === 'image' || keyName === 'price' || keyName === 'stock' || keyName === 'discount' || keyName === 'discountType' || keyName === "isDefault" ? "" :
                                                                <span key={i} >

                                                                    <span >{keyName} :</span>
                                                                    <strong style={{ margin: "0 5px", color: "#494A4A" }}>{variant[keyName]}</strong>,

                                                        </span>
                                                        ))
                                                    }

                                                </>
                                            </td>
                                            <td>
                                                <Input value={variant.price} onChange={(e) => handleVariantInput(variant.varname, 'price', e.target.value, variant.isDefault)} placeholder='Variant Price' type='number'></Input>
                                            </td>
                                            <td>
                                                <Input value={variant.discount} onChange={(e) => handleVariantInput(variant.varname, 'discount', e.target.value, variant.isDefault)} placeholder='Discount' type='number'></Input>
                                            </td>
                                            <td>
                                                <Select
                                                    style={{ width: "90%" }}
                                                    placeholder="Select discount type"
                                                    optionFilterProp="children"
                                                    onChange={(value) => handleVariantInput(variant.varname, 'discountType', value, variant.isDefault)}
                                                    value={variant.discountType}

                                                >
                                                    <Option value="flat">Flat</Option>
                                                    <Option value="percent">Percent</Option>
                                                </Select>
                                            </td>
                                            <td>
                                                <Input onBlur={(e) => { e.target.value === '' && handleVariantInput(variant.varname, 'stock', 0) }} value={variant.stock} onChange={(e) => handleVariantInput(variant.varname, 'stock', e.target.value)} placeholder='Variant Stock' type='number'></Input>
                                            </td>
                                            <td>
                                                <Switch style={{ width: "10px" }} checked={variant.isDefault} onChange={(c) => handleVariandDefault(variant, c)} />
                                            </td>
                                            <td>


                                                <Button
                                                    className='d_center'
                                                    onClick={() => {
                                                        setImageFor("variant@@@" + variant.varname)
                                                        setDisplay(true)
                                                    }}
                                                    type="primary"
                                                    shape="round"
                                                    icon={<UploadOutlined />}
                                                    size={"size"} >
                                                    Upload Image
                                                </Button>
                                                {
                                                    variant.image && <div style={{ display: "flex" }}>
                                                        <div key={index} className='image_container'>
                                                            <span onClick={() => handleVariantInput(variant.varname, 'image', "")}>X</span>
                                                            <img src={variant.image}></img>
                                                        </div>

                                                    </div>
                                                }


                                            </td>


                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    }

                </div>

            </Card>



            {/* --------product Description-------------- */}
            <Card style={{ marginTop: "15px" }} title="Product Description" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Description </label>
                        <ReactQuill
                            value={description}
                            onChange={(value) => setDescription(value)}
                            style={{ width: "100%", marginBottom: "20px" }}
                        />
                    </div>

                </div>

            </Card>


            {/* --------product shipping-------------- */}
            <Card style={{ marginTop: "15px" }} title="Product shipping cost" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Free shipping <span className='required'>*</span></label>
                        <Switch style={{ width: "10px" }} checked={freeShipping} onChange={(c) => setFreeShipping(c)} />
                    </div>
                    <div className='input_item'>
                        <label>Shipping cost </label>
                        <Input value={cost} onChange={(e)=>setCost(e.target.value)} disabled={freeShipping} placeholder='shipping cost' type='number' style={{ width: "20%" }}></Input>
                    </div>

                </div>

            </Card>


            {/* --------product meta-------------- */}
            <Card style={{ marginTop: "15px" }} title="SEO Meta Tags" >
                <div className='product_information'>
                    <div className='input_item'>
                        <label>Meta title </label>
                        <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} type='text' placeholder="product meta title"></Input>
                    </div>
                    <div className='input_item'>
                        <label>Meta description </label>
                        <Input.TextArea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} type='text' placeholder="product meta description"></Input.TextArea>
                    </div>
                    <div className='input_item'>
                        <label>Meta Image </label>
                        <div style={{ width: "100%" }}>
                            <Button
                                className='d_center'
                                onClick={() => {
                                    setImageFor("meta")
                                    setDisplay(true)
                                }}
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size={"size"} >
                                Upload meta image
                            </Button>
                            <div >
                                {
                                    metaImage && <div className='image_container'>
                                        <span onClick={() => setMetaImage('')}>X</span>
                                        <img src={metaImage}></img>
                                    </div>
                                }


                            </div>
                        </div>
                    </div>

                </div>

            </Card>


            <Button onClick={() => saveProduct()} size='large' style={{ float: "right", margin: "15px 0" }} type="primary">Save Product</Button>
        </div>
    )
}

export default CreateProduct
