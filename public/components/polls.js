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

function PollsCtrl (Profiles, Polls, $stateParams, $firebaseObject, $firebaseArray, $mdToast, $localStorage, $http, $state, $location, moment, $window) {
  var ctrl = this
  var clipboard = new $window.Clipboard('.clipboard')

  ctrl.$onInit = function () {
    ctrl.profiles = $firebaseObject(Profiles)
    ctrl.polls = $firebaseArray(Polls)

    ctrl.polls.$loaded().then(function (polls) {
      ctrl.poll = polls.$getRecord($stateParams.id)
    })

    ctrl.created = $localStorage[$stateParams.id + '_created']
    ctrl.voted = $localStorage[$stateParams.id + '_voted']

    ctrl.showAnswers = true
    ctrl.showCounts = true

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
        $localStorage[$stateParams.id + '_voted'] = true
        ctrl.voted = $localStorage[$stateParams.id + '_voted']

        $mdToast.show(
          $mdToast.simple()
            .textContent('Vote Casted')
            .hideDelay(3000)
        )
      })
  }

  ctrl.skipVote = function () {
    $localStorage[$stateParams.id + '_voted'] = true
    ctrl.voted = $localStorage[$stateParams.id + '_voted']
  }

  ctrl.goTo = function (route) {
    $state.go(route)
  }

  ctrl.clonePoll = function (poll) {
    var uid = null
    var answers = []

    if (ctrl.user) {
      uid = ctrl.user.uid
    }

    // Build answers format
    _.each(poll.answers, function (value, key) {
      if (value) {
        answers.push({
          text: value.text,
          count: 0
        })
      }
    })

    var pollData = {
      'ownerID': uid,
      'question': poll.question,
      'answers': answers,
      'created': moment().format(),
      'modified': moment().format()
    }

    ctrl.polls.$add(pollData)
      .then(function (ref) {
        var id = ref.key

        $state.go('polls', {id: id})
        ctrl.newPoll = null

        $mdToast.show(
          $mdToast.simple()
            .textContent('Created Poll')
            .hideDelay(3000)
        )
      })
  }

  function getShortURL () {
    $http({
      method: 'POST',
      url: 'https://www.googleapis.com/urlshortener/v1/url',
      params: { key: 'AIzaSyApu8K6ALu_piGLcSAoP3fuZcPOo0PuT7c' },
      data: {'longUrl': $location.absUrl()}
    })
      .then(function (res) {
        ctrl.shortURL = res.data.id
      })
  }
}
