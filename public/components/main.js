//  Main Component
angular
  .module('app')
  .component('main', {
    templateUrl: 'components/main.html',
    controller: MainCtrl
  })

function MainCtrl ($mdSidenav, $timeout, $log, Profiles, Auth) {
  var ctrl = this

  ctrl.toggleLeftNav = buildDelayedToggler('leftNav')

  ctrl.$onInit = function () {
    firebaseAuth()
  }

  ctrl.signIn = function () {
    Auth.$signInWithRedirect('google').then(function (firebaseUser) {
      $log.debug(firebaseUser)
    }).catch(function (error) {
      $log.debug(error)
    })
  }

  ctrl.signOut = function () {
    Auth.$signOut().then(function () {
      // Sign-out successful.
    }, function (error) {
      $log.debug(error)
    })
  }

  function firebaseAuth () {
    Auth.$onAuthStateChanged(function (firebaseUser) {
      ctrl.user = firebaseUser

      if (firebaseUser) {
        // Save current user profile
        Profiles.child(firebaseUser.uid).set({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        })
      }
    })
  }

  function debounce (func, wait, context) {
    var timer

    return function debounced () {
      var context = this
      var args = Array.prototype.slice.call(arguments)
      $timeout.cancel(timer)
      timer = $timeout(function () {
        timer = undefined
        func.apply(context, args)
      }, wait || 10)
    }
  }

  function buildDelayedToggler (navID) {
    return debounce(function () {
      $mdSidenav(navID)
        .toggle()
    }, 200)
  }
}
