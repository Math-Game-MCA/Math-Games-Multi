myApp.controller('MainController', ['$scope', 'Restangular', '$cookies', '$cookieStore', '$rootScope', '$location', 'toaster', 'flash', function($scope, Restangular, $cookies, $cookieStore, $rootScope, $location, toaster, flash) {
  $scope.verifyLogin = true;
  $rootScope.showGrid = false;
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var uri = next.split('#');
    var nUri = '';
    if(typeof uri[1] != 'undefined') {
      nUri = uri[1].split('/');
    }
    if((uri[1] == '/page/login' || uri[1] == '/page/register' || (nUri[2] == 'reset')) && $scope.getCookie() != 'undefined' && $scope.getCookie() != null && $scope.getCookie() != '') {
      Restangular.all('authenticate').post().then(function(data){
        $location.path('/app/summary');
      }, function (err) {
        $cookieStore.remove("user_details");
        $cookieStore.remove("token");
        $location.path('/page/login');
      });
    } else if(uri[1] != '/page/login' && uri[1] != '/page/register' && nUri[2] != 'reset') {
      $scope.isUserAuthenticated();
    }
  });
  
  $scope.setAuthData = function(data) {
    $cookieStore.put('user_details', data);
    $scope.setCookie(data.token);
    $location.path('/app/summary');
  }
  
  $scope.setCookie = function(token) {
    //Restangular.setDefaultHeaders({ authentication: 'bearer ' + token });
    $cookieStore.put('token', token);
  };
  
  $scope.getCookie = function() {
    //Restangular.setDefaultHeaders({ authentication: 'bearer ' + token });
    return $cookieStore.get('token');
  };
  
  $scope.isUserAuthenticated = function () {
    if($scope.getCookie() != 'undefined' && $scope.getCookie() != null && $scope.getCookie() != '') {
      Restangular.all('authenticate').post().then(function(data){}, function (err) {

        $cookieStore.remove("user_details");
        $cookieStore.remove("token");
        $location.path('/page/login');
      });
    } else {
      $location.path('/page/login');
    }
  };
  
  $scope.$watch('flash', function(newValue, oldValue) {
    
  });
  
  $scope.loadlinks = function(item) {
    console.log(item);
    return item.text == 'Accounts' ? '' : item.sref;
  }
}]);
