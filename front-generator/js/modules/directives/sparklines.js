/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
 
App.directive('sparkline', ['$timeout', '$window', function($timeout, $window){

  'use strict';

  return {
    restrict: 'EA',
    scope: true,
    controller: function ($scope, $element, $rootScope) {
      var runSL = function(){
        initSparLine($element);
      };
      
      $scope.$watch('$parent.totalPrinciple', function(newValue, oldValue){
        if(oldValue != newValue) {
          initCustomSparLine($element, newValue);
        }
      });
      
      $scope.$watch('$parent.cash', function(newValue, oldValue){
        if(oldValue != newValue) {
          initCustomSparLine($element, newValue);
        }
      });
      
      $scope.$watch('$parent.totalReturn', function(newValue, oldValue){
        if(oldValue != newValue) {
          initCustomSparLine($element, newValue);
        }
      });
      //$timeout(runSL);
      
    }
  };

  function initSparLine($element) {
    var options = $element.data();

    options.type = options.type || 'bar'; // default chart is bar
    options.disableHiddenCheck = true;

    $element.sparkline('html', options);

    if(options.resize) {
      $(window).resize(function(){
        $element.sparkline('html', options);
      });
    }
  }
  
  function initCustomSparLine($element, values) {
    var options = $element.data();
    options.values = values;
    options.type = options.type || 'bar'; // default chart is bar
    options.disableHiddenCheck = true;

    $element.sparkline('html', options);

    if(options.resize) {
      $(window).resize(function(){
        $element.sparkline('html', options);
      });
    }
  }

}]);
