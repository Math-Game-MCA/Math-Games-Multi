var myApp = angular.module('marketsync', ['angle', 'satellizer', 'restangular','mdo-angular-cryptography']);

myApp.run(function($log) {
  //$log.log('I\'m a line from custom.js');
});


myApp.config(function($stateProvider,$httpProvider,$authProvider, $compileProvider, $cryptoProvider) {
    $httpProvider.interceptors.push("authInterceptor");
    $cryptoProvider.setCryptographyKey('ABCD123');
    //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
})
//.constant('API_URL', "http://it-skalidindi:1337/")   // connect to  sails api
.constant('API_URL', "/")   // connect to  sails api
.run(function ($window, Restangular) {
        var param = $window.location.search.substring(1);
        if (param && $window.opener && $window.opener.location.origin === $window.location.origin) {
            var pair = param.split("=");
            var code = decodeURIComponent(pair[1]);

            //pass value from pop up window to main window
            $window.opener.postMessage(code, $window.location.origin);
        }
        
        Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
          var extractedData;
          // to look for getList operations
          if (operation === "getList") {
            if(url == '/charts') {
              extractedData = data;
            } else {
              extractedData = typeof data == 'object' ? data.data : data;
            }
          }else {
            extractedData = data;
          }
          
          return extractedData;
        });
});


/**** Custom Services ****/

/**** Services ***/
myApp.service('alert', function ($rootScope, $timeout ) {
    var alertTimeout;
    return function(type, title, message, timeout){
    $rootScope.alert ={
         hasBeenShown : true,
         show:true,
         type:type,
         message:message,
         title:title
     };

     $timeout.cancel(alertTimeout);
     alertTimeout = $timeout(function(){
         $rootScope.alert.show = false;
     }, timeout || 2000);
 }
});


myApp.service('auth', function ($http, API_URL, authToken, $state, $window, $q) {
    API_URL = "http://app.lendingcalc.com";
    var url = API_URL + "login";

    function authSuccessful(res) {
        authToken.setToken(res.token);
        $state.go('main');
    }

    this.login = function (email, password) {
        
        return $http.post(url, {
                email: email,
                password: password
            })
            .success(authSuccessful);
    }

    this.register = function (email, password) {
        return $http.post(API_URL + 'register', {
            email: email,
            password: password
        }).success(authSuccessful);
    }

    this.addAccount = function (userId, accountName, accountType) {
        return $http.post(API_URL + 'addAccount', {
            email: email,
            password: password
        }).success(authSuccessful);
    }

    var clientId = "875784166369-o8nsnuajb3sdo38k177nrl39gjjssmo5.apps.googleusercontent.com";
    var urlBuildere = [];
    urlBuildere.push('response_type=code');
    urlBuildere.push("client_id=" + clientId);
    urlBuildere.push("redirect_uri=" + window.location.origin);
    urlBuildere.push("scope=profile email");
    
    this.googleAuth = function () {

    var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuildere.join("&");
    var options = "width=500, height=500, left=" + ($window.auterWidth - 500) / 2 + ", top=" + ($window.outerHeight - 500) / 2.5;

    var deferred = $q.defer();

    var popup = $window.open(url, '', options);
    $window.focus();
    $window.addEventListener('message', function (event) {
        if (event.origin === $window.location.origin) {
            var code = event.data;
            popup.close();

            $http.post(API_URL + "auth/google", {
                code: code,
                clientId: clientId,
                redirectUri: window.location.origin
            }).success(function (jwt) {
                authSuccessful(jwt);
                deferred.resolve(jwt);
            })
        }
    });
    return deferred.promise;
    }
});


myApp.factory('authInterceptor', ["$cookieStore", function ($cookieStore) {
    return {
        request: function(config) {
            var token = $cookieStore.get('token');

            if (token)
                config.headers.Authorization = 'Bearer ' + token;

         return config;
      },

      response:function(response){
          return response; 
      }
    };
}]);

myApp.factory('authToken', function ($window) {
    var storage = $window.localStorage;
    var cachedToken;
    var userToken ='userToken';

    var authToken = {
        setToken: function (token) {
            cachedToken = token;
            storage.setItem(userToken, token)
        },

        getToken: function(){
            if(!cachedToken)
                cachedToken = storage.getItem(userToken);
            return cachedToken;
        },

        isAuthenticated : function(){
            return !!authToken.getToken();
        } ,

        removeToken : function(){
            cachedToken = null;
            storage.removeItem(userToken);
        }
    };

    return authToken;
});
/**** End of Custom Services ****/