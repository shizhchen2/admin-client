import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
export const reqLogin = (username,password)=>ajax('/login',{username,password},'POST')

export const reqAddOrUpdateUser = (user)=>ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')

//jsonp
export const reqWeather = (city)=>{

    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(error,data)=>{
            if(!error&&data.status==='success'){
                const {dayPictureUrl,weather}= data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
                message.error('获取信息失败')
            }
        })
    })

}
export const reqCategory = (parentId)=>ajax('/manage/category/list',{parentId})

export const reqAddCategory = (categoryName,parentId)=> ajax('/manage/category/add',{categoryName,parentId},'POST')
export const reqUpdateCategory = ({categoryName,categoryId})=> ajax('/manage/category/update',{categoryName,categoryId},'POST')

export const reqCategoryId = (categoryId)=> ajax('/manage/category/info',{categoryId})

export const reqProducts = (pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize})

export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>ajax('/manage/product/search',{pageNum,pageSize,[searchType]:searchName},'POST')

export const reqUpdateStatus = (productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST')


export const reqDeleteImg =(name)=>ajax('/manage/img/delete',{name},'POST')

export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')

export const reqRoles = ()=>ajax('/manage/role/list')


export const reqAddRole = (roleName)=>ajax('/manage/role/add',{roleName},'POST')

export const reqUpdateRole = (role)=>ajax('/manage/role/update',role,'POST')

export const reqUsers = ()=>ajax('/manage/user/list')

export const reqDeleteUser = (userId)=>ajax('/manage/user/delete',{userId},'POST')
