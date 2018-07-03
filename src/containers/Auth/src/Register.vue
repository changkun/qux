<template>
  <div class="container apply__container">
    <el-steps :space="300" :align-center="true" :center="true" :active="active" :process-status="status" finish-status="success">
      <el-step title="Register"></el-step>
      <el-step title="Validation"></el-step>
      <el-step title="Success"></el-step>
    </el-steps>
    <el-row class="apply__info" v-if="active === 0">
      <el-col :span="11" :offset="6">
        <el-form ref="form" :model="userInfo" label-width="140px">
          <el-form-item label="Email" required>
            <el-input v-model="userInfo.email" placeholder="Your Email"></el-input>
          </el-form-item>
          <el-form-item label="Username" required>
            <el-input v-model="userInfo.username" placeholder="Your username"></el-input>
          </el-form-item>
          <el-form-item label="Password" required>
            <el-input type="password" v-model="userInfo.password" placeholder="Your password"></el-input>
          </el-form-item>
          <el-form-item label="Occupation" required>
            <el-select v-model="userInfo.occupation" placeholder="Select or input" required filterable>
              <el-option
                  v-for="item in occupation.options" :key="item.code" :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Company Description">
            <el-input type="textarea" v-model="userInfo.company"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitRegister">Next</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="result" v-if="active === 2">
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import * as options from '@/services/options'

export default {
  name: 'Register',
  data() {
    const occupationOptions = options.occupationOptions
    return {
      active: 0,
      status: 'finish',
      userInfo: {
        email: '',
        password: '',
        username: '',
        occupation: '',
        company: '',
      },
      occupation: {
        options: occupationOptions,
      },
    }
  },
  computed: {
    ...mapGetters(['logIn', 'currentUser']),
  },
  methods: {
    ...mapMutations(['updateUserInfo']),
    submitRegister() {
      const { email, username, password, occupation } = this.userInfo

      if (!email || !username || !password || !occupation) return

      this.$store.dispatch('register', {
        email: this.userInfo.email,
        username: this.userInfo.username,
        password: this.userInfo.password,
        occupation: this.userInfo.occupation,
        company: this.userInfo.company,
      }).then((data) => {
        if (data.success === true) {
          this.active = 1
          this.$message.success(data.reason)
          this.$router.replace('/projects')
        } else {
          this.active = 0
          this.$message.error(data.reason)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~styles/exports";

.apply {
  &__container {
    margin-top: 40px;
  }

  &__info {
    margin-top: 50px;
  }
}

.translation {
  &__title {
    // font-size: 24px;
  }

  &__text {
    padding: 14px;
    border: 1px solid $gray;
    border-radius: 4px;
    line-height: 24px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
}

.result {
  margin-top: 60px;
  margin-bottom: 82px;
}
</style>
