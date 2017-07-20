/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider','$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'APP_REQUIRES',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, appRequires) {
        'use strict';

        App.controller = $controllerProvider.register;
        App.directive  = $compileProvider.directive;
        App.filter     = $filterProvider.register;
        App.factory    = $provide.factory;
        App.service    = $provide.service;
        App.constant   = $provide.constant;
        App.value      = $provide.value;

        // LAZY MODULES
        // -----------------------------------
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: appRequires.modules
        });

        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: basepath('app.html?_ver='+_version),
                controller: 'AppController',
                resolve: resolveFor('fastclick', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'slider')
            })
            .state('app.dashboard-summary', {
                url: '/summary',
                templateUrl: basepath('summary.html?_ver='+_version),
                controller: 'SummaryCtrl',
                resolve: resolveFor('ngTable', 'ngTableExport', 'flot-chart','flot-chart-plugins', 'toaster')
            })
            .state('app.dashboard-transactions', {
                url: '/transactions',
                templateUrl: basepath('transactions.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('ngTable', 'ngTableExport', 'flot-chart','flot-chart-plugins')
            })
            .state('app.dashboard-lc-analytics', {
                url: '/reports',
                templateUrl: basepath('reports.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('keshif')
            })
            .state('app.dashboard-prosper-analytics', {
                url: '/reports',
                templateUrl: basepath('reports.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('keshif')
            })
            .state('app.peer-accounts-root', {
                url: '/accounts/:accountId',
                title: 'Accounts',
                templateUrl: basepath('accounts.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle')

            })
            .state('app.peer-accounts', {
                url: '/accounts/:accountId',
                title: 'Accounts',
                templateUrl: basepath('accounts.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'oitozero.ngSweetAlert', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-accounts-aggressive', {
                url: '/accounts/:accountId/aggressive',
                title: 'Accounts',
                templateUrl: basepath('aggressive.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-accounts-new', {
                url: '/accounts/:accountId/new',
                title: 'Accounts',
                templateUrl: basepath('new_rules.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-accounts-update', {
                url: '/accounts/:accountId/rule/:ruleId',
                title: 'Accounts',
                templateUrl: basepath('update_rules.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-accounts-duplicate', {
                url: '/accounts/:accountId/rule/:ruleId/duplicate',
                title: 'Accounts',
                templateUrl: basepath('duplicate_rules.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-accounts-model', {
                url: '/accounts/:accountId/lc',
                title: 'Accounts',
                templateUrl: basepath('lc_rules.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('codemirror', 'codemirror-plugins', 'moment', 'taginput','inputmask','localytics.directives', 'slider', 'ngWig', 'filestyle', 'toaster')

            })
            .state('app.peer-add-accounts', {
                url: '/add-accounts',
                title: 'Add Accounts',
                templateUrl: basepath('add-accounts.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('jquery-ui', 'parsley', 'icons')
            })
            .state('app.faqs', {
                url: '/faqs',
                title: 'FAQs',
                templateUrl: basepath('faqs.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('flatdoc')
            })
            .state('app.todo', {
                url: '/todo',
                title: 'Tasks',
                templateUrl: basepath('todo.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('xeditable')
            })
            .state('app.prosper', {
                url: '/prosper',
                title: 'Prosper',
                templateUrl: basepath('prosper.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('keshif')
            })
            .state('app.lending_club', {
                url: '/lending-club',
                title: 'Prosper',
                templateUrl: basepath('lending_club.html?_ver='+_version),
                controller: 'NullController',
                resolve: resolveFor('keshif')
            })
            .state('app.backtester', {
                url: '/backtester',
                title: 'backtester',
                templateUrl: basepath('backtester.html?_ver='+_version),
                controller: 'BacktesterController'
            })
            .state('app.settings', {
                url: '/settings',
                title: 'settings',
                templateUrl: basepath('settings.html?_ver='+_version),
                controller: 'SettingsController'
            })
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: '/templates/pages/page.html?_ver='+_version,
                resolve: resolveFor('icons', 'parsley')
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: '/templates/pages/login.html?_ver='+_version,
                resolve: resolveFor('bootstrap-social', 'toaster')
            })
            .state('page.logout', {
                url: '/logout',
                title: "Logout",
                controller: 'LogoutController'
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: '/templates/pages/register.html?_ver='+_version,
                resolve: resolveFor('toaster')
            })
            .state('page.reset', {
                url: '/reset/:hash',
                title: "Reset Password",
                templateUrl: '/templates/pages/reset.html?_ver='+_version
            })
            .state('page.lock', {
                url: '/lock',
                title: "Lock",
                templateUrl: '/templates/pages/lock.html?_ver='+_version
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: '/templates/pages/404.html?_ver='+_version
            })
        ;

        //$locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');



        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'templates/views/' + uri;
        }

        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
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
                        if (appRequires.modules)
                            for(var m in appRequires.modules)
                                if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                                    return appRequires.modules[m];
                        return appRequires.scripts && appRequires.scripts[name];
                    }

                }]};
        }

    }]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : '/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).controller('NullController', function() {}).config(['flashProvider', function(flashProvider) {
    flashProvider.errorClassnames.push('alert-danger');
    flashProvider.warnClassnames.push('alert-warn');
    flashProvider.successClassnames.push('alert-success');
}]);
