import Project from './src/ProjectItem'

Project.install = function install(Vue) {
  Vue.component(Project.name, Project)
}

export default Project
