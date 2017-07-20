App.controller('LcRuleController', [ '$scope', 'Restangular', '$rootScope', '$state', '$stateParams', 'flash', function($scope, Restangular, $rootScope, $state, $stateParams, flash) {
	'use strict';

	$scope.listRules = rules;
	$scope.addFilters = addFilters;
	$scope.removeFilter = removeFilter;
	$scope.loadSlider = loadSlider;
	$scope.loadSliderData = loadSliderData;
	$scope.setSliderData = setSliderData;
	$scope.loadValues = loadValues;
	$scope.setSelectionValues = setSelectionValues;
	$scope.cancel = cancel;
	$scope.save = save;
	$scope.rules = {};
	function rules() {		
		Restangular.one('lc-rules', $stateParams.accountId).get().then(function(data){
			var _tmp = Restangular.stripRestangular(data);
			_tmp.data.ruleName = 'LendingCalc Model';
          angular.forEach(_tmp.default_filter, function(k, v) {
            //console.log(_tmp);
            angular.forEach(_tmp.data.buttons, function(key, val) {
              //console.log(key.name);
              if(k.name == key.name) {
                _tmp.data.buttons[val].hide = true;
              }
            });
          });
	        $scope.rules = _tmp.data;
	        $scope.rules.filters = _tmp.default_filter;          
	      }, function (err) {
      	});
	}

	function addFilters(idx) {
	    $scope.rules.buttons[idx]['button_i'] = idx;
	    $scope.rules.filters.push($scope.rules.buttons[idx]);
	    $scope.rules.buttons[idx]['hide'] = true;
	}

	function removeFilter(idx) {
		$scope.rules.buttons[$scope.rules.filters[idx]['button_i']]['hide'] = false;
	    $scope.rules.filters.splice(idx, 1);
	}

	function loadSliderData(index) {
	return 'slider_' + index;
	}

	function loadSlider(filter, type) {
		if((type == 'slider' && filter.type == 'slider') || (type == 'slider' && filter.type == 'range')) {
		  return true;
		} else if(type == 'selection' && filter.type == 'selection') {
		  return true;
		}  else if(type == 'text' && filter.type == 'text') {
      return true;
    } else {
		  return false;
		}
	}

	function setSliderData(id, val, txt) {
		$scope.rules['filters'][id].value = val;
		$scope.rules.filters[id]['desc_parsed_value'] = txt;
	}

	function loadValues(filter) {
	    if(filter.type == 'selection') {
	      if(filter.value.length > 5) {
	        var i = 0;
	        var states = [];
	        angular.forEach(filter.value, function(k, v) {
	          if(i < 5) {
	            states.push(k);
	          }
	          
	          i = i + 1;
	        });
	        return states.join(', ') + ' and ' + (filter.value.length - states.length) + ' other states';
	      } else {
	        return filter.value;
	      }
	    } else if(angular.isArray(filter.value)) {
	      return 'From: '+ filter.value[0] + ' To: ' + filter.value[1];
	    } else {
	      return filter.value + ' and above';
	    }
  	}

  	function setSelectionValues(pIdx, idx, key) {
	    var idxS = $scope.rules.filters[pIdx]['value'].indexOf(key);
	    if(idxS < 0) {
	      $scope.rules.filters[pIdx]['value'].push(key);
	    } else {
	      $scope.rules.filters[pIdx]['value'].splice(idxS, 1);
	    }
	    
	    var len = $scope.rules.filters[pIdx]['value'].length;
	    var htm = '';
	    if(len < 8) {
	    	htm = $scope.rules.filters[pIdx]['value'].join(', ');
	    } else {
	    	var j = [];
	    	for(var i = 0; i < 8; i++) {
	    		j.push($scope.rules.filters[pIdx]['value'][i]);
	    	}

	    	htm = j.join(', ') + ' and ' + (len - 7) + ' other states.';
	    }
	    $scope.rules.filters[pIdx]['desc_parsed_value'] = htm;
	    $('#lbl_'+pIdx).html(htm);
  	}

  	function save() {
  		var rules = {ruleName: $scope.rules.ruleName, filters: $scope.rules.filters};
  		console.log($scope.rules.rulesType);
		Restangular.all('rule').post({accountId: $stateParams.accountId, ruleName: $scope.rules.ruleName, filters: $scope.rules.filters, execStartTime: $scope.rules.execStartTime, execEndTime: $scope.rules.execEndTime, minTradeAmount: $scope.rules.minTradeAmount, maxTradeAmount: $scope.rules.maxTradeAmount}).then(function(data){
			flash.success = 'New rule created successfully.';
			$state.go('app.peer-accounts', {'accountId' : $stateParams.accountId});
			
		}, function (err) {
		});
  	}

  	function cancel() {
  		$state.go('app.peer-accounts', {'accountId' : $stateParams.accountId});
  	}

  	function activate() {
  	  //var dtSt = new Date();
      $scope.execStartTime = new Date(99,5,24,0,0,30,0);
      $scope.execEndTime = new Date(99,5,24,23,59,30,0);

      $scope.hstep = 1;
      $scope.mstep = 15;

      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };

      $scope.ismeridian = false;
      $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
      };

      /*$scope.update = function() {
      	
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.execStartTime = d;
      };*/

      $scope.execStartTimeChanged = function () {
      	var dte = $scope.execStartTime;
      	$scope.rules.execStartTime = dte.getHours() + ':' + dte.getMinutes();
      };

      $scope.execEndTimeChanged = function () {
        var dte = $scope.execEndTime;
      	$scope.rules.execEndTime = dte.getHours() + ':' + dte.getMinutes();
      };

      $scope.clear = function() {
        $scope.execStartTime = null;
        $scope.execEndTime = null;
      };
    }
    activate();

	rules();
}]);