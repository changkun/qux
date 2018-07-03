<template>
  <div class="projects container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ProjectsBase',
}
</script>

<style lang="scss" scoped>
.projects {
  margin-top: 40px;
}
</style>
