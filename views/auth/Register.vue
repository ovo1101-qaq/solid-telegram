<template>
    <div class="register-container">
      <el-card class="register-card">
        <h2 class="register-title">用户注册</h2>
        <el-form 
          :model="registerForm" 
          :rules="registerRules" 
          ref="registerForm" 
          label-width="100px"
          class="register-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" placeholder="3-16位字母数字组合"></el-input>
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入有效邮箱"></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="6-20位密码"
              show-password
            ></el-input>
            <div class="password-strength">
              <div :class="['strength-bar', strengthClass]"></div>
              <span class="strength-text">{{ strengthText }}</span>
            </div>
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="registerForm.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
              show-password
            ></el-input>
          </el-form-item>
          
          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="registerForm.role">
              <el-radio label="student">学生</el-radio>
              <el-radio label="teacher">教师</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="submitRegister"
              :loading="loading"
            >注册</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-link">
          已有账号? <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  import { validateUsername, validatePassword, validateEmail } from '@/utils/validate'
  
  export default {
    name: 'Register',
    data() {
      const validateConfirmPassword = (rule, value, callback) => {
        if (value !== this.registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
      
      return {
        registerForm: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        },
        registerRules: {
          username: [
            { required: true, trigger: 'blur', validator: validateUsername }
          ],
          email: [
            { required: true, trigger: 'blur', validator: validateEmail }
          ],
          password: [
            { required: true, trigger: 'blur', validator: validatePassword }
          ],
          confirmPassword: [
            { required: true, trigger: 'blur', validator: validateConfirmPassword }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ]
        },
        loading: false
      }
    },
    computed: {
      passwordStrength() {
        // 密码强度计算逻辑
        const password = this.registerForm.password
        if (!password) return 0
        
        let strength = 0
        if (password.length >= 6) strength++
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        
        return Math.min(strength, 4)
      },
      strengthClass() {
        return [
          'strength-' + this.passwordStrength,
          this.passwordStrength > 2 ? 'strong' : 'weak'
        ]
      },
      strengthText() {
        const texts = ['非常弱', '弱', '中等', '强', '非常强']
        return texts[this.passwordStrength]
      }
    },
    methods: {
      ...mapActions('auth', ['register']),
      submitRegister() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.register(this.registerForm)
              .then(() => {
                this.$message.success('注册成功')
                this.$router.push('/login')
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
      },
      resetForm() {
        this.$refs.registerForm.resetFields()
      }
    }
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  
  .register-card {
    width: 600px;
    padding: 30px;
  }
  
  .register-title {
    text-align: center;
    margin-bottom: 30px;
    color: #409EFF;
  }
  
  .register-form {
    margin-top: 20px;
  }
  
  .password-strength {
    margin-top: 8px;
  }
  
  .strength-bar {
    height: 6px;
    width: 100%;
    background-color: #ebeef5;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  
  .strength-bar::after {
    content: '';
    display: block;
    height: 100%;
    width: 0;
    background-color: #f56c6c;
    transition: width 0.3s, background-color 0.3s;
  }
  
  .strength-1::after {
    width: 25%;
    background-color: #f56c6c;
  }
  
  .strength-2::after {
    width: 50%;
    background-color: #e6a23c;
  }
  
  .strength-3::after {
    width: 75%;
    background-color: #67c23a;
  }
  
  .strength-4::after {
    width: 100%;
    background-color: #67c23a;
  }
  
  .strength-text {
    font-size: 12px;
    color: #909399;
  }
  
  .login-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
  </style>