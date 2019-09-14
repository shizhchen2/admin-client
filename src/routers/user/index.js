import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Card,Button,Table,Modal, message} from 'antd'
import {formatDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constraits'
import { reqUsers, reqDeleteUser,reqAddOrUpdateUser } from '../../api'
import UserForm from './userForm'
export class User extends Component {
    state = {
        users:[],
        roles:{},
        isShow:false
    }
    initColumns = ()=>{
        this.columns = [
            {
                title:'',
                dataIndex:'username'
            },
            {
                title:'邮箱',
                dataIndex:'email'
            },
            {
                title:'电话',
                dataIndex:'phone'
            },
            {
                title:'注册时间',
                dataIndex:'create_time',
                render:formatDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) =>this.roleNames[role_id]
            },
            {
                title:'操作',
                render:(user)=>
                <span>
                    <LinkButton
                    onClick={()=>this.showUpdate(user)}
                    >修改</LinkButton>
                    <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                </span>
                
            },
        ]
    }
    showUpdate = (user)=>{
        this.user = user



        this.setState({
            isShow:true
        })
    }
    deleteUser = (user)=>{
        Modal.confirm({
            title:`确认删除${user.username}嘛`,
            onOk: async ()=>{
                const response = await reqDeleteUser(user._id)
                const result = response.data
                if(result.data===0){
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })
    }
    addOrUpdateUser =async()=>{
        const user = this.form.getFieldsValue()
        console.log(user)
        this.form.resetFields()
        if(this.user){
            user._id = this.user._id
        }
        const response = await reqAddOrUpdateUser(user)
        const result = response.data
        if(result.status===0){
            message.success(`${this.user?'修改':'添加'}用户成功`)
            this.getUsers()
        }
    }
    initRolesNames = (roles)=>{
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id]=role.name
            return pre
        },{})
        this.roleNames= roleNames;
    }
    getUsers = async ()=>{
        const response = await reqUsers()
        const result = response.data
        if(result.status===0){
            const {users,roles} = result.data
            this.initRolesNames(roles)
            
            this.setState({users,roles})
        }
    }
    showAdd = ()=>{
        this.user = null
        this.setState({isShow:true})
    }

    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getUsers()
    }
    render() {
        const {user} = this
        const title =<Button type='primary'
        onClick={this.showAdd}
        >创建用户</Button>
        const {users} = this.state
        return (
            <Card title={title}>
               <Table
                    bordered
                    dataSource={users}
                    columns={this.columns}
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE}}
                />

                <Modal
                    title={user?"更新用户":"添加用户"}
                    visible={this.state.isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow:false})
                    }}
                >
                    <UserForm setForm={(form)=>this.form =form}
                    roles={this.state.roles}
                    user={user}/>
                </Modal> 

            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
