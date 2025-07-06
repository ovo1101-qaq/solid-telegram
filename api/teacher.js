import request from './index'

export default {
  // 获取教师列表
  getList(params) {
    return request({
      url: '/teachers',
      method: 'get',
      params
    })
  },
  
  // 添加教师
  create(data) {
    return request({
      url: '/teachers',
      method: 'post',
      data
    })
  },
  
  // 更新教师信息
  update(id, data) {
    return request({
      url: `/teachers/${id}`,
      method: 'put',
      data
    })
  },
  
  // 删除教师
  delete(id) {
    return request({
      url: `/teachers/${id}`,
      method: 'delete'
    })
  },
  
  // 分配课程
  assignCourse(teacherId, courseId) {
    return request({
      url: `/teachers/${teacherId}/courses/${courseId}`,
      method: 'post'
    })
  }
}