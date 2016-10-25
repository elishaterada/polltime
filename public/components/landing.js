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
    choices: ['', ''],
    type: 'mc'
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
    var pollData = {}
    var choices = []

    // Close virtual keyboard
    angular.element(document.querySelector('.md-input-focus')).blur()

    if (ctrl.user) {
      uid = ctrl.user.uid
    }

    pollData = {
      'ownerID': uid,
      'question': newPoll.question,
      'type': newPoll.type,
      'created': moment().format(),
      'modified': moment().format()
    }

    // Build Multiple-Choices
    if (newPoll.type === 'mc') {
      _.each(newPoll.choices, function (value, key) {
        if (value) {
          choices.push({
            text: value,
            count: 0
          })
        }
      })

      pollData.choices = choices
    } else if (newPoll.type === 'geo') {
      pollData.answers = {
        'ignore': { name: '', location: '' }
      }
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

        if (pollData.type === 'mc') {
          $state.go('mcPoll', { id: id })
        } else if (pollData.type === 'geo') {
          $state.go('geoPoll', { id: id })
        }
      })
  }

  ctrl.$doCheck = function () {
    // Automatically append next answer
    // IF: last item has a value
    // IF: total items are less than equal to 10
    if (_.last(ctrl.newPoll.choices) !== '' &&
        ctrl.newPoll.choices.length < 10
    ) {
      ctrl.newPoll.choices.push('')
    }
  }
}
