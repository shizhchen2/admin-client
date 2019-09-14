import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Card,Button,Table,Modal, message} from 'antd'
import { PAGE_SIZE } from '../../utils/constraits'
import AddForm from './addForm'
import AuthForm from './authForm'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import { formatDate } from '../../utils/dateUtils'

export class Role extends Component {
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    state = {
        roles:[],
        role:{},
        isShowAdd:false,
        isShowAuth:false
    }
    updateRole =async()=>{
        this.setState({isShowAuth:false})
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        const response = await reqUpdateRole(role)
        const result = response.data
        if(result.status===0){
            message.success('设置角色权限成功')
            this.getRoles()
        }else{
            message.error('设置角色权限失败')
        }
    }

    addRole = ()=>{
        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({
                    isShowAdd:false
                })
                const {roleName} = values
                this.form.resetFields()
                const response = await reqAddRole(roleName)
                // console.log(values,response)
                const result = response.data
                if(result.status===0){
                    message.success('添加角色成功')
                    // this.getRoles()
                    const role = result.data
                    // let roles = [...this.state.roles]
                    // roles.push(role)
                    this.setState((prevState)=>({
                        roles:[...prevState,role]
                    }))
                }
                else{
                    message.error('添加角色失败')
                }
            }
        })
    }


    onRow  = (role)=>{
        return {
            onClick:event=>{
                this.setState({
                    role
                })
            }
        }
    }
    initColumn = ()=>{
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name',
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:formatDate
            },
            {
                title:'授权时间时间',
                dataIndex:'auth_time',
                render:formatDate
            },
            {
                title:'授权人',
                dataIndex:'auth_name',
                render:formatDate
            },
        ] 
    }

    handleCancel = ()=>{
        this.setState({isShowAdd:false})
        this.form.resetFields()
    }

    getRoles = async()=>{
        const response = await reqRoles()
        const result = response.data
        if(result.status===0){
            this.setState({
                roles:result.data
            })
        }
    }
    componentDidMount(){
        this.getRoles()
    }
    componentWillMount(){
        this.initColumn()
    }
    render() {
        const {roles,role,isShowAdd } = this.state
        // const {form} = this
        const title = (
            <span>
                <Button 
                onClick={()=>this.setState({isShowAdd:true})}
                style={{marginRight:10}} type='primary'>创建角色</Button>
                <Button 
                onClick={()=>this.setState({isShowAuth:true})}
                type='primary' disabled={!role._id}>设置角色权限</Button>
                
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize:PAGE_SIZE}}
                    rowSelection={{type:'radio',selectedRowKeys:[role._id]}}
                    onRow={this.onRow}
                ></Table>
                <Modal
                    title='添加角色'
                    visible={isShowAdd}
                    onOk = {this.addRole} 
                    onCancel = {this.handleCancel}
                >
                    <AddForm setForm=
                    {(form)=>this.form=form}/>
                </Modal>
                <Modal
                    title='设置权限'
                    visible={this.state.isShowAuth}
                    onOk = {this.updateRole} 
                    onCancel = {()=>this.setState({isShowAuth:false})}
                >
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Role)
