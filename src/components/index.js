import Project from './Project'
import Navbar from './Navbar'
import Footer from './Footer'

import CalendarChart from './Charts/CalendarChart'
import RadarChart from './Charts/RadarChart'
import AgeChart from './Charts/AgeChart'
import GeoChart from './Charts/GeoChart'
import OccuChart from './Charts/OccuChart'

import Questionaire from './Questionaire'

const components = [
  Project,
  Navbar,
  Footer,
  CalendarChart,
  RadarChart,
  AgeChart,
  GeoChart,
  OccuChart,
  Questionaire,
]

const install = function install(Vue) {
  if (install.installed) return

  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

export default {
  install,
}
