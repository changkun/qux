<template>
  <div class="navbar">
    <div class="container">
      <router-link :to="'/'">
      <div class="navbar__header" :route="{ path: '/' }">
        <img class="navbar__logo" src="../../../assets/logo.png">
        <a class="navbar__brand">Quantified UX Metric <sup>Beta</sup></a>
      </div>
      </router-link>
      <div class="navbar__body">
        <el-menu :default-active="activeIndex" mode="horizontal" router>

          <el-menu-item index="index" :route="{ path:'/' }">
            Homepage
          </el-menu-item>
          <el-menu-item index="projects" :route="{ path:'/projects' }" v-if="isLogedIn">
            Projects
          </el-menu-item>

          <template v-if="questionaire">
            <el-menu-item index="questionaire" :route="{ path:'/questionaire' }">
              Questionaire
            </el-menu-item>
          </template>

          <li class="pull-right">
            <template v-if="isLogedIn">
              <el-submenu class="user-submenu" index="user">
                <template slot="title">{{ userName }}</template>
                <el-menu-item index="profile" :route="{ path: '/user/profile' }">Profile</el-menu-item>
                <el-menu-item index="logout" :route="{ path: '/auth/logout' }">Logout</el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item index="register" :route="{ path: '/auth/register' }">
                Register
              </el-menu-item>
              <el-menu-item index="login" :route="{ path: '/auth/login' }">
                Login
              </el-menu-item>
            </template>
          </li>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Navbar',
  props: ['user'],
  data() {
    return {
      activeIndex: 'index',
    }
  },
  computed: {
    ...mapState(['notifications']),
    isLogedIn() {
      return this.$store.getters.isLogedIn
    },
    userName() {
      return this.$store.getters.currentUser.username
    },
    questionaire() {
      return this.$store.getters.questionaire
    },
    totalOfNotifications() {
      return this.$store.getters.total
    },
  },
  methods: {
  },
}
</script>

<style lang="scss">
.navbar {
  // user-select: none;
  &__header {
    float: left;
    position: relative;
    z-index: 1;
    display: flex;
  }
  &__logo {
    margin-top: 10px;
    width: 40px;
    height: 40px;
  }
  &__brand {
    display: block;
    line-height: 60px;
    padding: 0 15px;
    font-size: 18px;
    color: #48576a;
  }
}

.username {
  padding-right: 1.8em
}

.el-menu--horizontal .el-menu-item:hover {
  border-bottom: 5px solid #20a0ff;
}
.el-menu--horizontal .user-submenu .el-menu-item:hover {
  border-bottom: 5px solid #d1dbe5;
}
.el-menu--horizontal .el-menu-item.navbar__messages:hover {
  border-bottom: 5px solid #eef1f6;
}
.el-submenu {
  &__icon-arrow {
    margin-left: 10px;
  }
}
.el-menu-item a {
  display: block;
}
sup {
  font-size: 12px;
  color: #F7BA2F;
  font-family: Roboto, sans-serif;
  font-weight: bold;
  font-style: oblique;
}
</style>
