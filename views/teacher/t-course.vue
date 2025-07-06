<template>
    <section>
      <el-row>
        <el-col :span="24">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="课程号">
              <el-input v-model="queryParams.course_id" placeholder="课程号" clearable></el-input>
            </el-form-item>
            <el-form-item label="课程名称">
              <el-input v-model="queryParams.course_name" placeholder="课程名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="学生学号">
              <el-input v-model="queryParams.student_id" placeholder="学生学号" clearable></el-input>
            </el-form-item>
            <el-form-item label="学生姓名">
              <el-input v-model="queryParams.student_name" placeholder="学生姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
  
          <!-- 数据表格 -->
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="course_id"
              label="课程号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="course_name"
              label="课程名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="student_id"
              label="学号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="student_name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="credit"
              label="学分"
              width="80">
            </el-table-column>
            <el-table-column
              prop="teacher"
              label="授课老师"
              width="150">
            </el-table-column>
            <el-table-column
              label="成绩"
              width="150">
              <template slot-scope="scope">
                <el-input-number
                  v-if="scope.row.editable"
                  v-model="scope.row.score"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="1"
                  size="mini"
                  controls-position="right"
                  style="width: 100px"
                ></el-input-number>
                <span v-else>{{ scope.row.score || '未录入' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              fixed="right">
              <template slot-scope="scope">
                <el-button 
                  v-if="!scope.row.editable"
                  size="mini" 
                  type="primary"
                  @click="handleEdit(scope.row)">
                  修改成绩
                </el-button>
                <el-button 
                  v-if="scope.row.editable"
                  size="mini" 
                  type="success"
                  @click="saveScore(scope.row)">
                  保存
                </el-button>
                <el-button 
                  v-if="scope.row.editable"
                  size="mini" 
                  @click="cancelEdit(scope.row)">
                  取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
  
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryParams.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="queryParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </section>
  </template>
  
  <script>
  import { formatDate } from '@/utils/date';
  
  export default {
    data() {
      return {
        // 查询参数
        queryParams: {
          page: 1,
          pageSize: 10,
          course_id: '',
          course_name: '',
          student_id: '',
          student_name: ''
        },
        // 表格数据
        tableData: [],
        total: 0,
        loading: false,
        
        // 原始数据备份
        originalData: []
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取成绩列表
      getList() {
        this.loading = true;
        this.$http.get('/api/score/list', { params: this.queryParams })
          .then(response => {
            this.tableData = response.data.list.map(item => ({
              ...item,
              editable: false,
              originalScore: item.score
            }));
            this.total = response.data.total;
            this.originalData = JSON.parse(JSON.stringify(this.tableData));
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 查询
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      
      // 重置查询
      resetQuery() {
        this.queryParams = {
          page: 1,
          pageSize: 10,
          course_id: '',
          course_name: '',
          student_id: '',
          student_name: ''
        };
        this.getList();
      },
      
      // 分页大小改变
      handleSizeChange(val) {
        this.queryParams.pageSize = val;
        this.getList();
      },
      
      // 当前页改变
      handleCurrentChange(val) {
        this.queryParams.page = val;
        this.getList();
      },
      
      // 编辑成绩
      handleEdit(row) {
        // 取消其他行的编辑状态
        this.tableData.forEach(item => {
          if (item.editable && item.id !== row.id) {
            item.editable = false;
            item.score = item.originalScore;
          }
        });
        
        row.editable = true;
      },
      
      // 保存成绩
      saveScore(row) {
        if (row.score === null || row.score === undefined) {
          this.$message.error('请输入成绩');
          return;
        }
        
        this.loading = true;
        this.$http.post('/api/score/update', {
          id: row.id,
          score: row.score
        })
          .then(() => {
            this.$message.success('成绩更新成功');
            row.editable = false;
            row.originalScore = row.score;
            this.originalData = JSON.parse(JSON.stringify(this.tableData));
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 取消编辑
      cancelEdit(row) {
        row.editable = false;
        row.score = row.originalScore;
      },
      
      // 格式化日期时间
      formatDateTime(date) {
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination-container {
    margin-top: 20px;
    text-align: center;
  }
  
  /* 成绩输入框样式 */
  .el-input-number {
    width: 100px;
  }
  
  /* 操作按钮间距 */
  .el-button {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  </style>