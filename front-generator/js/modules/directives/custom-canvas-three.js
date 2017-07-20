App.directive('customCanvasThree', function($compile, Restangular) {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      var html = '<div class="row">';
            html += '<div class="col-lg-4">';
              html += '<div id="panelTotalPrinciple" class="panel">';
                html += '<div class="panel-heading">';
                  html += '<div class="panel-title">Total Priciple</div>';
                html += '</div>';
                html += '<div collapse="panelChart3" class="panel-wrapper">';
                  html += '<div class="panel-body">';
                    html += '<div class="indicator show">';
                      html += '<span class="spinner"></span>';
                      html += '<div id="chartTotalPrinciple" style="height: 300px; width: 100%;">';
                      html += '</div>';
                    html += '</div>';
                  html += '</div>';
                html += '</div>';
              html += '</div>';
            html += '</div>';
            
            html += '<div class="col-lg-4">';
              html += '<div id="panelCash" class="panel">';
                html += '<div class="panel-heading">';
                  html += '<div class="panel-title">Cash</div>';
                html += '</div>';
                html += '<div collapse="panelChart3" class="panel-wrapper">';
                  html += '<div class="panel-body">';
                    html += '<div class="indicator show">';
                      html += '<span class="spinner"></span>';
                      html += '<div id="chartCash" style="height: 300px; width: 100%;">';
                      html += '</div>';
                    html += '</div>';
                  html += '</div>';
                html += '</div>';
              html += '</div>';
            html += '</div>';
            html += '<div class="col-lg-4">';
              html += '<div id="panelForwordLookingExpectedReturn" class="panel">';
                html += '<div class="panel-heading">';
                  html += '<div class="panel-title">Forward Looking Expected Return</div>';
                html += '</div>';
                html += '<div collapse="panelChart3" class="panel-wrapper">';
                  html += '<div class="panel-body">';
                    html += '<div class="indicator show">';
                      html += '<span class="spinner"></span>';
                      html += '<div id="chartForwordLookingExpectedReturn" style="height: 300px; width: 100%;">';
                      html += '</div>';
                    html += '</div>';
                  html += '</div>';
                html += '</div>';
              html += '</div>';
            html += '</div>';
          html += '</div>';
      
      var el = $compile(html)(scope);
      element.append(el);
      Restangular.all('charts').getList({dataCond: 'dashboard-panel'}).then(function(data){
        var principle = new CanvasJS.Chart('chartTotalPrinciple', data[0].charts.t);
        principle.render();
        var cash = new CanvasJS.Chart('chartCash', data[0].charts.c);
        cash.render();
        var ret = new CanvasJS.Chart('chartForwordLookingExpectedReturn', data[0].charts.r);
        ret.render();
      }, function (err) {
        
      });
    },
    replace: true
  };
});
