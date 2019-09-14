import React, { Component } from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
class AddForm extends Component {
    static propTypes = {
        setForm:PropTypes.func.isRequired,
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Form.Item label='角色名称:' >
                    {
                        getFieldDecorator('roleName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'角色名称必须输入'}
                            ]
                        })(<Input placeholder='请输入角色名称'/>)
                    }
                
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(AddForm)

