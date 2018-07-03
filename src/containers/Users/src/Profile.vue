<template>
  <div class="container">
    <div class="user-info">
      <div class="user-info__avatar"><img :src="avatar" alt=""></div>
      <h3>{{ user.username }}</h3>
      <p class="user-info__bio">{{ user.occupation }} | {{ user.company }}</p>
    </div>


    <el-row>
      <el-col :span="11" :offset="6">
        <el-form ref="form" :model="user" label-width="80px">
          <el-form-item label="Email">
            <el-input v-model="user.email" placeholder="Your Email"></el-input>
          </el-form-item>
          <el-form-item label="Username">
            <el-input v-model="user.username" placeholder="Your username"></el-input>
          </el-form-item>
          <el-form-item label="Password">
            <el-input type="password" v-model="user.password" placeholder="Input old password or new password"></el-input>
          </el-form-item>
            <el-form-item label="Occupation">
              <el-select v-model="user.occupation" placeholder="Select" filterable>
                <el-option
                  v-for="item in occupation.options" :key="item.code" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="Company Description">
            <el-input type="textarea" v-model="user.company"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="large-button" type="primary" @click="submitEdit">Save Changes</el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="large-button" type="danger" @click="deleteDialogFormVisible = true">Delete This Account</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="Warning"
      :visible.sync="deleteDialogFormVisible"
      width="30%"
      center>
      <span>Do you really want destroy your account and all of your data?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDialogFormVisible2 = true">Confirm</el-button>
        <el-button @click="deleteDialogFormVisible = false">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="Warning! Warning! Warning! "
      :visible.sync="deleteDialogFormVisible2"
      width="30%"
      center>
      <p>We have to do a double check for you.</p>
      <h3 style="color:red;">Do you really want to destroy your account and all of your projects data?</h3>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteAccount">Confirm</el-button>
        <el-button @click="deleteDialogFormVisible2 = false">Cancel</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions, mapMutations } from 'vuex'
import * as options from '@/services/options'
const store = require('store')

export default {
  name: 'UserBase',
  data() {
    const occupationOptions = options.occupationOptions
    return {
      user: null,
      occupation: {
        options: occupationOptions,
      },
      deleteDialogFormVisible: false,
      deleteDialogFormVisible2: false,
    }
  },
  computed: {
    ...mapState(['users']),
    avatar() {
      return `https://ui-avatars.com/api/?name=${this.user.username}`
    },
  },
  methods: {
    ...mapActions(['destroy', 'fetchUserInfo']),
    ...mapMutations(['edit']),
    submitEdit() {
      const userInfo = {
        userid: this.user._id,
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        occupation: this.user.occupation,
        company: this.user.company,
      }
      this.$store.dispatch('edit', userInfo)
        .then((response) => {
          if (response.success === true) {
            this.$message.success(response.reason)
            this.user.userid = userInfo._id
            this.user.username = userInfo.username
            this.user.email = userInfo.email
            this.user.password = null
            this.user.occupation = userInfo.occupation
            this.user.company = userInfo.company
          } else {
            this.$message.error(response.reason)
          }
        })
    },
    deleteAccount() {
      const destroyCallback = (response) => {
        this.$message.success(response.reason)
        this.$router.replace('/')
        store.remove('user')
      }
      this.$store.dispatch('destroy', {
        userid: this.user._id
      }).then(destroyCallback)
    },
  },
  created() {
    this.user = this.$store.getters.currentUser
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  margin-top: 80px;
  margin-bottom: 100px;
  text-align: center;

  &__avatar {

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
}
.large-button {
  width: 415px;
}
</style>
