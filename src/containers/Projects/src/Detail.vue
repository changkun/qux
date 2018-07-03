<template>
  <div id="pdf" class="project-detail container" v-loading="loading">
    <div class="project-detail__information">
      <project-item :project="project"></project-item>
      <div class="project-detail__footer clearfix">
        <div class="project__links project-detail__meta pull-left">
          <el-input
            :value="openQURL"
            :readonly="true"
            @click.native="selectAll"
            >
            <el-button ref="btn" slot="append" icon="share" :disable="loading">
            </el-button>
          </el-input>
        </div>
        <div class="project-detail__toolbar pull-right">
          <el-button type="success" icon="document" @click="downloadJSON">
          Download Raw Data
          </el-button>
          <!-- <el-button type="success" icon="document" @click="downloadDetails">PDF</el-button> -->
          <el-button type="primary" icon="edit" @click="dialogFormVisible = true"></el-button>
          <el-button type="danger" icon="delete" @click="deleteDialogFormVisible = true"></el-button>
        </div>
      </div>
      <calendar-chart v-if="participantData !== null" :calendarData="participantData"/>

    </div>

    <el-dialog title="Edit Project Settings" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Project Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="6" v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Cover Image" :label-width="formLabelWidth">
          <el-upload action="/api/projects/upload"
            list-type="picture-card"
            :file-list="this.form.image"
            :on-success="handleUploadSuccess"
            :before-upload="beforePictureUpload"
            :on-change="handleChange"
            :on-remove="handleRemove">
            <i class="el-icon-upload"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="Time Duration" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.duration"
            type="daterange"
            align="right"
            unlink-panels
            range-separator=" - "
            start-placeholder="Start date"
            end-placeholder="End date"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editProject">Save Changes</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="Warning"
      :visible.sync="deleteDialogFormVisible"
      width="30%"
      center>
      <span>You are deleting the project!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteProject">Confirm</el-button>
        <el-button @click="deleteDialogFormVisible = false">Cancel</el-button>
      </span>
    </el-dialog>

    <div class="results" v-loading="loading">
      <div class="results__header">
        <h3 class="results__title">Current Results Analysis</h3>
        <p>
          The following charts are based on your participants answers.
        </p>
        <p>
          You can download your whole data set by clicking on the green download button  for further analyses.
        </p>
      </div>

      <el-collapse v-model="activeNames">
      <div class="charts">

        <el-collapse-item :title="'How did your users evaluate the UX?'" :name="0">
          <radar-chart v-if="participantData !== null" :radarData="participantData"/>
        </el-collapse-item>

        <el-collapse-item :title="'What is the age distribution of your participants?'" :name="1">
          <age-chart v-if="participantData !== null" :ageData="participantData"/>
        </el-collapse-item>

        <el-collapse-item :title="'How your participants geographical distributed?'" :name="2">
          <geo-chart v-if="participantData !== null" :geoData="participantData"/>
        </el-collapse-item>

        <el-collapse-item :title="'What are your participants occupation?'" :name="3">
          <occu-chart v-if="participantData !== null" :occuData="participantData"/>
        </el-collapse-item>

      </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapGetters, mapActions } from 'vuex'
import * as projectServices from '@/services/projects'
import * as Clipboard from 'clipboard'
import * as JsPDF from 'jspdf'
import * as FileSaver from 'file-saver'
import * as html2canvas from 'html2canvas'

