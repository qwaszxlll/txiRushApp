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
    
    $rootScope.locations = ["Maseeh","Mccormick","Baker","Burton Conner","Macgregor","New House","Next House","Simmons","Student Center","77 Mass Ave","Stata @ Vassar","Media Lab @ Ames"];
    $rootScope.requestHistory = [];
    $rootScope.requests = {};
    $rootScope.totals = {};
    $rootScope.routes = {};
    $rootScope.vans = [];
    $rootScope.me = {
          name : 'Anonymous Rushee',
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
        $rootScope.isDriving = false;
        $rootScope.me = {
          name : 'Anonymous Rushee',
          contact : ''
        }
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
      $location.path($rootScope.returnPath);
    }

    $rootScope.setPath = function(path){
      console.log("SETTING RETURN PATH: ", path);
        $rootScope.returnPath=path;
    };

    $rootScope.refresh = function(){
        $rootScope.currentUser.fetch({
          success : function(object){
            $rootScope.isDriving = object.get("isDriving");
            // var brotherQuery = new Parse.Query(Parse.Object.extend("Brother"));
            // brotherQuery.equalTo("contact", $rootScope.currentUser.get("contact"));
            // brotherQuery.first({
            //   success : function(brother){
            //     if (brother.get("isDriving")){
            //       $rootScope.isDriving = true;
            //     }
            //     console.log("REFRESHING BROTHER ISDRIVING VAR: ", brother.get("isDriving"));
            //   },
            //   error : function(object, error){
            //     console.log("FAILED TO REFRESH BROTHER ISDRIVING VAR: ", error);
            //   }
            // });
            console.log("REFRESHED USER DATA: ", $rootScope.isDriving);
          },
          error : function(object, error){
            console.log("FAILED TO REFRESH USER DATA: ", error);
          }
        })
        parseLogic.getVans();
        parseLogic.getRequests();
    }

});
