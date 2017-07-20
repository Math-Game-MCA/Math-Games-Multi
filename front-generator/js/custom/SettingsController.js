    App.controller('SettingsController', ['$scope', '$location', '$crypto','$controller','$http', '$timeout', '$window', '$auth', '$cookieStore', '$cookies', '$state', '$stateParams', '$resource', 'Restangular', '$rootScope', 'flash', 'Upload', function($scope, $location, $crypto, $controller,$http, $timeout, $window, $auth, $cookieStore, $cookies, $state, $stateParams, $resource, Restangular, $rootScope, flash, Upload ) {
  'use strict';

	$scope.account = {};
	$rootScope.userImage = 'no-image.png';


	$scope.picture = function(){
		Restangular.one('get_pic').get().then(function(data){
        	if(data.file != ''){
        		$rootScope.userImage = data.file + '?decache=' + Math.random();
        		console.log($rootScope.userImage);
        	}
      }, function (err) {
      });
	}

	$scope.picture();

	$scope.load = function(){
		Restangular.one('get_user').get().then(function(data){
			$scope.account.fName = data.account[0].firstName;
			$scope.account.lName = data.account[0].lastName;
			$scope.account.email = data.account[0].email;
			console.log("Name:" + data.account[0].firstName);
      }, function (err) {
      });
	}

	$scope.load();

	$scope.change_user = function(){
		console.log( $scope.account.fName);
		Restangular.all('update_user').post({
			firstName: $scope.account.fName,
			lastName: $scope.account.lName,
			email: $scope.account.email
		}).then(function(data){
			flash.success = "Successfully updated your profile."
		}, function (err){
			flash.error = "Whoops, looks like we couldn't update your profile at the moment.";
		});
	}
 // upload on file select or drop

    $scope.upload = function (file) {
    	var fileName = file.name;
    	console.log(file.name);

		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function (e) {
		  var dataUrl = e.target.result;
		  var base64Data = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);

		  Restangular.all('upload').post({image: base64Data.toString(), name:fileName}).then(function(data){
		  		$scope.picture();

		  }, function (err){
		  	flash.error = "Whoops, looks like we couldn't upload your picture at the moment.";
		  });
		};
    };

    $scope.delete_account = function(){

	    $scope.account.password = CryptoJS.AES.encrypt($scope.account.password, "lendingCalc123" ).toString();

	    Restangular.all('login').post($scope.account).then(function(data){
			     Restangular.all('delete_account').post({accountId: $stateParams.accountId, email: $scope.account.username}).then(function(data) {
			            logout();
			    }, function (err) {
			   		flash.error = "Whoops, looks like we couldn't delete your account at the moment.";
			    });
	      $scope.account = {};
	    }, function (err) {
	      if(err.status == 417) {
	        $scope.response = 'validationError';
	        $scope.message = err.data.msg;
	        flash.error = "Whoops, looks like we couldn't delete your account at the moment.";
	      } else if (err.status == 401) {
	        /*toaster.pop('error', 'Wrong credentials', 'The email and password you entered dont match.');*/
	        flash.error = "Sorry, those credentials don't match what we have on file.";
	      } else {
	        $scope.response = 'error';
	        $scope.message = 'Internal server error occured, Please check back.';
	        flash.error = "Whoops, looks like we couldn't delete your account at the moment.";
	      }
	    });

	}

	$scope.change_pass = function(data){

		console.log(data.password_new);

	    $scope.account.password = CryptoJS.AES.encrypt($scope.account.password, "lendingCalc123" ).toString();
	    $scope.account.password_new = CryptoJS.AES.encrypt(data.password_new, "lendingCalc123" ).toString();

	    Restangular.all('login').post($scope.account).then(function(data){
			     Restangular.all('change_pass').post({new_pass: $scope.account.password_new}).then(function(data) {
			        flash.success = "Successfully changed your password.";
			    }, function (err) {
			    	flash.error = "Whoops, looks like we couldn't change your password at the moment.";
			    });
	      $scope.account = {};
	    }, function (err) {
	      if(err.status == 417) {
	        $scope.response = 'validationError';
	        $scope.message = err.data.msg;
	      } else if (err.status == 401) {
	        /*toaster.pop('error', 'Wrong credentials', 'The email and password you entered dont match.');*/
	        flash.error = "Sorry, those credentials don't match what we have on file.";
	      } else {
	        $scope.response = 'error';
	        $scope.message = 'Internal server error occured, Please check back.';
	      }
	    });
	}

    function logout() {
      $cookieStore.remove("user_details");
      $cookieStore.remove("token");
      $location.path('/page/login');
    };


}]);