/**=========================================================
 * Module: sidebar-menu.js
 * Provides a simple way to implement bootstrap collapse plugin using a target
 * next to the current element (sibling)
 * Targeted elements must have [data-toggle="collapse-next"]
 =========================================================*/
myApp.controller('SidebarController', ['$window', '$rootScope', '$scope', '$state', '$location', '$http', '$timeout', 'APP_MEDIAQUERY', '$auth' , 'API_URL' , 'Restangular',
    function($window, $rootScope, $scope, $state, $location, $http, $timeout, mq, $auth, API_URL, Restangular){

        var currentState = $rootScope.$state.current.name;
        var $win = $(window);
        var $html = $('html');
        var $body = $('body');

        // Adjustment on route changes
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            currentState = toState.name;
            currentParams = toParams;


            // Load SideBar when the Accounts State is changed
            //if(currentState && (currentState == 'app.peer-accounts-root' || currentState == 'app.peer-add-accounts')) {
            //$scope.loadSidebarMenu();
            //}

            // Hide sidebar automatically on mobile
            $('body.aside-toggled').removeClass('aside-toggled');

            $rootScope.$broadcast('closeSidebarMenu');
        });

        // Normalize state on resize to avoid multiple checks
        $win.on('resize', function() {
            if( isMobile() )
                $body.removeClass('aside-collapsed');
            else
                $body.removeClass('aside-toggled');
        });

        // Check item and children active state
        var isActive = function(item) {

            if(!item) return;

            if( !item.sref || item.sref == '#') {
                var foundActive = false;
                angular.forEach(item.submenu, function(value, key) {
                    if(isActive(value)) foundActive = true;
                });
                return foundActive;
            }
            else
                return $state.is(item.sref) || $state.includes(item.sref);
        };

        // Load menu from json file
        // -----------------------------------

        // TODO: Move this to separate file
        var sidebarMenuStaticList = [
            {
                heading: "true",
                text: "Dashboard",
                translate: "Dashboard"
            },
            {
                icon:"icon-speedometer",
                sref:"app.dashboard-summary",
                text:"Summary",
                translate:"Summary",
            },
            {
                text: "Transactions",
                sref: "app.dashboard-transactions",
                icon: "icon-grid",
                translate: "Transactions"
            },
            {
                heading:"true",
                text:"Analytics",
                translate: "Analytics"
            },
            {
                text: "Lending Club",
                sref: "app.lending_club",
                icon: "icon-energy",
                translate: "Lending Club"
            },
            {
                text: "Prosper",
                sref: "app.prosper",
                icon: "icon-energy",
                translate: "Prosper"
            },
            {
                text: 'Backtester',
                translate:'Backtester',
                sref:'app.backtester',
                icon:'icon-energy'
            },
            {
                text: "Marketplace",
                heading: "true",
                translate: "Marketplace Platforms"
            },
            // add accounts here
            {
                text: "No Account",
                translate: "No Account",
                icon: "icon-chemistry",
            },
            {
                text: "Add Account",
                sref: "app.peer-add-accounts",
                icon: "icon-plus",
                translate: "Add Account"
            },
            {
                text: "Resources",
                heading: "true",
                translate: "Resources"
            },
            {
                text: "FAQs",
                sref: "app.faqs",
                icon: "icon-graduation",
                translate: "FAQs"
            },
            {
                text: "Suggestions",
                sref: "app.todo",
                icon: "fa-list-ol",
                translate: "Suggestions"
            }
        ]
        $scope.getMenuItemPropClasses = function(item) {
            return (item.heading ? 'nav-heading' : '') +
                (isActive(item) ? ' active' : '') ;
        };
        // TODO: Improve this
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

                angular.forEach(menu, function (key, value) {
                    //sidebarMenuStaticList.push(key);
                    if(key.text === "Accounts" ){
                        sidebarMenuStaticList[8] = key;
                    }
                });



                $rootScope.menuItems = sidebarMenuStaticList;
            }, function (err) {
                $scope.response = 'error';
                $scope.message = 'Internal server error occured, Please check back.';
            });
        };

        $scope.loadSidebarMenu();

        // Handle sidebar collapse items
        // -----------------------------------
        var collapseList = [];

        $scope.addCollapse = function($index, item) {
            collapseList[$index] = !isActive(item);
        };

        $scope.isCollapse = function($index) {
            return (collapseList[$index]);
        };


        $scope.toggleCollapse = function($index, isParentItem) {


            // collapsed sidebar doesn't toggle drodopwn
            if( isSidebarCollapsed() && !isMobile() ) return true;

            // make sure the item index exists
            if( angular.isDefined( collapseList[$index] ) ) {
                collapseList[$index] = !collapseList[$index];
                closeAllBut($index);
            }
            else if ( isParentItem ) {
                closeAllBut(-1);
            }

            return true;

            function closeAllBut(index) {
                index += '';
                for(var i in collapseList) {
                    if(index < 0 || index.indexOf(i) < 0)
                        collapseList[i] = true;
                }
                // angular.forEach(collapseList, function(v, i) {
                // });
            }
        };

        // Helper checks
        // -----------------------------------

        function isMobile() {
            return $win.width() < mq.tablet;
        }
        function isTouch() {
            return $html.hasClass('touch');
        }
        function isSidebarCollapsed() {
            return $body.hasClass('aside-collapsed');
        }
        function isSidebarToggled() {
            return $body.hasClass('aside-toggled');
        }
    }]);
