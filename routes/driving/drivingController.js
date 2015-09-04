/* 
 * ROOTSCOPE VARIABLES (maintained throughout trip):
 *  loop (East or West) --> post to server at start of trip
 *  copilotID (Brother kerberos) --> post to server at start of trip
 *  currentLocation (String name of location))
 *  Route (Array of locations objects)
 *  isDriving (true or false) - indicates whether the driving block should display
 *  initiating (true of false) - indicates whether the create route block should display
 *  enroute (true or false) - indicates whether the done button should display
 *  
 *  
 * SCOPE VARIABLES (pulled and posted from server):
 *  selectingLoop - Indicates whether the loop options should display
 *  selectingCopilot - Indicates whether the copilotID selection options should display
 *
 */

angular.module('txiRushApp')
  .controller('drivingController', ['$scope', '$http', '$rootScope', '$interval', '$route', '$location', 'parseLogic',
    function($scope, $http, $rootScope, $interval, $route, $location, parseLogic) {
        if ($rootScope.notLogged || !$rootScope.isBrother){
            $location.path("/login");
        }

    $rootScope.pageName = "Driving";
    $rootScope.showFooter = false;
    $rootScope.canRefresh = true;
    $scope.initiating = true;
    $scope.selectingLoop=true;
    $scope.selectingCopilot=false;

    console.log("STARTING DRIVING PAGE: ", $rootScope.isDriving);

    parseLogic.getRequests();
    
    //Visibility Functions
    $scope.formComplete = function(){
        return $scope.loop!=null && $scope.copilotID!=null;
    };
    
    $scope.routeAvailable = function(){
        return !$rootScope.isDriving;
    };  
    $scope.toggleSelectLoop = function(){
        $scope.selectingLoop = ($scope.selectingLoop) ? false : true;
    };
    $scope.toggleSelectCopilot = function(){
        $scope.selectingCopilot = ($scope.selectingCopilot) ? false : true;
    };

    $scope.setVisibility = function(driving, initiating, enRoute){
        $rootScope.isDriving = driving;
        $scope.initiating = initiating;
        $rootScope.enRoute = enRoute;
    };

    $scope.hasRequests = function(location){
        return $rootScope.requests[location].length > 0;
    }

    $scope.locationComplete = function(index){
        return $rootScope.currentVan.get("location") > index;
    }
    
    //selection functions
    $rootScope.clearSelectedLoops = function(){
        var east = document.getElementById('East');
        east.className = "startButton loopButton";
        var west = document.getElementById('West');
        west.className = "startButton loopButton";
    };
    $rootScope.selectLoop = function(loop){
        $scope.loop = $rootScope.routes[loop];
        $rootScope.clearSelectedLoops();
        var element = document.getElementById(loop);
        element.className += " selected";
        $scope.selectingCopilot = true;
    };
    $rootScope.clearSelectedCopilots = function(){
        var brothers = $rootScope.brothers;
        for (i=0; i<brothers.length; i++){
            var brother = document.getElementById(brothers[i].id);
            brother.className = "startButton brotherOptions";
        }
    };
    $rootScope.selectCopilot = function(id, index){
        $scope.copilotID = id;
        $scope.copilotContact = $rootScope.brothers[index].get("contact");
        $scope.clearSelectedCopilots();
        var element = document.getElementById(id);
        element.className += " " + "selected";
    };
    
    //Trip functions
    $scope.startRoute = function(){
        //change visibility variables
        $scope.setVisibility(true, false, true);
        $scope.full=false;
        $rootScope.currentRoute = $scope.loop;

        parseLogic.submitNewVan($scope.copilotID, $scope.copilotContact, $scope.loop);
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
        var location = $rootScope.currentRoute.indexOf(loc);
        if ($rootScope.currentVan.get("location") > location){
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

    // $scope.update = function(loc){
    //     var postString = "https://rushtxi.mit.edu/app/api/vans/clear/" + loc;
    //     if (loc!='Theta Xi'){
    //         var updatePromise = $http.post(postString);
    //         updatePromise.success(function(data){
    //             $rootScope.route = data.route;
    //             $rootScope.currentLocation=data.current_location;
    //         });
    //     }
    // }
    
    $scope.next = function(){
        if ($rootScope.currentVan.get("location") >= $rootScope.currentRoute.length - 1){
            $scope.done();
        }
        $rootScope.currentVan.increment("location");
        $rootScope.currentVan.save();
    };

    $scope.back = function(){
        if ($rootScope.currentLocation=='Theta Xi'){
            $scope.end();
        }
        $rootScope.currentVan.increment("location", -1);
        $rootScope.currentVan.save();
    };
    
    $scope.done = function(){
      $scope.setVisibility(false, true, false);
      $rootScope.selectingCopilot=true;
      $rootScope.currentVan.destroy({
        success : function(object){
            $rootScope.currentUser.set("isDriving", false);
            $rootScope.currentUser.set("vanID", '');
            $rootScope.currentUser.save();
            console.log("TRIP ENDED AND VAN DESTROYED.");
        },
        error : function(object, error){
            console.log("TRIP ENDED BUT VAN WAS NOT SUCCESSFULLY DESTROYED: ", error);
        }
      })
    };
  }]);