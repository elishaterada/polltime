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

  ctrl.$onInit = function () {
    ctrl.showAnswers = true
    ctrl.showCounts = true
  }

  ctrl.$onChanges = function () {
    if (ctrl.answers) {
      renderData(ctrl.answers)
    }
  }

  ctrl.toggleAnswers = function (show) {
    if (show) {
      graph.selectAll('text.answer')
        .transition()
        .duration(500)
        .attr('opacity', 1)
    } else {
      graph.selectAll('text.answer')
        .transition()
        .duration(500)
        .attr('opacity', 0)
    }
  }

  ctrl.toggleCounts = function (show) {
    if (show) {
      graph.selectAll('text.count')
        .transition()
        .duration(500)
        .attr('opacity', 1)
    } else {
      graph.selectAll('text.count')
        .transition()
        .duration(500)
        .attr('opacity', 0)
    }
  }

  function renderData (data) {
    data = _.orderBy(data, 'count', 'desc')

    // Define scheme
    var c10 = d3.scaleOrdinal(d3.schemeCategory10)
    c10.domain(ctrl.answers.map(function (d, i) { return data[i].text }))

    // Set height
    var newGraphHeight = (conf.barHeight + conf.padding) * data.length
    graph.attr('height', newGraphHeight)

    // Set data max
    var dataMax = d3.max(data, function (d, i) {
      return d.count
    })

    // Set data spectrum
    var x = d3.scaleLinear()
      .domain([0, dataMax])
      .range([0, conf.width])

    // Bars
    var bars = graph.selectAll('g.bar')
      .data(data)
      .enter().append('g')
      .attr('class', 'bar')

    // Bar: Container
    bars.append('rect')
      .attr('class', 'potential')
      .attr('width', conf.width)
      .attr('height', conf.barHeight)

    // Bar: Actual Value
    bars.append('rect')
      .attr('class', 'actual')
      .attr('width', 0)
      .attr('height', conf.barHeight)
      .attr('fill', function (d, i) {
        return c10(d.text)
      })

    // Label: Answer
    bars.append('text')
      .text(function (d, i) {
        return d.text
      })
      .attr('class', 'answer')
      .attr('opacity', 1)
      .attr('transform', function (d, i) {
        var yPosition = (conf.barHeight + conf.padding) / 2

        return 'translate(' + conf.padding + ', ' + yPosition + ')'
      })

    // Label: Count
    bars.append('text')
      .text(function (d, i) {
        return d.count
      })
      .attr('class', 'count')
      .attr('opacity', 1)
      .attr('transform', function (d, i) {
        var yPosition = (conf.barHeight + conf.padding) / 2
        var xPosition = conf.width - conf.padding * 2

        return 'translate(' + xPosition + ', ' + yPosition + ')'
      })

    // Transitions
    graph.selectAll('g.bar')
      .transition()
      .duration(500)
      .attr('transform', function (d, i) {
        return 'translate(0, ' + (conf.barHeight + conf.padding) * i + ')'
      })

    graph.selectAll('text.answer')
      .transition()
      .text(function (d, i) {
        return data[i].text
      })

    graph.selectAll('text.count')
      .transition()
      .text(function (d, i) {
        return data[i].count
      })

    graph.selectAll('rect.actual')
      .transition()
      .duration(1500)
      .attr('width', function (d, i) {
        return x(data[i].count)
      })
  }
}
