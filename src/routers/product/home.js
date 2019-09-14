import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    Icon,
    message
} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constraits'
//default children route
export default class ProductHome extends Component {
    state = {
        total:0,
        products:[],
        loading:false,
        searchName:'',
        searchType:'productName'
    }

    componentDidMount(){
        this.getProducts(1)
    }
    componentWillMount(){
        this.initColumns()
    }
    getProducts=async(pageNum)=>{
        this.pageNum=pageNum
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let response
        if(searchName){
            response = await reqSearchProducts({
                pageNum,pageSize:PAGE_SIZE,searchName,searchType
            })
        }else{
            response = await reqProducts(pageNum,PAGE_SIZE)
        }
        // console.log(pageNum)
        this.setState({loading:false})
        const result = response.data
        if(result.status===0){
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }
    updateStatus = async(productId,status)=>{
        const response = await reqUpdateStatus(productId,status)
        const result = response.data 
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    initColumns =()=>{
        this.columns = [{
            title: '商品名称',
            dataIndex: 'name',
          },
          {
            title: '商品描述',
            dataIndex: 'desc',
          },
          {
            title: '价格',
            dataIndex: 'price',
            render:(price)=>
                '$' + price
            
          },
          {
            title: '状态',
            // dataIndex: 'status',
            width:100,
            render:(product)=>{
                const {status,_id} = product
                return (
                    <span>
                        <Button type='primary'
                        onClick={()=>this.updateStatus(_id,status===1?2:1)}
                        >{status===1?'下架':'上架'}</Button>
                        <span>{status===1?'在售':'已下架'}</span>
                    </span>
                )
            }
          },
          {
              
            title: '操作',
            width:100,
            render:(product)=>{
                return (
                    <span>
                        <LinkButton
                            onClick={()=>this.props.history.push('/product/detail',product)}
                        >详情</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        
                    </span>
                )
            }
          },
        ]
    }
    render() {

        const {products,total,loading,searchName,searchType} = this.state
        console.log(products)
        const title = (
            <span>
                <Select value={searchType} style={{width:150}}
                onChange={(value) => this.setState({
                    searchType:value
                })}
                >
                    <Select.Option value='productName'>按名称搜索</Select.Option>
                    <Select.Option value='productType'>按描述搜索</Select.Option>
                </Select>
                <Input 
                onChange={(e)=>this.setState({
                    searchName:e.target.value
                })}
                placeholder='关键字' style={{width:150,margin:'0 15px'} } value={searchName}/>
                <Button type='primary'
                onClick={()=>this.getProducts()}
                >搜索</Button>
            </span>
        )
        const extra = (
            <Button
                onClick = {()=>this.props.history.push('/product/addupdate')}
            >
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={products}
                    columns={this.columns}
                    pagination={
                    {defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    total,
                    onChange:this.getProducts}
                    }
                >
                </Table>    
            </Card>
        )
    }
}
