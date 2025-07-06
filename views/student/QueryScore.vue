<template>
    <section>
      <el-row>
        <el-col :span="24">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="学生学号" prop="student_id">
              <el-input 
                v-model="queryParams.student_id" 
                placeholder="请输入学生学号" 
                clearable
                @keyup.enter.native="handleQuery">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
  
          <!-- 学生基本信息 -->
          <el-card v-if="studentInfo" class="student-info-card">
            <div slot="header" class="clearfix">
              <span>学生基本信息</span>
            </div>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="info-item">
                  <span class="info-label">学号：</span>
                  <span class="info-value">{{ studentInfo.student_id }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-item">
                  <span class="info-label">姓名：</span>
                  <span class="info-value">{{ studentInfo.name }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-item">
                  <span class="info-label">专业：</span>
                  <span class="info-value">{{ studentInfo.major }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-item">
                  <span class="info-label">班级：</span>
                  <span class="info-value">{{ studentInfo.class }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
  
          <!-- 数据表格 -->
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%; margin-top: 20px">
            <el-table-column
              prop="course_id"
              label="课程号"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="course_name"
              label="课程名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="credit"
              label="学分"
              width="80"
              align="center">
            </el-table-column>
            <el-table-column
              prop="teacher"
              label="授课教师"
              width="150">
            </el-table-column>
            <el-table-column
              prop="score"
              label="成绩"
              width="120"
              align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="getScoreTagType(scope.row.score)"
                  effect="dark">
                  {{ scope.row.score || '未录入' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="gpa"
              label="绩点"
              width="120"
              align="center">
              <template slot-scope="scope">
                {{ scope.row.gpa || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="semester"
              label="学期"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              fixed="right"
              align="center">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  type="primary"
                  @click="viewCourseDetail(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
  
          <!-- 统计信息 -->
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-title">已修课程数</div>
                <div class="stat-value">{{ stats.course_count || 0 }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-title">总学分</div>
                <div class="stat-value">{{ stats.total_credits || 0 }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-title">平均成绩</div>
                <div class="stat-value">{{ stats.avg_score ? stats.avg_score.toFixed(1) : '--' }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="stat-card">
                <div class="stat-title">平均绩点</div>
                <div class="stat-value">{{ stats.avg_gpa ? stats.avg_gpa.toFixed(2) : '--' }}</div>
              </el-card>
            </el-col>
          </el-row>
  
          <!-- 课程详情对话框 -->
          <el-dialog title="课程详情" :visible.sync="detailDialogVisible" width="50%">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="课程号">{{ currentCourse.course_id }}</el-descriptions-item>
              <el-descriptions-item label="课程名称">{{ currentCourse.course_name }}</el-descriptions-item>
              <el-descriptions-item label="学分">{{ currentCourse.credit }}</el-descriptions-item>
              <el-descriptions-item label="授课教师">{{ currentCourse.teacher }}</el-descriptions-item>
              <el-descriptions-item label="上课时间">{{ currentCourse.class_time }}</el-descriptions-item>
              <el-descriptions-item label="教室">{{ currentCourse.classroom }}</el-descriptions-item>
              <el-descriptions-item label="学期">{{ currentCourse.semester }}</el-descriptions-item>
              <el-descriptions-item label="成绩">
                <el-tag :type="getScoreTagType(currentCourse.score)" size="medium">
                  {{ currentCourse.score || '未录入' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="绩点">{{ currentCourse.gpa || '--' }}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
              <el-button @click="detailDialogVisible = false">关闭</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 查询参数
        queryParams: {
          student_id: ''
        },
        // 表格数据
        tableData: [],
        // 学生信息
        studentInfo: null,
        // 统计信息
        stats: {},
        loading: false,
        // 课程详情对话框
        detailDialogVisible: false,
        currentCourse: {}
      };
    },
    methods: {
      // 获取学生成绩列表
      getList() {
        if (!this.queryParams.student_id) {
          this.$message.warning('请输入学生学号');
          return;
        }
  
        this.loading = true;
        this.$http.get('/api/student/scores', { 
          params: {
            student_id: this.queryParams.student_id
          }
        })
          .then(response => {
            this.tableData = response.data.courses;
            this.studentInfo = response.data.student_info;
            this.stats = response.data.stats;
          })
          .catch(() => {
            this.tableData = [];
            this.studentInfo = null;
            this.stats = {};
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 查询
      handleQuery() {
        this.getList();
      },
      
      // 重置查询
      resetQuery() {
        this.queryParams.student_id = '';
        this.tableData = [];
        this.studentInfo = null;
        this.stats = {};
      },
      
      // 根据成绩获取标签类型
      getScoreTagType(score) {
        if (!score) return 'info';
        if (score >= 90) return 'success';
        if (score >= 80) return 'primary';
        if (score >= 60) return 'warning';
        return 'danger';
      },
      
      // 查看课程详情
      viewCourseDetail(row) {
        this.currentCourse = row;
        this.detailDialogVisible = true;
      }
    }
  };
  </script>
  
  <style scoped>
  .student-info-card {
    margin-bottom: 20px;
  }
  
  .info-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .info-label {
    color: #909399;
    font-weight: bold;
  }
  
  .info-value {
    color: #606266;
  }
  
  .stat-card {
    text-align: center;
    height: 120px;
  }
  
  .stat-title {
    font-size: 16px;
    color: #909399;
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #409EFF;
  }
  
  .el-tag {
    font-size: 14px;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: center;
  }
  </style>