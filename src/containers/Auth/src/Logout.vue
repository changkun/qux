<template>
  <div class="callback container">
    <div class="result-alerts text-center" v-loading="loading.status" element-loading-text="Quiting..."></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const store = require('store')

export default {
  name: 'Logout',
  data() {
    return {}
  },
  computed: {
    ...mapState(['loading']),
  },
  methods: {
    ...mapActions(['logout']),
  },
  created() {
    const logoutCallback = () => {
      this.$message.success('Quit successfully')
      this.$router.replace('/')

      store.remove('user')
    }

    this.logout().then(logoutCallback).catch(logoutCallback)
  },
}
</script>

<style lang="scss" scoped>
.callback {
  min-height: 320px;
}
.result-alerts {
  width: 400px;
  margin-top: 168px;
  margin-left: auto;
  margin-right: auto;
}
</style>
