import React, { Component } from 'react'
import { Layout } from 'antd';
import LeftNav from '../../components/leftNav'
import Header from '../../components/header'
import {Switch,Route,Redirect} from 'react-router-dom'
import Category from '../category'
import Product from '../product'
import User from '../user'
import Role from '../role'
import Pie from '../charts/pie'
import Line from '../charts/line'
import Bar from '../charts/bar'
import Home from '../home'
const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
    render() {
        return (
            <Layout style={{minHeight:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
              <Header/>
              <Content style={{backgroundColor:'#c1c7cc',margin:20}}>
                  <Switch>
                      <Route path='/home' component={Home}/>
                      <Route path='/category' component={Category}/>
                      <Route path='/product' component={Product}/>
                      <Route path='/user' component={User}/>
                      <Route path='/charts/pie' component={Pie}/>
                      <Route path='/charts/line' component={Line}/>
                      <Route path='/charts/bar' component={Bar}/>
                      <Route path='/role' component={Role}/>
                      <Redirect to='/home'/>
                  </Switch>
              </Content>
              <Footer style={{textAlign:'center',backgroundColor:'#cccccc'}}>建议使用Chrome浏览器得到更好的体验</Footer>
            </Layout>
          </Layout>
        )
    }
}
