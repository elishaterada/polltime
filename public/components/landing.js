// Landing Component
angular
  .module('app')
  .component('landing', {
    templateUrl: 'components/landing.html',
    controller: LandingCtrl
  })

function LandingCtrl (Auth, Profiles, Polls, $firebaseObject, $firebaseArray, $mdToast, $state, $localStorage, moment) {
  var ctrl = this

  var pollDefault = {
    question: '',
    answers: ['', '']
  }

  ctrl.$onInit = function () {
    Auth.$onAuthStateChanged(function (firebaseuser) {
      ctrl.user = firebaseuser
    })
    ctrl.profiles = $firebaseObject(Profiles)
    ctrl.polls = $firebaseArray(Polls)
    ctrl.newPoll = angular.copy(pollDefault)
  }

  ctrl.cancel = function () {
    ctrl.newPoll = angular.copy(pollDefault)
  }

  ctrl.createPoll = function (newPoll) {
    var uid = null
    var answers = []

    // Close virtual keyboard
    angular.element(document.querySelector('.md-input-focus')).blur()

    if (ctrl.user) {
      uid = ctrl.user.uid
    }

    // Build answers format
    _.each(newPoll.answers, function (value, key) {
      if (value) {
        answers.push({
          text: value,
          count: 0
        })
      }
    })

    var pollData = {
      'ownerID': uid,
      'question': newPoll.question,
      'answers': answers,
      'created': moment().format(),
      'modified': moment().format()
    }

    ctrl.polls.$add(pollData)
      .then(function (ref) {
        var id = ref.key

        $localStorage[id + '_created'] = true

        ctrl.newPoll = null

        $mdToast.show(
          $mdToast.simple()
            .textContent('Created Poll')
            .hideDelay(3000)
        )

        $state.go('polls', { id: id })
      })
  }

  ctrl.$doCheck = function () {
    // Automatically append next answer
    // IF: last item has a value
    // IF: total items are less than equal to 10
    if (_.last(ctrl.newPoll.answers) !== '' &&
        ctrl.newPoll.answers.length < 10
    ) {
      ctrl.newPoll.answers.push('')
    }
  }
}
