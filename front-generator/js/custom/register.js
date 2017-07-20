/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

myApp.controller('RegisterFormController', ['$scope', 'Restangular', 'toaster', function($scope, Restangular, toaster) {
    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.message = [];
    $scope.response = '';
    $scope.register = function() {
        $scope.message = $scope.response = '';
        // TODO: Move encryption key to config file
        $scope.account.password = CryptoJS.AES.encrypt($scope.account.password, 'lendingCalc123').toString();
        $scope.account.password2 = $scope.account.password;
        Restangular.all('register').post($scope.account).then(function(data){
            $scope.message = '';
            $scope.account = {};
            toaster.pop('success', 'Registration', 'You are registered succesfully, We have sent a verification email to the address you used when you filled in the form.');
        }, function (err) {
            if(err.status == 417) {
                $scope.response = 'validationError';
                $scope.message = err.data.msg;
            } else {
                toaster.pop('error', 'Unknown Error', 'We got an error we will get back to you asap.');
            }
        });
    };
}]);
