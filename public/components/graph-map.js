angular
  .module('app')
  .component('graphMap', {
    template: '<div id="graph-map"></div>',
    controller: GraphMapCtrl,
    bindings: {
      answers: '<'
    }
  })

function GraphMapCtrl ($interval, mapboxToken, mapboxgl) {
  var ctrl = this
  var map = null
  var intervalID

  ctrl.$onInit = function () {
    ctrl.showAnswers = true
    ctrl.showCounts = true

    mapboxgl.accessToken = mapboxToken

    map = new mapboxgl.Map({
      container: 'graph-map',
      style: 'mapbox://styles/mapbox/dark-v9'
    })

    intervalID = $interval(
      mapInitLoadMarkers, 250
    )
  }

  ctrl.$onChanges = function () {
    if (map && map.loaded()) {
      loadMarkers()
    }
  }

  function mapInitLoadMarkers () {
    if (map && map.loaded()) {
      loadMarkers()
      $interval.cancel(intervalID)
    }
  }

  function loadMarkers () {
    var bounds = new mapboxgl.LngLatBounds()
    var markers = []

    _.each(ctrl.answers, function (value, key) {
      if (key === 'ignore') {
        return
      }

      // Extend boundary to reset map view later
      bounds.extend(value.location.coordinates)

      // Track answers
      markers.push(value)

      var el = document.createElement('div')
      el.id = key
      el.className = 'marker'

      new mapboxgl.Marker(el)
        .setLngLat(value.location.coordinates)
        .addTo(map)
    })

    if (markers.length === 1) {
      map.setZoom(4)
      map.setCenter(markers[0].location.coordinates)
    } else if (markers.length > 1) {
      map.fitBounds(bounds, { padding: 100 })
    }
  }
}
