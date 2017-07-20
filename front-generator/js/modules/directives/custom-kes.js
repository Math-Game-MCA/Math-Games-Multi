App.value('prosper_test', {html:'<div class="contents"><div>No holdings available</div></div>'});

App.directive('customKes', function($compile, Restangular, $timeout, prosper_test) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element, attrs) {
       Restangular.all('analytics/prosper_test').getList().then(function(result){
    
        if(result.status != 406){
        	prosper_test.html = '<div class="contents"><div id="chart_div">Please refresh your browser.</div></div>';
    	}
      });
     $timeout(function() {
      var el = $compile(prosper_test.html)(scope);
      element.append(el);
      }, 1000);
      function resizeBrowser(minWidth, minHeight){
    if(minWidth) $('#chart_div').width($('#analyticsProsper').width());
    if(minHeight) $('#chart_div').height($(window).height()-minHeight);
    };


function dataLoad(browser){
  Restangular.all('analytics/prosper').getList().then(function(data){
    var dataSet = data[0];

    console.log(dataSet.loans[0].ms_tradeTimestamp);
    var dte = new Date(dataSet.loans[0].ms_tradeTimestamp);
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var sDte = monthNames[dte.getMonth()];
    var d = dte.getDate();
    if(d < 10) {
      d = '0'+d;
    }
    var h = dte.getHours();
    if(h < 10) {
      h = '0'+h;
    }
    var m = dte.getMinutes();
    if(m < 10) {
      m = '0'+m;
    }
    var s = dte.getSeconds();
    
    if(s < 10) {
      s = '0'+s;
    }
    $('#analytics-prosper').html('Last Loaded Time: ' + sDte+', '+ d + ' ' + dte.getFullYear() + ' ' + h +':'+m+':'+s);
    browser.primaryTableName = "Loans";
    kshf.dt.Loans = [];

    dataSet.loans.forEach(function(v){
      var dt = {};
      dt.id = v.id;
      dt.borrower_state = v.borrower_state;
      dt.prosper_rating = v.prosper_rating;
      dt.investment_type_description = v.investment_type_description;
      dt.income_verifiable = v.income_verifiable;
      dt.prior_prosper_loans = v.prior_prosper_loans;
      dt.current_delinquencies = v.current_delinquencies;
      dt.listing_title = v.listing_title;
      dt.occupation = v.occupation;
      dt.listing_number = v.listing_number;
      dt.listing_amount = v.listing_amount;
      dt.amount_delinquent = v.amount_delinquent;
      dt.fico_score = v.fico_score;
      dt.amount_funded = v.amount_funded;
      dt.listing_term = v.listing_term;
      dt.delinquencies_over30_days = v.delinquencies_over30_days;
      dt.borrower_apr = v.borrower_apr;
      dt.income_range_description = v.income_range_description;
      dt.employment_status_description = v.employment_status_description;
      kshf.dt.Loans.push(new kshf.Item(dt,'id'));
    });

    browser.loadCharts();
    
  }, function (err) {
  });
};
$timeout(function() {
$(document).ready( function(){
  resizeBrowser(180,30);
  $(window).resize(function() {
    resizeBrowser(180,30);
    browser.updateLayout();
  });

  browser = new kshf.Browser({
    domID: "#chart_div",
    categoryTextWidth: 80,
    source: {
      //url: "http://moritz.stefaner.eu/projects/elastic-lists/MACE%20ProjectSearch/index.html",
      callback: dataLoad
    },
    summaries: [
      { value: "prosper_rating", name: "Prosper Rating", panel: 'left' },
      { value: "fico_score", name: "Fico Score", panel: 'left'  },
      { value: "borrower_state", name: "Borrower State", panel: 'left'  },
      { value: "investment_type_description", name: "Investment Type Description", panel: 'left'},
      { value: "occupation", name: "Occupation", panel: 'right' },
      { value: "listing_title", name: "Listing Title", panel: 'right' },
      { value: "listing_amount", name: "Listing Amount", panel: 'right'},
      { value: "delinquencies_over30_days", name: "Delinquencies Over 30 Days", panel: 'right'}
    ],
    itemDisplay: {
      sortingOpts: "listing_amount",
      autoExpandMore: false,
      //displayType: "grid",
      maxVisibleItems_Default: 48,
      textSearch: "listing_title",
      recordView: function(){
        str = "<div class='row'>" +
                "<div class='ficoRange col-xs-4>"+"</div>"+
                "<div class='ficoRange col-xs-4> Income Range: "+ this.income_range_description +"</div>"+
                "<div class='row'><div class='jobInfo col-xs-4'> "+this.occupation+"</div>" + 
                "<div class='ficoRange col-xs-1>"+"</div>"+
                "<div class='ficoRange col-xs-4s>Employment Type: "+this.employment_status_description+"</div>" +
                "<div class='ficoRange col-xs-1>"+"</div></div>"; //+
                //"<div class='moneyStuff col-xs-4>"+this.investment_type_description+"</div></div>";


        //var str = this.listing_term + this.borrower_rate + this.listing_amount + this.fico_score;
       /* str = "<div class='row'><div class='loanInfo col-xs-4'>Term: "+this.listing_term + " months at " + parseFloat(Math.round(this.borrower_rate * 100) / 100).toFixed(2) + "%</div>" +
                "<div class='ficoRange col-xs-4>"+"</div>"+
                "<div class='ficoRange col-xs-6>Fico Low:\t"+this.fico_score.split('-')[0]+"</div></div>"+
                "<div class='row'><div class='loanInfo col-xs-4'>$"+this.listing_amount+"</div>" + 
                "<div class='ficoRange col-xs-4>"+"</div>"+
                "<div class='ficoRange col-xs-4>Fico High:\t"+this.fico_score.split('-')[1]+"</div>";*/


        if(this.source_url){
          str+="<span class='item_source'>";
          str+="<a href='"+this.source_url+"' target='_blank' class='fa fa-info-circle'></a>";
          str+="</span>";
        }
        return str;        

      }//,
      //---------------------
      //visibleCb: function(d){
       // d3.select(d.DOM.record).select("img").attr("src",
            //"https://www.googleapis.com/freebase/v1/image/"+d.data.img_url);
      //}
    }
  });
});
}, 1000);
    },
    replace: true
  };
});
