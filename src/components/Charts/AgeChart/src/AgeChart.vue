<template>
  <div class='ageChart' v-if="hasData">
  </div>
  <div class='noData' v-else>
  You don't have participants data yet.
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
export default {
  name: 'AgeChart',
  props: ['ageData'],
  data() {
    return {
      hasData: true,
    }
  },
  mounted() {
    if (this.ageData.length === 0)
      this.hasData = false
    else
      this.plotStat()
  },
  methods: {
    plotStat() {

      const ageStat = [
        {group: '0-9', male: 0, female: 0},
        {group: '10-19', male: 0, female: 0},
        {group: '20-29', male: 0, female: 0},
        {group: '30-39', male: 0, female: 0},
        {group: '40-49', male: 0, female: 0},
        {group: '50-59', male: 0, female: 0},
        {group: '60-69', male: 0, female: 0},
        {group: '70-79', male: 0, female: 0},
        {group: '80-89', male: 0, female: 0},
        {group: '90-99', male: 0, female: 0},
        {group: '100-109', male: 0, female: 0},
        {group: '110-119', male: 0, female: 0},
        {group: '120-129', male: 0, female: 0},
      ];

      const total = this.ageData.length
      let unknown = 0
      for (let index in this.ageData) {

        const age = this.ageData[index].info.age
        const gender = this.ageData[index].info.gender

        if (age === null && gender === null) {
          unknown += 1
        }

        for (let groupIndex in ageStat) {
          const group = ageStat[groupIndex].group.split('-')
          if (age <= group[1] && age > group[0]) {
            if (gender === 'Male') {
              ageStat[groupIndex].male += 1
            } else {
              ageStat[groupIndex].female += 1
            }
            break;
          }
        }
      }

      // SET UP DIMENSIONS
      var w = 800,
          h = 200;
          
      // margin.middle is distance from center line to each y-axis
      var margin = {
        top: 20,
        right: 20,
        bottom: 24,
        left: 20,
        middle: 28
      };
          
      // the width of each side of the chart
      var regionWidth = w/2 - margin.middle;

      // these are the x-coordinates of the y-axes
      var pointA = regionWidth,
          pointB = w - regionWidth;

      // GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
      var totalPopulation = d3.sum(ageStat, function(d) { return d.male + d.female; }),
          percentage = function(d) { return d / totalPopulation; };
        
        
      // CREATE SVG
      var svg = d3.select('.ageChart').append('svg')
        .attr('width', margin.left + w + margin.right)
        .attr('height', margin.top + h*1.1 + margin.bottom)
        // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
        .append('g')
          .attr('transform', translation(margin.left, margin.top));

      // find the maximum data value on either side
      //  since this will be shared by both of the x-axes
      var maxValue = Math.max(
        d3.max(ageStat, function(d) { return percentage(d.male); }),
        d3.max(ageStat, function(d) { return percentage(d.female); })
      );

      // SET UP SCALES
        
      // the xScale goes from 0 to the width of a region
      //  it will be reversed for the left x-axis
      var xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, regionWidth])
        .nice();

      var xScaleLeft = d3.scaleLinear()
        .domain([0, maxValue])
        .range([regionWidth, 0]);

      var xScaleRight = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, regionWidth]);

      var yScale = d3.scaleBand().rangeRound([h,0]).padding(0.1)
        .domain(ageStat.map(function(d) { return d.group; }))


      // SET UP AXES
      var yAxisLeft = d3.axisRight()
        .scale(yScale)
        .tickSize(4,0)
        .tickPadding(margin.middle-4);

      var yAxisRight = d3.axisLeft()
        .scale(yScale)
        .tickSize(4,0)
        .tickFormat('');

      var xAxisRight = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format('.1%'));

      var xAxisLeft = d3.axisBottom()
        // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
        .scale(xScale.copy().range([pointA, 0]))
        .tickFormat(d3.format('.1%'));
        // .orient("bottom")
        // .tickFormat(function(d) {return d + "%"; })

      // MAKE GROUPS FOR EACH SIDE OF CHART
      // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
      var leftBarGroup = svg.append('g')
        .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
      var rightBarGroup = svg.append('g')
        .attr('transform', translation(pointB, 0));

      // DRAW AXES
      svg.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(pointA, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

      svg.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(pointB, 0))
        .call(yAxisRight);

      svg.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, h))
        .call(xAxisLeft)
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      svg.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(pointB, h))
        .call(xAxisRight)
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      svg.append("text")
        .style("text-anchor", "middle")
        .style("fill", "steelblue")
        .text("Male");

      svg.append("text")
        .style("text-anchor", "middle")
        .attr("transform",
            "translate(" + (w/1.02) + " ," + 
                           (0) + ")")
        .style("fill", "firebrick")
        .text("Female");

      svg.append("text")
        .style("text-anchor", "middle")
        .attr("transform",
            "translate(" + (w/2) + " ," + 
                           (-10) + ")")
        .style("fill", "gray")
        .text(`Total: ${total}    Unknown: ${unknown}`);

      // DRAW BARS
      leftBarGroup.selectAll('.bar.left')
        .data(ageStat)
        .enter().append('rect')
          .attr('class', 'bar left')
          .attr('x', 0)
          .attr('y', function(d) { return yScale(d.group); })
          .attr('width', function(d) { return xScale(percentage(d.male)); })
          .attr('height', yScale.bandwidth());

      rightBarGroup.selectAll('.bar.right')
        .data(ageStat)
        .enter().append('rect')
          .attr('class', 'bar right')
          .attr('x', 0)
          .attr('y', function(d) { return yScale(d.group); })
          .attr('width', function(d) { return xScale(percentage(d.female)); })
          .attr('height', yScale.bandwidth());


      // so sick of string concatenation for translations
      function translation(x,y) {
        return 'translate(' + x + ',' + y + ')';
      }


    },
  }
}
</script>

<style lang="scss">
.axis line,
.axis path {
  shape-rendering: crispEdges;
  fill: transparent;
  stroke: #555;
}
.axis text {
  font-size: 11px;
}
.bar {
  fill-opacity: 0.5;
}
.bar.left {
  fill: steelblue;
}
.bar.right {
  fill: firebrick;
}
</style>
