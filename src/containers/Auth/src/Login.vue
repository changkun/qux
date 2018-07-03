<template>
  <div class="container apply__container">
    <el-steps :space="300" :align-center="true" :center="true" :active="active" :process-status="status" finish-status="success">
      <el-step title="Login"></el-step>
      <el-step title="Success"></el-step>
    </el-steps>
    <el-row class="apply__info" v-if="active === 0">
      <el-col :span="11" :offset="6">
        <el-form ref="form" :model="userInfo" label-width="140px">
          <el-form-item label="Email" :rules="emailRule">
            <el-input v-model="userInfo.email" placeholder="Your Email"></el-input>
          </el-form-item>
          <el-form-item label="Password" required>
            <el-input type="password" v-model="userInfo.password" placeholder="Your password" @keyup.enter.native="submitLogin"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLogin">Login</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="result" v-if="active === 1">
      <el-col :span="8" :offset="8">
        <el-alert v-if="result.type ==='success'" :title="result.message" type="success" show-icon :closable="false"></el-alert>
        <el-alert v-if="result.type ==='failure'" :title="result.message" type="error" show-icon :closable="false"></el-alert>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

// const store = require('store')

export default {
  name: 'Login',
  data() {
    return {
      active: 0,
      status: 'finish',
      userInfo: {
        email: '',
        password: '',
      },
      emailRule: {
        required: true,
        message: 'You have to input your email for login',
      },
    }
  },
  computed: {
    ...mapGetters(['logIn', 'currentUser']),
  },
  methods: {
    ...mapMutations(['login', 'updateUserInfo']),
    // submit login action
    submitLogin() {
      const { email, password } = this.userInfo
      if (!email || !password) return
      this.$store.dispatch('login', {
        email: this.userInfo.email,
        password: this.userInfo.password,
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
