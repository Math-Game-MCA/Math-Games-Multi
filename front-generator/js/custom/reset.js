myApp.controller('ResetController', ['$scope', 'Restangular', '$location', '$state', '$window', 'flash', '$stateParams', function($scope, Restangular, $location, $state, $window, flash, $stateParams) {
  if(typeof $stateParams.hash == 'undefined' || $stateParams.hash == '') {
    flash.error = 'Invalid page access.';
    $location.path('/page/login');
  }
  
  $scope.reset = function() {
    Restangular.all('reset_p').post({h: $stateParams.hash, password: $scope.password, confirm_password: $scope.cpassword}).then(function(data){
      flash.success = 'Password updated successfully.';
      $location.path('/page/login');
    }, function (err) {
      
    });
  }
}]);
