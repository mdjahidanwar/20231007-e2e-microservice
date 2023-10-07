import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag, Select,Button } from 'antd';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import axios from 'axios'
import moment from 'moment'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import './orderdetails.scss'
import CloseIcon from '@material-ui/icons/Close';
const { Option } = Select;
function getSteps() {
    return ['Pending', 'Processing', "Shipped", "delivered"];
}
function reverse(array){
    return array.map((item,idx) => array[array.length-1-idx])
  }

function OrderDetails() {
    const params = useParams()

    const [showEdit, setShowEdit] = useState(false)
    const [order, setOrder] = useState(null)
    const [activeStep, setActiveStep] = useState(0);

    const [paymentStatus, setPaymentStatus] = useState("")
    const [orderStatus, setOrderStatus] = useState("")

    const steps = getSteps();

    const setStep=(orderStatus)=>{
        if(orderStatus === "pending"){
            setActiveStep(0)
        }
        if(orderStatus === "processing"){
            setActiveStep(1)
        }
        if(orderStatus === "shipped"){
            setActiveStep(2)
        }
        if(orderStatus === "delivered"){
            setActiveStep(3)
        }
    }
    useEffect(() => {
        if (params.invoice) {
            axios.get(`/order/single/${params.invoice}`)
                .then(res => {
                    setOrder(res.data.order)
                    setPaymentStatus(res.data.order.paymentStatus);
                    setOrderStatus(res.data.order.orderStatus);
                    setStep(res.data.order.orderStatus)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [params])



    const handleChangeOrderStatus=(e)=>{
        if(!showEdit){
            setShowEdit(true)
        }
     
        setOrderStatus(e)
    }
    const handleChangePaymentStatus=(e)=>{
        if(!showEdit){
            setShowEdit(true)
        }
        setPaymentStatus(e)
    }

    const cancleShow=()=>{
        setPaymentStatus(order.paymentStatus)
        setOrderStatus(order.orderStatus)
    
        setShowEdit(false)
    }

    const updateStatus=()=>{
        let data ={}
        if(order.orderStatus !== orderStatus){
            data.orderStatus = orderStatus
        }
        if(order.paymentStatus !== paymentStatus){
            data.paymentStatus = paymentStatus
        }

        axios.patch(`/order/update/${order.invoice}`,data)
        .then(res=>{
            setOrder(res.data.order)
            setPaymentStatus(res.data.order.paymentStatus);
            setOrderStatus(res.data.order.orderStatus);
            setStep(res.data.order.orderStatus)
            setShowEdit(false)
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <div id="orderdetails">

            <div className="details">
                <div className="header_info py-4">
                    <h5>Invoice: {order && order.invoice}</h5>
                    <span >{moment(order && order.createdAt).format("DD MMM YYYY, hh:mm A")}</span>

                </div>

                <div className="order_section">
                    <div className="section_heading">
                        <h6>ORDER STATUS</h6>
                    </div>
                    <div className="status">
                        <div className="status_wrapper">
                        <div className="input_group">
                            <label>Order status</label>
                            <Select 
                            value={orderStatus}
                            onChange={(e)=>handleChangeOrderStatus(e)}  
                            style={{ width: 120 }}
                            >
                                <Option value="pending">Pending</Option>
                                <Option value="processing">Processing</Option>
                                <Option value="shipped">Shipped</Option>
                                <Option value="delivered">Delivered</Option>
                                <Option value="cancelled">Cancelled</Option>
                            </Select>
                        </div>
                        <div className="input_group">
                            <label>Payment status</label>
                            <Select 
                            value={paymentStatus}
                            onChange={(e)=>handleChangePaymentStatus(e)} 
                            style={{ width: 120 }}
                            >
                                <Option value="paid">Paid</Option>
                                <Option value="unpaid">Unpaid</Option>
                                <Option value="refunded">Refunded</Option>
                                <Option value="cod">Cod</Option>

                            </Select>
                        </div>
                        {
                            showEdit && <div className="button">
                            <Button onClick={()=>cancleShow()} style={{background:"red",color:"white",marginRight:"10px"}}   >Cancle</Button>
                            <Button onClick={()=>updateStatus()} type="primary"  >Save</Button>
                        </div>
                        }
                        
                        </div>
                       

                    </div>
                </div>

                <div className="step">

                    <Stepper   activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step  key={label}>
                                {
                                    order && order.orderStatus === 'cancelled' ?
                                    <StepLabel icon={<CloseIcon style={{background:"red",color:"white",borderRadius:"50%"}}></CloseIcon>} >{label}</StepLabel>:
                                    <StepLabel >{label}</StepLabel>
                                    
                                }
                                
                            </Step>
                        ))}
                    </Stepper>
                </div>

                <div className="order_section">
                    <div className="section_heading">
                        <h6>ORDER SUMMARY</h6>
                    </div>

                    <div className="summary">
                        <div className="row">
                            <div className="col-lg-6 col-md-12">

                                <table>
                                    <tr >
                                        <td>Order Date:</td>
                                        <td>{order && moment(order.createdAt).format("DD MMM YYYY, hh:mm A")}</td>
                                    </tr>
                                    <tr>
                                        <td>Order ID:</td>
                                        <td>{order && order.invoice}</td>
                                    </tr>

                                    <tr>
                                        <td> Payment Method:</td>
                                        <td>{order && order.paymentMethod || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment Status:</td>
                                        <td>{order && order.paymentStatus}</td>
                                    </tr>
                                    <tr>
                                        <td>Order Status:</td>
                                        <td>{order && order.orderStatus}</td>
                                    </tr>
                                </table>



                            </div>
                            <div className="col-lg-6 col-md-12">
                                <table>
                                    <tr>
                                        <td> Name:</td>
                                        <td>{order && order.addressId.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone:</td>
                                        <td>{order && order.addressId.mobileNumber}</td>
                                    </tr>
                                    <tr>
                                        <td> Shipping Region:</td>
                                        <td>{order && order.addressId.region}</td>
                                    </tr>
                                    <tr>
                                        <td> Shipping Area:</td>
                                        <td>{order && order.addressId.area}</td>
                                    </tr>
                                    <tr>
                                        <td> Shipping Address:</td>
                                        <td>{order && order.addressId.address}</td>
                                    </tr>


                                </table>

                            </div>
                        </div>
                    </div>

                </div>




                <div className="order_section">
                    <div className="section_heading">
                        <h6>ORDER DETAILS</h6>
                    </div>

                    <div className="item_details p-4">
                        <div className="overflow-auto">
                            <table className="w-100 border_bottom">
                                <tbody>
                                    <tr className="border_bottom">
                                        <td style={{ width: "60%" }} >Description</td>
                                        <td className='text-center' >Quantity</td>
                                        <td className='text-center'>Amount</td>

                                    </tr>

                                    {
                                        order && order.items.map((item, index) => {
                                            return (
                                                <tr key={index} className="">
                                                    <td className="mt-2">
                                                        <div className="d-flex align-items-center mt-2">
                                                            <div className="">
                                                                <img style={{ height: "80px", width: "80px", objectFit: "cover", marginRight: "10px" }} src={item.thumbnail} />
                                                            </div>
                                                            <div className="">
                                                                <a href="#">
                                                                    <p className="">{item.productName}</p>
                                                                </a>

                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <p className='font-weight-bold'>$ {item.payablePrice} X {item.purchasedQty}</p>
                                                    </td>
                                                    <td className="text-center">
                                                        <p className='font-weight-bold'>$ {parseInt(item.payablePrice) * parseInt(item.purchasedQty)}</p>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>


                            <table className='w-100 mt-4'>
                                <tbody className='mt-4'>
                                    <tr >
                                        <td style={{ width: "50%" }}>Status: {order && order.paymentStatus}</td>
                                        <td style={{ width: "13%" }}>
                                            <span>Total price :</span>
                                            <div className='font-weight-bold'>$ {order && order.totalAmount}</div>
                                        </td>
                                        <td className='text-center' style={{ width: "13%" }}>
                                            <span>Total paid :</span>
                                            <div className='font-weight-bold'>$ {order && order.paidAmount}</div>
                                        </td>
                                        <td className='text-center' style={{ width: "13%" }}>
                                            <span >Due :</span>
                                            <div className='font-weight-bold'>$ {order && order.totalAmount - order.paidAmount}</div>
                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>


                <div className="order_section">
                    <div className="section_heading">
                        <h6>ORDER TIMELINE</h6>
                    </div>
                </div>

                <div className="steps">



                    <div className="container">
                        <div className="timeline">

                            {
                                order && reverse(order.orderHistories).map((history, index) => {
                                    return (
                                        <div key={index} className="timeline-container primary">
                                            <div className="timeline-icon">
                                                <CheckCircleOutlineIcon className='icon' />
                                            </div>
                                            <div className="timeline-body">
                                                <h4 className="timeline-title"><span className="badge">{history.type}</span></h4>
                                                <p>{history.note}</p>
                                                <p className="timeline-subtitle">{moment(history.date).fromNow()}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default OrderDetails










