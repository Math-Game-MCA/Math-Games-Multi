myApp.controller('TransactionsCtrl', TransactionsCtrl);

function TransactionsCtrl($scope, Restangular, $window, $filter, ngTableParams, $resource, $timeout, ngTableDataService, API_URL) {
  'use strict';
  // required for inner references     
  var vm = this;
  $scope.data = [];
  $scope.showTransactionsEmpty = false;
  $scope.showTransactions = false;
  $scope.sIndex = null;
  Summary_initialization();
  function Summary_initialization() {
    $scope.authMsg = '';
    Restangular.all('transactions').getList().then(function(data){
      if(typeof data[0] != 'undefined'&& typeof data[0].id != 'undefined') {
        if(data[0].length) {
          $scope.showTransactionsEmpty = false;
          $scope.showTransactions = true;
        } else {
          $scope.showTransactionsEmpty = true;
          $scope.showTransactions = false;
        }
      } else {
        $scope.showTransactions = false;
        $scope.showTransactionsEmpty = true;
      }
      $scope.data = data;
      
    }, function (err) {
      $scope.response = 'error';
      $scope.message = 'Internal server error occured, Please check back.';
        
    });
  }

  $scope.loadCollapse = function (index) {
    
    if($scope.sIndex == index) {
      $scope.sIndex = null;
    } else {
      $scope.sIndex = index;
    }
    
  }
}

myApp.controller('NGTranTableCtrl', NGTranTableCtrl);
function NGTranTableCtrl($scope, $http, $window, $filter, ngTableParams, $resource, $timeout, ngTableDataServiceTran, API_URL, Restangular) {
  'use strict';
  // required for inner references
  var vm = this;
  $scope.showTransactions = false;
  Summary_initialization();
  $scope.sIndex = null;
  $scope.loadCollapse = function (index) {
    
    if($scope.sIndex == index) {
      $scope.sIndex = null;
    } else {
      $scope.sIndex = index;
    }
    
  }

  function Summary_initialization() {
  	  $scope.authMsg = '';
      
       
       Restangular.all('transactions').getList().then(function(transactions){
            
            if (transactions) {
                /****TO_DO::: sk - 11/28::: Update The Rule Name and Account Name dynamically ***/
                for(var i=0; i<transactions.length; i++ ){
                    if (transactions[i].ms_accountId == 1) {
                        transactions[i].ms_accountId = "Lending Club"
                    }
                    if (transactions[i].ms_accountId == 2) {
                        transactions[i].ms_accountId = "Prosper"
                    }
                    if (transactions[i].ms_accountId == 1) {
                        transactions[i].ms_accountId = "Funding Circle"
                    }
                }
                if(typeof transactions[0] != 'undefined'&& typeof transactions[0].id != 'undefined') {
                  $scope.showTransactions = true;
                  $scope.showTransactionsEmpty = false;
                } else {
                  $scope.showTransactions = false;
                  $scope.showTransactionsEmpty = true;
                }
                $scope.data = transactions;
                
                
               
              var data = $scope.data;
              vm.data = $scope.data;    

              // EXPORT CSV
              // -----------------------------------  

              
              vm.tableParams4 = new ngTableParams({
                  page: 1,            // show first page
                  count: 10           // count per page
              }, {
                  total: data.length, // length of data4
                  getData: function($defer, params) {
                      $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });


              // SORTING
              // ----------------------------------- 
              vm.tableParams = new ngTableParams({
                  page: 1,            // show first page
                  count: 10,          // count per page
                  sorting: {
                      ms_tradeTimestamp: 'desc'     // initial sorting
                  },
                  filter: {
                      ms_tradeTimestamp: '',
                      ms_status: ''
                      // name: 'M'       // initial filter
                  }
              }, {
                  total: data.length, // length of data
                  getData: function($defer, params) {
                      // use build-in angular filter
                      var orderedData = params.filter() ?
                             $filter('filter')(data, params.filter()) :
                             data;
                      orderedData = params.sorting() ?
                              $filter('orderBy')(orderedData, params.orderBy()) :
                              orderedData;
                      vm.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                      params.total(orderedData.length); // set total for recalc pagination
                      $defer.resolve(vm.users);
                  }
              });

              
                
                
                
            }
        }).catch(handleError); 
        
  }
  function handleError(err) {
      alert('warning', 'Something went wrong :(', err.message);
      $scope.authMsg = 'Internal Server Problem.';
  }

  
  // AJAX
  
  var Api = $resource('server/table-data.json');

  vm.tableParams5 = new ngTableParams({
      page: 1,            // show first page
      count: 10           // count per page
  }, {
      total: 0,           // length of data
      counts: [],         // hide page counts control
      getData: function($defer, params) {
          
          // Service using cache to avoid mutiple requests
          ngTableDataServiceTran.getData( $defer, params, Api);
          
          /* direct ajax request to api (perform result pagination on the server)
          Api.get(params.url(), function(data) {
              $timeout(function() {
                  // update table params
                  params.total(data.total);
                  // set new data
                  $defer.resolve(data.result);
              }, 500);
          });
          */
      }
  });
  
  $scope.loadToolTip = function(index) {
    return $scope.data[index].ms_account_id.accountName + '<br /> <br />' + $scope.data[index].ms_requestedAmount;
  }
}

// NOTE: We add the service definition here for quick reference
myApp.service('ngTableDataServiceTran', function() {

  var TableData = {
    cache: null,
    getData: function($defer, params, api){
      // if no cache, request data and filter
      if ( ! TableData.cache ) {
        if ( api ) {
          api.get(function(data){
            TableData.cache = data;
            filterdata($defer, params);
          });
        }
      }
      else {
        filterdata($defer, params);
      }
      
      function filterdata($defer, params) {
        var from = (params.page() - 1) * params.count();
        var to = params.page() * params.count();
        var filteredData = TableData.cache.result.slice(from, to);

        params.total(TableData.cache.total);
        $defer.resolve(filteredData);
      }

    }
  };
  
  return TableData;

});
