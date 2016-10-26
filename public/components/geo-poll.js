angular
  .module('app')
  .component('geoPoll', {
    templateUrl: 'components/geo-poll.html',
    controller: GeoPollCtrl
  })

function GeoPollCtrl (Auth, $stateParams, $q, $firebaseObject, $firebaseArray, $mdToast, $localStorage, $state, moment, $http, mapboxToken) {
  var ctrl = this

  ctrl.$onInit = function () {
    Auth.$onAuthStateChanged(function (firebaseuser) {
      ctrl.user = firebaseuser
    })

    ctrl.poll = $firebaseObject(
      firebase.database().ref('polls').child($stateParams.id)
    )

    ctrl.searchText = ''

    ctrl.created = $localStorage[$stateParams.id + '_created']
    ctrl.answered = $localStorage[$stateParams.id + '_answered']

    ctrl.showAnswers = true
    ctrl.showCounts = true
  }

  ctrl.locationSearch = function (searchText) {
    var deferred = $q.defer()

    $http({
      method: 'GET',
      url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(searchText) + '.json?access_token=' + mapboxToken
    }).then(function (response) {
      deferred.resolve(response.data.features)
    })

    return deferred.promise
  }

  ctrl.answer = function (choice) {
    // Update Poll
    var answer = {
      name: choice.place_name,
      location: choice.geometry
    }
    var answers = $firebaseArray(
      firebase.database().ref('polls').child($stateParams.id).child('answers')
    )

    answers.$add(answer).then(function (ref) {
      // Store answered state
      $localStorage[$stateParams.id + '_answered'] = true
      ctrl.answered = $localStorage[$stateParams.id + '_answered']

      // Update parent poll
      ctrl.poll.modified = moment().format()
      ctrl.poll.$save()
    })
  }

  ctrl.skipAnswer = function () {
    $localStorage[$stateParams.id + '_answered'] = true
    ctrl.answered = $localStorage[$stateParams.id + '_answered']
  }

  ctrl.goTo = function (route) {
    $state.go(route)
  }
}
