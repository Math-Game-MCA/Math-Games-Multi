myApp.controller('AlphaModalController', ['$scope', '$modalInstance', function($scope, $modalInstance) {
  'use strict';
  $scope.close = function() {
    $modalInstance.dismiss('cancel');
  }
}]);

myApp.controller('RulesModalController', [ '$scope','$controller','$http', '$timeout', '$window', '$auth', '$state', '$stateParams', '$resource', 'Restangular', '$rootScope', 'flash', '$modalInstance', 'accountId', function($scope, $controller,$http, $timeout, $window, $auth, $state, $stateParams, $resource, Restangular, $rootScope, flash, $modalInstance, accountId) {
  'use strict';
  function init() {
    $scope.authMsg = '';
    if($stateParams.accountId) {
      Restangular.one('account/rules', $stateParams.accountId).get().then(function(data){
        $scope.accountRules = [];
        $scope.vendorUserName = data.data.userName;
        $scope.vendorPassword = data.data.encryptedPassword;
        $scope.vendorAccountId = data.data.vendorAccountId;
        $scope.vendorAPIKey = data.data.apiKey;
        $scope.msAccountName = data.data.accountName;
        $scope.accountStatus = data.data.status;
        $scope._account_id = data.data.id;
        if(data.account_rules.length > 0) {
          $scope.accountRules = data.account_rules;
        } else {
          $scope.accountRules.push(data.rules);
        }
        $scope.singleRule = data.rules;
      }, function (err) {
        $scope.response = 'error';
        $scope.message = 'Something went wrong';
      });
    }
  }
  
   $scope.demoVals = {
        sliderExample3:     14,
        sliderExample4:     14,
        sliderExample5:     50,
        sliderExample8:     0.34,
        sliderExample9:     [-0.52, 0.54],
        sliderExample10:     -0.37
      };
  $scope.any_level = 10;
  $scope.alertchange = function(data){

}

  $scope.authMsg = '';
  $scope.vendorUserName = '';
  $scope.vendorPassword = '';
  $scope.vendorAccountId = '';
  $scope.vendorAPIKey = '';
  $scope.msAccountName = '';
  $scope.accountStatus = 'active';    
  $scope._account_id = '';
  $scope.accountRules = [];
  $scope.singleRule = {};
  $scope.p = {errors: []};
  $scope.lc = {errors: []};
  $scope.sliders = {sliderValue: 20};
  $scope.testOptions = {min: 5, max: 10, step: 1, value: 12};
  
  $scope.isCustom = false;
  $scope.isConservative = false;
  $scope.isBalanced = false;
  $scope.isAgressive = false;
  
  var sidebarModel = $scope;
  $controller('SidebarController', {$scope: sidebarModel});
  


  function authSuccessful(res) {
      $scope.vendorUserName = res.account.userName;
    $scope.vendorPassword = res.account.encryptedPassword;
    $scope.vendorAccountId = res.account.vendorAccountId;
    $scope.vendorAPIKey = res.account.apiKey;
      $scope.accountStatus = res.account.status;
    $scope.msAccountName = res.account.accountName;
      $state.go('app.peer-accounts-root', {'accountId' : res.account.msAccountId});

  }
      
  function handleError(err) {
      alert('warning', 'Something went wrong', err.message);
      $scope.authMsg = 'Something went wrong.';
  }
    

  $scope.addPlatformLC = function(data) {
    $scope.authMsg = '';
    Restangular.all('account').post(
    {
      accountName: data.lc_account_id,
      accountType: 'Lending Club',
      vendorUserName: data.lc_username,
      vendorPassword: data.lc_password,
      vendorAPIKey: data.lc_api_key,
      status: 'active',
      vendorAccountId: data.lc_account_id
    }
    ).then(function(data){
      console.log(data);
      $scope.vendorUserName = data.account.userName;
      $scope.vendorPassword = data.account.encryptedPassword;
      $scope.vendorAccountId = data.account.vendorAccountId;
      $scope.vendorAPIKey = data.account.apiKey;
      $scope.accountStatus = data.account.status;
      $scope.msAccountName = 'Lending Club-' + data.account.vendorAccountId;
      sidebarModel.loadSidebarMenu();
      flash.success = data.account.accountName + ' for Lending Club added successfully.';
      $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
    }, function (err) {
      if(err.status == 417) {
        $scope.lc.errors = err.data.message;
      } else if(err.status == 401) {
        flash.error = 'Authentication credentials failed.';
      } else {
        flash.error = 'Something went wrong.';
      }
    });
  };
    
  $scope.addPlatformFC = function() {
    $scope.authMsg = '';
    Restangular.all('account').post(
      {
      accountName: data.fc_account_id,
      accountType: 'Funding Circle',
      vendorUserName: data.fc_username,
      vendorPassword: data.fc_password,
      vendorAPIKey: data.fc_api_key,
      status: 'active',
      vendorAccountId: data.fc_account_id
      }
    ).then(function(data){
      $scope.vendorUserName = data.account.userName;
      $scope.vendorPassword = data.account.encryptedPassword;
      $scope.vendorAccountId = data.account.vendorAccountId;
      $scope.vendorAPIKey = data.account.apiKey;
      $scope.accountStatus = data.account.status;
      $scope.msAccountName = data.account.accountName;
      sidebarModel.loadSidebarMenu();
      flash.success = data.account.accountName + ' for Funding Circle added successfully.';
      
      $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
    }, function (err) {
      if(err.status == 417) {
        $scope.lc.errors = err.data.message;
      } else if(err.status == 401) {
        flash.error = 'Authentication credentials failed.';
      } else {
        flash.error = 'Internal server error occured, Please check back.';
      }
    });
  };

  $scope.addPlatformProsper = function(data) {
    $scope.authMsg = '';
    Restangular.all('account').post(
    {
      accountName: data.accountNameProsper,
      accountType: 'Prosper',
      vendorUserName: data.p_username,
      vendorPassword: data.p_password,
      status: 'active',
      vendorAccountId: data.p_clientid,
      vendorAPIKey: data.p_clientsecret
    }
    ).then(function(data){
      $scope.vendorUserName = data.account.userName;
      $scope.vendorPassword = data.account.encryptedPassword;
      $scope.vendorAccountId = data.account.vendorAccountId;
      $scope.vendorAPIKey = data.account.apiKey;
      $scope.accountStatus = data.account.status;
      $scope.msAccountName = data.account.accountName;
      sidebarModel.loadSidebarMenu();
      flash.success = data.account.accountName + ' for Prosper added successfully.';
      $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
    }, function (err) {
      if(err.status == 417) {
        $scope.lc.errors = err.data.message;
      } else if(err.status == 401) {
        flash.error = 'Authentication credentials failed.';
      } else {
        flash.error = 'Internal server error occured, Please check back.';
      }
    });
  };
    
  $scope.addfilter = function(pIdx, idx) {
    $scope.accountRules[pIdx].buttons[idx]['button_i'] = idx;
    $scope.accountRules[pIdx].filters.push($scope.accountRules[pIdx].buttons[idx]);
    $scope.accountRules[pIdx].buttons[idx]['hide'] = true;
  };
  

  $scope.removefilter = function(pIdx, idx) {
    $scope.accountRules[pIdx].buttons[$scope.accountRules[pIdx].filters[idx]['button_i']]['hide'] = false;
    //$scope.accountRules[pIdx].buttons.push($scope.accountRules[pIdx].filters[idx]);
    $scope.accountRules[pIdx].filters.splice(idx, 1);
  };
  

  $scope.deleteRule = function(idx) {
    if(typeof($scope.accountRules[idx].id) != 'undefined') {
      Restangular.one('rule', $scope.accountRules[idx].id).remove().then(function(res) {
        init();
      }, function(err) {
      });
    }
  };

  $scope.addRule = function() {
    $scope.accountRules.push($scope.singleRule);
  };
  
  $scope.saveRule = function(index) {
    if(typeof($scope.accountRules[index].id) == 'undefined') {
      $scope.accountRules[index].priority = index + 1;
      Restangular.all('rule').post({accountId: $stateParams.accountId, rule: $scope.accountRules[index]}).then(function(data){
        $scope.accountRules[index] = data.data;
        flash.success = 'Rule created successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    } else {
      $scope.accountRules[index].priority = index + 1;
      Restangular.one('rule', $scope.accountRules[index].id).customPUT({accountId: $stateParams.accountId, rule: $scope.accountRules[index]}).then(function(data){
        $scope.accountRules[index] = data.data;
        flash.success = 'Rule updated successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    }
  };

  
//End of Peer2Alpha








// Form controller 

// the following allow to request array $resource instead of object (default)
  var actions = {'get': {method: 'GET', isArray: true}};
  
  // Tags inputs
  // ----------------------------------- 
  var Cities = $resource('server/cities.json', {}, actions);

  Cities.get(function(data){

      $scope.cities = data;

  });
  // for non ajax form just fill the scope variable
  // $scope.cities = ['Amsterdam','Washington','Sydney','Beijing','Cairo'];


  // Chosen data
  // ----------------------------------- 

  var States = $resource('server/chosen-states.json', {},  {'query':    {method:'GET', isArray:true} });

  $scope.states = States.query();

//end of form controller






  
  
  // Component is optional
  if(!$.fn.sortable) return;

  var Selector = '[portlet]',
      storageKeyName = 'portletState';

  angular.element(document).ready(function () {

    $timeout(function() {

      $( Selector ).sortable({
        connectWith:          Selector,
        items:                'div.panel',
        handle:               '.portlet-handler',
        opacity:              0.7,
        placeholder:          'portlet box-placeholder',
        cancel:               '.portlet-cancel',
        forcePlaceholderSize: true,
        iframeFix:            false,
        tolerance:            'pointer',
        helper:               'original',
        revert:               200,
        forceHelperSize:      true,
        start:                saveListSize,
        update:               savePortletOrder,
        create:               loadPortletOrder
      })
      // optionally disables mouse selection
      //.disableSelection()
      ;
    }, 0);

  });


  function savePortletOrder(event, ui) {
    var self = event.target;
    var data = angular.fromJson($scope.$storage[storageKeyName]);
    
    if(!data) { data = {}; }

    data[self.id] = $(self).sortable('toArray');

    $scope.$storage[storageKeyName] = angular.toJson(data);
      
    // save portlet size to avoid jumps
    saveListSize.apply(self);
  }

  function loadPortletOrder(event) {
    var self = event.target;
    var data = angular.fromJson($scope.$storage[storageKeyName]);

    if(data) {
      
      var porletId = self.id,
          panels   = data[porletId];

      if(panels) {
        var portlet = $('#'+porletId);
        
        $.each(panels, function(index, value) {
           $('#'+value).appendTo(portlet);
        });
      }

    }

    // save portlet size to avoid jumps
    saveListSize.apply(self);
  }

  // Keeps a consistent size in all portlet lists
  function saveListSize() {
    var $this = $(this);
    $this.css('min-height', $this.height());
  }

  /*function resetListSize() {
    $(this).css('min-height', "");
  }*/
  
  $scope.loadSidebarMenu = function() {
    Restangular.all('side-menu').getList().then(function(data){
      var sub_menu = {};
      var menu = [];
      angular.forEach(data[0]['sub_menu'], function(k, v) {
        if(typeof(sub_menu[k.sidebarmenumap]) == 'undefined') {
          sub_menu[k.sidebarmenumap] = [];
        }
        sub_menu[k.sidebarmenumap].push(k);
      });
      
      angular.forEach(data[0]['super_menu'], function(k, v) {
        if(typeof(sub_menu[k.id]) != 'undefined') {
          k['submenu'] = sub_menu[k.id];
          menu.push(k);
        } else {
          menu.push(k);
        }
      });
      $rootScope.menuItems = menu;
    }, function (err) {
      $scope.response = 'error';
      $scope.message = 'Internal server error occured, Please check back.';
    });
  };
  
  $scope.loadSliderData = function(p_index, index, field) {
    return 'slider_' + p_index + '_' + index;
  }
  
  $scope.setSliderData = function(p_id, id, val) {
    $scope.accountRules[p_id]['filters'][id].value = val;
  }
  
  $scope.loadSlider = function(filter, type) {
    if(type == 'slider' && filter.type != 'selection') {
      return true;
    } else if(type == 'selection' && filter.type == 'selection') {
      return true;
    } else {
      return false;
    }
  }
  
  $scope.setSelectionValues = function(sPIdx, pIdx, idx, key) {
    var idxS = $scope.accountRules[sPIdx].filters[pIdx]['value'].indexOf(key);
    if(idxS < 0) {
      $scope.accountRules[sPIdx].filters[pIdx]['value'].push(key);
    } else {
      $scope.accountRules[sPIdx].filters[pIdx]['value'].splice(idxS, 1);
    }
  }
  
  $scope.setPriority = function(idx, flow) {
    if(flow == 'up' && idx > 0) {
      var $_temp = $scope.accountRules[idx];
      $scope.accountRules[idx] = $scope.accountRules[idx - 1];
      $scope.accountRules[idx].priority = idx + 1;
      $scope.accountRules[idx - 1] = $_temp;
      $scope.accountRules[idx - 1].priority = idx;
      var upPriority = {rules: []};
      angular.forEach($scope.accountRules, function(k, v) {
        upPriority.rules.push({id: k.id, priority: k.priority});
      });
      
      Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
        flash.success = 'Priority updated successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    } else if(flow == 'down') {
      if(typeof $scope.accountRules[idx + 1] != 'undefined' && typeof $scope.accountRules[idx + 1].id != 'undefined') {
        var $_temp = $scope.accountRules[idx];
        $scope.accountRules[idx] = $scope.accountRules[idx + 1];
        $scope.accountRules[idx].priority = $scope.accountRules[idx].priority - 1;
        $scope.accountRules[idx + 1] = $_temp;
        $scope.accountRules[idx + 1].priority = idx + 1;
        var upPriority = {rules: []};
        angular.forEach($scope.accountRules, function(k, v) {
          upPriority.rules.push({id: k.id, priority: k.priority});
        });
        
        Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
          flash.success = 'Priority updated successfully.';
        }, function (err) {
            $scope.response = 'error';
            $scope.message = 'Internal server error occured, Please check back.';
        });
      }
    }
  }
  
  $scope.loadValues = function(filter) {
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
  
  init();
}]);




myApp.controller('accountsController', [ '$scope', '$controller', '$http', '$timeout', '$window', '$auth', '$state', '$stateParams', '$resource', 'API_URL', 'Restangular', '$rootScope', 'flash', '$modal', function($scope, $controller,$http, $timeout, $window, $auth, $state, $stateParams, $resource, API_URL, Restangular, $rootScope, flash, $modal) {
  'use strict';
  $scope.demoVals = {
        sliderExample3:     14,
        sliderExample4:     14,
        sliderExample5:     50,
        sliderExample8:     0.34,
        sliderExample9:     [-0.52, 0.54],
        sliderExample10:     -0.37
      };
  $scope.any_level = 10;
  $scope.alertchange = function(data){

}
  $scope.authMsg = '';
  $scope.vendorUserName = '';
  $scope.vendorPassword = '';
  $scope.vendorAccountId = '';
  $scope.vendorAPIKey = '';
  $scope.msAccountName = '';
  $scope.accountStatus = 'inactive';    
  $scope._account_id = '';
  $scope.accountRules = [];
  $scope.singleRule = {};
  $scope.p = {errors: []};
  $scope.lc = {errors: []};
  $scope.sliders = {sliderValue: 20};
  $scope.testOptions = {min: 5, max: 10, step: 1, value: 12};
  $scope.mp_prosper = {p_username: '', p_password: '', accountNameProsper: '', p_clientid: '', p_clientsecret: ''};
  $scope.isCustom = false;
  $scope.isConservative = false;
  $scope.isBalanced = false;
  $scope.isAgressive = false;
  $scope.isAlpha = false;
  $scope.mp_fc = {fc_username: '', fc_password: '', accountNameFC: '', fc_api_id: '', fc_api_password: ''};
  $scope.fc = {errors: []};

  var sidebarModel = $scope;
  $controller('SidebarController', {$scope: sidebarModel});
  
  Account_initialization();

   function Account_initialization() {
      $scope.authMsg = '';

      if($stateParams.accountId) {
        Restangular.one('account', $stateParams.accountId).get().then(function(data){
          $scope.accountRules = [];
          $scope.vendorUserName = data.data.userName;
          $scope.vendorPassword = data.data.encryptedPassword;
          $scope.vendorAccountId = data.data.vendorAccountId;
          $scope.vendorAPIKey = data.data.apiKey;
          $scope.msAccountName = data.data.accountName;
          $scope.accountStatus = data.data.status;
          $scope._account_id = data.data.id;
          $scope.rulesType = data.data.rulesType;
          if(typeof data.data.rulesType == 'undefined' || data.data.rulesType == '' || data.data.rulesType == null) {
            $scope.isCustom = true;
            $scope.isConservative = true;
            $scope.isBalanced = true;
            $scope.isAlpha = true;
          } else if (data.data.rulesType == 'Alpha'){
            $scope.isCustom = false;
            $scope.isAlpha = true;
          } else if (data.data.rulesType == 'Custom Rules'){
            $scope.isAlpha = false;
            $scope.isCustom = true;
          }
          $('#rulesScreen').removeClass('bar');
          $('#rulesScreen').removeClass('whirl');
          /*if(data.account_rules.length > 0) {
            $scope.accountRules = data.account_rules;
          } else {
            $scope.accountRules.push(data.rules);
          }
          $scope.singleRule = data.rules;*/
        }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
        });
      }
      
  }
  


  function authSuccessful(res) {
    $scope.vendorUserName = res.account.userName;
    $scope.vendorPassword = res.account.encryptedPassword;
    $scope.vendorAccountId = res.account.vendorAccountId;
    $scope.vendorAPIKey = res.account.apiKey;
    $scope.accountStatus = res.account.status;
    $scope.msAccountName = res.account.accountName;
    $state.go('app.peer-accounts-root', {'accountId' : res.account.msAccountId});

  }
      
  function handleError(err) {
      alert('warning', 'Something went wrong :(', err.message);
      $scope.authMsg = 'Internal Server Problem.';
  }
    

  $scope.addPlatformLC = function(data) {
    $scope.authMsg = '';
    Restangular.all('account').post(
    {
      accountName: data.accountNameLC,
      accountType: 'Lending Club',
      vendorUserName: data.lc_username,
      vendorPassword: data.lc_password,
      vendorAPIKey: data.lc_api_key,
      vendorAccountId: data.lc_account_id,
      status: 'active'
    }
    ).then(function(data){
      $scope.vendorUserName = data.account.userName;
      $scope.vendorPassword = data.account.encryptedPassword;
      $scope.vendorAccountId = data.account.vendorAccountId;
      $scope.vendorAPIKey = data.account.apiKey;
      $scope.accountStatus = data.account.status;
      $scope.msAccountName = data.account.accountName;
      sidebarModel.loadSidebarMenu();
      flash.success = data.account.accountName + ' for Lending Club added successfully.';
      $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
    }, function (err) {
      if(err.status == 417) {
        $scope.lc.errors = err.data.message;
      } else if(err.status == 401) {
        flash.error = 'Authentication credentials failed.';
      } else {
        flash.error = 'Internal server error occured, Please check back.';
      }
    });
  };
    
  $scope.addPlatformFC = function(data) {
    $scope.authMsg = '';
    Restangular.all('account').post(
      {
      accountName: data.accountNameFC,
      accountType: 'Funding Circle',
      vendorUserName: data.fc_username,
      vendorPassword: data.fc_password,
      vendorAPIKey: data.fc_api_password,
      vendorAccountId: data.fc_api_id,
      status: 'active'
      }
    ).then(function(data){
      $scope.vendorUserName = data.account.userName;
      $scope.vendorPassword = data.account.encryptedPassword;
      $scope.vendorAccountId = data.account.vendorAccountId;
      $scope.vendorAPIKey = data.account.apiKey;
      $scope.accountStatus = data.account.status;
      $scope.msAccountName = data.account.accountName;
      sidebarModel.loadSidebarMenu();
      flash.success = data.account.accountName + ' for Funding Circle added successfully.';
      $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
    }, function (err) {
		if(err.status == 417) {
	        $scope.lc.errors = err.data.message;
	      } else if(err.status == 401) {
	        flash.error = 'Authentication credentials failed.';
	      } else {
	        flash.error = 'Internal server error occured, Please check back.';
	      }
    });
  };

  $scope.addPlatformProsper = function(data) {
      $scope.authMsg = '';
      Restangular.all('account').post(
        {
          accountName: data.accountNameProsper,
          accountType: 'Prosper',
          vendorAPIKey: data.p_clientsecret,
          vendorAccountId: data.p_clientid,
          vendorUserName: data.p_username,
          vendorPassword: data.p_password
        }
      ).then(function(data){
        sidebarModel.loadSidebarMenu();
        flash.success = data.account.accountName + ' for Prosper added successfully.';
        $state.go('app.peer-accounts-root', {'accountId' : data.account.id});
      }, function (err) {
        if(err.status == 417) {
          $scope.p.errors = err.data.message;
        } else if(err.status == 401) {
          flash.error = 'Authentication credentials failed.';
        } else {
          flash.error = 'Internal server error occured, Please check back.';
        }
      });
  };

  $scope.updateAccount = function() {
      $scope.authMsg = '';
      Restangular.one('account', $stateParams.accountId).customPUT(
        {
          vendorUserName: $scope.vendorUserName,
          vendorPassword: $scope.vendorPassword,
          vendorAccountId: $scope.vendorAccountId,
          vendorAPIKey: $scope.vendorAPIKey
        }
      ).then(function(data){
        
      }, function (err) {
        if(err.status == 417) {
          $scope.response = 'validationError';
          $scope.message = err.data.msg;
        } else {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
        }
      });
  };

  $scope.renameAccount = function() {
    $scope.authMsg = '';
    Restangular.one('account', $stateParams.accountId).customPUT(
      {
        accountName: $scope.msAccountName,
        action: 'rename'
      }
    ).then(function(data){
      sidebarModel.loadSidebarMenu();
    }, function (err) {
      if(err.status == 417) {
        $scope.response = 'validationError';
        $scope.message = err.data.msg;
      } else {
        $scope.response = 'error';
        $scope.message = 'Internal server error occured, Please check back.';
      }
    });
  };
    

  $scope.deleteAccount = function() {
    $scope.authMsg = '';
    Restangular.one('account', $stateParams.accountId).remove().then(function(res) {
      sidebarModel.loadSidebarMenu();
      $state.go('app.peer-add-accounts');
    }, function(err) {
    });
  };

  $scope.addfilter = function(pIdx, idx) {
    $scope.accountRules[pIdx].buttons[idx]['button_i'] = idx;
    $scope.accountRules[pIdx].filters.push($scope.accountRules[pIdx].buttons[idx]);
    $scope.accountRules[pIdx].buttons[idx]['hide'] = true;
  };
  

  $scope.removefilter = function(pIdx, idx) {
    $scope.accountRules[pIdx].buttons[$scope.accountRules[pIdx].filters[idx]['button_i']]['hide'] = false;
    //$scope.accountRules[pIdx].buttons.push($scope.accountRules[pIdx].filters[idx]);
    $scope.accountRules[pIdx].filters.splice(idx, 1);
  };
  

  $scope.deleteRule = function(idx) {
    if(typeof($scope.accountRules[idx].id) != 'undefined') {
      Restangular.one('rule', $scope.accountRules[idx].id).remove().then(function(res) {
        Account_initialization();
      }, function(err) {
      });
    }
  };
  


  $scope.addRule = function() {
    $scope.accountRules.push($scope.singleRule);
  };
  
  $scope.saveRule = function(index) {
    if(typeof($scope.accountRules[index].id) == 'undefined') {
      $scope.accountRules[index].priority = index + 1;
      Restangular.all('rule').post({accountId: $stateParams.accountId, rule: $scope.accountRules[index]}).then(function(data){
        $scope.accountRules[index] = data.data;
        flash.success = 'Rule created successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    } else {
      $scope.accountRules[index].priority = index + 1;
      Restangular.one('rule', $scope.accountRules[index].id).customPUT({accountId: $stateParams.accountId, rule: $scope.accountRules[index]}).then(function(data){
        $scope.accountRules[index] = data.data;
        flash.success = 'Rule updated successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    }
  };

  
//End of Peer2Alpha








// Form controller 

// the following allow to request array $resource instead of object (default)
  var actions = {'get': {method: 'GET', isArray: true}};
  
  // Tags inputs
  // ----------------------------------- 
  var Cities = $resource('server/cities.json', {}, actions);

  Cities.get(function(data){

      $scope.cities = data;

  });
  // for non ajax form just fill the scope variable
  // $scope.cities = ['Amsterdam','Washington','Sydney','Beijing','Cairo'];


  // Chosen data
  // ----------------------------------- 

  var States = $resource('server/chosen-states.json', {},  {'query':    {method:'GET', isArray:true} });

  $scope.states = States.query();

//end of form controller






  
  
  // Component is optional
  if(!$.fn.sortable) return;

  var Selector = '[portlet]',
      storageKeyName = 'portletState';

  angular.element(document).ready(function () {

    $timeout(function() {

      $( Selector ).sortable({
        connectWith:          Selector,
        items:                'div.panel',
        handle:               '.portlet-handler',
        opacity:              0.7,
        placeholder:          'portlet box-placeholder',
        cancel:               '.portlet-cancel',
        forcePlaceholderSize: true,
        iframeFix:            false,
        tolerance:            'pointer',
        helper:               'original',
        revert:               200,
        forceHelperSize:      true,
        start:                saveListSize,
        update:               savePortletOrder,
        create:               loadPortletOrder
      })
      // optionally disables mouse selection
      //.disableSelection()
      ;
    }, 0);

  });


  function savePortletOrder(event, ui) {
    var self = event.target;
    var data = angular.fromJson($scope.$storage[storageKeyName]);
    
    if(!data) { data = {}; }

    data[self.id] = $(self).sortable('toArray');

    $scope.$storage[storageKeyName] = angular.toJson(data);
      
    // save portlet size to avoid jumps
    saveListSize.apply(self);
  }

  function loadPortletOrder(event) {
    var self = event.target;
    var data = angular.fromJson($scope.$storage[storageKeyName]);

    if(data) {
      
      var porletId = self.id,
          panels   = data[porletId];

      if(panels) {
        var portlet = $('#'+porletId);
        
        $.each(panels, function(index, value) {
           $('#'+value).appendTo(portlet);
        });
      }

    }

    // save portlet size to avoid jumps
    saveListSize.apply(self);
  }

  // Keeps a consistent size in all portlet lists
  function saveListSize() {
    var $this = $(this);
    $this.css('min-height', $this.height());
  }

  /*function resetListSize() {
    $(this).css('min-height', "");
  }*/
  
/*  $scope.loadSidebarMenu = function() {
    Restangular.all('side-menu').getList().then(function(data){
      var sub_menu = {};
      var menu = [];
      angular.forEach(data[0]['sub_menu'], function(k, v) {
        if(typeof(sub_menu[k.sidebarmenumap]) == 'undefined') {
          sub_menu[k.sidebarmenumap] = [];
        }
        sub_menu[k.sidebarmenumap].push(k);
      });
      
      angular.forEach(data[0]['super_menu'], function(k, v) {
        if(typeof(sub_menu[k.id]) != 'undefined') {
          k['submenu'] = sub_menu[k.id];
          menu.push(k);
        } else {
          menu.push(k);
        }
      });
      $rootScope.menuItems = menu;
    }, function (err) {
      $scope.response = 'error';
      $scope.message = 'Internal server error occured, Please check back.';
    });
  };*/
  
  $scope.loadSliderData = function(p_index, index, field) {
    return 'slider_' + p_index + '_' + index;
  }
  
  $scope.setSliderData = function(p_id, id, val) {
    $scope.accountRules[p_id]['filters'][id].value = val;
  }
  
  $scope.loadSlider = function(filter, type) {
    if(type == 'slider' && filter.type != 'selection') {
      return true;
    } else if(type == 'selection' && filter.type == 'selection') {
      return true;
    } else {
      return false;
    }
  }
  
  $scope.setSelectionValues = function(sPIdx, pIdx, idx, key) {
    var idxS = $scope.accountRules[sPIdx].filters[pIdx]['value'].indexOf(key);
    if(idxS < 0) {
      $scope.accountRules[sPIdx].filters[pIdx]['value'].push(key);
    } else {
      $scope.accountRules[sPIdx].filters[pIdx]['value'].splice(idxS, 1);
    }
  }
  
  $scope.setPriority = function(idx, flow) {
    if(flow == 'up' && idx > 0) {
      var $_temp = $scope.accountRules[idx];
      $scope.accountRules[idx] = $scope.accountRules[idx - 1];
      $scope.accountRules[idx].priority = idx + 1;
      $scope.accountRules[idx - 1] = $_temp;
      $scope.accountRules[idx - 1].priority = idx;
      var upPriority = {rules: []};
      angular.forEach($scope.accountRules, function(k, v) {
        upPriority.rules.push({id: k.id, priority: k.priority});
      });
      
      Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
        flash.success = 'Priority updated successfully.';
      }, function (err) {
          $scope.response = 'error';
          $scope.message = 'Internal server error occured, Please check back.';
      });
    } else if(flow == 'down') {
      if(typeof $scope.accountRules[idx + 1] != 'undefined' && typeof $scope.accountRules[idx + 1].id != 'undefined') {
        var $_temp = $scope.accountRules[idx];
        $scope.accountRules[idx] = $scope.accountRules[idx + 1];
        $scope.accountRules[idx].priority = $scope.accountRules[idx].priority - 1;
        $scope.accountRules[idx + 1] = $_temp;
        $scope.accountRules[idx + 1].priority = idx + 1;
        var upPriority = {rules: []};
        angular.forEach($scope.accountRules, function(k, v) {
          upPriority.rules.push({id: k.id, priority: k.priority});
        });
        
        Restangular.one('rule/priority', $stateParams.accountId).customPUT(upPriority).then(function(data){
          flash.success = 'Priority updated successfully.';
        }, function (err) {
            $scope.response = 'error';
            $scope.message = 'Internal server error occured, Please check back.';
        });
      }
    }
  }
  
  $scope.loadValues = function(filter) {
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
  
  $scope.openAlpha = function() {
    
  }
  
  $scope.openRules = function() {
    var r = resolveFor('moment', 'taginput','inputmask','localytics.directives', 'ngWig', 'filestyle', 'ui.select');
    r['accountId'] = function() {
        return $stateParams.accountId;
    };
    var modalInstance = $modal.open({
      templateUrl: '/templates/views/_rules_modal.html',
      controller: 'RulesModalController',
      resolve: r
    });
    
    
  }
  var loader = {
    scripts: {
            'whirl':              ['vendor/whirl/dist/whirl.css'],
            'classyloader':       ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'animo':              ['vendor/animo.js/animo.js'],
            'fastclick':          ['vendor/fastclick/lib/fastclick.js'],
            //'modernizr':          ['vendor/modernizr/modernizr.js'],
            'animate':            ['vendor/animate.css/animate.min.css'],
            'skycons':            ['vendor/skycons/skycons.js'],
            'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                                   'vendor/simple-line-icons/css/simple-line-icons.css'],
            'weather-icons':      ['vendor/weather-icons/css/weather-icons.min.css'],
            'sparklines':         ['app/vendor/sparklines/jquery.sparkline.min.js'],
            'wysiwyg':            ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                                   'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],
            'vector-map':         ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'],
            'vector-map-maps':    ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                                   'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'],
            'loadGoogleMapsJS':   ['app/vendor/gmap/load-google-maps.js'],
            'flot-chart':         ['vendor/Flot/jquery.flot.js'],
            'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                                   'vendor/Flot/jquery.flot.resize.js',
                                   'vendor/Flot/jquery.flot.pie.js',
                                   'vendor/Flot/jquery.flot.time.js',
                                   'vendor/Flot/jquery.flot.categories.js',
                                   'vendor/flot-spline/js/jquery.flot.spline.min.js'],
                                  // jquery core and widgets
            'jquery-ui':          ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js'],
                                   // loads only jquery required modules and touch support
            'jquery-ui-widgets':  ['vendor/jquery-ui/ui/core.js',
                                   'vendor/jquery-ui/ui/widget.js',
                                   'vendor/jquery-ui/ui/mouse.js',
                                   'vendor/jquery-ui/ui/draggable.js',
                                   'vendor/jquery-ui/ui/droppable.js',
                                   'vendor/jquery-ui/ui/sortable.js',
                                   'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'],
            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],
            'inputmask':          ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
            'flatdoc':            ['vendor/flatdoc/flatdoc.js'],
            'codemirror':         ['vendor/codemirror/lib/codemirror.js',
                                   'vendor/codemirror/lib/codemirror.css'],
            // modes for common web files
            'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                                     'vendor/codemirror/mode/xml/xml.js',
                                     'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                                     'vendor/codemirror/mode/css/css.js'],
            'taginput' :          ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                                   'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'],
            'filestyle':          ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
            'parsley':            ['vendor/parsleyjs/dist/parsley.min.js'],
            'fullcalendar':       ['vendor/fullcalendar/dist/fullcalendar.min.js',
                                   'vendor/fullcalendar/dist/fullcalendar.css'],
            'gcal':               ['vendor/fullcalendar/dist/gcal.js'],
            'chartjs':            ['vendor/Chart.js/Chart.js'],
            'morris':             ['vendor/raphael/raphael.js',
                                   'vendor/morris.js/morris.js',
                                   'vendor/morris.js/morris.css'],
            'loaders.css':          ['vendor/loaders.css/loaders.css'],
            'spinkit':              ['vendor/spinkit/css/spinkit.css']
          },
          // Angular based script (use the right module name)
          modules: [
            {name: 'toaster',                   files: ['vendor/angularjs-toaster/toaster.js',
                                                       'vendor/angularjs-toaster/toaster.css']},
            {name: 'localytics.directives',     files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
                                                       'vendor/chosen_v1.2.0/chosen.min.css',
                                                       'vendor/angular-chosen-localytics/chosen.js']},
            {name: 'ngDialog',                  files: ['vendor/ngDialog/js/ngDialog.min.js',
                                                       'vendor/ngDialog/css/ngDialog.min.css',
                                                       'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
            {name: 'ngWig',                     files: ['vendor/ngWig/dist/ng-wig.min.js'] },
            {name: 'ngTable',                   files: ['vendor/ng-table/dist/ng-table.min.js',
                                                        'vendor/ng-table/dist/ng-table.min.css']},
            {name: 'ngTableExport',             files: ['vendor/ng-table-export/ng-table-export.js']},
            {name: 'angularBootstrapNavTree',   files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                        'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
            {name: 'htmlSortable',              files: ['vendor/html.sortable/dist/html.sortable.js',
                                                        'vendor/html.sortable/dist/html.sortable.angular.js']},
            {name: 'xeditable',                 files: ['vendor/angular-xeditable/dist/js/xeditable.js',
                                                        'vendor/angular-xeditable/dist/css/xeditable.css']},
            {name: 'angularFileUpload',         files: ['vendor/angular-file-upload/angular-file-upload.js']},
            {name: 'ngImgCrop',                 files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                                                        'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
            {name: 'ui.select',                 files: ['vendor/angular-ui-select/dist/select.js',
                                                        'vendor/angular-ui-select/dist/select.css']},
            {name: 'ui.codemirror',             files: ['vendor/angular-ui-codemirror/ui-codemirror.js']},
            {name: 'angular-carousel',          files: ['vendor/angular-carousel/dist/angular-carousel.css',
                                                        'vendor/angular-carousel/dist/angular-carousel.js']},
            {name: 'ngGrid',                    files: ['vendor/ng-grid/build/ng-grid.min.js',
                                                        'vendor/ng-grid/ng-grid.css' ]},
            {name: 'infinite-scroll',           files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']},
            {name: 'ui.bootstrap-slider',       files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                                                        'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                                                        'vendor/angular-bootstrap-slider/slider.js']},
            {name: 'ui.grid',                   files: ['vendor/angular-ui-grid/ui-grid.min.css',
                                                        'vendor/angular-ui-grid/ui-grid.min.js']},
            {name: 'textAngular',               files: ['vendor/textAngular/dist/textAngular.css',
                                                        'vendor/textAngular/dist/textAngular-rangy.min.js',
                                                        'vendor/textAngular/dist/textAngular-sanitize.js',
                                                        'vendor/textAngular/src/globals.js',
                                                        'vendor/textAngular/src/factories.js',
                                                        'vendor/textAngular/src/DOM.js',
                                                        'vendor/textAngular/src/validators.js',
                                                        'vendor/textAngular/src/taBind.js',
                                                        'vendor/textAngular/src/main.js',
                                                        'vendor/textAngular/dist/textAngularSetup.js'
                                                        ], serie: true},
            {name: 'angular-rickshaw',          files: ['vendor/d3/d3.min.js',
                                                        'vendor/rickshaw/rickshaw.js',
                                                        'vendor/rickshaw/rickshaw.min.css',
                                                        'vendor/angular-rickshaw/rickshaw.js'], serie: true},
            {name: 'angular-chartist',          files: ['vendor/chartist/dist/chartist.min.css',
                                                        'vendor/chartist/dist/chartist.js',
                                                        'vendor/angular-chartist.js/dist/angular-chartist.js'], serie: true},
            {name: 'ui.map',                    files: ['vendor/angular-ui-map/ui-map.js']},
            {name: 'datatables',                files: ['vendor/datatables/media/css/jquery.dataTables.css',
                                                        'vendor/datatables/media/js/jquery.dataTables.js',
                                                        'vendor/angular-datatables/dist/angular-datatables.js'], serie: true},
            {name: 'angular-jqcloud',           files: ['vendor/jqcloud2/dist/jqcloud.css',
                                                        'vendor/jqcloud2/dist/jqcloud.js',
                                                        'vendor/angular-jqcloud/angular-jqcloud.js']},
            {name: 'angularGrid',               files: ['vendor/ag-grid/dist/angular-grid.css',
                                                        'vendor/ag-grid/dist/angular-grid.js',
                                                        'vendor/ag-grid/dist/theme-dark.css',
                                                        'vendor/ag-grid/dist/theme-fresh.css']},
            {name: 'ng-nestable',               files: ['vendor/ng-nestable/src/angular-nestable.js',
                                                        'vendor/nestable/jquery.nestable.js']},
            {name: 'akoenig.deckgrid',          files: ['vendor/angular-deckgrid/angular-deckgrid.js']},
            {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                                        'vendor/angular-sweetalert/SweetAlert.js']},
            {name: 'bm.bsTour',                 files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                                                        'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                                                        'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'], serie: true},
            {name: 'ui.knob',                   files: ['vendor/angular-knob/src/angular-knob.js',
                                                        'vendor/jquery-knob/dist/jquery.knob.min.js']},
            {name: 'easypiechart',              files: ['vendor/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']},
            {name: 'colorpicker.module',        files: ['vendor/angular-bootstrap-colorpicker/css/colorpicker.css',
                                                        'vendor/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js']}
  ]};
  function resolveFor() {
      var _args = arguments;
      return {
        deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
          // Creates a promise chain for each argument
          var promise = $q.when(1); // empty promise
          for(var i=0, len=_args.length; i < len; i ++){
            promise = andThen(_args[i]);
          }
          return promise;

          // creates promise to chain dynamically
          function andThen(_arg) {
            // also support a function that returns a promise
            if(typeof _arg == 'function')
                return promise.then(_arg);
            else
                return promise.then(function() {
                  // if is a module, pass the name. If not, pass the array
                  var whatToLoad = getRequired(_arg);
                  // simple error check
                  if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                  // finally, return a promise
                  return $ocLL.load( whatToLoad );
                });
          }
          // check and returns required data
          // analyze module items with the form [name: '', files: []]
          // and also simple array of script files (for not angular js)
          function getRequired(name) {
            if (loader.modules)
                for(var m in loader.modules)
                    if(loader.modules[m].name && loader.modules[m].name === name)
                        return loader.modules[m];
            return loader.scripts && loader.scripts[name];
          }

        }]};
    }
    
    $scope.loadCustomRules = function(type) {
      if(type == $scope.rulesType) {
        return 'De-Activate';
      } else {
        return 'Activate';
      }
    }
    
    $scope.loadAplhaRules = function(type) {
      if(type == $scope.rulesType) {
        return 'De-Activate';
      } else {
        return 'Activate';
      }
    }
    
    $scope.openAlphaDetails = function() {
      var modalInstance = $modal.open({
        templateUrl: '/templates/views/_alpha_modal.html',
        controller: 'AlphaModalController'
      });
    }
    
    $scope.setRulesType = function(type) {
      if(type == $scope.rulesType) {
        type = '';
      } else {
        type = type;
      }
      
      Restangular.one('rule/type', $stateParams.accountId).customPUT({type: type}).then(function(data){
        flash.success = 'Priority updated successfully.';
        Account_initialization();
      }, function (err) {
      });
    }
    
    $scope.loadHelp = function(type) {
      var modalInstance = $modal.open({
        templateUrl: '/templates/views/_help.html',
        controller: 'HelpController',
        resolve: {
          helpType: function() {
            return type;
          }
        }
      });
    }
}]);

