import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Icon, Table, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategory, reqUpdateCategory, reqAddCategory } from '../../api/index'
import AddForm from './addForm'
import UpdateForm from './updateForm'

export class Category extends Component {
    state = {
        loading: false,
        categories: [],
        subCategories: [],
        parentId: '0',
        parentName: '',
        showStatus: 0,
    }
    getCategories = async (parentId) => {
        this.setState({ loading: true })
        parentId = parentId || this.state.parentId
        const response = await reqCategory(parentId)
        const result = response.data
        this.setState({ loading: false })
        console.log(result)
        if (result.status === 0) {
            if (parentId === '0') {
                this.setState({ categories: result.data })
            } else {
                this.setState({ subCategories: result.data })
            }
        } else {
            message.error('获取列表请求失败')
        }

    }
    showSubCategories = (category) => {
        console.log(category)
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategories()
        })
    }
    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    addCategory =  () => {
        this.form.validateFields(async(err,values)=>{
            if(!err){
                this.setState({
                    showStatus: 0
                })
                const { parentId, categoryName } = values
                this.form.resetFields()
        
                const response = await reqAddCategory(categoryName, parentId)
                const result = response.data
                if (result.status === 0) {
                    if (parentId === this.state.parentId) {
                        this.getCategories()
                    } else if (parentId === '0') {
                        this.getCategories('0')
                    }
                }
            }
            
        })
       
    }

    updateCategory =  () => {

        //表单验证
        this.form.validateFields(async(err, values) => {
            if (!err) {
                //隐藏modal框
                this.setState({
                    showStatus: 0
                })
                //发送请求更新分类
                const categoryId = this.category._id
                const {categoryName} = values
                //清楚输入数据
                this.form.resetFields()
                const response = await reqUpdateCategory({ categoryName, categoryId })
                const result = response.data
                //重新显示列表
                if (result.status === 0) {
                    this.getCategories()
                }
            }
        })


    }
    showUpdate = (category) => {
        this.category = category
        this.setState({ showStatus: 2 })

    }

    componentDidMount() {
        this.getCategories()
        // console.log('已请求')
    }
    componentWillMount() {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                        <LinkButton onClick={() => this.showSubCategories(category)}>查看子类</LinkButton>
                    </span>
                )
            },
        ];
    }
    render() {
        const { categories, subCategories, parentId, parentName, loading, showStatus } = this.state
        const category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</ LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => { this.setState({ showStatus: 1 }) }}>
                <Icon type='plus' />
                添加
            </Button>
        )
        // console.log(this.category)
        return (

            <Card title={title} extra={extra}>

                <Table
                    bordered
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    rowKey='_id'
                    loading={loading}
                    pagination={{ defaultPageSize: 5, showQuickJumper: false }}
                />

                <Modal
                    title="添加"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categories={this.state.categories} parentId={parentId} setForm={(form) => this.form = form} />
                </Modal>
                <Modal
                    title="更新"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => this.form = form} />
                </Modal>
            </Card>

        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Category)
