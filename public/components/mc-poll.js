angular
  .module('app')
  .component('mcPoll', {
    templateUrl: 'components/mc-poll.html',
    controller: McPollCtrl
  })

function McPollCtrl (Auth, $stateParams, $firebaseObject, $mdToast, $localStorage, $state, moment) {
  var ctrl = this

  ctrl.$onInit = function () {
    Auth.$onAuthStateChanged(function (firebaseuser) {
      ctrl.user = firebaseuser
    })

    ctrl.poll = $firebaseObject(
      firebase.database().ref('polls').child($stateParams.id)
    )

    ctrl.created = $localStorage[$stateParams.id + '_created']
    ctrl.answered = $localStorage[$stateParams.id + '_answered']

    ctrl.showAnswers = true
    ctrl.showCounts = true
  }

  ctrl.answer = function (choice) {
    // Update Poll
    ctrl.poll.choices[choice].count += 1
    ctrl.poll.modified = moment().format()

    ctrl.poll.$save().then(function () {
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

  ctrl.clonePoll = function (poll) {
    var uid = null
    var choices = []

    if (ctrl.user) {
      uid = ctrl.user.uid
    }

    // Build answers format
    _.each(poll.choices, function (value, key) {
      if (value) {
        choices.push({
          text: value.text,
          count: 0
        })
      }
    })

    var pollData = {
      'ownerID': uid,
      'question': poll.question,
      'choices': choices,
      'type': 'mc',
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

        $state.go('mcPoll', {id: id})
      })
  }
}
