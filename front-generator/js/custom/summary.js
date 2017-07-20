myApp.controller('SummaryCtrl', SummaryCtrl);

function SummaryCtrl($scope, $http, $window, $filter, ngTableParams, $resource, $timeout, ngTableDataService, API_URL,Restangular, $rootScope, $state) {
  'use strict';


    
  // required for inner references
  var vm = this;
  $scope.data = [];
  $scope.totalPrinciple = "";
  $scope.cash = "";
  $scope.totalReturn = "";
  $scope.isTotalPrinciple = true;
  $scope.portfolioReturn = 0;
  $scope.portfolioCash = 0;
  $scope.portfolioCapital = 0;
  $scope.portfolioLoans = 0;
  $scope.portfolioRecords = 0;
  $scope.sIndex = null;
  //$scope.pReturn = 0;
  Summary_initialization();

  $scope.isCollapsed = false;
  
  function Summary_initialization() {
    
    $scope.data = [];
    $scope.totalPrinciple = "";
    $scope.cash = "";
    $scope.totalReturn = "";
    $scope.isTotalPrinciple = true;
    $scope.portfolioReturn = 0;
    $scope.portfolioCash = 0;
    $scope.portfolioCapital = 0;
    $scope.portfolioLoans = 0;
    $scope.portfolioRecords = 0;
    $scope.sIndex = null;

    $scope.showGridEmpty = false;
    $scope.authMsg = '';
    Restangular.all('summary').getList().then(function(data){
      if (data) {
        //console.log(data);
        if(typeof data[0] != 'undefined'&& typeof data[0].id != 'undefined') {
          $scope.showGridEmpty = false;
          $rootScope.showGrid = true;
          
        } else {
          $rootScope.showGrid = false;
          $scope.showGridEmpty = true;
        }
        $scope.data = data;
        $scope.portfolioRecords = data.length;

        Restangular.all('check_accounts').getList().then(function(data){
            // Do nothing on success
        }).then(function(data){
          //Do Nothing
        }, function (err) {
      if(err.status == 417) {
        $scope.lc.errors = err.data.message;
      } else if(err.status == 466) {
        alert('It seems we can\'t connect to your ' + err.data.error +' account.\nTo update your credentials, go to ' + err.data.error + ' rules page.');
      } else {
        // Do Nothing
      }
    });   
        
        angular.forEach(data, function(value, key) {
          $scope.portfolioLoans = value.ms_totalNotes + $scope.portfolioLoans;
          $scope.portfolioCapital = value.ms_totalNAV + $scope.portfolioCapital;
          $scope.portfolioCash = value.ms_availableCash + $scope.portfolioCash;
          $scope.portfolioReturn = value.ms_annualizedAPR + $scope.portfolioReturn;
          
          
        });

        //Returns
        $scope.pReturn = ($scope.portfolioReturn / $scope.portfolioRecords);
        $scope.pCashAvailable = $scope.portfolioCash;
        $scope.pCapital = $scope.portfolioCapital;
        $scope.pLoans = $scope.portfolioLoans;
      }
    }).catch(handleError);
  }
  
  function handleError(err) {
/*      alert('warning', 'Something went wrong :(', err.message);
      $scope.authMsg = 'Internal Server Problem.';*/
  }

  $scope.addPoints = function () {
      var seriesArray = $scope.chartConfig.series
      var rndIdx = Math.floor(Math.random() * seriesArray.length);
      seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
  };

  $scope.addSeries = function () {
    var rnd = []
    for (var i = 0; i < 10; i++) {
        rnd.push(Math.floor(Math.random() * 20) + 1)
    }
    $scope.chartConfig.series.push({
        data: rnd
    })
  }

  $scope.removeRandomSeries = function () {
    var seriesArray = $scope.chartConfig.series
    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    seriesArray.splice(rndIdx, 1)
  }

  $scope.swapChartType = function () {
    if (this.chartConfig.options.chart.type === 'line') {
        this.chartConfig.options.chart.type = 'bar'
    } else {
        this.chartConfig.options.chart.type = 'line'
        this.chartConfig.options.chart.zoomType = 'x'
    }
  }

  $scope.toggleLoading = function () {
    this.chartConfig.loading = !this.chartConfig.loading
  }

  $scope.chartConfig = {
    options: {
      chart: {
          type: 'bar'
      }
    },
    series: [{
      data: [10, 15, 12, 8, 7]
    }],
    title: {
      text: 'Hello'
    },
    loading: false
  };

  $scope.loadCollapse = function (index) {
    if($scope.sIndex == index) {
      $scope.sIndex = null;
    } else {
      $scope.sIndex = index;
    }
  }
  
  $scope.linkAccount = function() {
    $state.go('app.peer-add-accounts');
  }
  
  Restangular.one('summary-analytics').get().then(function(data){
      //$('#analysisFrame').
      $("#analysisFrame").attr('src',"data:text/html;charset=utf-8," + escape(data))
    }, function (err) {
      
    });
    
  $scope.refresh = function() {
    console.log('here');
    alert("Please click okay and wait until the page refreshes");
    Restangular.one('exec').get().then(function(data){
      Summary_initialization();
      alert("Refreshing finished");
    }, function (err) {
    });
  }
}
