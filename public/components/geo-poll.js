angular
  .module('app')
  .component('geoPoll', {
    templateUrl: 'components/geo-poll.html',
    controller: GeoPollCtrl
  })

function GeoPollCtrl (Auth, Polls, $stateParams, $q, $firebaseArray, $mdToast, $localStorage, $state, moment, $http, mapboxToken) {
  var ctrl = this

  ctrl.$onInit = function () {
    Auth.$onAuthStateChanged(function (firebaseuser) {
      ctrl.user = firebaseuser
    })
    ctrl.polls = $firebaseArray(Polls)

    ctrl.polls.$loaded().then(function (polls) {
      ctrl.poll = polls.$getRecord($stateParams.id)
    })

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
    var geoId = _.replace(choice.id, '.', '_')
    ctrl.poll.answers[geoId] = {
      name: choice.place_name,
      location: choice.geometry
    }

    ctrl.poll.modified = moment().format()

    ctrl.polls.$save(ctrl.poll)
      .then(function () {
        $localStorage[$stateParams.id + '_answered'] = true
        ctrl.answered = $localStorage[$stateParams.id + '_answered']

        $mdToast.show(
          $mdToast.simple()
            .textContent('Vote Casted')
            .hideDelay(3000)
        )
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
