import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Form, Input, Button, Checkbox,Alert } from 'antd';
import './auth.scss'
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

function Login() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onFinish = (values) => {
    setLoading(true)
      axios.post('/admin/signin',values)
      .then(res=>{
        setLoading(false)
        console.log( res.data);
        if(res.status === 200){
          if (res.data.user.role === 'user') {
            return setError({message:"Access denied"})
          }
         
          //console.log(res.data.token);
          Cookies.set("ecom", res.data.token);
          
              window.location.pathname = '/'
        
      }
      })
      .catch(err=>{
        setLoading(false)
        setError(err && err.response && err.response.data);
        //console.log(err && err.response && err.response.data);
      })
    
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onCloseAlert=()=>{
      setError(null)
  }



  return (
    <div className="auth_container">
    <div className="auth">
      <div className='mb-3'>
        {
          error && error.message && <Alert
            message={error.message}
            type="error"
            closable
            onClose={onCloseAlert}
          />
        }
      </div>
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
        initialValue="demo@demo.com"
          label="Emai"
          name="email"
          className="label mb-3"
          validateStatus={error && error.email ? "error" : "succcess"}
          help={error && error.email ? error.email : null}

        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
        initialValue="123456"
          label="Password"
          name="password"
          className="label"
          validateStatus={error && error.password ? "error" : "succcess"}
          help={error && error.password ? error.password : null}
        >
          <Input.Password />
        </Form.Item>



        <div className='text-center'>
          <Button loading={loading} className="primary_btn my-3" type="primary" htmlType="submit">
            Login
    </Button>
          {/* <span className='register'> Dont't have an account ? <Link href="/auth/register"><a>register now!</a></Link></span> */}
        </div>
      </Form>
    </div>
    </div>
  )
}

export default Login
