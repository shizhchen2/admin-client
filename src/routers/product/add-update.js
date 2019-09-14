import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Icon,
    Button,
    message
} from 'antd'
import { reqCategory,reqAddOrUpdateProduct } from '../../api'
import LinkButton from '../../components/link-button'
import PicturesWall from './picturesWall'
import RichTextEditor from './rich-text-editor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
const { Item } = Form
const { TextArea } = Input


class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    state = {
        options: []
    }
    loadData = async (selectedOptions) => {
        // console.log('loadDate()', selectedOptions)
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true // 显示 loading

        const subCategorys = await this.getCategories(targetOption.value) // await 的作用: 保 证完成执行完保存的分类数组才进入后面的语句
        targetOption.loading = false // 隐藏 loading 
        if (subCategorys && subCategorys.length > 0) { // 有子分类
            // 生成一个二级的 options
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 添加为对应的 option 的 children(子 options)
            targetOption.children = cOptions
        } else { // 没有子分类
            targetOption.isLeaf = true
        }
        // 更新 options 状态 
        this.setState({
            options: [...this.state.options],
        });
    }

    initOptions = async (categorys) => { // 根据一级分类数组生成 option 的数组 
        const options = categorys.map(c => ({
            value: c._id, label: c.name, isLeaf: false,
        }))
        // 如果当前是更新, 且商品是一个二级分类的商品 
        const { product, isUpdate } = this
        if (isUpdate && product.pCategoryId !== '0') {
            // 异步获取 product.pCategoryId 的二级分类列表
            const subCategorys = await this.getCategorys(product.pCategoryId)
            if (subCategorys && subCategorys.length > 0) {
                // 生成二级的 option 数组
                const cOptions = subCategorys.map(c => ({
                    value: c._id, label: c.name, isLeaf: true,
                }))
                // 找到对应的 option
                const targetOption = options.find(option => option.value === product.pCategoryId)
                // 将 cOptions 添加为对应的一级 option 的 children
                targetOption.children = cOptions
            }
        }
        // 更新状态 
        this.setState({
            options
        })
    }


    componentDidMount() {
        this.getCategories('0')


    }
    getCategories = async (parentId) => {

        const response = await reqCategory(parentId)
        const result = response.data
        if (result.status === 0) {
            if (parentId == 0) {
                this.initOptions(result.data)
            } else {
                return result.data
            }

        }
    }
    submit =() => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // alert('发送ajax请求')
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const {name,desc,price,categoryIds} = values
                let pCategoryId,categoryId 
                if(categoryIds.length===1){
                    pCategoryId='0'
                    categoryId=categoryIds[0]
                }else{
                    pCategoryId=categoryIds[0]
                    categoryId=categoryIds[1]
                }
                const product = {
                    name,desc,price,imgs,detail,pCategoryId,categoryId
                }
                if(this.isUpdate){
                    product._id = this.product._id
                }
                const response = await reqAddOrUpdateProduct(product)
                const result = response.data
                if(result.status===0){
                    message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'添加'}商品成功`)
                }
            }
        })
    }
    validatePrice = (rule, price, callback) => {
        if (price * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product//强制转换成布尔值
        this.product = product || {}
    }
    render() {
        const { isUpdate } = this
        const { pCategoryId, categoryId, imgs, detail} = this.product
        const categoryIds = []
        const { getFieldDecorator } = this.props.form
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <Icon type='arrow-left' />
                    <span>{isUpdate ? '修改商品' : '添加商品'}</span>
                </LinkButton>
            </span>
        )
        const formItemLayout = {
            labelCol: {
                xs: { span: 16 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        }
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }
        return (
            <Card
                title={title}
            >
                <Form {...formItemLayout} >
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: this.product.name,
                                rules: [
                                    { required: true, message: '必须要输入商品名称' }
                                ]
                            })(<Input placeholder='请输入商品名称'
                            />)
                        }

                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator('desc', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '必须要输入商品描述' }
                                ]
                            })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '必须要输入商品描述' },
                                    { validator: this.validatePrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格'
                                addonAfter='元'
                            />)
                        }
                    </Item>
                    <Item label='商品分类'>
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '必须要输入商品分类' },

                                ]
                            })(<Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                            />)
                        }
                    </Item>
                    <Item label='商品图片'

                    >
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情'
                        labelCol={{
                            xs: { span: 16 },
                            sm: { span: 4 },
                        }}
                        wrapperCol={{
                            xs: { span: 20 },
                            sm: { span: 20 },
                        }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary'
                            onClick={this.submit}
                        >提交</Button>
                    </Item>
                </Form>

            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
