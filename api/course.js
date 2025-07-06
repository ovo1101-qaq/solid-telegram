import request from './index'

export default {
  // 获取课程列表
  getList(params) {
    return request({
      url: '/courses',
      method: 'get',
      params
    })
  },
  
  // 添加课程
  create(data) {
    return request({
      url: '/courses',
      method: 'post',
      data
    })
  },
  
  // 更新课程
  update(id, data) {
    return request({
      url: `/courses/${id}`,
      method: 'put',
      data
    })
  },
  
  // 删除课程
  delete(id) {
    return request({
      url: `/courses/${id}`,
      method: 'delete'
    })
  },
  
  // 批量导入课程
  import(data) {
    return request({
      url: '/courses/import',
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    })
  }
}