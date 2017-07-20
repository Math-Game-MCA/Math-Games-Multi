if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }
var _version = '{{{currentVersion}}}';

// APP START
// ----------------------------------- 

var App = angular.module('angle', ['ngRoute', 'ngAnimate', 'ngStorage', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'toaster','mdo-angular-cryptography', 'ngFileUpload'])
          .run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {
              // Set reference to access them from any scope
              $rootScope.$state = $state;
              $rootScope.$stateParams = $stateParams;
              $rootScope.$storage = $window.localStorage;

              // Uncomment this to disables template cache
              /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                  if (typeof(toState) !== 'undefined'){
                    $templateCache.remove(toState.templateUrl);
                  }
              });*/

              // Scope Globals
              // ----------------------------------- 
              $rootScope.app = {
                name: 'Lending Calc',
                description: 'Marketplace Lending Order Management System',
                year: ((new Date()).getFullYear()),
                layout: {
                  isFixed: true,
                  isCollapsed: false,
                  isBoxed: true,
                  isRTL: false
                },
                viewAnimation: 'ng-fadeInUp'
              };
              
            }
          ])
          .run(["$rootScope", "$state", "Restangular", "$cookies", function($rootScope, $state, Restangular, $cookies) {
    $rootScope.$state = $state; // state to be accessed from view
    
    Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
      //headers.Authorization = 'Bearer ' + $cookies.get('user-token');
      return {headers:headers, params: _.extend(params, {_timestamp: new Date().getTime()} ), element: element};
    });
    Restangular.setRestangularFields({
      "options": "restangularOptions"
    });
}]);
