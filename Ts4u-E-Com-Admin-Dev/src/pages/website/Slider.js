import React, { useState, useEffect } from 'react'
import { Button, Card, Table, Modal, Input, Image,Popconfirm,Space } from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, UploadOutlined,EditOutlined, DeleteOutlined, QuestionCircleOutlined  } from '@ant-design/icons';
import arrayMove from 'array-move';
import axios from 'axios'
import MediaLibrary from '../../components/MediaLibrary';



const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);




const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);



function Slider() {
    const [sliders, setSliders] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [display, setDisplay] = useState(false)

    const [title, settitle] = useState('')
    const [image, setImage] = useState(null)

    const [editSlide, setEditSlide] = useState(null)

    useEffect(() => {
        axios.get("/settings/getsliders")
            .then(res => {
                setSliders(res.data.sliders)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const saveData = (data) => {
        axios.post('/settings/savesliders', { sliders: data })
            .then(res => {
                if (res.data.success) {

                    setSliders(data);
                    handleCancel()
                }
            })
            .catch(err => {
                console.log(err);
            })
    }



    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(sliders), oldIndex, newIndex).filter(el => !!el);
            let array = []
            newData.map((slide, index) => {
                array.push({ ...slide, index })
            })
            saveData(array)
            // console.log('Sorted items: ', newData);

        }
    };



    const DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={onSortEnd}
            {...props}
        />
    );

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = sliders.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };



    const createSlide = () => {
        if (!title || !image) {
            return alert("title and image is required")
        }

        let newSliders = [{ key: Math.floor(1000 + Math.random() * 9000), title, image, index: 0 }, ...sliders]
        let array = []
        newSliders.map((slide, index) => {
            array.push({ ...slide, index })
        })
        saveData(array)
    }



    const updateSlide = () => {
        if (!title || !image) {
            return alert("title and image is required")
        }

        let slidersArray = [...sliders]
        let index = slidersArray.findIndex(slide=>slide.key === editSlide.key)
        slidersArray[index] = {...slidersArray[index],title,image}
        saveData(slidersArray)
    }

    const deleteSlide=(key)=>{
        let slidersArray = [...sliders]
        let index = slidersArray.findIndex(slide=>slide.key === key)
        slidersArray.splice(index,1)
        let array = []
        slidersArray.map((slide, index) => {
            array.push({ ...slide, index })
        })
        saveData(array)

    }
    




    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        settitle("")
        setImage(null)
        setEditSlide(null)
    };

    const handleImageselect = (item) => {
        setImage(item.thumbnailUrl);
        setDisplay(false)
    }

    const handleEditSlide=(slide)=>{
        settitle(slide.title)
        setImage(slide.image)
        setEditSlide(slide)
        showModal()
    }




    const columns = [
        {
            title: 'Sort',
            dataIndex: 'sort',
            width: 30,
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            className: 'drag-visible',
        },
        {
            title: 'Image',
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
                    <Button onClick={() => handleEditSlide(record)} className='d-center' type='primary' icon={<EditOutlined />}></Button>
                    <Popconfirm onConfirm={() => deleteSlide(record.key)} title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>
    
                </Space>
            ),
        },
    
    ];


    return (
        <>
            <MediaLibrary display={display} onHide={() => setDisplay(false)} selectCallback={(item) => handleImageselect(item)} />
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => showModal()} type='primary'>Add new slider</Button>
            </div>
            <Card title="Sliders">
                <Table
                    pagination={false}
                    dataSource={sliders}
                    columns={columns}
                    rowKey="index"
                    components={{
                        body: {
                            wrapper: DraggableContainer,
                            row: DraggableBodyRow,
                        },
                    }}
                />
            </Card>

            <Modal
                zIndex={1111}
                title="Slider"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <>
                        <Button onClick={() => handleCancel()} className='submit_btn' type="primary" danger>Cancel</Button>
                        {
                            editSlide ?
                                <Button onClick={() => updateSlide()} className='submit_btn' type="primary">Update</Button> :
                                <Button onClick={() => createSlide()} className='submit_btn' type="primary">Create</Button>
                        }

                    </>
                ]}
            >

                <div className='campaigns_wrapper'>
                    <div className='input_item'>
                        <label>Slider title <span className='required'>*</span></label>
                        <Input
                            value={title}
                            onChange={(e) => settitle(e.target.value)}
                            type="text"
                            placeholder='Enter campaign name'>
                        </Input>

                    </div>

                    <div className='input_item'>
                        <label>Slider image (908x320) <span className='required'>*</span></label>
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


                </div>

            </Modal>
        </>
    )
}

export default Slider
