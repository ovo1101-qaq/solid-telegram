<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">教育管理系统登录</h2>
      <el-form 
        :model="loginForm" 
        :rules="loginRules" 
        ref="loginForm" 
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名/邮箱"></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
            @keyup.enter.native="submitLogin"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" @click="gotoForgotPassword" style="float: right;">忘记密码?</el-link>
          <el-link type="primary" @click="gotoRegister" style="float: right; margin-right: 15px;">注册新账号</el-link>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitLogin"
            :loading="loading"
            style="width: 100%;"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { validateUsername, validatePassword } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', ['login']),   // 命名空间格式

    
    // 登录提交
    submitLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.login(this.loginForm)
            .then(() => {
              this.$message.success('登录成功')
              // 确保跳转到首页或重定向页面
              const redirect = this.$route.query.redirect || '/'
              this.$router.push(redirect)
            })
            .catch((error) => {
              this.$message.error(error.message || '登录失败')
              this.loading = false
            })
        }
      })
    },
    
    // 跳转注册页面
    gotoRegister() {
      this.$router.push('/register')
    },
    
    // 跳转忘记密码页面
    gotoForgotPassword() {
      this.$router.push('/forgot-password')
    }
  }
  }

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d3a4b;
}

.login-card {
  width: 450px;
  padding: 30px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
  font-size: 24px;
}

.login-form {
  margin-top: 20px;
}
</style>