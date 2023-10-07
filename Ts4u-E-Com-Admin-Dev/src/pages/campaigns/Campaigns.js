import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Button, Table, Tag, Space, Image, Switch, Popconfirm, Modal, DatePicker } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import "./campaigns.scss"
import axios from 'axios'
import MediaLibrary from '../../components/MediaLibrary';
import { useHistory } from 'react-router-dom'
import moment from 'moment';
const { RangePicker } = DatePicker;



function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
}

function disabledDateTime() {
    return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    };
}

function disabledRangeTime(_, type) {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
}


function Campaigns() {
    const history = useHistory()
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [display, setDisplay] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [campaigns, setCampaigns] = useState([])

    const [campaignName, setCampaignName] = useState('')
    const [image, setImage] = useState('')
    const [startAt, setStartAt] = useState('')
    const [endAt, setEndAt] = useState('')
    const [status, setStatus] = useState(true)

    const [editCamp, setEditCamp] = useState(null)


    const clearFields = () => {
        setCampaignName("")
        setImage('')
        setStartAt('')
        setEndAt("")
        setStatus(true)
        setEditCamp(null)
        setIsModalVisible(false)
    }


    const createCamp = () => {
        setIsLoading(true)
        let data = {
            name: campaignName,
            image,
            startAt,
            endAt,
            isActive: status
        }
        axios.post('/campaign/create', data)
            .then(res => {
                setCampaigns(prev => [res.data.campaign, ...prev])
                setIsLoading(false)
                clearFields()
            })
            .catch(err => {
                setIsLoading(false)
                err && err.response && console.log(err.response.data)
            })
    }

    const getCamp = () => {
        axios.get('/campaign/getall')
            .then(res => {
                setCampaigns(res.data.campaigns)
                console.log(res.data.campaigns);
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }
    const deleteCamp = (id) => {
        axios.delete(`/campaign/delete/${id}`)
            .then(res => {
                if (res.data.success) {
                    let filter = campaigns.filter(b => b._id !== id)
                    setCampaigns(filter)
                }
            })
            .catch(err => {
                err && err.response && console.log(err.response.data)
            })
    }

    const handleEditCamp = (camp) => {
        setCampaignName(camp.name)
        setImage(camp.image)
        setStatus(camp.isActive)
        setStartAt(camp.startAt)
        setEndAt(camp.endAt)
        setEditCamp(camp._id)
        setIsModalVisible(true)

    }

    const updateCamp = () => {
        setIsLoading(true)
        let data = {
            name: campaignName,
            image,
            startAt,
            endAt,
            isActive: status
        }
        axios.patch(`/campaign/update/${editCamp}`, data)
            .then(res => {
                if (res.data.success) {
                    setIsLoading(false)
                    let campArray = [...campaigns]
                    let index = campArray.findIndex(c => c._id === res.data.campaign._id)
                    campArray[index] = res.data.campaign
                    setCampaigns(campArray)
                    clearFields()
                }
            })
            .catch(err => {
                setIsLoading(false)
                err && err.response && console.log(err.response.data)
            })
    }



    useEffect(() => {
        getCamp()

    }, [])



    const handleImageselect = (item) => {
        setImage(item.thumbnailUrl);
        setDisplay(false)
    }




    const columns = [

        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },


        {
            title: 'Banner',
            key: 'image',
            dataIndex: 'image',
            render: image => <Image
                width={100}
                src={image}
                fallback="data:image/png;base64,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"
            />
        },
        {
            title: 'Status',
            key: 'isActive',
            dataIndex: 'isActive',
            render: isActive => (
                <>
                    {
                        isActive == true ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
                    }
                </>
            ),
        },
        {
            title: 'Start Date',
            key: 'startAt',
            dataIndex: 'startAt',
            render: startAt => (
                <>
                    <strong>{moment(startAt).format("D MMM YYYY HH:mm:ss")}</strong>
                </>
            ),
        },
        {
            title: 'End Date',
            key: 'endAt',
            dataIndex: 'endAt',
            render: endAt => (
                <>
                    <strong>{moment(endAt).format("D MMM YYYY HH:mm:ss")}</strong>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleEditCamp(record)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteCamp(record._id)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
                    <Button onClick={() => history.push(`/campaigns/${record._id}`)} type='primary'>Select Products</Button>

                </Space>
            ),
        },
    ];




    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        clearFields()
    };


    const handleCampDate = (dates) => {
        setStartAt(moment(dates[0]._d).format())
        setEndAt(moment(dates[1]._d).format())
    }


    return (
        <div className='campaigns'>
            <Button onClick={() => showModal()}>Create New Campaign</Button>
            <MediaLibrary display={display} onHide={() => setDisplay(false)} selectCallback={(item) => handleImageselect(item)} />
            <Row gutter={16}>
                <Col className="gutter-row" lg={24} md={24} sm={24}>
                    <Card style={{ marginTop: "15px" }} title="Brands" >
                        <Table columns={columns} dataSource={campaigns} />
                    </Card>
                </Col>
            </Row>


            <Modal
                zIndex={1111}
                title="Campaigns"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <>
                        <Button onClick={() => clearFields()} className='submit_btn' type="primary" danger>Cancel</Button>
                        {
                            editCamp ?
                                <Button onClick={() => updateCamp()} className='submit_btn' type="primary">Update</Button> :
                                <Button loading={isLoading} onClick={() => createCamp()} className='submit_btn' type="primary">Create</Button>
                        }

                    </>
                ]}
            >

                <div className='campaigns_wrapper'>
                    <div className='input_item'>
                        <label>Campaign name <span className='required'>*</span></label>
                        <Input
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            type="text"
                            placeholder='Enter campaign name'>
                        </Input>

                    </div>

                    <div className='input_item'>
                        <label>Campaign image <span className='required'>*</span></label>
                        <div style={{ width: "100%" }}>
                            <Button className='d-center' onClick={() => setDisplay(true)} type="primary" shape="round" icon={<UploadOutlined />} size={"size"} >Upload image </Button>

                            {
                                image && <>
                                    <div className='image_container'>
                                        <span onClick={() => setImage('')}>X</span>
                                        <img src={image}></img>
                                    </div>
                                </>
                            }
                        </div>

                    </div>

                    <div className='input_item'>
                        <label>Active <span className='required'>*</span></label>
                        <Switch checked={status} onChange={(checked) => setStatus(checked)} />

                    </div>

                    {/* <RangePicker
                        style={{ margin: "10px 0" }}
                        disabledDate={disabledDate}
                        disabledTime={disabledRangeTime}
                        showTime={{
                            hideDisabledOptions: true,
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="D MMM YYYY HH:mm:ss"
                        onChange={(e) => handleCampDate(e)}
                        allowEmpty={false}
                        value={startAt && endAt ? [moment(startAt), moment(endAt)]: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]}
                        
                
                    /> */}






                    <RangePicker
                        ranges={{
                            Today: [moment(Date.now()), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={handleCampDate}
                        value={startAt && endAt ? [moment(startAt), moment(endAt)]: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]}
                    />


                </div>

            </Modal>
        </div>
    )
}

export default Campaigns

