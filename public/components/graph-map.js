// Polls Component
angular
  .module('app')
  .component('graphMap', {
    template: '<div id="graph-map"></div>',
    controller: GraphMapCtrl,
    bindings: {
      answers: '<',
      showAnswers: '<',
      showCounts: '<'
    }
  })

function GraphMapCtrl ($timeout, mapboxToken, mapboxgl) {
  var ctrl = this
  var map = null

  ctrl.$onInit = function () {
    ctrl.showAnswers = true
    ctrl.showCounts = true

    mapboxgl.accessToken = mapboxToken

    map = new mapboxgl.Map({
      container: 'graph-map',
      style: 'mapbox://styles/mapbox/dark-v9'
    })

    $timeout(function () {
      loadMarkers()
    }, 0)
  }

  ctrl.$onChanges = function () {
    if (map) {
      loadMarkers()
    }
  }

  function loadMarkers () {
    var bounds = new mapboxgl.LngLatBounds()

    _.each(ctrl.answers, function (value, key) {
      if (key === 'ignore') {
        return
      }

      // Extend boundary to reset map view later
      bounds.extend(value.location.coordinates)

      var el = document.createElement('div')
      el.id = key
      el.className = 'marker'

      new mapboxgl.Marker(el)
        .setLngLat(value.location.coordinates)
        .addTo(map)
    })

    map.fitBounds(bounds, {padding: 100})
  }
}
