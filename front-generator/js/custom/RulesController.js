App.controller('RulesController', [ '$scope', '$controller','Restangular', '$rootScope', '$state', '$stateParams', 'toaster', 'flash', function($scope, $controller, Restangular, $rootScope, $state, $stateParams, toaster, flash) {
	'use strict';
	
	$scope.addRules = addRules;
	$scope.listRules = listRules;
	$scope.updateStatus = updateStatus;
	$scope.remove = remove;
	$scope.setPriority = setPriority;
	$scope.update = update;
	$scope.duplicate = duplicate;

	$scope.vendorUserName;
	$scope.vendorPassword;
	$scope.vendorAPIKey;
	$scope.vendorAccountId;
	$scope.rules = [];
	$scope.account = {};
	$scope.name;

	var sidebarModel = $scope;
	$controller('SidebarController', {$scope: sidebarModel});

	function listRules() {
		Restangular.one('account/'+ $stateParams.accountId +'/rules').get().then(function(data){
			$scope.rules = Restangular.stripRestangular(data.rules);
			$scope.account = Restangular.stripRestangular(data.data);

			angular.forEach($scope.rules, function(k, v) {
				var default_text_a = [];
		        angular.forEach(k.filters, function(key, val) {
              if(key.type == 'text') {
                default_text_a.push(key.name+ ': ' + key.value);
              } else {
                default_text_a.push(key.name+ ': ' + key.desc_parsed_value);
              }
		      	});
		      	$scope.rules[v].default_text = default_text_a.join(', ');
	      	});
		}, function (err) {
		});
	}

  $scope.updateAccount = function(data) {
      $scope.authMsg = '';
      Restangular.one('account', $stateParams.accountId).customPUT(
        {
          vendorUserName: data.vendorUserName,
          vendorPassword: data.vendorPassword,
          vendorAccountId: data.vendorAccountId,
          vendorAPIKey: data.vendorAPIKey,
          vendor: $scope.account.vendor,
          accountName: $scope.account.accountName
        }
      ).then(function(data){
        if(data.msg != 'fail'){
           flash.success = 'Successfully updated the credentials for your ' + $scope.account.vendor + ' account';
         } else{
          flash.error = 'Sorry, those don\'t seem like the right credentials.';
         }
      }, function (err) {
        if(err.status == 417) {
          $scope.response = 'validationError';
          $scope.message = err.data.msg;
       	  flash.error = 'Sorry about that, there was a problem on our side :/';
        } else {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
          flash.error = 'Sorry, those don\'t seem like the right credentials.';
        }
      });
  };

  $scope.renameAccount = function(data) {
    $scope.authMsg = '';
    $scope.name = data.name;
    Restangular.one('account', $stateParams.accountId).customPUT(
      {
        accountName: $scope.name,
        action: 'rename'
      }
    ).then(function(data){
    	flash.success = "Successfully renamed account to " + $scope.name;
      	sidebarModel.loadSidebarMenu();
    }, function (err) {
      if(err.status == 417) {
        $scope.response = 'validationError';
        $scope.message = err.data.msg;
        flash.error = 'Sorry about that, there was a problem on our side :/';
      } else {
        $scope.response = 'error';
        $scope.message = 'Internal server error occured, Please check back.';
        flash.error = "Sorry, couldn't rename the account at the moment.";
      }
    });
  };

  $scope.deleteAccount = function(data) {
    $scope.authMsg = '';
    console.log($scope.account.accountName);
    console.log(data.accountName);
    if(data.accountName == $scope.account.accountName){
	    Restangular.one('account', $stateParams.accountId).remove().then(function(res) {
	      sidebarModel.loadSidebarMenu();
	      $state.go('app.peer-add-accounts');
	      flash.success = 'Successfully deleted the account.';
	    }, function(err) {
	      flash.error = "Sorry, couldn't delete this account at the moment.";
	    });
	}
	else{
		alert('Make sure to match the name exactly!');
	}
  };

	function addRules(approach) {
		if(approach == 'lc') {
			$state.go('app.peer-accounts-model', {'accountId' : $stateParams.accountId});
		} else if(approach = 'blank') {
			$state.go('app.peer-accounts-new', {'accountId' : $stateParams.accountId});
		}
	}

	function updateStatus(id, status) {
		Restangular.one('rule/status', id).customPUT({accountId: $stateParams.accountId, status: (status ? false : true)}).then(function(data){
			toaster.pop('success', '', 'Status has been updated successfully.');
			listRules();
		}, function (err) {
		  
		});
	}

	function remove(id) {
		if(typeof(id) != 'undefined') {
	      Restangular.one('rule', id).remove({accountId: $stateParams.accountId}).then(function(res) {
	      	toaster.pop('success', '', 'Rule has been deleted successfully.');
	        listRules();
	      }, function(err) {
	      });
	    }
	}

	function setPriority(idx, flow) {
		if(flow == 'up' && idx >= 0) {
		  var upPriority = [];
		  upPriority.push({id: $scope.rules[idx].id, priority: ($scope.rules[idx].priority - 1)});
		  upPriority.push({id: $scope.rules[idx - 1].id, priority: ($scope.rules[idx - 1].priority + 1)});
		  
		  Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
		  	toaster.pop('success', '', 'Priority has been updated successfully.');
		    listRules();
		  }, function (err) {
		  });
		} else if(flow == 'down') {
		  if(typeof $scope.rules[idx + 1] != 'undefined' && typeof $scope.rules[idx + 1].id != 'undefined') {
		    var upPriority = [];
		    upPriority.push({id: $scope.rules[idx].id, priority: ($scope.rules[idx].priority + 1)});
		  	upPriority.push({id: $scope.rules[idx + 1].id, priority: ($scope.rules[idx + 1].priority - 1)});
		    
		    Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
		    	toaster.pop('success', '', 'Priority has been updated successfully.');
		    	listRules();
		    }, function (err) {
		    });
		  }
		}
	}

	function update(id) {
		$state.go('app.peer-accounts-update', {'accountId' : $stateParams.accountId, 'ruleId': id});
	}

	function duplicate(id) {
		$state.go('app.peer-accounts-duplicate', {'accountId' : $stateParams.accountId, 'ruleId': id});
	}

	listRules();
}]);