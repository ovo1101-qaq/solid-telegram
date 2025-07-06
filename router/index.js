import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue' 

Vue.use(VueRouter) 

const router = new VueRouter({
    mode: 'hash',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue')
      },
      {
        path:'/logout',
        name:'Logout',
        component:() => import('@/views/auth/Logout.vue')
      },
      {
        path:'/courselist',
        name:'CourseList',
        component:() => import('@/views/admin/CourseList.vue')
      },
      {
        path:'/studentlist',
        name:'StudentList',
        component:() => import('@/views/admin/StudentList.vue')
      },
      {
        path:'/teacherlist',
        name:'TeacherList',
        component:() => import('@/views/admin/TeacherList.vue')
      },
      {
        path:'/choosecourse',
        name:'ChooseCourse',
        component:() => import('@/views/student/ChooseCourse.vue')
      },
      {
        path:'/queryscore',
        name:'QueryScore',
        component:() => import('@/views/student/QueryScore.vue')
      },
      {
        path:'/score',
        name:'Score',
        component:() => import('@/views/teacher/Score.vue')
      },
      {
        path:'/manager',
        name:'Manager',
        component:() => import('@/views/admin/Manager.vue')
      }
   ]
  })
  
  export default router
