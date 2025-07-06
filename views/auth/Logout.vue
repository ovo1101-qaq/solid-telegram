<template>
    <div class="logout-container">
      <el-card class="logout-card">
        <h2 class="logout-title">注销账户</h2>
        <div class="logout-warning">
          <el-alert
            title="警告"
            type="warning"
            description="此操作将永久删除您的账户和所有相关数据，且无法恢复。请谨慎操作！"
            show-icon
            :closable="false"
          />
        </div>
        
        <el-form 
          :model="logoutForm" 
          :rules="logoutRules" 
          ref="logoutForm" 
          label-width="100px"
          class="logout-form"
        >
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="logoutForm.password" 
              type="password" 
              placeholder="请输入密码确认注销"
              show-password
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="danger" 
              @click="confirmLogout"
              :loading="loading"
            >确认注销</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex'
  import { validatePassword } from '@/utils/validate'
  
  export default {
    name: 'Logout',
    data() {
      return {
        logoutForm: {
          password: ''
        },
        logoutRules: {
          password: [
            { required: true, trigger: 'blur', validator: validatePassword }
          ]
        },
        loading: false
      }
    },
    methods: {
      ...mapActions('auth', ['logoutAccount']),
      confirmLogout() {
        this.$refs.logoutForm.validate(valid => {
          if (valid) {
            this.$confirm('确定要永久删除您的账户吗?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.loading = true
              this.logoutAccount(this.logoutForm)
                .then(() => {
                  this.$message.success('账户已注销')
                  this.$router.push('/login')
                })
                .catch(() => {
                  this.loading = false
                })
            }).catch(() => {
              this.$message.info('已取消注销')
            })
          }
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
  }
  
  .logout-card {
    width: 600px;
    padding: 30px;
  }
  
  .logout-title {
    text-align: center;
    margin-bottom: 30px;
    color: #f56c6c;
  }
  
  .logout-warning {
    margin-bottom: 30px;
  }
  
  .logout-form {
    margin-top: 20px;
  }
  </style>