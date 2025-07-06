<template>
  <section>
    <el-row>
      <el-col :span="24">
        <!-- 查询表单 -->
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="课程编号" prop="course_id">
            <el-input 
              v-model="queryParams.course_id" 
              placeholder="请输入课程编号" 
              clearable
              @keyup.enter.native="handleQuery">
            </el-input>
          </el-form-item>
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

        <!-- 课程基本信息 -->
        <el-card v-if="courseInfo" class="info-card">
          <div slot="header" class="clearfix">
            <span>课程基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="info-item">
                <span class="info-label">课程编号：</span>
                <span class="info-value">{{ courseInfo.course_id }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="info-label">课程名称：</span>
                <span class="info-value">{{ courseInfo.course_name }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="info-label">授课教师：</span>
                <span class="info-value">{{ courseInfo.teacher }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <span class="info-label">学分：</span>
                <span class="info-value">{{ courseInfo.credit }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 学生基本信息 -->
        <el-card v-if="studentInfo" class="info-card" style="margin-top: 20px">
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

        <!-- 成绩录入表单 -->
        <el-card v-if="scoreInfo" class="score-form-card" style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span>成绩录入</span>
          </div>
          <el-form :model="scoreForm" :rules="scoreRules" ref="scoreForm" label-width="100px">
            <el-form-item label="当前成绩" prop="current_score">
              <el-tag :type="getScoreTagType(scoreInfo.score)" size="medium" style="margin-right: 10px">
                {{ scoreInfo.score || '未录入' }}
              </el-tag>
              <span v-if="scoreInfo.gpa" style="color: #606266">(绩点: {{ scoreInfo.gpa }})</span>
            </el-form-item>
            <el-form-item label="录入成绩" prop="score">
              <el-input-number 
                v-model="scoreForm.score" 
                :min="0" 
                :max="100" 
                :precision="1" 
                :step="0.5"
                placeholder="请输入0-100之间的成绩">
              </el-input-number>
              <span style="margin-left: 10px; color: #909399">(自动计算绩点: {{ calculatedGpa || '--' }})</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitScore" :loading="submitting">提交</el-button>
              <el-button @click="resetScoreForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 未找到记录提示 -->
        <el-card v-if="showNoDataTip" class="no-data-card" style="margin-top: 20px; text-align: center">
          <i class="el-icon-warning" style="font-size: 24px; color: #E6A23C"></i>
          <div style="margin-top: 10px; font-size: 16px">未找到匹配的课程或学生记录</div>
          <div style="margin-top: 5px; color: #909399">请检查输入的课程编号和学生学号是否正确</div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  data() {
    // 成绩验证规则
    const validateScore = (rule, value, callback) => {
      if (value === null || value === '') {
        callback(new Error('请输入成绩'));
      } else if (value < 0 || value > 100) {
        callback(new Error('成绩必须在0-100之间'));
      } else {
        callback();
      }
    };

    return {
      // 查询参数
      queryParams: {
        course_id: '',
        student_id: ''
      },
      // 课程信息
      courseInfo: null,
      // 学生信息
      studentInfo: null,
      // 成绩信息
      scoreInfo: null,
      // 成绩表单
      scoreForm: {
        score: null
      },
      // 表单规则
      scoreRules: {
        score: [
          { required: true, validator: validateScore, trigger: 'blur' }
        ]
      },
      loading: false,
      submitting: false,
      showNoDataTip: false
    };
  },
  computed: {
    // 计算绩点 (示例算法，可根据实际规则调整)
    calculatedGpa() {
      if (this.scoreForm.score === null) return null;
      const score = this.scoreForm.score;
      if (score >= 90) return '4.0';
      if (score >= 85) return '3.7';
      if (score >= 82) return '3.3';
      if (score >= 78) return '3.0';
      if (score >= 75) return '2.7';
      if (score >= 72) return '2.3';
      if (score >= 68) return '2.0';
      if (score >= 64) return '1.5';
      if (score >= 60) return '1.0';
      return '0.0';
    }
  },
  methods: {
    // 获取成绩信息
    getScoreInfo() {
      if (!this.queryParams.course_id || !this.queryParams.student_id) {
        this.$message.warning('请输入课程编号和学生学号');
        return;
      }

      this.loading = true;
      this.showNoDataTip = false;
      this.$http.get('/api/score/info', { 
        params: {
          course_id: this.queryParams.course_id,
          student_id: this.queryParams.student_id
        }
      })
        .then(response => {
          this.courseInfo = response.data.course_info;
          this.studentInfo = response.data.student_info;
          this.scoreInfo = response.data.score_info;
          if (!this.courseInfo || !this.studentInfo) {
            this.showNoDataTip = true;
          }
        })
        .catch(() => {
          this.resetData();
          this.showNoDataTip = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 查询
    handleQuery() {
      this.getScoreInfo();
    },
    
    // 重置查询
    resetQuery() {
      this.queryParams = {
        course_id: '',
        student_id: ''
      };
      this.resetData();
    },
    
    // 重置数据
    resetData() {
      this.courseInfo = null;
      this.studentInfo = null;
      this.scoreInfo = null;
      this.resetScoreForm();
      this.showNoDataTip = false;
    },
    
    // 重置成绩表单
    resetScoreForm() {
      this.scoreForm = {
        score: null
      };
      if (this.$refs.scoreForm) {
        this.$refs.scoreForm.resetFields();
      }
    },
    
    // 根据成绩获取标签类型
    getScoreTagType(score) {
      if (!score) return 'info';
      if (score >= 90) return 'success';
      if (score >= 80) return 'primary';
      if (score >= 60) return 'warning';
      return 'danger';
    },
    
    // 提交成绩
    submitScore() {
      this.$refs.scoreForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const params = {
            course_id: this.queryParams.course_id,
            student_id: this.queryParams.student_id,
            score: this.scoreForm.score,
            gpa: this.calculatedGpa
          };

          this.$http.post('/api/score/update', params)
            .then(() => {
              this.$message.success('成绩录入成功');
              this.getScoreInfo(); // 刷新数据
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      });
    }
  }
};
</script>

<style scoped>
.info-card {
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

.score-form-card {
  margin-top: 20px;
}

.no-data-card {
  padding: 30px 0;
}

.el-tag {
  font-size: 14px;
  padding: 0 10px;
  height: 28px;
  line-height: 28px;
}

.el-input-number {
  width: 200px;
}
</style>