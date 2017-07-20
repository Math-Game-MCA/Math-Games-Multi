/**=========================================================
 * Module: nestable.js
 * Nestable controller
 =========================================================*/

App.controller('NestableController', ['$scope', function($scope) {
  
  'use strict';

  $scope.myNestable = {};
  $scope.myNestable2 = {};

  $scope.myNestable.onchange = function() {
    
  };


  $scope.myNestable2.onchange = function() {
    $scope.serialized = $scope.myNestable2.serialize();
  };

}]);
