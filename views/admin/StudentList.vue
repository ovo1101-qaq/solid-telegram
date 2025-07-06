<template>
    <section>
      <el-row>
        <el-col :span="24">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="学号">
              <el-input v-model="queryParams.student_id" placeholder="学号" clearable></el-input>
            </el-form-item>
            <el-form-item label="学生姓名">
              <el-input v-model="queryParams.name" placeholder="学生姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="入学年份">
              <el-date-picker
                v-model="queryParams.enrollment_year"
                type="year"
                placeholder="选择入学年份"
                value-format="yyyy"
                clearable>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="queryParams.major" placeholder="专业" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
  
          <!-- 操作按钮 -->
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增学生</el-button>
            <el-button type="success" @click="exportExcel" icon="el-icon-download">导出Excel</el-button>
          </div>
  
          <!-- 数据表格 -->
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="student_id"
              label="学号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="学生姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="enrollment_year"
              label="入学年份"
              width="120">
            </el-table-column>
            <el-table-column
              prop="major"
              label="专业">
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="180">
              <template slot-scope="scope">
                {{ formatDateTime(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
  
      <!-- 新增/编辑对话框 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="学号" prop="student_id">
            <el-input v-model="form.student_id"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="入学年份" prop="enrollment_year">
            <el-date-picker
              v-model="form.enrollment_year"
              type="year"
              placeholder="选择入学年份"
              value-format="yyyy"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="form.major"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import { formatDate } from '@/utils/date';
  
  export default {
    data() {
      return {
        // 查询参数
        queryParams: {
          page: 1,
          pageSize: 10,
          student_id: '',
          name: '',
          enrollment_year: '',
          major: ''
        },
        // 表格数据
        tableData: [],
        total: 0,
        loading: false,
        
        // 对话框相关
        dialogVisible: false,
        dialogTitle: '',
        submitLoading: false,
        form: {
          id: '',
          student_id: '',
          name: '',
          enrollment_year: '',
          major: ''
        },
        rules: {
          student_id: [
            { required: true, message: '请输入学号', trigger: 'blur' },
            { pattern: /^\d+$/, message: '学号必须为数字', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' }
          ],
          enrollment_year: [
            { required: true, message: '请选择入学年份', trigger: 'change' }
          ],
          major: [
            { required: true, message: '请输入专业', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取数据列表
      getList() {
        this.loading = true;
        this.$http.get('/api/student/list', { params: this.queryParams })
          .then(response => {
            this.tableData = response.data.list;
            this.total = response.data.total;
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
          student_id: '',
          name: '',
          enrollment_year: '',
          major: ''
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
      
      // 新增
      handleAdd() {
        this.dialogTitle = '新增学生';
        this.form = {
          id: '',
          student_id: '',
          name: '',
          enrollment_year: '',
          major: ''
        };
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      
      // 编辑
      handleEdit(row) {
        this.dialogTitle = '编辑学生信息';
        this.form = JSON.parse(JSON.stringify(row));
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      
      // 提交表单
      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            const url = this.form.id ? '/api/student/update' : '/api/student/create';
            const method = this.form.id ? 'put' : 'post';
            
            this.$http[method](url, this.form)
              .then(() => {
                this.$message.success('操作成功');
                this.dialogVisible = false;
                this.getList();
              })
              .finally(() => {
                this.submitLoading = false;
              });
          }
        });
      },
      
      // 删除
      handleDelete(row) {
        this.$confirm('确认删除该学生信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/api/student/delete/${row.id}`)
            .then(() => {
              this.$message.success('删除成功');
              this.getList();
            });
        });
      },
      
      // 导出Excel
      exportExcel() {
        this.loading = true;
        this.$http.get('/api/student/list', { 
          params: {
            ...this.queryParams,
            pageSize: this.total // 获取所有数据
          }
        }).then(response => {
          const data = response.data.list;
          
          // 准备Excel数据
          const excelData = [
            ['学号', '学生姓名', '入学年份', '专业', '创建时间'],
            ...data.map(item => [
              item.student_id,
              item.name,
              item.enrollment_year,
              item.major,
              formatDate(item.created_at, 'yyyy-MM-dd hh:mm:ss')
            ])
          ];
          
          // 创建工作簿
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(excelData);
          XLSX.utils.book_append_sheet(wb, ws, '学生数据');
          
          // 设置列宽
          ws['!cols'] = [
            { wch: 15 }, // 学号
            { wch: 15 }, // 学生姓名
            { wch: 12 }, // 入学年份
            { wch: 25 }, // 专业
            { wch: 20 }  // 创建时间
          ];
          
          // 导出文件
          XLSX.writeFile(wb, `学生信息_${formatDate(new Date(), 'yyyyMMdd')}.xlsx`);
        }).finally(() => {
          this.loading = false;
        });
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
  </style>