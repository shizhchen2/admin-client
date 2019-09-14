import React, { Component } from 'react'
import { Input, Form, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuConfig from '../../config/menuConfig'
import menuList from '../../config/menuConfig';
const { TreeNode } = Tree;
export default class AuthForm extends Component {
    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }
    static propTypes = {
        role: PropTypes.object
    }
    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    };
    getMenus = ()=>{
        return this.state.checkedKeys
    }

    getTreeNodes = (menuList) =>{
        return menuList.reduce((pre,menu)=>{
            pre.push(
                <TreeNode title={menu.title} key={menu.key}>
                    {menu.children?this.getTreeNodes(menu.children):null}
                </TreeNode> 
            )
            return pre
        },[])
    }

    componentWillMount(){
        this.treeNodes = this.getTreeNodes(menuList)
    }
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const { role } = this.props
        console.log(role)
        return (
            <Form >
                <Form.Item label='角色名称'>
                    <Input value={role.name} disabled /></Form.Item>
                <Tree
                    checkable
                    defaultExpandAll='true'
                    onCheck = {this.onCheck}
                    // checkedKeys={role.menu}
                >
                    <TreeNode title="权限" key="all">
                        {
                            this.treeNodes
                        }
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
