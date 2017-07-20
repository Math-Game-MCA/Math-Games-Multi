App.directive('customCanvas', function($compile, Restangular) {
  return {
    restrict: 'E',
    scope: {
      customId: '@',
      heading: '@',
      widthClass: '@',
      customChartContainerId: '@',
      chartType: '@',
      chartDataCond: '@'
    },
    link: function(scope, element, attrs) {
      var html = '<div class="'+attrs.widthClass+'">';
          html += '<div id="'+attrs.customId+'" class="panel">';
            html += '<div class="panel-heading">';
              html += '<div class="panel-title">Portfolio Evaluation</div>';
            html += '</div>';
            html += '<div collapse="panelChart3" class="panel-wrapper">';
              html += '<div class="panel-body">';
                html += '<div class="indicator show">';
                  html += '<span class="spinner"></span>';
                  html += '<div id="'+attrs.customChartContainerId+'" style="height: 300px; width: 100%;">';
                html += '</div>';
              html += '</div>';
            html += '</div>';
          html += '</div>';
        html += '</div>';
      var el = $compile(html)(scope);
      element.append(el);
      Restangular.all('charts').getList({name: attrs.chartType, dataCond: attrs.chartDataCond}).then(function(data){
        var chartData = [];
        angular.forEach(data, function(value, key) {
          chartData.push({x: new Date(value.ms_asOfDate), y: value.ms_totalNAV});
        });
        var chart = new CanvasJS.Chart(attrs.customChartContainerId, {
          axisX:{
              title: "Date",
              gridThickness: 2,
            valueFormatString: "MMM DD, YYYY"
          },
          axisY: {
              title: "Investment"
          },
          data: [
          {        
              type: "stackedBar",
              dataPoints: chartData
          }
          ]
      });
        chart.render();
      }, function (err) {
        
      });
    },
    replace: true
  };
});
