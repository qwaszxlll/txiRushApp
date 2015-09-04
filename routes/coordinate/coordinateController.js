/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('txiRushApp')
  .controller('coordinateController', ['$scope', '$http', '$rootScope', '$interval', '$route', '$location',
    function($scope, $http, $rootScope, $interval, $route, $location) {
        if ($rootScope.notLogged || !$rootScope.isCoordinator){
            $location.path("/login");
        }
        $rootScope.showFooter = false;
        $rootScope.canRefresh = false;

        $scope.pageName = "Coordinate";
        $scope.newRequest = {
          "name" : null,
          "cell" : null
        };

    //-----------------------Sync periodically-----------------------\\
    var requestPromise;
    $scope.getRequests = function() {
        requestPromise = $interval(function() {
            if ($route.current.scope.pageName=='Coordinate') {
               $http.get($rootScope.serve("requests"))
               .success(function(data, status, headers, config){
                    $rootScope.requests=data.requests;
                    $scope.totals = data.totals;
                });
            } else {
                $scope.stopRequests();
            }
        }, 1000);
    };

      $scope.stopRequests = function() {
        if (angular.isDefined(requestPromise)) {
          $interval.cancel(requestPromise);
          requestPromise = undefined;
        }
      };

      $scope.getRequests();  

      //-----------------------Show Info Functions-----------------------\\

      $scope.showWest = function(){
        var message = "West Loop: Dorm Row + Student Center"
        alert(message);
      };

      $scope.showEast = function(){
        var message = "East Loop: Dorm Row + Senior House/E.C."
        alert(message);
      };

      //-----------------------Sending Functions-----------------------\\

      $scope.initiateSend = function(){
        $rootScope.requesting = true;
      };

      $scope.send = function(){
        if ($scope.sendLoop!=undefined && $scope.driver!=undefined){
          var message = ": Please begin a route on " + $scope.sendLoop + " Loop --";
          var testMessage = ": testing van app, isn't this awesome? Don't reply to this number --"
          var postData = {
            "recipient" : $scope.driver.cell,
            "message" : $scope.driver.name + message + $rootScope.me.name
          }
          $http.post($rootScope.serve("sms"), postData);
          $rootScope.requesting = false;
        }
      };

      //-----------------------Rushee Add And Remove-----------------------\\

      $scope.addRushee = function(location){
        $scope.newRequest.name=prompt("Enter Rushee's Name");
        if ($scope.newRequest.name!=null && $scope.newRequest.name!=""){
          $scope.newRequest.cell=prompt("Enter Rushee's Cell");
          if ($scope.newRequest.cell!=null && $scope.newRequest.cell!=""){
            var confirmDialog = "Add " + $scope.newRequest.name + " ( cell: " + $scope.newRequest.cell +")?";
            if (confirm(confirmDialog)){
              var postData = {
                "location" : location.location,
                "name" : $scope.newRequest.name,
                "cell" : $scope.newRequest.cell
              }
              $http.post($rootScope.serve("requests/add"), postData).success(function(data){
                $scope.newRequest.name=null;
                $scope.newRequest.cell=null;
              });
            }
          }
        }
      }

      $scope.removeRushee = function(location, name){
        var postData = {
          "location" : location.location,
          "name" : name,
        };
        $http.post($rootScope.serve("requests/delete"), postData);
      };

    //-----------------------Selection Functions-----------------------\\

    $scope.clearSelectedLoops = function(){
        var east = document.getElementById('East');
        east.className = "startButton loopButton";
        var west = document.getElementById('West');
        west.className = "startButton loopButton";
    };
    $rootScope.selectLoop = function(loop){
        $scope.sendLoop = loop;
        $scope.clearSelectedLoops();
        var element = document.getElementById(loop);
        element.className += " " + "selected";
    };
    $scope.clearSelectedDrivers = function(){
        var brothers = $rootScope.brothers;
        for (i=0; i<brothers.length; i++){
            if (brothers[i].driver){
              var brother = document.getElementById(brothers[i].kerberos);
              brother.className = "startButton brotherOptions";
            }
        }
    };
    $scope.selectDriver = function(driver){
        $scope.driver = driver;
        $scope.clearSelectedDrivers();
        var element = document.getElementById(driver.kerberos);
        element.className += " " + "selected";
    };

}]);
    