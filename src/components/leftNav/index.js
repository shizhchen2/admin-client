import React, { Component } from 'react'
import './index.less'
import logo from '../../assets/imgs/logo.jpeg'
import { Link ,withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

class LeftNav extends Component
    
{
    hadAuth = (item) =>{
        const key = item.key
        // const menus = 
    }

    getMenuDetails = (menuList)=>{
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0){
            path = '/product'
        }
        return menuList.map((menu)=>{
            if(this.hasAuth(menu)){
                if(!menu.children){
                    return (
                    <Menu.Item key={menu.key}>
                    <Link to={menu.key}><Icon type={menu.icon} />
                    <span>{menu.title}</span></Link>
                    </Menu.Item>)
                }else{
                    // console.log(menu.key,path)
                    const cMenu = menu.children.find(cMenu=>path.indexOf(cMenu.key)===0)
                    if(cMenu){
                        this.openKey = menu.key
                    }
    
                    return (<SubMenu
                    key={menu.key}
                    title={
                        <span>
                            <Icon type={menu.icon} />
                            <span>{menu.title}</span>
                        </span>
                    }
                >
                    {
                        this.getMenuDetails(menu.children)
                    }
                    </SubMenu>)
                }
            }
            
            
        })
    }
    componentWillMount(){
        this.menuNodes = this.getMenuDetails(menuList)
    }
    render() {
        
        const path = this.props.location.pathname
        const openKey = this.openKey

        return (
            
                <div className='left-nav'>
                    <Link  to='/' className='left-nav-header'>
                        <img src={logo} alt='logo' />
                        <h1>后台demo</h1>
                    </Link>
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[path]}
                        defaultOpenKeys={[openKey]}
                    >
                        {
                            this.menuNodes
                        }
                    </Menu>
                </div>
        )
    }
}
export default withRouter(LeftNav)