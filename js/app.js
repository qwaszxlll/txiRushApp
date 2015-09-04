'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('txiRushApp', [
  'ngRoute',
  'txiRushApp.filters',
  'txiRushApp.services',
  'txiRushApp.directives',
]);
app.
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/events', {
      templateUrl: 'routes/events/events.html', 
      controller: 'eventsController'
  });
  $routeProvider.when('/vantracker', {
      templateUrl: 'routes/vanTracker/vanTracker.html', 
      controller: 'vanController'
  });
  $routeProvider.when('/brothers', {
      templateUrl: 'routes/brothers/brothers.html', 
      controller: 'brothersController'
  });
  $routeProvider.when('/info', {
      templateUrl: 'routes/info/info.html', 
      controller: 'infoController'
  });
  $routeProvider.when('/driving', {
      templateUrl: 'routes/driving/driving.html', 
      controller: 'drivingController'
  });
  $routeProvider.when('/coordinate', {
      templateUrl: 'routes/coordinate/coordinate.html', 
      controller: 'coordinateController'
  });
  $routeProvider.when('/vanRequest', {
      templateUrl: 'routes/vanRequest/vanRequest.html', 
      controller: 'requestController'
  });
  $routeProvider.when('/me', {
      templateUrl: 'routes/me/me.html', 
      controller: 'meController'
  });
  $routeProvider.when('/login', {
      templateUrl: 'routes/login/login.html', 
      controller: 'loginController'
  });
  $routeProvider.otherwise({redirectTo: '/events'});
}]);

app.controller("AppController", function($scope, $rootScope, $http, $route, $location, parseLogic){

    //Set Default Visibility Variables
    $rootScope.showmenu=false;
    $rootScope.requesting=false;
    $rootScope.notLogged = true;
    $rootScope.isBrother = false;
    $rootScope.isCoordinator = false;
    $rootScope.isDriving = false;
    $rootScope.canRefresh = false;
    $rootScope.showFooter = true;
    $rootScope.configComplete = false;
    
    $rootScope.requests = {};
    $rootScope.routes = {};
    $rootScope.vans = [];
    $rootScope.me = {
          name : '',
          contact : ''
        }

    $scope.$route=$route;
    $scope.$location = $location;

    $rootScope.serve = function(destination){
      // return "https://rushtxi.mit.edu/app/api/" + destination;
      return "http://localhost:8000/"+ destination;
    };

    Parse.initialize('ccpnOank7Z9Zx9bM2cKx4bKfY2aXpz9YbsqGqISv', 'DsyunChoW6REhbite7qHhJDMu95gCedSvpIGkMwB');
    $("#loader").show();
    parseLogic.getBrothers();
    parseLogic.getEvents();
    parseLogic.getVans();
    parseLogic.getRoutes();
    parseLogic.restoreUser();


    $rootScope.logout = function(){
        Parse.User.logOut();
        $rootScope.notLogged = true;
        $rootScope.isBrother = false;
        $rootScope.isCoordinator = false;
        $rootScope.showmenu=($rootScope.showmenu) ? false : true;
    }

    //this is the toggle function
    $rootScope.toggleMenu = function(){
        $rootScope.showmenu=($rootScope.showmenu) ? false : true;
        $("#loader").hide();
    };
    $rootScope.closeMenu = function(){
        if ($rootScope.showmenu === true){
           $rootScope.showmenu=false;
           $rootScope.isBrother = false;
           $rootScope.isCoordinator = false;
        }
    };
    $rootScope.back = function(){
      $rootScope.requesting=false;
    }

    $rootScope.setPath = function(path){
        $rootScope.returnPath=path;
    };

    $rootScope.refresh = function(){
        parseLogic.getVans();
        parseLogic.getRequests();
    }

    $("#window").ready(function() {
            // Animate loader off screen
            $("#loader").hide();
    });

});
