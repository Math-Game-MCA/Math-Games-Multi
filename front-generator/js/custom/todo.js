/**=========================================================
 * Module: demo-buttons.js
 * Provides a simple demo for buttons actions
 =========================================================*/

myApp.controller('TodoController', ['$scope', '$window', '$state', '$filter', '$http', 'editableOptions', 'editableThemes','$q', 'API_URL', 'Restangular',
  function($scope, $window, $state, $filter, $http, editableOptions, editableThemes, $q, API_URL, Restangular) {

  
      
  Task_init();
   $scope.users = [];

  function Task_init() {
    $scope.authMsg = '';
    Restangular.all('tasks').getList().then(function(data){
      $scope.users = data;
    }, function (err) {
      $scope.response = 'error';
      $scope.message = 'Internal server error occured, Please check back.';
    });
  }
      
  function handleError(err) {
      alert('warning', 'Something went wrong :(', err.message);
      $scope.authMsg = 'Internal Server Problem.';
  }
 
      
  // editable row
  // ----------------------------------- 
  
  $scope.statuses = [
    {value: 1, text: 'Open'},
    {value: 2, text: 'In progress'},
    {value: 3, text: 'Closed'},
    {value: 4, text: 'Duplicate'}
  ];

  $scope.groups = [
    {value: 1, text: 'UI - Dashboard'},
    {value: 2, text: 'UI - Accounts'},
    {value: 3, text: 'UI - Resources'},
    {value: 4, text: 'Algo - Trading'},
    {value: 5, text: 'Algo - Analytics'},
    {value: 6, text: 'Algo - BackTesting'}];
  
  $scope.showGroup = function(user) {
    var selected = [];
    if(user.group) {
      selected = $filter('filter')($scope.groups, {value: user.group});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

      
  function handleError(err) {
      alert('warning', 'Something went wrong :(', err.message);
      $scope.authMsg = 'Internal Server Problem.';
  }
      
  function authSuccessful(res) {
      
      $state.go('app.todo');

  }
  

  $scope.saveUser = function(data, id) {
    if (id == 0)  {
      Restangular.all('tasks').post({
        title: data.title,
        description: data.description,
        status: data.status,
        group: data.group
      }).then(function(data){
        Task_init();
      }, function (err) {
        $scope.response = 'error';
        $scope.message = 'Internal server error occured, Please check back.';
      });
    } else {
      Restangular.one('tasks', id).customPUT({
        title: data.title,
        description: data.description,
        status: data.status,
        group: data.group
      }).then(function(data){
        Task_init();
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    }
  };

  // remove user
  $scope.removeUser = function(index) {
    Restangular.one('tasks', index).remove().then(function(res) {
      Task_init();
    }, function(err) {
      
    });
  };

  // add user
  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: 0,
      title: '',
      description: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };
}]);
