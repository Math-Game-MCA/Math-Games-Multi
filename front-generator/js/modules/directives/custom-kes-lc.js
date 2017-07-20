App.value('lending_club_test', {html:'<div class="contents"><div>No holdings available</div></div>'});

App.directive('customkeslc', function($compile, Restangular, $timeout, lending_club_test) {
  return {
    restrict: 'E',
    scope: {},
    link: function(scope, element, attrs) {
      Restangular.all('analytics/lending_club_test').getList().then(function(result){
    
        if(result.status != 406){
        	lending_club_test.html = '<div class="contents"><div id="chart_div">Please refresh your browser.</div></div>';
    	}
      });
     $timeout(function() {
        console.log(lending_club_test.html);
        var el = $compile(lending_club_test.html)(scope);
        element.append(el);
      }, 1000);
      function resizeBrowser(minWidth, minHeight){
    if(minWidth) $('#chart_div').width($('#analyticsLendingClub').width());
    if(minHeight) $('#chart_div').height($(window).height()-minHeight);
};

function dataLoad(browser){
  Restangular.all('analytics/lc').getList().then(function(data){
    var dataSet = data[0];
    browser.primaryTableName = "Loans";
    kshf.dt.Loans = [];

    dataSet.loans.forEach(function(v){
      var dt = {};
      dt.id = v.id;
      dt.orderId = v.orderId;
      dt.loanId = v.loanId;
      dt.noteId = v.noteId;
      dt.noteAmount = v.noteAmount;

      dt.accruedInterest = v.accruedInterest;
      dt.loanAmount = v.loanAmount;
      dt.principalPending = v.principalPending;
      dt.principalReceived = v.principalReceived;
      dt.paymentsReceived = v.paymentsReceived;
      dt.interestReceived = v.interestReceived;
      dt.interestRate = v.interestRate;


      dt.purpose = v.purpose;
      dt.loanLength = v.loanLength;
      dt.grade = v.grade;
      dt.creditTrend = v.creditTrend;
      dt.loanStatus = v.loanStatus;
      dt.applicationType = v.applicationType;
      dt.currentPaymentStatus = v.currentPaymentStatus;
      //dt.inqLast6m = (v.inqLast6m === "undefined")? 0 : v.inqLast6m ;
      kshf.dt.Loans.push(new kshf.Item(dt,'id'));
    });

    var dte = new Date(dataSet.loans[0].orderDate);
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
    $('#analytics-lc').html('Last Loaded Time: ' + sDte+', '+ d + ' ' + dte.getFullYear() + ' ' + h +':'+m+':'+s);
    
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
      { value: "creditTrend", name: "Credit Trend", panel: 'left' },
      { value: "loanLength", name: "Term", panel: 'left'},
      { value: "purpose", name: "Purpose" },
      { value: "grade", name: "Grade", panel: 'left' },
      { value: "applicationType", name: "Application Type", panel: 'left' },
      { value: "currentPaymentStatus", name: "currentPaymentStatus", panel: 'right'},
      { value: "purpose", name: "Purpose", panel: 'right' },
      { value: "loanAmount", name: "Loan Amount", panel: 'right' },
      { value: "loanStatus", name: "Loan Status", panel: 'right'}
    ],
    itemDisplay: {
      sortingOpts: "loanAmount",
      autoExpandMore: false,
      //displayType: "grid",
      maxVisibleItems_Default: 48,
      textSearch: "purpose",
      recordView: function(){
        
        str = "<div class='row'>" +
                "<div class='ficoRange col-xs-4>"+"</div>"+
                "<div class='ficoRange col-xs-4> Credit Trend: "+ this.creditTrend +"</div>"+
                "<div class='row'><div class='jobInfo col-xs-4'> "+this.purpose+"</div>" + 
                "<div class='ficoRange col-xs-1>"+"</div>"+
                "<div class='ficoRange col-xs-4s>Grade: "+this.grade+"</div>" +
                "<div class='ficoRange col-xs-1>"+"</div></div>"; //+
                //"<div class='moneyStuff col-xs-4>"+this.applicationType+"</div></div>";
        
        //str = "<div class='row'>NoteAmount: $"+this.noteAmount+" is purchased from the loan amount of $"+this.loanAmount+",Term is "+this.loanLength+ " months at " + this.interestRate + "%. The principal received on this note so far is $"+this.principalReceived+".</div>";
                //"<div class='row'><div class='jobInfo col-xs-4'>  "+this.empTitle+"</div>" + 
                //"<div class='ficoRange col-xs-1>"+"</div>"+
                //"<div class='ficoRange col-xs-4s>Fico High: "+this.ficoRangeHigh+"</div>" +
                //"<div class='ficoRange col-xs-1>"+"</div>"+
                //"<div class='moneyStuff col-xs-4>Income $"+this.annualInc+"</div></div>";


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
