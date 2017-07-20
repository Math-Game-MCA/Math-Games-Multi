myApp.controller('LoginFormController', ['$scope', 'Restangular', '$location', '$state', '$window', 'flash', 'toaster','$cookies','$cookieStore', '$timeout', '$crypto', function($scope, Restangular, $location, $state, $window, flash, toaster ,$cookies,$cookieStore, $timeout,$crypto) {
  $scope.view = 'login';
  $scope.social = loadGoogle;
  $scope.facebook = loadFacebook;
  $scope.linkedin = loadLinkedin;
  $scope.loadInstance = loadInstance;
  $scope.recover = recover;
  $scope.account = {};
  $scope.login = function() {

    //TODO: Move this key to config folder
    $scope.account.password = CryptoJS.AES.encrypt($scope.account.password, "lendingCalc123" ).toString();

    Restangular.all('login').post($scope.account).then(function(data){
      $scope.setAuthData(data);
      $scope.account = {};
      //toaster.pop('success', '', 'You are logged in successfully.');
      $location.path('/app/app/summary');
    }, function (err) {
      if(err.status == 417) {
        $scope.response = 'validationError';
        $scope.message = err.data.msg;
      } else if (err.status == 401) {
        toaster.pop('error', 'Wrong credentials', 'The email and password you entered dont match.');
      } else {
        $scope.response = 'error';
        $scope.message = 'Internal server error occured, Please check back.';
      }
    });
  };
  
  $scope.social = function() {
    loadGoogle();
  }
  
  function loadGoogle() {
    $window.open('/auth/google', 'Google login', 'width=300, height= 500');
  }
  
  function loadFacebook() {
    $window.open('/auth/facebook', 'Facebook login', 'width=300, height= 500');
  }
  
  function loadLinkedin() {
    $window.open('/auth/linkedin', 'Linkedin login', 'width=300, height= 500');
  }
  
  function loadInstance(view) {
    $scope.view = view || 'login';
  }
  
  function recover(email) {
    Restangular.all('recover').post({email: email}).then(function(data){
      toaster.pop('success', '', 'We have sent you the login instruction on you email.');
      loadInstance('login');
    }, function (err) {
      if(err.status == 417) {
        toaster.pop('error', '', 'We don\'t found any associated email in our record.');
      } else {
        flash.error = 'Internal server error occured, Please check back.';
      }
    });
  }
}]);
