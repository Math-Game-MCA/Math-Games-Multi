App.controller('HelpController', [ '$scope', 'Restangular', '$modalInstance', '$sce', 'helpType', function($scope, Restangular, $modalInstance, $sce, helpType) {
	'use strict';
  //I am
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  
  if(helpType == 'lc') {
    $scope.src = 'https://www.youtube.com/embed/Bs2z7WMxb6o?autoplay=1';
  } else if(helpType == 'prosper') {
    $scope.src = 'https://www.youtube.com/embed/Y8mJSHTFVm0?autoplay=1';
  }
}]);