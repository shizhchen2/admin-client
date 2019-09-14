import React, { Component } from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
class AddForm extends Component {
    static propTypes = {
        categories:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired,
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {categories,parentId} = this.props
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(<Select>
                            <Select.Option value='0'>一级分类</Select.Option>
                            {
                                categories.map(c=>
                                    <Select.Option value={c._id}>{c.name}</Select.Option>
                                )
                            }
                        </Select>)
                    }
                
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:'',
                            rules:[
                                {required:true,message:'必须要输入分类名称'}
                            ]
                        })(<Input placeholder='请输入分类名称'/>)
                    }
                </Form.Item>
                
            </Form>
        )
    }
}

export default Form.create()(AddForm)