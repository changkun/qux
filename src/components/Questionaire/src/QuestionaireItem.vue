<template>
  <div class="project__item clearfix">
    <div class="project__poster">
      <img :src="mapProjectImage(project)" alt="">
    </div>
    <div class="project__content">
      
      <h3 class="project__title">{{ project.name }}</h3>
      <p class="project__intro">{{ project.description }}</p>
      <div class="project__footer clearfix">
        <div class="pull-left">
          <span class="project__tag">{{ mapProjectDate(project) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'QuestionaireItem',
  props: ['project'],
  data() {
    return {
    }
  },
  methods: {
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
    mapProjectImage(project) {
      const image = project.image
      if (!image) {
        return `${window.location.origin}/uploads/default.png`
      }
      return `${window.location.origin}${image}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~styles/exports";

.project {
  &__item {
    display: block;
    padding: 16px;
    border-bottom: 1px solid $gray-extra-light;
    border-radius: 4px;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      background-color: $gray-extra-light;
    }
  }

  &__poster {
    float: left;
    width: 260px;
  }

  &__poster img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    object-fit:contain;
  }

  &__content {
    margin-left: 280px;
  }

  &__title {
    margin: 0;
    font-size: 22px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__intro {
    height: 116px;
    font-size: 14px;
    line-height: 24px;
    overflow: hidden;
    hyphens:auto;
  }

  &__footer {
    font-size: 14px;
    color: $silver;
  }
}
</style>
