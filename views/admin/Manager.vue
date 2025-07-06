<template>
    <div class="admin-container">
      <!-- 顶部导航栏 -->
      <el-header class="admin-header">
        <div class="header-title">教务管理系统</div>
        <div class="header-user">
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar icon="el-icon-user-solid"></el-avatar>
              <span style="margin-left: 10px">{{ username }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
  
      <!-- 主内容区 -->
      <el-main class="admin-main">
        <el-card class="welcome-card" shadow="hover">
          <div slot="header" class="clearfix">
            <h2>欢迎您，{{ username }} 管理员</h2>
            <p class="welcome-subtitle">请选择要管理的功能模块</p>
          </div>
  
          <!-- 功能按钮区 -->
          <el-row :gutter="20" class="button-group">
            <el-col :span="8">
              <el-card shadow="hover" class="function-card" @click.native="goToCourseList">
                <div class="card-icon">
                  <i class="el-icon-notebook-2"></i>
                </div>
                <h3>课程管理</h3>
                <p>管理课程信息、设置课程安排</p>
                <el-button type="primary" round>进入管理</el-button>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card shadow="hover" class="function-card" @click.native="goToStudentList">
                <div class="card-icon">
                  <i class="el-icon-user"></i>
                </div>
                <h3>学生管理</h3>
                <p>管理学生信息、学籍档案</p>
                <el-button type="success" round>进入管理</el-button>
              </el-card>
            </el-col>
            
            <el-col :span="8">
              <el-card shadow="hover" class="function-card" @click.native="goToTeacherList">
                <div class="card-icon">
                  <i class="el-icon-s-custom"></i>
                </div>
                <h3>教师管理</h3>
                <p>管理教师信息、教学任务</p>
                <el-button type="warning" round>进入管理</el-button>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-main>
  
      <!-- 页脚 -->
      <el-footer class="admin-footer">
        © 2023 教务管理系统 - 管理员后台
      </el-footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: localStorage.getItem('username') || '管理员'
      }
    },
    methods: {
      // 跳转到课程管理
      goToCourseList() {
        this.$router.push('/courselist');
      },
      // 跳转到学生管理
      goToStudentList() {
        this.$router.push('/studentlist');
      },
      // 跳转到教师管理
      goToTeacherList() {
        this.$router.push('/teacherlist');
      },
      // 退出登录
      logout() {
        this.$confirm('确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.$router.push('/login');
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
  }
  
  .admin-header {
    background-color: #409EFF;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  }
  
  .header-title {
    font-size: 20px;
    font-weight: bold;
  }
  
  .header-user {
    display: flex;
    align-items: center;
  }
  
  .el-dropdown-link {
    display: flex;
    align-items: center;
    color: white;
    cursor: pointer;
  }
  
  .admin-main {
    flex: 1;
    padding: 20px;
    background-color: #f5f7fa;
  }
  
  .welcome-card {
    margin-bottom: 20px;
    border-radius: 8px;
  }
  
  .welcome-subtitle {
    color: #909399;
    margin-top: 10px;
    font-size: 16px;
  }
  
  .button-group {
    margin-top: 30px;
  }
  
  .function-card {
    text-align: center;
    padding: 30px 20px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 8px;
    height: 100%;
  }
  
  .function-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-icon {
    font-size: 50px;
    color: #409EFF;
    margin-bottom: 20px;
  }
  
  .function-card h3 {
    margin-bottom: 15px;
    color: #303133;
  }
  
  .function-card p {
    color: #909399;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .admin-footer {
    text-align: center;
    line-height: 60px;
    color: #909399;
    background-color: #e9eef3;
    font-size: 14px;
  }
  </style>