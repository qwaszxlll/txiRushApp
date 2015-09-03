'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('txiRushApp.services', []).
  value('version', '0.1');

app.factory('parseLogic', function($rootScope, $location){
	var service = {};

	service.initialize = function(){
		Parse.initialize('ccpnOank7Z9Zx9bM2cKx4bKfY2aXpz9YbsqGqISv', 'DsyunChoW6REhbite7qHhJDMu95gCedSvpIGkMwB');
	};

	service.newQuery = function(type){
		var objType = Parse.Object.extend(type);
		return new Parse.Query(objType);
	};

	service.getBrothers = function(scope){
		var brotherQuery = new Parse.Query(Parse.Object.extend("Brother"));
	    return brotherQuery.find({
	      	success : function(brothers){
	      		$rootScope.drivers = [];
	      		$rootScope.brothers = brothers;

		        for (var i = 0; i < brothers.length; i++){
		        	for (var key in brothers[i].attributes){
		      			$rootScope.brothers[i][key] = brothers[i].attributes[key];
		      		}
		          	if ($rootScope.brothers[i].isDriver){
		            	$rootScope.drivers.push($rootScope.brothers[i]);
		          	}
		        }
		        scope.$apply();
		        $("#loader").hide();
		        console.log("BROTHER RETRIEVAL SUCCESS: ", brothers);
		    },
		    error : function(error){
	        	console.log("BROTHER RETRIEVAL ERROR: ", error);
	      	}
	    });
	};

	service.getEvents = function(scope){
		var eventsQuery = new Parse.Query(Parse.Object.extend("Event"));
		$rootScope.days = [
		{name: "Saturday", events: []}, 
		{name: "Sunday", events: []}, 
		{name: "Monday", events: []}, 
		{name: "Tuesday", events: []}, 
		{name: "Wednesday", events: []}, 
		{name: "Thursday", events: []}
		];
	    return eventsQuery.find().then(
	      	function(events){
		        for (var i = 0; i < events.length; i++){
		        	var rushEvent = events[i];
		        	for (var key in rushEvent.attributes){
		      			rushEvent[key] = rushEvent.attributes[key];
		      		}
		        	$rootScope.days[rushEvent.dayIndex - 1].events.push(rushEvent);
		        	
		        }
		        for (var j = 0; j < $rootScope.days.length; j ++) {
		        	$rootScope.days[j].events.sort(function(a, b){
		        		return a.order > b.order;
		        	});
		        }
		        scope.$apply();
		        $("#loader").hide();
		        console.log("EVENT RETRIEVAL SUCCESS: ", $rootScope.days);
		    },
		    function(error){
	        	console.log("EVENT RETRIEVAL ERROR: ", error);
	      	}
	    );
	};

	service.getVans = function(scope){
		var vanQuery = new Parse.Query(Parse.Object.extend("Van"));
	    return vanQuery.find({
	      	success : function(vans){
	      		var renew = scope.vans.length != vans.length;
	      		for (var i = 0; i < scope.vans.length; i++){
	      			renew = scope.vans[i].id != vans.id && renew;
	      		}
	      		// if (renew){
	      		// 	for (var i = 0; i < vans.length; i++){
			      //   	for (var key in vans[i].attributes){
			      // 			vans[i][key] = vans[i].attributes[key];
			      // 		}
			      //   }
			      //   scope.vans = vans;
			      //   scope.$apply();
			      //   console.log("VAN RETRIEVAL SUCCESS: ", vans);
	      		// } else{
	      		// 	console.log("No van update");
	      		// }

	      		for (var i = 0; i < vans.length; i++){
		        	for (var key in vans[i].attributes){
		      			vans[i][key] = vans[i].attributes[key];
		      		}
		        }
		        scope.vans = vans;
		        scope.$apply();
		        if (renew){
		        	console.log("VAN RETRIEVAL SUCCESS: ", vans);
		        }			        
		    },
		    error : function(error){
	        	console.log("VAN RETRIEVAL ERROR: ", error);
	      	}
	    });
	}

	service.submitRequest = function(location){
		var Request = Parse.Object.extend("Request");
		var request = new Request();
		request.set("location", location);
		// if ($rootScope.user.contact){
		// 	request.set("contact", contact);
		// }
		request.save(null, {
			success: function(request){
				alert("Your request has been registered, we will send a van to come get you shortly!");
			},
			error: function(error){
				alert("Sorry, we were not able to process your request. Please check if you are connected to the internet.");
			}
		});
	}

	service.handleLogin = function(name, password, isBrother, isCoordinator){
		var userQuery = new Parse.Query(Parse.Object.extend("User"));
        userQuery.equalTo("username", name);
        userQuery.find().then(
            function(results){
                if (results.length > 0){
                    Parse.User.logIn(name, password, {
                        success : function(){
                        	$rootScope.notLogged = false;
                        	$location.path('/me');
                        	$rootScope.$apply();
                            console.log("SUCCESSFULLY LOGGED IN AS: ", name);
                        },
                        error : function(){
                            console.log("FAILED LOGIN");
                        }
                    })
                } else{
                    var user = new Parse.User();
                    user.set("username", name);
                    user.set("password", password);
                    user.set("contact", parseInt($rootScope.me.contact));
                    user.set("isBrother", isBrother);
                    user.set("isCoordinator", isCoordinator);
                    user.signUp(null, {
                        success : function(){
                        	$rootScope.notLogged = false;
                        	$location.path('/me');
                        	$rootScope.$apply();
                            console.log("SUCCESSFULLY SIGNED UP AS: ", $rootScope.me.name);
                        },
                        error : function(object, error){
                            console.log("FAILED SIGNUP: ", error);
                        }
                    })
                }
                console.log("CHECKING USERNAMES: ", results);
            });
	}

	return service;
})