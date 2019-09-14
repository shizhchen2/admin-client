import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductHome from './home'
import Detail from './detail'
import ProductAddUpdate from './add-update'
import './index.less'
export class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome}/>
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={Detail}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
