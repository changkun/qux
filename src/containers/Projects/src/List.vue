<template>
  <div class="container">
    <el-row class="main grid__row-gutter">
      <el-col class="grid__col-gutter" :span="24">
        <el-tabs v-model="activeTab" v-loading="loading" @tab-click="toggleTab">
          <el-tab-pane v-for="tab in projectsTab" :label="tab.label" :name="tab.name" :key="tab.name">
            <div class="create">
              <el-button v-if="tab.label=='Inprogress'" type="primary" @click="dialogFormVisible = true">Create Project</el-button>
            </div>
            <project-item v-for="(project, index) in projects[tab.name]" :project="project" :key="index"></project-item>
            <div class="text-center no-content" v-if="noInprogress && tab.name=='inprogress'">
              No project, please create a new one :)
            </div>
            <div class="text-center no-content" v-if="noFinished && tab.name=='finished'">
              You don't have finished project yet :)
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-dialog title="Creating New Project" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="Project Name" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="6" v-model="form.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Upload Image" :label-width="formLabelWidth">
              <el-upload action="/api/projects/upload" list-type="picture-card" :on-success="handleUploadSuccess" :before-upload="beforePictureUpload" :on-change="handleChange" :on-remove="handleRemove">
                <i class="el-icon-upload"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="Project Duration" :label-width="formLabelWidth">
              <el-date-picker v-model="form.duration" type="daterange" align="right" unlink-panels range-separator=" - " start-placeholder="Start date" end-placeholder="End date" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="createProject">Confirm</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapActions,
  } from 'vuex'
  
  export default {
    name: 'ProjectsList',
    data() {
      return {
        projectsTab: [
          {
            name: 'inprogress',
            label: 'Inprogress',
          },
          {
            name: 'finished',
            label: 'Finished',
          },
        ],
        loading: false,
        activeTab: 'inprogress',
        page: 1,
        noInprogress: false,
        noFinished: false,
        dialogFormVisible: false,
        form: {
          name: '',
          description: '',
          image: '',
          date: '',
        },
        formLabelWidth: '120px',
        date_picker: '',
        pickerOptions: {
          shortcuts: [{
            text: 'A Week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // eslint-disable-next-line
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          }, {
            text: 'A Month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // eslint-disable-next-line
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          }, {
            text: 'Three Month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // eslint-disable-next-line
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          }, {
            text: 'Six Month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // eslint-disable-next-line
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            },
          }],
        },
        dialogVisible: false,
      }
    },
    computed: {
      ...mapState(['projects']),
      ...mapGetters(['currentUser']),
    },
    beforeRouteLeave(to, from, next) {
      next()
    },
    methods: {
      ...mapActions(['fetchProjects', 'createProjects']),
  
      toggleTab() {
        if (!this.noInprogress) {
          this.noInprogress = false
        }
        this.renderProjects()
      },
  
      // handling creat project dialogue
      createProject() {
        this.dialogFormVisible = false
        const start = new Date(this.form.duration[0])
        const end = new Date(this.form.duration[1])
        const diff = Math.abs(end.getTime() - start.getTime())
        const dur = Math.ceil(diff / (1000 * 3600 * 24))
        const newProject = {
          name: this.form.name,
          description: this.form.description,
          image: this.form.image,
          create_at: start.toISOString(),
          duration: dur,
        }
        return this.createProjects(newProject).then((data) => {
          if (data.success === false) {
            this.$message.error(data.reason)
          }
          this.form = {
            name: '',
            description: '',
            image: '',
            date: '',
          }
          this.noInprogress = false
          return Promise.resolve(data)
        }).catch((err) => {
          this.$message.error(err.message)
          return Promise.reject(err)
        })
      },
      // handling images
      handleRemove(file, fileList) {
        // do nothing
        return [file, fileList]
      },
      beforePictureUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 1
  
        if (!isJPG) {
          this.$message.error('Upload format must be .jpg!')
        }
        if (!isLt2M) {
          this.$message.error('Image size must lower than 1MB!')
        }
        return isJPG && isLt2M
      },
      handleChange(file, fileList) {
        // only allow 1 picture
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
      },
      handleUploadSuccess(payload) {
        this.form.image = payload.url
      },
  
      renderProjects() {
        return this.fetchProjects().then((data) => {
          if (data.inprogress.length === 0) {
            this.noInprogress = true
          }
          if (data.finished.length === 0) {
            this.noFinished = true
          }
          return Promise.resolve(data)
        }).catch((err) => {
          this.$message.error(err.message)
          return Promise.reject(err)
        })
      },
    },
    created() {
      this.loading = true
      this.renderProjects().then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
  }
</script>

<style lang="scss" scoped>
  @import "~styles/exports";
  .main {
    margin-top: $grid-gutter-width * 1.5;
  }
  
  .grid__row-gutter {
    margin-left: floor(-$grid-gutter-width / 2);
    margin-right: ceil(-$grid-gutter-width / 2);
  }
  
  .grid__col-gutter {
    padding-left: floor($grid-gutter-width / 2);
    padding-right: ceil($grid-gutter-width / 2);
  }
  
  .load-more {
    height: 60px;
    margin: 60px 0;
  }
  
  .load-more__btn {
    display: inline-block;
    padding: 10px 50px;
    font-size: 14px;
    border: 1px solid $primary;
    border-radius: 4px;
    color: $primary;
  }
  
  .load-more__btn:hover {
    color: #fff;
    background-color: $primary;
  }
  
  .no-content {
    a {
      display: block;
      margin: 100px 0;
      font-size: 16px;
      color: $blue;
    }
    margin-bottom: 200px;
  }
  
  .card {
    img {
      width: 100%;
      height: 200px;
    }
  }
  
  .create {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
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
