App.controller('VersionController', [ '$scope', 'Restangular', '$rootScope', '$state', '$stateParams', 'toaster', 'flash', function($scope, Restangular, $rootScope, $state, $stateParams, toaster, flash) {
	'use strict';

$scope.version = "";

  function init() {
  	Restangular.one('version').get().then(function(data){
  		$scope.version = data.version;
        }, function (err) {
          	$scope.response = 'error';
          	$scope.message = 'Something went wrong';
        }); 
    }
  init();
 }]);