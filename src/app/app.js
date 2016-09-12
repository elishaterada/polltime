function config (
  $mdThemingProvider
) {
  // Angular Material Setup
  $mdThemingProvider.theme('custom')
    .primaryPalette('deep-purple')
    .accentPalette('blue')

  $mdThemingProvider.setDefaultTheme('custom')
}

function run ($rootScope, $window) {
  $rootScope._ = $window._
}

function AppCtrl () {
}

angular
  .module('app', [
    'ngAnimate',
    'ngMaterial',
    'ngAria'
  ])
  .controller('AppCtrl', AppCtrl)
  .config(config)
  .run(run)

//  Main Component
function MainCtrl ($log) {
  var ctrl = this

  ctrl.greeting = 'Hello World'

  ctrl.greet = function(text) {
    $log.debug(text)
  }

  function sample () {
    $log.debug('App is initialized!')
  }

  function init () {
    sample()
  }

  init()
}

angular
  .module('app')
  .component('main', {
    templateUrl: 'src/templates/main.tpl.html',
    controller: MainCtrl
  })
