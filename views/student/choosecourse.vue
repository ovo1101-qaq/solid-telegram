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
            <el-form-item label="授课老师">
              <el-input v-model="queryParams.teacher" placeholder="授课老师" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" :loading="loading">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
  
          <!-- 操作按钮 -->
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="getMyCourses" icon="el-icon-collection">我的课程</el-button>
            <el-button type="success" @click="exportExcel" icon="el-icon-download">导出课表</el-button>
          </div>
  
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
              prop="teacher"
              label="授课老师"
              width="150">
            </el-table-column>
            <el-table-column
              prop="credit"
              label="学分"
              width="80">
            </el-table-column>
            <el-table-column
              prop="time"
              label="上课时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="classroom"
              label="教室"
              width="120">
            </el-table-column>
            <el-table-column
              label="课程图片"
              width="180">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 60px"
                  :src="scope.row.image_url"
                  :preview-src-list="[scope.row.image_url]"
                  fit="cover">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="selected_count"
              label="已选人数"
              width="100">
              <template slot-scope="scope">
                {{ scope.row.selected_count }}/{{ scope.row.capacity }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  :type="scope.row.is_selected ? 'danger' : 'primary'"
                  @click="toggleCourseSelection(scope.row)">
                  {{ scope.row.is_selected ? '退选' : '选课' }}
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
  
      <!-- 我的课程对话框 -->
      <el-dialog title="我的课程" :visible.sync="myCoursesDialogVisible" width="70%">
        <el-table
          :data="myCoursesData"
          border
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
            prop="teacher"
            label="授课老师"
            width="150">
          </el-table-column>
          <el-table-column
            prop="credit"
            label="学分"
            width="80">
          </el-table-column>
          <el-table-column
            prop="time"
            label="上课时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="classroom"
            label="教室"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button 
                size="mini" 
                type="danger"
                @click="withdrawCourse(scope.row)">
                退选
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="myCoursesDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="exportMyCourses">导出课表</el-button>
        </div>
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
          course_id: '',
          course_name: '',
          teacher: ''
        },
        // 表格数据
        tableData: [],
        total: 0,
        loading: false,
        
        // 我的课程相关
        myCoursesDialogVisible: false,
        myCoursesData: [],
        
        // 学生信息
        studentInfo: {
          id: '20230001',
          name: '张三',
          major: '计算机科学与技术'
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取可选课程列表
      getList() {
        this.loading = true;
        this.$http.get('/api/course/available', { 
          params: {
            ...this.queryParams,
            student_id: this.studentInfo.id
          }
        })
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
      
      // 获取我的课程
      getMyCourses() {
        this.loading = true;
        this.$http.get('/api/course/selected', { 
          params: {
            student_id: this.studentInfo.id
          }
        })
          .then(response => {
            this.myCoursesData = response.data;
            this.myCoursesDialogVisible = true;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 选课/退选切换
      toggleCourseSelection(row) {
        const action = row.is_selected ? 'withdraw' : 'select';
        this.loading = true;
        
        this.$http.post(`/api/course/${action}`, {
          course_id: row.id,
          student_id: this.studentInfo.id
        })
          .then(() => {
            this.$message.success(row.is_selected ? '退选成功' : '选课成功');
            this.getList();
            if (this.myCoursesDialogVisible) {
              this.getMyCourses();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      
      // 从我的课程对话框退选
      withdrawCourse(row) {
        this.$confirm('确认退选该课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          this.$http.post('/api/course/withdraw', {
            course_id: row.id,
            student_id: this.studentInfo.id
          })
            .then(() => {
              this.$message.success('退选成功');
              this.getList();
              this.getMyCourses();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      
      // 导出所有课程Excel
      exportExcel() {
        this.loading = true;
        this.$http.get('/api/course/available', { 
          params: {
            ...this.queryParams,
            pageSize: this.total // 获取所有数据
          }
        }).then(response => {
          const data = response.data.list;
          
          // 准备Excel数据
          const excelData = [
            ['课程号', '课程名称', '授课老师', '学分', '上课时间', '教室', '已选人数/容量'],
            ...data.map(item => [
              item.course_id,
              item.course_name,
              item.teacher,
              item.credit,
              item.time,
              item.classroom,
              `${item.selected_count}/${item.capacity}`
            ])
          ];
          
          // 创建工作簿
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(excelData);
          XLSX.utils.book_append_sheet(wb, ws, '可选课程');
          
          // 设置列宽
          ws['!cols'] = [
            { wch: 15 }, // 课程号
            { wch: 20 }, // 课程名称
            { wch: 15 }, // 授课老师
            { wch: 8 },  // 学分
            { wch: 20 }, // 上课时间
            { wch: 12 }, // 教室
            { wch: 15 }  // 人数
          ];
          
          // 导出文件
          XLSX.writeFile(wb, `可选课程_${formatDate(new Date(), 'yyyyMMdd')}.xlsx`);
        }).finally(() => {
          this.loading = false;
        });
      },
      
      // 导出我的课程Excel
      exportMyCourses() {
        this.loading = true;
        
        // 准备Excel数据
        const excelData = [
          ['学号', '姓名', '专业', '课程号', '课程名称', '授课老师', '学分', '上课时间', '教室'],
          ...this.myCoursesData.map(item => [
            this.studentInfo.id,
            this.studentInfo.name,
            this.studentInfo.major,
            item.course_id,
            item.course_name,
            item.teacher,
            item.credit,
            item.time,
            item.classroom
          ])
        ];
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, '我的课程');
        
        // 设置列宽
        ws['!cols'] = [
          { wch: 12 }, // 学号
          { wch: 10 }, // 姓名
          { wch: 20 }, // 专业
          { wch: 15 }, // 课程号
          { wch: 20 }, // 课程名称
          { wch: 15 }, // 授课老师
          { wch: 8 },  // 学分
          { wch: 20 }, // 上课时间
          { wch: 12 }  // 教室
        ];
        
        // 导出文件
        XLSX.writeFile(wb, `我的课程_${this.studentInfo.name}_${formatDate(new Date(), 'yyyyMMdd')}.xlsx`);
        this.loading = false;
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
  
  /* 选课按钮样式 */
  .el-button--primary {
    margin-right: 10px;
  }
  
  /* 我的课程表格样式 */
  .my-courses-table {
    margin-top: 20px;
  }
  </style>