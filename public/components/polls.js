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

function PollsCtrl (Profiles, Polls, $stateParams, $firebaseObject, $firebaseArray, $mdToast, $localStorage, moment) {
  var ctrl = this

  ctrl.$onInit = function () {
    ctrl.profiles = $firebaseObject(Profiles)
    ctrl.polls = $firebaseArray(Polls)

    ctrl.polls.$loaded().then(function (polls) {
      ctrl.poll = polls.$getRecord($stateParams.id)
    })

    ctrl.voted = $localStorage[$stateParams.id]
  }

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

}
