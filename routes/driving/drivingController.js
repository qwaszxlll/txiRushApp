/* 
 * ROOTSCOPE VARIABLES (maintained throughout trip):
 *  loop (East or West) --> post to server at start of trip
 *  copilot (Brother kerberos) --> post to server at start of trip
 *  currentLocation (String name of location))
 *  Route (Array of locations objects)
 *  driving (true or false) - indicates whether the driving block should display
 *  initiating (true of false) - indicates whether the create route block should display
 *  enroute (true or false) - indicates whether the done button should display
 *  
 *  
 * SCOPE VARIABLES (pulled and posted from server):
 *  selectingLoop - Indicates whether the loop options should display
 *  selectingCopilot - Indicates whether the copilot selection options should display
 *
 */

angular.module('txiRushApp')
  .controller('drivingController', ['$scope', '$http', '$rootScope', '$interval', '$route',
    function($scope, $http, $rootScope, $interval, $route) {
        if ($rootScope.notLogged || !$rootScope.isBrother){
            $location.path("/login");
        }

    $rootScope.pageName = "Driving";
    $rootScope.driving = false;
    $scope.initiating = true;
    $rootScope.enRoute = false;
    $scope.selectingLoop=true;
    $scope.selectingCopilot=false;
    // $scope.isDriver = $rootScope.me.driver; //use this for production
    $scope.isDriver = true; //use this for debugging

    //Sync periodically
    var pollPromise;
    $scope.poll = function() {
        pollPromise = $interval(function() {
            if ($route.current.scope.pageName=='Driving') {
                $http.get("https://rushtxi.mit.edu/app/api/vans/poll").success(function(data){
                    if(data.error==undefined){
                        //User is Driving
                        $scope.setVisibility(true, false, true);
                        $rootScope.route = data.route;
                        $rootScope.currentLocation=data.current_location;
                    }
                    else{
                        //User is not driving
                        $scope.setVisibility(false, true, false);
                    }
                });
            } else {
                $scope.stopPoll();
            }
        }, 1000);
    };

      $scope.stopPoll = function() {
        if (angular.isDefined(pollPromise)) {
          $interval.cancel(pollPromise);
          pollPromise = undefined;
        }
      };

      $scope.poll();  
    
    //Visibility Functions
    $scope.formComplete = function(){
        return $rootScope.loop!=null && $scope.copilot!=null;
    };
    
    $scope.routeAvailable = function(){
        return !$scope.driving && $scope.isDriver;
    };  
    $scope.noAccess = function(){
        return !$scope.isDriver;
    };
    $scope.toggleSelectLoop = function(){
        $scope.selectingLoop = ($scope.selectingLoop) ? false : true;
    };
    $scope.toggleSelectCopilot = function(){
        $scope.selectingCopilot = ($scope.selectingCopilot) ? false : true;
    };

    $scope.setVisibility = function(driving, initiating, enRoute){
        $rootScope.driving = driving;
        $scope.initiating = initiating;
        $rootScope.enRoute = enRoute;
    };

    $scope.hasRequests = function(requests){
        return requests.length>0;
    }
    
    //selection functions
    $rootScope.clearSelectedLoops = function(){
        var east = document.getElementById('East');
        east.className = "startButton loopButton";
        var west = document.getElementById('West');
        west.className = "startButton loopButton";
    };
    $rootScope.selectLoop = function(loop){
        $rootScope.loop = loop;
        $rootScope.clearSelectedLoops();
        var element = document.getElementById(loop);
        element.className += " " + "selected";
        $scope.selectingCopilot = true;
    };
    $rootScope.clearSelectedCopilots = function(){
        var brothers = $rootScope.brothers;
        for (i=0; i<brothers.length; i++){
            var brother = document.getElementById(brothers[i].kerberos);
            brother.className = "startButton brotherOptions";
        }
    };
    $rootScope.selectCopilot = function(kerberos){
        $rootScope.copilot = kerberos;
        $scope.clearSelectedCopilots();
        var element = document.getElementById(kerberos);
        element.className += " " + "selected";
    };
    
    //Trip functions
    $scope.startRoute = function(){
        //change visibility variables
        $scope.setVisibility(true, false, true);
        $scope.full=false;
        
        //create a message to send to server
        $scope.startMessage = {
          "drivers": [$rootScope.me.kerberos, $scope.copilot],
          "route": $rootScope.loop
        };
        //send selected info to server and assign route based on response
        $http.post($rootScope.serve("vans/start"), $scope.startMessage)
        .success(function(data){
            $rootScope.route = data.route;
            $rootScope.currentLocation=data.current_location;
        });
    };
    
    $scope.complete = function(status){
        if (status==='done'){
            return true;
        }
        else{
            return false;
        }
    };
      
    $scope.dot = function(first, last, loc){
        if ($rootScope.currentLocation===loc.location){
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
        else if ($scope.full && !loc.done){
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

    $scope.update = function(loc){
        var postString = "https://rushtxi.mit.edu/app/api/vans/clear/" + loc;
        if (loc!='Theta Xi'){
            var updatePromise = $http.post(postString);
            updatePromise.success(function(data){
                $rootScope.route = data.route;
                $rootScope.currentLocation=data.current_location;
            });
        }
    }
    
    $scope.next = function(){
        if ($rootScope.currentLocation=='Theta Xi'){
            $scope.end();
        }
        $scope.update($rootScope.currentLocation);
    };
    
    $scope.end = function(){
        var postString = "https://rushtxi.mit.edu/app/api/vans/full/" + $rootScope.currentLocation;
        $http.post(postString);
        $scope.full=true;
        $scope.stopPoll();
        $rootScope.enRoute=false;
        $rootScope.currentLocation='Theta Xi'; // maybe don't do this line
    };
    
    $scope.done = function(){
      $scope.setVisibility(false, true, false);
      $rootScope.selectingCopilot=true;
      $http.post("https://rushtxi.mit.edu/app/api/vans/end");
    };
  }]);