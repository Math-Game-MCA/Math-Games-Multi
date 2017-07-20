myApp.controller('LogoutController', ['$scope', 'Restangular', '$cookies', '$cookieStore', '$location', 'flash', function($scope, Restangular, $cookies, $cookieStore, $location, flash) {
  function logout() {
    $cookieStore.remove("user_details");
    $cookieStore.remove("token");
    flash.success = 'You have logged out successfully.';
    $location.path('/page/login');
  };
  
  logout();
}]);
