<template>
  <div class='geoChart' v-if="hasData">
  </div>
  <div class='noData' v-else>
  You don't have participants data yet.
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
import * as options from '@/services/options'

export default {
  name: 'GeoChart',
  props: ['geoData'],
  data() {
    return {
      hasData: true,
    }
  },
  mounted() {
    if (this.geoData.length === 0)
      this.hasData = false
    else
      this.plotStat()
  },
  methods: {
    plotStat() {
      const nationalityOptions = options.nationalityOptions

      const compare = (a,b) => {
        if (a.count < b.count)
          return 1;
        if (a.count > b.count)
          return -1;
        return 0;
      }
      let geoStat = [
        {
          code: 'Unknown',
          count: 0,
        }
      ]
      for (let index in this.geoData) {
        const nationality = this.geoData[index].info.nationality

        if (nationality === undefined || nationality === null) {
          geoStat[0].count += 1
          continue
        }

        let country = nationalityOptions.find(function(element) {
          return element.code === nationality;
        });

        name = country.name

        let notFound = true
        for (let idx in geoStat) {
          if (geoStat[idx].code === name) {
            geoStat[idx].count += 1
            notFound = false
            break
          }
        }
        if (notFound) {
          geoStat.push({
            code: name,
            count: 1
          })
        }
      }
      geoStat = geoStat.sort(compare)

      var margin = {top: 20, right: 20, bottom: 30, left: 40}
      var w = 800
      var h = 200

      var svg = d3.select(".geoChart").append('svg')
        .attr('width', margin.left + w + margin.right)
        .attr('height', margin.top + h*1.5 + margin.bottom)


      var x = d3.scaleBand().rangeRound([0, w]).padding(0.1),
          y = d3.scaleLinear().rangeRound([h, 0]);

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      x.domain(geoStat.map(function(d) { return d.code; }));
      y.domain([0, d3.max(geoStat, function(d) { return d.count; })]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + h + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-45)");

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(5, ".0f"))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Frequency");

      g.selectAll(".bar")
        .data(geoStat)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.code); })
          .attr("y", function(d) { return y(d.count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return h - y(d.count); });

    },
  }
}
</script>

<style lang="scss">
.bar {
  fill: steelblue;
}

.bar:hover {
  fill: coral;
}

.axis--x path {
  display: none;
}
</style>
