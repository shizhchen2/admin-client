import React, { Component } from 'react'
import { Form, Icon, Input, Button,message} from 'antd';
//一级登陆路由
import './login.less'
import logo from '../../assets/imgs/logo.jpeg'
import {reqLogin} from '../../api/index'
class Login extends Component {

    

    handleSubmit=(e)=>{
        e.preventDefault()
        // const form = this.props.form
        // // const values = form.getFieldsValue()
        // // // console.log(values)
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
              const {username,password} = values
            //   reqLogin(username,password).then((response)=>{
            //     console.log(response.data)
            //   }).catch((error)=>{
            //     console.log(error)
            //   }) 
                const response = await reqLogin(username,password)
                // console.log(response.data)
                const result = response.data
                if(result.status===0){
                    message.success('登陆成功')
                    this.props.history.replace('/admin')
                }else{
                    message.error(result.msg)
                }
                
            }else{
                alert('request failed')
            }
          });
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt='' />
                    <h1>后台管理系统demo</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登陆</h2>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                            {
                                getFieldDecorator('username',{
                                    rules: [
                                        { required: true, whitespace: true, message: '请输入用户名' },
                                        { max: 12, message: '用户名不能超过12位' },
                                        { min: 4, message: '用户名不能少于于4位' },
                                        { pattern: /^[a-zA-Z0-9_]+$|/, message: '用户名必须由英文字母数字及下划线组成' },
                                    ],
                                    initialValue:'admin'
                                })( <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />)
                            }
                            </Form.Item>
                            <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        {
                                            validator:function(rule,value,callback){
                                                if(!value){
                                                    callback('密码必须输入')
                                                }else if(value.length<4){
                                                    callback('密码必须不少于4位')
                                                }else if(value.length>12){
                                                    callback('密码必须不超过12位')
                                                }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
                                                    callback('密码必须由字母、数字及下划线组成')
                                                }else{
                                                    callback()
                                                }
                                            }
                                        }
                                    ],
                                    
                                })(                            <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />)
                            }
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登陆</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </section>

            </div>
        )
    }
}
const WrapedLogin = Form.create()(Login)
export default WrapedLogin