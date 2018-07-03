<template>
<div class="projects container">
  <div class="project-detail container" v-loading="loading">
    <div class='project-detail__information'>
      <questionaire-item :project="project"></questionaire-item>
    </div>

    <el-collapse v-model="activeNames">
      <div class="project-detail__footer clearfix questionaire" v-for="(question, index_question) in questionaire" :key="index_question">
        <el-collapse-item :title="question.area" :name="index_question">
        <template slot="title">
         {{ question.area }}
        </template>
        <div class="dimension" v-for="(dimension, index_dimension) in question.dimensions" :key="index_dimension">
        <h2> {{ dimension.name }} </h2>
          <div class="qq" v-for="(q, idx) in dimension.questions" :key="idx">
            <p>{{ q.title }}</p>
            <div class="selection" style="margin-top: 20px;">
              <div style="width: 200px; text-align: center; vertical-align: middle;">{{ q.answer.left }}</div>
              <div style="width: 400px;">
                <el-slider  placement="bottom" v-model="q.value" :show-tooltip="true"></el-slider>
              </div>
              <div style="width: 200px; text-align: center; vertical-align: middle;">{{ q.answer.right }}</div>
              <br class="clearBoth" />
            </div>
          </div>
        </div>
        </el-collapse-item>
      </div>
    </el-collapse>
      <div class="extra">
        <h2>I am willing to help you to better understand your study...</h2>
        <el-switch
          v-model="participant.isOn"
          active-text="Yes"
          inactive-text="No">
        </el-switch>

        <el-row>
        <el-col :span="12" :offset="5">
          <el-form ref="form" :model="participant" label-width="140px"  v-if="participant.isOn">
            <el-form-item label="Age" required size="mini">
              <el-select class="selector" v-model="participant.info.age.value" filterable placeholder="Select or input">
                <el-option
                  v-for="(item, itemKey) in participant.info.age.options"
                  :key="itemKey" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Gender" required>
              <el-select class="selector" v-model="participant.info.gender.value" filterable placeholder="Select or input">
                <el-option
                  v-for="(item, itemKey) in participant.info.gender.options"
                  :key="itemKey" :value="item">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Nationality" required>
              <el-select class="selector" v-model="participant.info.nationality.value" placeholder="Select or input" filterable>
                <el-option
                  v-for="(item, itemKey) in participant.info.nationality.options" :key="itemKey" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Occupation" required>
              <el-select class="selector" v-model="participant.info.occupation.value" placeholder="Select or input" filterable>
                <el-option
                    v-for="(item, itemKey) in participant.info.occupation.options" :key="itemKey" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>

          <el-form-item label="Email" required>
            <el-input v-model="participant.info.email.value" placeholder="Your Email"></el-input>
          </el-form-item>


          </el-form>
        </el-col>
        </el-row>
      </div>
    <div class="submit">
      <el-button type="success" @click="submitConfirm = true">SUBMIT</el-button>
    </div>
    <el-dialog
      title="Submit"
      :visible.sync="submitConfirm"
      width="30%"
      center>
      <span class="thanks">Thanks for your time! Just click the confirm button to submit your answer 🙂</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitQuestionaire">Confirm</el-button>
        <el-button @click="submitConfirm = false">Cancel</el-button>
      </span>

    </el-dialog>
  </div>
</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import * as questionaire from '@/services/questionaire'
import * as options from '@/services/options'

