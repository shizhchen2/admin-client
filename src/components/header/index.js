import React, { Component } from 'react'
import './index.less'
import { formatDate } from '../../utils/dateUtils'
import { reqWeather } from '../../api/index'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd'
import LinkButton from  '../../components/link-button'
class Header extends Component {

    state = {
        currentTime: formatDate(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('上海')
        this.setState({
            dayPictureUrl, weather
        })
    }
    getTitle = () => {

        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            }
            else if (item.children) {
                let cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    logout = () => {
        Modal.confirm({
            content: '确定要退出登录嘛',
            onOk:()=>{
                // console.log('确定');
                this.props.history.replace('/login')
            },
        })
    }


    componentDidMount() {

        setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval()
    }

    render() {
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎</span>
                    <LinkButton
                        onClick={this.logout}
                        href='javascript:'>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{this.getTitle()}</div>
                    <div className='header-bottom-right'>
                        <span>{this.state.currentTime}</span>
                        <img src={this.state.dayPictureUrl} alt='weather' />
                        <span>{this.state.weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)