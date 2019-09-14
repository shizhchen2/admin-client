import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constraits'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
    constructor(props){
        super(props)
        const fileList = []
        let {imgs} = this.props
        if(imgs&&imgs.length>0){
            imgs.map((img,index)=>({
                uid:-index,
                name:img,
                status:'done',
                url:BASE_IMG_URL+img
            }))
        }
        this.state={
            previewVisible: false,
            previewImage: '',
            fileList: [
            //   {
            //     uid: '-1',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            //   },
        
            ]
        }
    }

  static propTypes = {
      imgs:PropTypes.array
  }  
  

  getImgs= ()=>{
      return this.state.fileList.map(file=>file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file,fileList }) =>{
     if(file.status==='done'){
         const result = file.response
         if(result.status===0){
             message.success('上传成功')
             const {name,url} = result.data
             file = fileList[fileList.length-1]
             file.name=name
             file.url=url
         }else{
             message.error('上传失败')
         }
     }else if(file.status==='removed') {
        const response = await reqDeleteImg(file.name)
        const result = response.data
        if(result.status===0){
            message.success('删除成功')
        }else{
            message.error('删除失败')
        }
     }
     this.setState({ fileList })
  }

  render(){
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept='/image/*'
          listType="picture-card"
          name='image'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
