// Polls Component
angular
  .module('app')
  .component('sharePoll', {
    templateUrl: 'components/share-poll.html',
    controller: SharePollCtrl
  })

function SharePollCtrl ($mdToast, $http, $location, $window) {
  var ctrl = this
  var clipboard = new $window.Clipboard('.clipboard')

  ctrl.$onInit = function () {
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
