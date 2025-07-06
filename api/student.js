import request from './index'

export default {
  // 获取学生列表
  getList(params) {
    return request({
      url: '/students',
      method: 'get',
      params
    })
  },
  
  // 添加学生
  create(data) {
    return request({
      url: '/students',
      method: 'post',
      data
    })
  },
  
  // 更新学生信息
  update(id, data) {
    return request({
      url: `/students/${id}`,
      method: 'put',
      data
    })
  },
  
  // 删除学生
  delete(id) {
    return request({
      url: `/students/${id}`,
      method: 'delete'
    })
  },
  
  // 导出学生数据
  export(params) {
    return request({
      url: '/students/export',
      method: 'get',
      params,
      responseType: 'blob'
    })
  }
}