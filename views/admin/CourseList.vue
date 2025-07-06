<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!-- 查询表单 -->
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="课程编号">
            <el-input v-model="queryParams.course_id" placeholder="课程编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input v-model="queryParams.course_name" placeholder="课程名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="授课教师">
            <el-input v-model="queryParams.teacher" placeholder="授课教师" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="handleAdd" icon="el-icon-plus">新增课程</el-button>
          <el-button type="success" @click="exportExcel" icon="el-icon-download">导出Excel</el-button>
        </div>

        <!-- 数据表格 -->
        <el-table
          :data="tableData"
          border
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="course_id"
            label="课程编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="course_name"
            label="课程名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="teacher"
            label="授课教师"
            width="120">
          </el-table-column>
          <el-table-column
            label="课程封面"
            width="150">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 60px"
                :src="scope.row.image_url || defaultImage"
                :preview-src-list="[scope.row.image_url || defaultImage]"
                fit="cover">
              </el-image>
            </template>
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
        <el-form-item label="课程编号" prop="course_id">
          <el-input v-model="form.course_id" :disabled="!!form.id"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="course_name">
          <el-input v-model="form.course_name"></el-input>
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher"></el-input>
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="form.image_url" :src="form.image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">建议尺寸：300×200像素，大小不超过2MB</div>
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
import { formatDate } from '@/utils/date.js';

export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        course_id: '',
        course_name: '',
        teacher: ''
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,
      defaultImage: 'https://via.placeholder.com/100x60?text=No+Image',
      
      // 对话框相关
      dialogVisible: false,
      dialogTitle: '',
      submitLoading: false,
      form: {
        id: '',
        course_id: '',
        course_name: '',
        teacher: '',
        image_url: ''
      },
      rules: {
        course_id: [
          { required: true, message: '请输入课程编号', trigger: 'blur' }
        ],
        course_name: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请输入授课教师', trigger: 'blur' }
        ]
      },
      
      // 图片上传
      uploadUrl: import.meta.env.VITE_API_BASE_URL + '/upload',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
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
      this.$http.get('/api/course/list', { params: this.queryParams })
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
        course_id: '',
        course_name: '',
        teacher: ''
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
      this.dialogTitle = '新增课程';
      this.form = {
        id: '',
        course_id: '',
        course_name: '',
        teacher: '',
        image_url: ''
      };
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '编辑课程信息';
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
          const url = this.form.id ? '/api/course/update' : '/api/course/create';
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
      this.$confirm('确认删除该课程信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/api/course/delete/${row.id}`)
          .then(() => {
            this.$message.success('删除成功');
            this.getList();
          });
      });
    },
    
    // 导出Excel
    exportExcel() {
      this.loading = true;
      this.$http.get('/api/course/list', { 
        params: {
          ...this.queryParams,
          pageSize: this.total // 获取所有数据
        }
      }).then(response => {
        const data = response.data.list;
        
        // 准备Excel数据
        const excelData = [
          ['课程编号', '课程名称', '授课教师', '封面链接', '创建时间'],
          ...data.map(item => [
            item.course_id,
            item.course_name,
            item.teacher,
            item.image_url || '无',
            formatDate(item.created_at, 'yyyy-MM-dd hh:mm:ss')
          ])
        ];
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, '课程数据');
        
        // 设置列宽
        ws['!cols'] = [
          { wch: 15 }, // 课程编号
          { wch: 20 }, // 课程名称
          { wch: 15 }, // 授课教师
          { wch: 40 }, // 封面链接
          { wch: 20 }  // 创建时间
        ];
        
        // 导出文件
        XLSX.writeFile(wb, `课程信息_${formatDate(new Date(), 'yyyyMMdd')}.xlsx`);
      }).finally(() => {
        this.loading = false;
      });
    },
    
    // 格式化日期时间
    formatDateTime(date) {
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    
    // 图片上传前校验
    beforeUpload(file) {
      const isImage = file.type.includes('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB!');
      }
      return isImage && isLt2M;
    },
    
    // 图片上传成功
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.form.image_url = res.data.url;
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.msg || '上传失败');
      }
    }
  }
};
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>