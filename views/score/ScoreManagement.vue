<template>
    <div class="app-container">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="成绩录入" name="input" v-if="isTeacher">
          <el-card>
            <div class="filter-container">
              <el-select
                v-model="inputQuery.courseId"
                placeholder="选择课程"
                clearable
                style="width: 200px"
                class="filter-item"
                @change="handleInputFilter"
              >
                <el-option
                  v-for="item in teacherCourses"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-model="inputQuery.studentName"
                placeholder="学生姓名"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleInputFilter"
              />
            </div>
  
            <el-table
              :data="inputList"
              border
              fit
              highlight-current-row
              style="width: 100%; margin-top: 20px;"
            >
              <el-table-column label="学号" prop="studentId" align="center" width="120" />
              <el-table-column label="学生姓名" prop="studentName" align="center" width="120" />
              <el-table-column label="课程名称" prop="courseName" align="center" width="180" />
              <