'use strict';

angular.module('txiRushApp')
  .controller('vanController', ['$scope', '$rootScope', '$http','$interval', '$route', 'parseLogic',
    function($scope, $rootScope, $http, $interval, $route, parseLogic) {
        $scope.pageName = "Van Tracker";
        $scope.showContact=false;
        $rootScope.canRefresh = true;
        $rootScope.showFooter = true;
        // $scope.vans = $rootScope.vans;
    // Poll every second
      //   var vanPromise;
      //   $scope.vans = [];
      //   $scope.poll = function() {
      //   $("#loader").show();
      //   vanPromise = $interval(function() {
      //     if ($route.current.scope.pageName=='Van Tracker') {
      //       parseLogic.getVans();
              
      //       // var promise = $http.get($rootScope.serve("vans"));
      //       // promise.success(function(data){
      //       //     $scope.vans = data.vans;
      //       //     $("#loader").hide();
      //       // });
      //     } else {
      //       $scope.stopPoll();
      //     }
      //   }, 1000);
      // };

      $scope.stopPoll = function() {
        if (angular.isDefined(vanPromise)) {
          $interval.cancel(vanPromise);
          vanPromise = undefined;
        }
      };

      // $scope.poll();       

      $scope.seeNumber = function(){
        $scope.showContact = true;
      };
        
        /**
         * 
         * @param {int} num van number, 1 or 2
         * @param {bool} first true if the dot is the first dot
         * @param {bool} last true if the dot is the last dot
         * @param {String} loc location of van
         * @returns {String} image string of correct dot to use
         */
        $scope.dot = function(van, first, last, loc, index){
            if (van.location == index){
                if (first){
                    return 'img/dots/closedDotTop.png';
                }
                else if (last){
                    return 'img/dots/closedDotBottom.png';
                }
                else{
                    return 'img/dots/closedDot.png';
                }
            }
            else if (van.full && loc != 'Theta Xi' && index > van.location){
              return 'img/dots/line.png'
            }
            else{
                if (first){
                    return 'img/dots/openDotTop.png';
                }
                else if (last){
                    return 'img/dots/openDotBottom.png';
                }
                else{
                    return 'img/dots/openDot.png';
                }
            }
        };

        $scope.hasVans = function(){
          if($rootScope.vans==undefined || $rootScope.vans.length>0){
            return true;
          }
          return false;
        };

        $scope.notReached = function(van, loc){
          return van.route.indexOf(loc) < van.location;
        };

        $scope.isFull = function(van){
          if (van.full){
            return "Full";
          }
          else{
            return "Yes";
          }
        };

        
  }]);