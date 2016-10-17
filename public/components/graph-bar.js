// Polls Component
angular
  .module('app')
  .component('graphBar', {
    templateUrl: 'components/graph-bar.html',
    controller: GraphBarCtrl,
    bindings: {
      answers: '<'
    }
  })

function GraphBarCtrl (d3) {
  var ctrl = this

  var conf = {
    width: 330,
    height: 0,
    barHeight: 30,
    padding: 10,
    minBarWidth: 2,
    maxBarWidth: 280,
    maxMagnitude: 10
  }

  // D3 Initiation
  var graph = d3.select('.graph-bar')
    .attr('width', conf.width)
    .attr('height', conf.height)

  var bars = graph.selectAll('g.bar')

  ctrl.$onChanges = function () {
    if (ctrl.answers) {
      renderData(ctrl.answers)
    }
  }

  function renderData (data) {
    // Color scheme
    var c10 = d3.scaleOrdinal(d3.schemeCategory10)
    c10.domain(data.map(function (d) { return d.text }))

    // Set height
    var newGraphHeight = (conf.barHeight + conf.padding) * data.length
    graph.attr('height', newGraphHeight)

    // Set data max
    var dataMax = d3.max(data, function (d) {
      return d.count
    })

    // Set data spectrum
    var x = d3.scaleLinear()
      .domain([0, dataMax])
      .range([0, conf.width])

    // Bars
    bars = graph.selectAll('g.bar')
      .data(data)
      .enter()
        .append('g')
        .attr('class', 'bar')

    // Bar: Container
    bars.append('rect')
      .attr('class', 'potential')
      .attr('width', conf.width)
      .attr('height', conf.barHeight)
      .attr('transform', function (d, i) {
        return 'translate(0, ' + (conf.barHeight + conf.padding) * i + ')'
      })

    // Bar: Actual Value
    bars.append('rect')
      .attr('class', 'actual')
      .attr('z-index', 1)
      .attr('width', 0)
      .attr('height', conf.barHeight)
      .attr('transform', function (d, i) {
        return 'translate(0, ' + (conf.barHeight + conf.padding) * i + ')'
      })
      .attr('fill', function (d) {
        return c10(d.text)
      })

    // Label: Answer
    bars.append('text')
      .text(function (d) {
        return d.text
      })
      .attr('class', 'answer')
      .attr('transform', function (d, i) {
        var stepOffset = (conf.barHeight + conf.padding) * i
        var textOffset = (conf.barHeight + conf.padding) / 2
        var totalOffset = stepOffset + textOffset

        return 'translate(' + conf.padding + ', ' + totalOffset + ')'
      })

    // Label: Count
    bars.append('text')
      .text(function (d) {
        return d.count
      })
      .attr('class', 'count')
      .attr('transform', function (d, i) {
        var yStepOffset = (conf.barHeight + conf.padding) * i
        var yTextOffset = (conf.barHeight + conf.padding) / 2
        var yPosition = yStepOffset + yTextOffset
        var xPosition = conf.width - conf.padding * 2

        return 'translate(' + xPosition + ', ' + yPosition + ')'
      })

    // Transitions
    var transition = graph.transition()

    transition.selectAll('rect.actual')
      .duration(1500)
      .attr('width', function (d, i) {
        // Ensure latest date is returned
        return x(data[i].count)
      })

    transition.selectAll('text.count')
      .duration(1500)
      .text(function (d, i) {
        // Ensure latest date is returned
        return data[i].count
      })
  }
}
