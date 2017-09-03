angular.module('TaskMasterPro')

.constant("baseURL","https://task-master-pro.herokuapp.com/") //:3000? :5000?

// resource routes
.factory('goalFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL+"users/:userId/goals/:goalId", {userId:"@userId", goalId:"@goalId"}, {'update':{method:'PUT' }});

}])

.factory('taskFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL+"users/:userId/tasks/:taskId", {userId:"@userId", taskId:"@taskId"}, {'update':{method:'PUT' }});

}])

.factory('rewardFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL+"users/:userId/rewards/:rewardId", {userId:"@userId", goalId:"@rewardId"}, {'update':{method:'PUT' }});

}])

.factory('userFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        return $resource(baseURL+"users/:userId/tracking", {userId:"@userId"}, {'update':{method:'PUT' }});

}])

// local storage for json token and user credentials
.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

// user authorization
.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken;
    var userId = '';
    var newUser = false;

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    // Credential check
    if (credentials.authDate != undefined) {
        // Token authorization date
        var authDate = credentials.authDate;
        // Set token expiration date to 12 hours from authorization date
        var expDate = authDate + (12 * 60 * 60 * 1000);
        // Grab current time
        var currentDate = new Date().getTime();
        // If we're past the expiration date, log user out, otherwise load user credentials
        if (currentDate > expDate) {
            destroyUserCredentials();
            console.log("Token expired! User logged out!");
        } else if (credentials.username != undefined) {
            useCredentials(credentials);
        }   
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    userId = credentials.userId;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData) {
        
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token, userId: response.userId, authDate: response.authDate});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '<div class="ngdialog-message"> <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p><br><br>' +  response.data.err.message + '.</p><p>Please try again!</p></div><br>' + // response.data.err.name
                '<div class="ngdialog-buttons"> <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div></div>';
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){});
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password});
            }
              newUser = true;
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '<div class="ngdialog-message"> <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p><br><br>' +  response.data.err.message + '.</p><p>Please try again!</p></div><br>' + // response.data.err.name
                '<div class="ngdialog-buttons"> <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;
    };
    
    authFac.getUserId = function() {
        return userId;
    };
    
    authFac.checkNew = function() {
        return newUser;
    };
    
    authFac.resetUser = function() {
        newUser = false;
    };

    loadUserCredentials();
    
    return authFac;
    
}])

;