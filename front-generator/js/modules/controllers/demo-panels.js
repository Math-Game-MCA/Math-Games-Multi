/**=========================================================
 * Module: demo-panels.js
 * Provides a simple demo for panel actions
 =========================================================*/

App.controller('PanelsCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

  // PANEL COLLAPSE EVENTS
  // ----------------------------------- 

  // We can use panel id name for the boolean flag to [un]collapse the panel
  $scope.$watch('panelDemo1',function(newVal){
      
      

  });


  // PANEL DISMISS EVENTS
  // ----------------------------------- 

  // Before remove panel
  $scope.$on('panel-remove', function(event, id, deferred){
    
    
    
    // Here is obligatory to call the resolve() if we pretend to remove the panel finally
    // Not calling resolve() will NOT remove the panel
    // It's up to your app to decide if panel should be removed or not
    deferred.resolve();
  
  });

  // Panel removed ( only if above was resolved() )
  $scope.$on('panel-removed', function(event, id){

    

  });


  // PANEL REFRESH EVENTS
  // ----------------------------------- 

  $scope.$on('panel-refresh', function(event, id) {
    var secs = 3;
    
    

    $timeout(function(){
      // directive listen for to remove the spinner 
      // after we end up to perform own operations
      $scope.$broadcast('removeSpinner', id);
      
      

    }, 3000);

  });

  // PANELS VIA NG-REPEAT
  // ----------------------------------- 

  $scope.panels = [
    {
      id: 'panelRepeat1',
      title: 'Panel Title 1',
      body: 'Nulla eget lorem leo, sit amet elementum lorem. '
    },
    {
      id: 'panelRepeat2',
      title: 'Panel Title 2',
      body: 'Nulla eget lorem leo, sit amet elementum lorem. '
    },
    {
      id: 'panelRepeat3',
      title: 'Panel Title 3',
      body: 'Nulla eget lorem leo, sit amet elementum lorem. '
    }
  ];

}]);