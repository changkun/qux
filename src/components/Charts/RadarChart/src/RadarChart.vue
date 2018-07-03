<template>
  <div>
    <el-button id="download-png" @click="getpng" size="small" round>
      <i class="fa fa-download"></i> PNG
    </el-button>
    <div class='radarChart' v-if="hasData">
    </div>
    <div class='noData' v-else>
    You don't have participants data yet.
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
import { svgAsPngUri, download } from 'save-svg-as-png'
export default {
  name: 'RadarChart',
  props: ['radarData'],
  mounted() {
    if (this.radarData.length === 0) this.hasData = false
    else this.plotRadar()
  },
  created() {
  },
  data() {
    return {
      hasData: true,
      average: null,
      axisLabels: ["Visual Branding", "Mastery", "Outcome Satisfaction", "Emotional Attachment", "Task Effectiveness", "Task Efficiency", "Stability Performance", "Appealing Visual Design", "Communicated Information Stucture"]
    }
  },
  methods: {
    getpng() {
      svgAsPngUri(document.getElementsByClassName("radar.radarChart")[0], {}, (uri) => {
        download('qx.png', uri);
      });
    },
    aggregator(participants) {
      const average_dict = {
        d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0, d8: 0, d9: 0,
      }
      const parti = []
      for (let participantKey in participants) {
        const p = []
        for (let key in participants[participantKey].questionaire) {
          let mean = 0
          for (let index in participants[participantKey].questionaire[key]) {
            mean += participants[participantKey].questionaire[key][index]
          }
          mean /= participants[participantKey].questionaire[key].length
          average_dict[key] += mean
          p.push({value: mean / 100})
        }
        parti.push(p)
      }
      const average = []
      for (let key in average_dict) {
        average_dict[key] /= (100 * participants.length)
        average.push({value: average_dict[key]})
      }
      const data = [average].concat(parti)
      return data
    },
    plotRadar() {
      const aggregatedData = this.aggregator(this.radarData)
      var generate = [];
      while (generate.length != aggregatedData.length-1) {
          do {
            var color = Math.floor((Math.random()*1000000000)+1);
          } while (generate.indexOf(color) >= 0);
          generate.push("#" + ("000000" + color.toString(16)).slice(-6));
      }
      const colors = ['#CC333F'].concat(generate)
      const margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
      }
      const width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right
      const height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20)
      let radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 0.5,
        levels: 5,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(colors)
      };
      this.RadarChart(aggregatedData, radarChartOptions);
    },
    RadarChart(data, options) {
      let config = {
        w: 600,
        h: 600,
        margin: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        levels: 4,
        maxValue: 0,
        labelFactor: 1.25,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 6,
        opacityCircles: 0.1,
        strokeWidth: 2,
        roundStrokes: false,
        color: d3.scaleOrdinal(d3.schemeCategory10)
      };
      if ('undefined' !== typeof options) {
        for (let i in options) {
          if ('undefined' !== typeof options[i]) {
            config[i] = options[i];
          }
        }
      }

      let maxValue = 1
      let radius = Math.min(config.w / 2, config.h / 2)
      let Format = d3.format('.2f')
      let angleSlice = Math.PI * 2 / this.axisLabels.length
      let rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

      d3.select('.radarChart').select('svg').remove();
      let svg = d3.select('.radarChart').append('svg')
        .attr('width', config.w + config.margin.left + config.margin.right)
        .attr('height', config.h + config.margin.top + config.margin.bottom)
        .attr('class', 'radar' + '.radarChart');
      let g = svg.append('g')
        .attr('transform', 'translate(' + (config.w / 2 + config.margin.left) + ',' + (config.h / 2 + config.margin.top) + ')');

      //Filter for the outside glow
      let filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      /**
       * Draw the Circular grid
       */
      // Wrapper for the grid & axes
      let axisGrid = g.append('g').attr('class', 'axisWrapper');

      // Draw the background circles
      axisGrid.selectAll('.levels')
        .data(d3.range(1, (config.levels + 1)).reverse())
        .enter()
        .append('circle')
        .attr('class', 'gridCircle')
        .attr('r',(d, i) => {
          return radius / config.levels * d;
        })
        .style('fill', 'gray')
        .style('stroke', '#CDCDCD')
        .style('fill-opacity', config.opacityCircles)
        .style('filter', 'url(#glow)');

      // Text indicating at what % each level is
      axisGrid.selectAll('.axisLabel')
        .data(d3.range(1, (config.levels + 1)).reverse())
        .enter().append('text')
        .attr('class', 'axisLabel')
        .attr('x', 4)
        .attr('y', (d) => {
          return -d * radius / config.levels;
        })
        .attr('dy', '0.5em')
        .style('font-size', '10px')
        .attr('fill', '#737373')
        .text((d, i) => {
          return Format(maxValue * d / config.levels);
        });

      /**
       * Draw the axes
       */
      // Create the straight lines radiating outward from the center
      let axis = axisGrid.selectAll('.axis')
        .data(this.axisLabels)
        .enter()
        .append('g')
        .attr('class', 'axis')
      // Append the lines
      axis.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', (d, i) => {
          return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr('y2', (d, i) => {
          return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .attr('class', 'line')
        .style('stroke', 'white')
        .style('stroke-width', '3px');

      // Append the labels at each axis
      axis.append('text')
        .attr('class', 'legend')
        .style('font-size', '15px')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.1em')
        .attr('x', (d, i) => {
          return rScale(maxValue * config.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr('y', (d, i) => {
          return rScale(maxValue * config.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2.01);
        })
        .text(d => d)
        .style('stroke', (d) => {
          if (d === 'Visual Branding') {
            return '#afc97d'
          } else if (d === 'Mastery' || d === 'Outcome Satisfaction') {
            return '#3cb499'
          } else if (d === 'Emotional Attachment') {
            return '#928b7d'
          } else if (d === 'Task Effectiveness' || d === 'Task Efficiency' || d === 'Stability Performance') {
            return '#f1ac45'
          } else if (d === 'Appealing Visual Design' || d === 'Communicated Information Stucture') {
            return '#3b7da5'
          } else {
            return 'black'
          }
        })
        .call(wrap, config.wrapWidth);

      /**
       * Draw the radar chart blobs
       */
      // The radial line function
      let radarLine = d3.lineRadial().curve(d3.curveLinearClosed)
        .radius(function(d) {
          return rScale(d.value);
        })
        .angle(function(d, i) {
          return i * angleSlice;
        });

      if (config.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
      }

      // Create a wrapper for the blobs  
      let blobWrapper = g.selectAll('.radarWrapper')
        .data(data)
        .enter().append('g')
        .attr('class', 'radarWrapper');
      // Append the backgrounds  
      blobWrapper.append('path')
        .attr('class', 'radarArea')
        .attr('d', function(d, i) {
          if(i===0)
          return radarLine(d);
        })
        .style('fill', function(d, i) {
          return config.color(i);
        })
        .style('fill-opacity', config.opacityArea)
        .on('mouseover', function(d, i) {
          //Dim all blobs
          d3.selectAll('.radarArea')
            .transition().duration(200)
            .style('fill-opacity', 0.1);
          //Bring back the hovered over blob
          d3.select(this)
            .transition().duration(200)
            .style('fill-opacity', 0.7);
        })
        .on('mouseout', function() {
          //Bring back all blobs
          d3.selectAll('.radarArea')
            .transition().duration(200)
            .style('fill-opacity', config.opacityArea);
        });
      // Create the outlines  
      blobWrapper.append('path')
        .attr('class', 'radarStroke')
        .attr('d', function(d, i) {
          if (i === 0)
          return radarLine(d);
        })
        .style('stroke-width', config.strokeWidth + 'px')
        .style('stroke', function(d, i) {
          return config.color(i);
        })
        .style('fill', 'none')
        .style('filter', 'url(#glow)');

      // Append the circles
      let count = -1
      let count2 = -1
      let count3 = -1
      blobWrapper.selectAll('.radarCircle')
        .data(function(d, i) {
          return d;
        })
        .enter().append('circle')
        .attr('class', 'radarCircle')
        .attr('r', function(d, i) {
          count += 1
          if (count < 9)
          return config.dotRadius
          else return 3
        })
        .attr('cx', function(d, i) {
          return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr('cy', function(d, i) {
          return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style('fill', function(d, i, j) {
          count2 += 1
          return config.color(Math.floor(count2/9));
        })
        .style('fill-opacity', 0.9);

      /**
       * Append invisible circles for tooltip
       */

      //Wrapper for the invisible circles on top
      let blobCircleWrapper = g.selectAll('.radarCircleWrapper')
        .data(data)
        .enter().append('g')
        .attr('class', 'radarCircleWrapper');
      //Set up the small tooltip for when you hover over a circle

      let tooltip = g.append('text')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      //Append a set of invisible circles on top for the mouseover pop-up
      blobCircleWrapper.selectAll('.radarInvisibleCircle')
        .data(function(d, i) {
          return d;
        })
        .enter().append('circle')
        .attr('class', 'radarInvisibleCircle')
        .attr('r', config.dotRadius * 1.5)
        .attr('cx', function(d, i) {
          return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr('cy', function(d, i) {
          return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mouseover', function(d, i) {
          tooltip
            .attr('x', parseFloat(d3.select(this).attr('cx')) - 10)
            .attr('y', parseFloat(d3.select(this).attr('cy')) - 10)
            .text(Format(d.value))
            .transition().duration(200)
            .style('opacity', 1);
        })
        .on('mouseout', function() {
          tooltip.transition().duration(200)
            .style('opacity', 0);
        });



      function wrap(text, width) {
        text.each(function() {
          let text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.2, // ems
            y = text.attr('y'),
            x = text.attr('x'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(' '));
              line = [word];
              tspan = text.append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                .text(word);
            }
          }
        })
      }
    },
  }
}
</script>

<style>
.radarChart {
  font-family: 'Open Sans', sans-serif;
  font-size: 11px;
  font-weight: 300;
  fill: #242424;
  text-align: center;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
  cursor: default;
}
.noData {
  font-size: 15px;
  color: #aaa;
}
download-png {
  border-color: white;
}
</style>
