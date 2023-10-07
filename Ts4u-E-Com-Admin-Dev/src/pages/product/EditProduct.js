import React, { useState, useEffect } from 'react'
import { Router, useParams,useHistory } from 'react-router-dom'
import { Card, Form, Input, TreeSelect, Select, Switch, Button, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import "./product.scss"
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill'
import axios from 'axios'
import { useSelector } from 'react-redux'
import MediaLibrary from '../../components/MediaLibrary';
 
const { TreeNode } = TreeSelect;
const { Option } = Select;




function EditProduct() {
    const params = useParams()
    const history = useHistory()
    const { categories, brands, isCategoryLoading, isBrandLoading } = useSelector(state => state.data)
    const [loading, setLoading] = useState(true)

    const [isVarValueChanged, setIsVarValueChanged] = useState(false)


    const [display, setDisplay] = useState(false)
    const [imageFor, setImageFor] = useState("thumbnail")

    const [errors, setErrors] = useState([])

    const [editId, setEditId] = useState('')
    const [product, setProduct] = useState(null)

    //-----product information---------
    const [name, setName] = useState('')
    // const [brands, setBrands] = useState([])
    const [brand, setBrand] = useState('')
    const [unit, setUnit] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')

    const [productType, setProductType] = useState('simple')

    //categories
    // const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [category, setCategory] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [subSubCategory, setSubSubCategory] = useState('')
    const [subSubCategories, setSubSubCategories] = useState([])
    //console.log(category,subCategory,subSubCategory);

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


    const fetchAttributes = async () => {
        axios.get('attribute/get')
            .then(res => {
                setAttributes(res.data.attributes)

            })
            .catch(err => {
                console.log(err);
            })
    }


    useEffect(() => {
        if (variations && productType !=='simple'){
            var sum = variations.reduce(function (a, b) {
                return parseInt(a) + parseInt(b.stock);
            }, 0);
            setStock(sum);
        }

        
    }, [variations])

    const setProductValue = (product) => {
        setName(product.name)
        setUnit(product.unit)
        setTags(product.tags)
        setThumbnail(product.thumbnail)
        setGallery(product.gallery)
        setPrice(product.price)
        setDiscount(product.discount.value)
        setDiscountType(product.discount.discountType)
        setTax(product.tax.value)
        setTaxType(product.tax.taxType)
        setSku(product.sku)
        setDescription(product.description)
        setFreeShipping(product.shipping.isFree)
        setCost(product.shipping.cost)
        setMetaTitle(product.meta.title)
        setMetaDescription(product.meta.description)
        setMetaImage(product.meta.image)
        setBrand(product.brand?._id || '')
        setProductType(product.productType)
        setStock(product.stock)

        let pcategory = product.categories.filter(cat => cat.level == 1)[0]?.category || null
        let psubCategory = product.categories.filter(cat => cat.level == 2)[0]?.category || null
        let psubSubCategory = product.categories.filter(cat => cat.level == 3)[0]?.category || null

        setCategory(pcategory)
        let filterdsub = categories.filter(cat => cat._id === pcategory)
            setSubCategories(filterdsub[0]?.children)
        if (psubCategory) {
            


            let filterdsubsub = filterdsub[0]?.children.filter(cat => cat._id === psubCategory)
            setSubSubCategories(filterdsubsub[0]?.children)

        }



        psubCategory && setSubCategory(psubCategory)
        psubSubCategory && setSubSubCategory(psubSubCategory)

        let selected = []
        if (attributes.length) {
            product.attributes.map(attr => {
                selected.push(attributes.filter(a => a.name === attr.name)[0])
                //setSelectedAttr(prev=>[...prev, attributes.filter(a=>a.name === attr.name)[0]])

            })
        }


        setSelectedAttr(selected)
        setSelectedAttrVal(product.attributes)
        setVariations(product.variations)
        setLoading(false)
    }




    const fetchProduct = () => {
        //console.log(params.productslug);
        axios.get(`/product/details/${params.productslug}`)
            .then(res => {
                setEditId(res.data.product._id);
                setProduct(res.data.product);
            })
            .catch(err=>{
                history.push('/product/productlist')
            })
    }

    useEffect(() => {
        if (product && categories.length > 0) {
            setProductValue(product)
        }
    }, [product, categories, attributes])

    useEffect(() => {
        if (params) {
            fetchProduct()
        }
    }, [params])

    useEffect(() => {
        (async function () {
            setLoading(true)
            await fetchAttributes()

        })();


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


    const handleChangeCategory=(value)=>{
        setCategory(value)
        let filterd = categories.filter(cat => cat._id === value)
        setSubCategories(filterd[0]?.children)
        setSubSubCategories([])
        setSubCategory('')
        setSubSubCategory('')
    }

    const handleChangeSubCategory=(value)=>{
        setSubCategory(value)
        let filterdMain = categories.filter(cat => cat._id === category)
        let filterdSub = filterdMain[0]?.children.filter(cat => cat._id === value)[0]
        if(filterdSub?.children){
            setSubSubCategories(filterdSub?.children)
        }
        setSubSubCategory('')
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
        setIsVarValueChanged(true)
        let filtered = attributes.filter(a => a._id === value)[0]
        setSelectedAttr(prev => [...prev, filtered])

    }
    const handleRemoveAttr = (value) => {
        setIsVarValueChanged(true)
        let filtered = selectedAttr.filter(a => a._id !== value)
        let selected = selectedAttr.filter(a => a._id === value)[0]
        setSelectedAttr(filtered)


        let attrval = [...selectedAttrVal]
        let index = attrval.findIndex(v => v.name === selected.name)
        attrval.splice(index, 1)
        setSelectedAttrVal(attrval)

    }
    //console.log(selectedAttr);

    //----------------variation-------------------------
    const handleChangeAttrValue = (value) => {

        let newArry = [...selectedAttrVal]
        let index = newArry.findIndex(val => val.name === value.split("@@@")[1])


        if (index === -1) {
            setSelectedAttrVal([...selectedAttrVal, { name: value.split("@@@")[1], values: [value.split("@@@")[0]] }])
            setIsVarValueChanged(true)
        } else {
            let newVal = [...newArry[index].values, value.split("@@@")[0]]
            newArry[index] = { name: value.split("@@@")[1], values: newVal }
            setSelectedAttrVal(newArry)
            setIsVarValueChanged(true)
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
            setIsVarValueChanged(true)
        } else {
            newArry[index] = { name: value.split("@@@")[1], values: newVal }
            setSelectedAttrVal(newArry)
            setIsVarValueChanged(true)
        }


    }





    useEffect(() => {
        if (!isVarValueChanged) return
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
            variations,
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
        // return console.log(data.categories);
        axios.patch(`/product/edit/${editId}`, data)
            .then(res => {
                alert("product updated successfully");
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



    const productForm = () => (
        <>
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
                                onChange={(value) => handleChangeCategory(value)}
                                value={category}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    categories?.length > 0 && categories.map((cat, index) => {
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
                        subCategories?.length > 0 &&
                        <div className='input_item'>
                            <label>Sub Category <span className='required'>*</span></label>
                            <div className='width_100'>
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select a sub category"
                                    optionFilterProp="children"
                                    onChange={(value) =>handleChangeSubCategory(value)}
                                    value={subCategory}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        subCategories?.length > 0 && subCategories.map((cat, index) => {
                                            return (
                                                <Option key={index} value={cat._id}>{cat.name}</Option>
                                            )

                                        })
                                    }


                                </Select>

                                {errors && errors.category && <span className='error_text'>{errors.category}</span>}
                            </div>
                        </div>
                    }


                    {/*---------------- sub sub categories---------- */}
                    {
                        subSubCategories?.length > 0 &&
                        <div className='input_item'>
                            <label>Nested Sub Category <span className='required'>*</span></label>
                            <div className='width_100'>
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="Please select a sub category"
                                    optionFilterProp="children"
                                    onChange={(value) =>setSubSubCategory(value)}
                                    value={subSubCategory}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        subSubCategories?.length > 0 && subSubCategories.map((cat, index) => {
                                            return (
                                                <Option key={index} value={cat._id}>{cat.name}</Option>
                                            )

                                        })
                                    }


                                </Select>
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
                            value={brand}
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
                            <Button
                                className='d_center'
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
                                value={selectedAttr?.map(at => at?._id)}
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
                        selectedAttr.length > 0 &&
                        selectedAttr.map((attr, index) => {
                            return (
                                <div key={index} className='input_item'>
                                    <label>{attr?.name} <span className='required'>*</span></label>
                                    <Select
                                        mode="multiple"
                                        size="default"
                                        placeholder="Please select"
                                        onSelect={(value) => handleChangeAttrValue(value)}
                                        onDeselect={(value) => handleRemoveAttrValue(value)}
                                        style={{ width: '100%' }}
                                        value={selectedAttrVal && selectedAttrVal?.filter(selected => selected?.name === attr?.name)[0]?.values.map(val => val + "@@@" + attr.name)}

                                    >
                                        {
                                            attr.values.map((val, index) => {
                                                return (
                                                    <Option value={val + "@@@" + attr.name} key={index}>{val}</Option>
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
                        <div className='width_100'>
                            <Input className={errors && errors.sku && 'error'} value={sku} onChange={(e) => setSku(e.target.value)} placeholder='Product SKU' type='text'></Input>
                            {errors && errors.sku && <span className='error_text'>{errors.sku}</span>}
                        </div>
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
                        <label>Shipping cost  </label>
                        <Input value={cost} onChange={(e) => setCost(cost)} disabled={freeShipping} placeholder='shipping cost' type='number' style={{ width: "20%" }}></Input>
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


            <Button onClick={() => saveProduct()} size='large' style={{ float: "right", margin: "15px 0" }} type="primary">Edit Product</Button>
        </>
    )

    return (
        <div className="product_create">
            <MediaLibrary display={display} onHide={() => setDisplay(false)} selectCallback={(item) => handleImageselect(item)} />
            {
                isCategoryLoading || isBrandLoading || loading ? "Loading" : productForm()
            }
        </div>
    )
}

export default EditProduct
