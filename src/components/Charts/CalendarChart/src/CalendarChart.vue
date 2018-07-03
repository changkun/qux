<template>
  <div class='calendarChart' v-if="hasData">
  </div>
  <div class='noData' v-else>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3'
import * as moment from 'moment'
import * as options from '@/services/options'

export default {
  name: 'CalendarChart',
  props: ['calendarData'],
  data() {
    return {
      hasData: true,
    }
  },
  mounted() {
    if (this.calendarData.length === 0)
      this.hasData = false
    else
      this.plotStat()
  },
  methods: {
    plotStat() {
      const calendarStat = [];
      for (let index in this.calendarData) {
        const date = this.calendarData[index].info.create_at
        if (date === null && gender === null) {
          continue
        }

        let notFound = true
        for (let dateIndex in calendarStat) {
          if (sameDay(date, calendarStat[dateIndex].date)) {
            calendarStat[dateIndex].count += 1
            notFound = false
            break;
          }
        }
        if (notFound) {
          calendarStat.push({
            date: new Date(date),
            count: 1
          })
        }
      }

      const chart = calendarHeatmap()
                      .data(calendarStat)
                      .selector('.calendarChart')
                      .colorRange(['#D8E6E7', '#218380'])
                      .tooltipEnabled(true)
                      .tooltipUnit(
                        [
                          {min: 0, unit: 'participant'},
                          {min: 1, max: 1, unit: 'participant'},
                          {min: 2, max: 'Infinity', unit: 'participants'}
                        ]
                      );
      chart();

      function sameDay(date1, date2) {
        const d1 = new Date(date1)
        const d2 = new Date(date2)
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
      }
      function calendarHeatmap() {
        // defaults
        var margin = {top: 20, right: 20, bottom: 30, left: 40}
        var width = 800;
        var height = 110;
        var legendWidth = 125;
        var selector = 'body';
        var SQUARE_LENGTH = 11;
        var SQUARE_PADDING = 3.5;
        var MONTH_LABEL_PADDING = 6;
        var now = moment().endOf('day').toDate();
        var yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
        var startDate = null;
        var data = [];
        var max = null;
        var colorRange = ['#D8E6E7', '#218380'];
        var tooltipEnabled = true;
        var tooltipUnit = 'participation';
        var legendEnabled = true;
        var onClick = null;
        var weekStart = 0; //0 for Sunday, 1 for Monday
        var locale = {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          No: 'No',
          on: 'on',
          Less: 'Less',
          More: 'More'
        };
        var v = Number(d3.version.split('.')[0]);

        // setters and getters
        chart.data = function (value) {
          if (!arguments.length) { return data; }
          data = value;
          return chart;
        };

        chart.max = function (value) {
          if (!arguments.length) { return max; }
          max = value;
          return chart;
        };

        chart.selector = function (value) {
          if (!arguments.length) { return selector; }
          selector = value;
          return chart;
        };

        chart.startDate = function (value) {
          if (!arguments.length) { return startDate; }
          yearAgo = value;
          now = moment(value).endOf('day').add(1, 'year').toDate();
          return chart;
        };

        chart.colorRange = function (value) {
          if (!arguments.length) { return colorRange; }
          colorRange = value;
          return chart;
        };

        chart.tooltipEnabled = function (value) {
          if (!arguments.length) { return tooltipEnabled; }
          tooltipEnabled = value;
          return chart;
        };

        chart.tooltipUnit = function (value) {
          if (!arguments.length) { return tooltipUnit; }
          tooltipUnit = value;
          return chart;
        };

        chart.legendEnabled = function (value) {
          if (!arguments.length) { return legendEnabled; }
          legendEnabled = value;
          return chart;
        };

        chart.onClick = function (value) {
          if (!arguments.length) { return onClick(); }
          onClick = value;
          return chart;
        };

        chart.locale = function (value) {
          if (!arguments.length) { return locale; }
          locale = value;
          return chart;
        };

        function chart() {

          d3.select(chart.selector()).selectAll('svg.calendar-heatmap').remove(); // remove the existing chart, if it exists

          var dateRange = (d3.timeDays)(yearAgo, now); // generates an array of date objects within the specified range
          var monthRange = (d3.timeMonths)(moment(yearAgo).startOf('month').toDate(), now); // it ignores the first month if the 1st date is after the start of the month
          monthRange = monthRange.slice(1, monthRange.length)
          var firstDate = moment(dateRange[0]);
          if (chart.data().length == 0) {
            max = 0;
          } else if (max === null) {
            max = d3.max(chart.data(), function (d) { return d.count; }); // max data value
          }

          // color range
          var color = d3.scaleLinear()
            .range(chart.colorRange())
            .domain([0, max]);

          var tooltip;
          var dayRects;

          drawChart();

          function drawChart() {
            var svg = d3.select(chart.selector())
              .style('position', 'relative')
              .append('svg')
              .attr('width',  margin.left + width + margin.right)
              .attr('class', 'calendar-heatmap')
              .attr('height', height)
              .style('padding', '30px 36px 20px 36px');

            dayRects = svg.selectAll('.day-cell')
              .data(dateRange);  //  array of days for the last yr

            var enterSelection = dayRects.enter().append('rect')
              .attr('class', 'day-cell')
              .attr('width', SQUARE_LENGTH)
              .attr('height', SQUARE_LENGTH)
              .attr('fill', function(d) { return color(countForDate(d)); })
              .attr('x', function (d, i) {
                var cellDate = moment(d);
                var result = cellDate.week() - firstDate.week() + (firstDate.weeksInYear() * (cellDate.weekYear() - firstDate.weekYear()));
                return result * (SQUARE_LENGTH + SQUARE_PADDING);
              })
              .attr('y', function (d, i) {
                return MONTH_LABEL_PADDING + formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING);
              });

            if (typeof onClick === 'function') {
              (v === 3 ? enterSelection : enterSelection.merge(dayRects)).on('click', function(d) {
                var count = countForDate(d);
                onClick({ date: d, count: count});
              });
            }

            if (chart.tooltipEnabled()) {
              (v === 3 ? enterSelection : enterSelection.merge(dayRects)).on('mouseover', function(d, i) {
                tooltip = d3.select(chart.selector())
                  .append('div')
                  .attr('class', 'day-cell-tooltip')
                  .html(tooltipHTMLForDate(d))
                  .style('left', function () { return Math.floor(i / 7) * SQUARE_LENGTH + 'px'; })
                  .style('top', function () {
                    return formatWeekday(d.getDay()) * (SQUARE_LENGTH + SQUARE_PADDING) + MONTH_LABEL_PADDING * 2 + 'px';
                  });
              })
              .on('mouseout', function (d, i) {
                tooltip.remove();
              });
            }

            if (chart.legendEnabled()) {
              var colorRange = [color(0)];
              for (var i = 3; i > 0; i--) {
                colorRange.push(color(max / i));
              }

              var legendGroup = svg.append('g');
              legendGroup.selectAll('.calendar-heatmap-legend')
                  .data(colorRange)
                  .enter()
                .append('rect')
                  .attr('class', 'calendar-heatmap-legend')
                  .attr('width', SQUARE_LENGTH)
                  .attr('height', SQUARE_LENGTH)
                  .attr('x', function (d, i) { return (width - legendWidth) + (i + 1) * 13; })
                  .attr('y', height + SQUARE_PADDING)
                  .attr('fill', function (d) { return d; });

              legendGroup.append('text')
                .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-less')
                .attr('x', width - legendWidth - 13)
                .attr('y', height + SQUARE_LENGTH)
                .text(locale.Less);

              legendGroup.append('text')
                .attr('class', 'calendar-heatmap-legend-text calendar-heatmap-legend-text-more')
                .attr('x', (width - legendWidth + SQUARE_PADDING) + (colorRange.length + 1) * 13)
                .attr('y', height + SQUARE_LENGTH)
                .text(locale.More);
            }

            dayRects.exit().remove();
            var monthLabels = svg.selectAll('.month')
                .data(monthRange)
                .enter().append('text')
                .attr('class', 'month-name')
                .text(function (d) {
                  return locale.months[d.getMonth()];
                })
                .attr('x', function (d, i) {
                  var matchIndex = 0;
                  dateRange.find(function (element, index) {
                    matchIndex = index;
                    return moment(d).isSame(element, 'month') && moment(d).isSame(element, 'year');
                  });

                  return Math.floor(matchIndex / 7) * (SQUARE_LENGTH + SQUARE_PADDING);
                })
                .attr('y', 0);  // fix these to the top

            locale.days.forEach(function (day, index) {
              index = formatWeekday(index);
              if (index % 2) {
                svg.append('text')
                  .attr('class', 'day-initial')
                  .attr('transform', 'translate(-8,' + (SQUARE_LENGTH + SQUARE_PADDING) * (index + 1) + ')')
                  .style('text-anchor', 'middle')
                  .attr('dy', '2')
                  .text(day);
              }
            });
          }

          function pluralizedTooltipUnit (count) {
            if ('string' === typeof tooltipUnit) {
              return (tooltipUnit + (count === 1 ? '' : 's'));
            }
            for (var i in tooltipUnit) {
              var _rule = tooltipUnit[i];
              var _min = _rule.min;
              var _max = _rule.max || _rule.min;
              _max = _max === 'Infinity' ? Infinity : _max;
              if (count >= _min && count <= _max) {
                return _rule.unit;
              }
            }
          }

          function tooltipHTMLForDate(d) {
            var dateStr = moment(d).format('ddd, MMM Do YYYY');
            var count = countForDate(d);
            return '<span><strong>' + (count ? count : locale.No) + ' ' + pluralizedTooltipUnit(count) + '</strong> ' + locale.on + ' ' + dateStr + '</span>';
          }

          function countForDate(d) {
            var count = 0;
            var match = chart.data().find(function (element, index) {
              return moment(element.date).isSame(d, 'day');
            });
            if (match) {
              count = match.count;
            }
            return count;
          }

          function formatWeekday(weekDay) {
            if (weekStart === 1) {
              if (weekDay === 0) {
                return 6;
              } else {
                return weekDay - 1;
              }
            }
            return weekDay;
          }

          var daysOfChart = chart.data().map(function (day) {
            return day.date.toDateString();
          });

  }

  return chart;
}


// polyfill for Array.find() method
/* jshint ignore:start */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
/* jshint ignore:end */


    },
  }
}
</script>

<style lang="scss">
text.month-name,
text.calendar-heatmap-legend-text,
text.day-initial {
  font-size: 10px;
  fill: inherit;
  font-family: Helvetica, arial, 'Open Sans', sans-serif;
}
rect.day-cell:hover {
  stroke: #555555;
  stroke-width: 1px;
}
.day-cell-tooltip {
  position: absolute;
  z-index: 9999;
  padding: 5px 9px;
  color: #bbbbbb;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 3px;
  text-align: center;
}
.day-cell-tooltip > span {
  font-family: Helvetica, arial, 'Open Sans', sans-serif
}
.calendar-heatmap {
  box-sizing: initial;
}
</style>
