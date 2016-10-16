// Polls Component
angular
  .module('app')
  .component('polls', {
    templateUrl: 'components/polls.html',
    controller: PollsCtrl,
    bindings: {
      user: '<'
    }
  })

function PollsCtrl (Profiles, Polls, $stateParams, $firebaseObject, $firebaseArray, $mdToast, $localStorage, $http, moment, $window) {
  var ctrl = this
  var clipboard = new $window.Clipboard('.clipboard')

  ctrl.$onInit = function () {
    ctrl.profiles = $firebaseObject(Profiles)
    ctrl.polls = $firebaseArray(Polls)

    ctrl.polls.$loaded().then(function (polls) {
      ctrl.poll = polls.$getRecord($stateParams.id)
    })

    ctrl.voted = $localStorage[$stateParams.id]

    ctrl.shortURL = getShortURL()
  }

  clipboard.on('success', function (e) {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Copied URL')
        .hideDelay(3000)
    )
  })

  clipboard.on('error', function (e) {
    $mdToast.show(
      $mdToast.simple()
        .textContent('Copy Failed')
        .hideDelay(3000)
    )
  })

  ctrl.vote = function (choice) {
    // Update Poll
    ctrl.poll.answers[choice].count += 1
    ctrl.poll.modified = moment().format()

    ctrl.polls.$save(ctrl.poll)
      .then(function () {
        $localStorage[$stateParams.id] = true
        ctrl.voted = $localStorage[$stateParams.id]

        $mdToast.show(
          $mdToast.simple()
            .textContent('Vote Casted')
            .hideDelay(3000)
        )
      })
  }

  function getShortURL () {
    $http({
      method: 'POST',
      url: 'https://www.googleapis.com/urlshortener/v1/url',
      params: { key: 'AIzaSyApu8K6ALu_piGLcSAoP3fuZcPOo0PuT7c' },
      data: {'longUrl': $window.location.href}
    })
      .then(function (res) {
        ctrl.shortURL = res.data.id
      })
  }
}
