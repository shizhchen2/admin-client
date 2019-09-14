import React, { PureComponent } from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
class UserForm extends PureComponent {
    static propTypes = {
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {roles} = this.props
        const user = this.props.user || {}
        console.log(user)
        return (
            <Form>
                <Form.Item label='用户名' >
                    {
                        getFieldDecorator('username',{
                            initialValue:user.username,
                            rules:[
                                {required:true,message:'用户名称必须输入'}
                            ]
                        })(<Input placeholder='请输入用户名'/>)
                    }
                </Form.Item>
                {
                    user._id?null:(<Form.Item label='密码' >{
                            getFieldDecorator('password',{
                                initialValue:user.password,
                                rules:[
                                    {required:true,message:'密码必须输入'}
                                ]
                            })(<Input type='password' placeholder='请输入密码'/>)
                        }
                    </Form.Item>)
                }  
                <Form.Item label='手机号' >
                    {
                        getFieldDecorator('phone',{
                            initialValue:user.phone,
                            rules:[
                                {required:true,message:'手机号必须输入'}
                            ]
                        })(<Input placeholder='请输入手机号'/>)
                    }
                </Form.Item>
                <Form.Item label='邮箱' >
                    {
                        getFieldDecorator('email',{
                            initialValue:user.email,
                            rules:[
                                {required:true,message:'邮箱必须输入'}
                            ]
                        })(<Input placeholder='请输入邮箱地址'/>)
                    }
                </Form.Item>
                <Form.Item label='角色' >
                    {
                        getFieldDecorator('role_id',{
                            initialValue:user.role,
                        })(<Select>
                            {
                                roles.map(role=>{
                                    return (
                                        <Select.Option value={role._id}
                                        key={role._id}>
                                        {role.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>)
                    }
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(UserForm)