export default {
  name: 'QuestionaireDetail',
  data() {
    const genderOptions = options.genderOptions
    const nationalityOptions = options.nationalityOptions
    const occupationOptions = options.occupationOptions
    const questionaireOptions = options.questionaireOptions
    // eslint-disable-next-line
    const range = (a, b) => Array.from((function*(x, y){
      // eslint-disable-next-line
      while (x <= y) yield x++
    })(a, b))
    return {
      activeNames: [0, 1, 2],
      participant: {
        isOn: true,
        info: {
          age: {
            options: range(5, 150),
            value: null,
          },
          gender: genderOptions,
          nationality: {
            options: nationalityOptions,
            value: null,
          },
          email: {
            value: null,
          },
          occupation: {
            options: occupationOptions,
            value: null,
          },
        },
      },
      questionaire: questionaireOptions,
      loading: true,
      project: {},
      submitConfirm: false,
    }
  },
  computed: {
    ...mapState(['projects']),
    ...mapGetters(['currentUser', 'logIn']),
  },
  beforeCreate() {
    const url = new URL(window.location.href)
    const uuid = url.searchParams.get('code')
    questionaire.fetchQuestionaire(uuid).then((data) => {
      if (data.success === false) {
        this.$message.error(`${data.reason}.`)
        this.$router.replace('/')
        return
      }
      this.project = data.project
      this.loading = false
    }).catch(err => this.$message.error(err.reason))
  },
  methods: {
    submitQuestionaire() {
      const qq = {
        d1: [
          this.questionaire[0].dimensions[0].questions[0].value,
          this.questionaire[0].dimensions[0].questions[1].value,
          this.questionaire[0].dimensions[0].questions[2].value,
        ],
        d2: [
          this.questionaire[0].dimensions[1].questions[0].value,
          this.questionaire[0].dimensions[1].questions[1].value,
          this.questionaire[0].dimensions[1].questions[2].value,
        ],
        d3: [
          this.questionaire[0].dimensions[2].questions[0].value,
          this.questionaire[0].dimensions[2].questions[1].value,
          this.questionaire[0].dimensions[2].questions[2].value,
        ],
        d4: [
          this.questionaire[1].dimensions[0].questions[0].value,
          this.questionaire[1].dimensions[0].questions[1].value,
          this.questionaire[1].dimensions[0].questions[2].value,
        ],
        d5: [
          this.questionaire[1].dimensions[1].questions[0].value,
          this.questionaire[1].dimensions[1].questions[1].value,
          this.questionaire[1].dimensions[1].questions[2].value,
        ],
        d6: [
          this.questionaire[1].dimensions[2].questions[0].value,
          this.questionaire[1].dimensions[2].questions[1].value,
          this.questionaire[1].dimensions[2].questions[2].value,
        ],
        d7: [
          this.questionaire[2].dimensions[0].questions[0].value,
          this.questionaire[2].dimensions[0].questions[1].value,
          this.questionaire[2].dimensions[0].questions[2].value,
        ],
        d8: [
          this.questionaire[2].dimensions[1].questions[0].value,
          this.questionaire[2].dimensions[1].questions[1].value,
          this.questionaire[2].dimensions[1].questions[2].value,
        ],
        d9: [
          this.questionaire[2].dimensions[2].questions[0].value,
          this.questionaire[2].dimensions[2].questions[1].value,
          this.questionaire[2].dimensions[2].questions[2].value,
        ],
      }
      const url = new URL(window.location.href)
      const uuid = url.searchParams.get('code')
      const payload = {
        code: uuid,
        info: {
          age: this.participant.info.age.value,
          gender: this.participant.info.gender.value,
          nationality: this.participant.info.nationality.value,
          email: this.participant.info.email.value,
          occupation: this.participant.info.occupation.value,
        },
        answers: qq,
      }
      if (this.submissionValidator()) {
        questionaire.submitQuestionaire(payload).then((data) => {
          if (data.success === true) {
            this.$message.success('Thank you very much for your time!')
            this.$router.replace('/')
          } else {
            this.$message.error('Opps! Network crashed, please submit again')
          }
        }).catch(err => this.$message.error(err))
      } else {
        this.submitConfirm = false
      }
    },
    submissionValidator() {
      if (this.participant.isOn) {
        if (this.participant.info.age.value === null) {
          this.$message.error('Please submit a valid age')
          return false
        }
        if (this.participant.info.gender.value === null) {
          this.$message.error('Please submit a valid gender')
          return false
        }
        if (this.participant.info.nationality.value === null) {
          this.$message.error('Please submit a valid nationality')
          return false
        }
        if (this.participant.info.occupation.value === null) {
          this.$message.error('Please submit a valid occupation')
          return false
        }
        if (this.participant.info.email.value === null || this.participant.info.email.lengh < 1) {
          this.$message.error('Please submit a valid email')
          return false
        }
      }
      return true
    },
  },
}
</script>
<style lang='scss' scoped>
@import '~styles/exports';
.projects {
  margin-top: 40px;
}
.el-collapse {
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
.el-button--success {
    color: #fff;
    background-color: #13ce66;
    border-color: #13ce66;
    width: 100%;
}
.project-detail {
  width: 80%;

  &__information {
    padding: 20px;
    border: 1px solid $gray-extra-light;
    border-radius: 6px;
    background-color: $drak-white;
    margin-bottom: 20px;
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
  .questionaire {
    margin-left: auto;
    margin-right: auto;
    width: 800px;
  }
  .extra {
    margin-top: 20px;
    border: 1px solid $gray-extra-light;
    border-radius: 6px;
    padding: 20px;
  }
  .dimension {
    h2 {
      // color: $primary;
    }
  }
  .qq {
    margin: 50px;
    p {
      // color: $blue-light;
      color: #777;
      font-weight: 600;
    }
  }
  .submit {
    margin: 0 auto;
    margin-top: 20px;
  }
  .selection {
    display: flex;
    flex-direction: row;
    margin: 20px;
    align-items: center;
  }
  .participant {
    width: 500px;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    div {
      margin: 5px;
    }
    .info {
      width: 100px;
    }
    .input {
      width: 300px;
    }
  }
}
.thanks {
  font-size: 16px;
}
.selector {
  width: 100%;
}
</style>
