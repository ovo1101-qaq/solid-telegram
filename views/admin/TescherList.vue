<template>
    <section>
      <el-row>
        <el-col :span="24">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="教师编号">
              <el-input v-model="queryParams.teacher_id" placeholder="教师编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="教师姓名">
              <el-input v-model="queryParams.name" placeholder="教师姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="年龄范围">
              <el-input-number v-model="queryParams.min_age" :min="20" :max="100" placeholder="最小年龄"></el-input-number>
              <span style="margin: 0 10px">至</span>
              <el-input-number v-model="queryParams.max_age" :min="20" :max="100" placeholder="最大年龄"></el-input-number>
            </el-form-item>
            <el-form-item label="户籍所在地">
              <el-input v-model="queryParams.hometown" placeholder="户籍所在地" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
  
          <!-- 操作按钮 -->
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增教师</el-button>
            <el-button type="success" @click="exportExcel" icon="el-icon-download">导出Excel</el-button>
          </div>
  
          <!-- 数据表格 -->
          <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="teacher_id"
              label="教师编号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="教师姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="age"
              label="年龄"
              width="80">
            </el-table-column>
            <el-table-column
              prop="hometown"
              label="户籍所在地">
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
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="教师编号" prop="teacher_id">
            <el-input v-model="form.teacher_id" :disabled="!!form.id"></el-input>
          </el-form-item>
          <el-form-item label="教师姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="form.age" :min="20" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="户籍所在地" prop="hometown">
            <el-input v-model="form.hometown" type="textarea" :rows="3"></el-input>
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
          teacher_id: '',
          name: '',
          min_age: null,
          max_age: null,
          hometown: ''
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
          teacher_id: '',
          name: '',
          age: 30,
          hometown: ''
        },
        rules: {
          teacher_id: [
            { required: true, message: '请输入教师编号', trigger: 'blur' },
            { pattern: /^[A-Za-z0-9]+$/, message: '教师编号只能包含字母和数字' }
          ],
          name: [
            { required: true, message: '请输入教师姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请输入年龄', trigger: 'blur' },
            { type: 'number', min: 20, max: 100, message: '年龄应在20-100岁之间', trigger: 'blur' }
          ],
          hometown: [
            { required: true, message: '请输入户籍所在地', trigger: 'blur' }
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
        this.$http.get('/api/teacher/list', { params: this.queryParams })
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
          teacher_id: '',
          name: '',
          min_age: null,
          max_age: null,
          hometown: ''
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
        this.dialogTitle = '新增教师';
        this.form = {
          id: '',
          teacher_id: '',
          name: '',
          age: 30,
          hometown: ''
        };
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      
      // 编辑
      handleEdit(row) {
        this.dialogTitle = '编辑教师信息';
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
            const url = this.form.id ? '/api/teacher/update' : '/api/teacher/create';
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
        this.$confirm('确认删除该教师信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/api/teacher/delete/${row.id}`)
            .then(() => {
              this.$message.success('删除成功');
              this.getList();
            });
        });
      },
      
      // 导出Excel
      exportExcel() {
        this.loading = true;
        this.$http.get('/api/teacher/list', { 
          params: {
            ...this.queryParams,
            pageSize: this.total // 获取所有数据
          }
        }).then(response => {
          const data = response.data.list;
          
          // 准备Excel数据
          const excelData = [
            ['教师编号', '教师姓名', '年龄', '户籍所在地', '创建时间'],
            ...data.map(item => [
              item.teacher_id,
              item.name,
              item.age,
              item.hometown,
              formatDate(item.created_at, 'yyyy-MM-dd hh:mm:ss')
            ])
          ];
          
          // 创建工作簿
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(excelData);
          XLSX.utils.book_append_sheet(wb, ws, '教师数据');
          
          // 设置列宽
          ws['!cols'] = [
            { wch: 15 }, // 教师编号
            { wch: 12 }, // 教师姓名
            { wch: 8 },  // 年龄
            { wch: 25 }, // 户籍所在地
            { wch: 20 }  // 创建时间
          ];
          
          // 导出文件
          XLSX.writeFile(wb, `教师信息_${formatDate(new Date(), 'yyyyMMdd')}.xlsx`);
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
  
  .el-input-number {
    width: 120px;
  }
  </style>