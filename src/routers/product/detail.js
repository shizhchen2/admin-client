import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constraits'
import {reqCategoryId} from '../../api'
export default class Detail extends Component {
    state ={
        categoryName1:'',
        categoryName2:''
    }
    async componentDidMount(){
        const {pCategoryId,categoryId} = this.props.location.state
        if(pCategoryId==='0'){
            const response = await reqCategoryId(categoryId)
            const result = response.data
            this.setState({
                categoryName1:result.data.name
            }) 
        }else{
            const responses = await Promise.all([
                reqCategoryId(pCategoryId),reqCategoryId(categoryId)
            ])
            this.setState({
                categoryName1:responses[0].data.data.name,
                categoryName2:responses[1].data.data.name
            })
        }
    }

    render() {
        // console.log(this.props.location.state)
        const {name,desc,price,detail,imgs} = this.props.location.state
        const { categoryName1,categoryName2} = this.state
        const title = (
            <span>
                <LinkButton>
                <Icon type='arrow-left' style={{color:'green',marginRight:5,fontSize:15}}
                onClick={()=>this.props.history.goBack()}
                /></LinkButton>
                
                <span>商品详情</span>
            </span>
        )
        return (
            <Card
                title={title}
                className='product-detail'
                // extra={extra}
            >
                <List>
                    <List.Item>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>所属分类</span>
                        <span>{categoryName1}{categoryName2?'-->'+categoryName2:''}</span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                imgs.map(img=>{
                                    return (
                                        <img 
                                className='product-img'
                                src={BASE_IMG_URL+img}
                                key={img}
                                alt='img'   
                            />
                                    )
                                })
                            }
                            
                        </span>
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>
                    </List.Item>
                    
                    
                </List>

            </Card>
        )
    }
}
