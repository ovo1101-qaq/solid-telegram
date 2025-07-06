<!-- src/views/Home.vue -->
<template>
    <div class="welcome-container">
      <img src="https://element.eleme.cn/static/theme-index-blue.c38b733.png" alt="Logo" class="logo">
      
      <div class="welcome-card">
        <h2 class="welcome-title">欢迎使用后台管理系统</h2>
        <p class="welcome-description">
          这是一个基于Vue.js和Element UI构建的教学管理系统
        </p>
        <div class="action-buttons">
          <button @click="goToLogin" class="btn btn-login">登录</button>
          <button @click="goToRegister" class="btn btn-register">注册</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    methods: {
      goToLogin() {
        console.log('尝试跳转到登录页') // 调试用
        this.$router.push('/login').catch(err => {
          console.error('路由跳转错误:', err)
        })
    },
      goToRegister() {
        this.$router.push('/register').catch(err => {
          console.error('路由跳转错误:', err)
        })
    }
}
  }
  </script>
  
  <style scoped>
  body {
            margin: 0;
            padding: 0;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
            background-color: #f5f7fa;
            color: #333;
        }
        
        .welcome-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .welcome-card {
            width: 450px;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            background-color: #fff;
            text-align: center;
        }
        
        .welcome-title {
            font-size: 24px;
            margin-bottom: 20px;
            color: #409EFF;
        }
        
        .welcome-description {
            font-size: 14px;
            color: #909399;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn-login {
      background-color: #409EFF;
      color: white;
    }
    .btn-register {
      background-color: #67C23A;
      color: white;
    }
        
        .start-button {
            width: 200px;
            height: 50px;
            font-size: 16px;
        }
        
        .logo {
            width: 120px;
            margin-bottom: 30px;
        }
  </style>