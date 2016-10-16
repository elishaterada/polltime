// Landing Component
angular
  .module('app')
  .component('landing', {
    templateUrl: 'components/landing.html',
    controller: LandingCtrl,
    bindings: {
      user: '<'
    }
  })

function LandingCtrl (Profiles, Polls, $firebaseObject, $firebaseArray, $mdToast, moment) {
  var ctrl = this

  ctrl.$onInit = function () {
    ctrl.profiles = $firebaseObject(Profiles)
    ctrl.polls = $firebaseArray(Polls)
    ctrl.newPoll = {
      question: '',
      answers: [ {}, {} ]
    }
  }

  ctrl.createPoll = function (newPoll) {
    var pollData = {
      'ownerID': ctrl.user.uid,
      'question': newPoll.question,
      'answers': newPoll.answers,
      'created': moment().format(),
      'modified': moment().format()
    }

    ctrl.polls.$add(pollData)
      .then(function () {
        ctrl.newPoll = null

        $mdToast.show(
          $mdToast.simple()
            .textContent('Created Poll')
            .hideDelay(3000)
        )
      })
  }
}