export default {
  name: 'ProjectDetail',
  data() {
    return {
      data: [],
      activeNames: [0,1,2,3],
      loading: true,
      project: {},
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        name: '',
        description: '',
        image: '',
        duration: [],
        participants: [],
      },
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
      deleteDialogFormVisible: false,
      participantData: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.clipboard = new Clipboard(this.$refs.btn.$el, {
        text: () => `${window.location.origin}/questionaire?code=${this.project.uuid}`,
      })
      this.clipboard.on('success', (e) => {
        this.$message.success('Questionaire URL has copied successfuly.')
        return e
      })
    })
  },
  components: {
  },
  computed: {
    ...mapState(['projects']),
    ...mapGetters(['currentUser', 'isLogedIn']),
    openQURL() {
      return `${window.location.origin}/questionaire?code=${this.project.uuid}`
    },
  },
  methods: {
    ...mapActions(['editProjectById', 'deleteProjectById']),
    mapProjectDate(project) {
      const today = new Date()
      const start = new Date(project.create_at)
      const duration = project.duration
      const end = new Date()
      // eslint-disable-next-line
      end.setTime(start.getTime() + 3600 * 1000 * 24 * duration)

      if (today < end) {
        const remains = Math.abs(end.getTime() - today.getTime())
        const remainDays = Math.ceil(remains / (1000 * 3600 * 24))
        return `Project starts from ${start.toDateString()} | remains ${remainDays} days`
      }
      return `Project ends at ${end.toDateString()}`
    },
    // handling creat project dialogue
    editProject() {
      this.dialogFormVisible = false
      const start = new Date(this.form.duration[0])
      const end = new Date(this.form.duration[1])
      const diff = Math.abs(end.getTime() - start.getTime())
      const dur = Math.ceil(diff / (1000 * 3600 * 24))
      const editProject = {
        id: this.form.id,
        name: this.form.name,
        description: this.form.description,
        image: this.form.image[0],
        create_at: start.toISOString(),
        duration: dur,
      }

      return this.editProjectById(editProject).then((response) => {
        if (response.success === false) {
          this.$message.error(response.reason)
        }
        const { id } = this.$route.params
        projectServices.fetchProjectById(id).then((data) => {
          this.project = data.project
          this.project.duration = editProject.duration
          this.project.create_at = editProject.create_at
          this.loading = false
          this.form.id = editProject.id
          this.form.name =editProject.name
          this.form.description = editProject.description
          this.form.image = [editProject.image]
          this.form.participants = this.project.participants

          const start = this.project.create_at
          const duration = this.project.duration
          const temp = new Date()
          temp.setTime((new Date(start)).getTime() + 3600 * 1000 * 24 * duration)
          const end = temp.toISOString()
          this.form.duration = [start, end]
        }).catch(err => this.$message.error(err.message))

        return Promise.resolve(response)
      }).catch((err) => {
        this.$message.error(err.message)
        return Promise.reject(err)
      })
    },
    // handling images
    handleRemove(file, fileList) {
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
      this.form.image = [payload.url]
    },

    deleteProject() {
      this.deleteDialogFormVisible = false
      const deleteProject = {
        id: this.form.id,
      }
      return this.deleteProjectById(deleteProject).then((response) => {
        if (response.success === false) {
          this.$message.error(response.reason)
        }
        this.$router.replace('/projects')
        return Promise.resolve(response)
      }).catch((err) => {
        this.$message.error(err.message)
        return Promise.reject(err)
      })
    },
    downloadDetails() {
      html2canvas(document.getElementById('pdf')).then((canvas) => {
        const img = canvas.toDataURL('image/png');
        const doc = new JsPDF('p', 'mm', 'a4');
        const width = doc.internal.pageSize.width;
        const height = doc.internal.pageSize.height;
        doc.addImage(img, 'JPEG', 0, 0, width, height);
        doc.save(`${this.form.name}.pdf`);
      })
    },
    downloadJSON() {
      const blob = new Blob([JSON.stringify(this.form, null, 2)], {
        type: 'text/json;charset=utf-8',
      })
      FileSaver.saveAs(blob, `${this.form.name}.json`)
    },
  },
  selectQuestionaireURL() {
    const url = this.$children[0].$el.querySelector('input')
    url.select()
  },
  created() {
    const { id } = this.$route.params
    projectServices.fetchProjectById(id).then((data) => {
      this.project = data.project
      this.loading = false
      this.form.id = this.project.id
      this.form.name = this.project.name
      this.form.description = this.project.description
      this.form.image = [{
        url: window.location.origin + this.project.image,
      }]

      const start = this.project.create_at
      const duration = this.project.duration
      const temp = new Date()
      // eslint-disable-next-line
      temp.setTime((new Date(start)).getTime() + 3600 * 1000 * 24 * duration)
      const end = temp.toISOString()
      this.form.duration = [start, end]
      this.form.participants = this.project.participants

      this.participantData = this.project.participants
    }).catch(err => this.$message.error(err.message))
  },
}
</script>

<style lang="scss" scoped>
@import "~styles/exports";
.result {
  margin-top: 30px;
  margin-bottom: 30px;
}
.project-detail {
  width: 80%;

  &__information {
    padding: 20px;
    border: 1px solid $gray-extra-light;
    border-radius: 6px;
    background-color: $drak-white;
  }

  &__icon {
    font-size: 24px;
  }

  &__toolbtn {
    margin-left: 10px;
  }

  &__footer {
    margin-top: 20px;
  }
}

.project__links {
  padding-left: 20px;
  line-height: 36px;
  .el-input {
    width: 420px;
  }
}

.project__link {
  font-size: 14px;
  color: $silver;

  &:after {
    margin: 0 6px 0 10px;
    color: #c0ccda;
  }

  &:last-child:after {
    display: none;
    content: "";
  }

  &:hover {
    color: $primary;
  }
}

.radar {
  padding: 100px;
}
.results {
  position: relative;
  margin-top: 60px;

  &__divider {
    position: absolute;
    top: 15px;
    z-index: -1;
    width: 100%;
    height: 1px;
    background: $gray-light;
  }

  &__title {
    display: inline-block;
    margin: 0;
    padding-right: 10px;
    background-color: #fff;
  }

  &__body {
    padding: 30px 40px;
  }
}
.el-collapse {
  border: 1px solid #EFF2F7;
  border-radius: 6px;
}
.el-collapse-item__header {
  height: 43px;
  line-height: 30px;
  padding-left: 15px;
  background-color: #fff;
  color: rebeccapurple;
  cursor: pointer;
  border-bottom: 1px solid #dfe6ec;
  font-size: 16px;
  font-weight: bold;
}
</style>
