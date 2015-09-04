'use strict';

app.factory('parseLogic', function($rootScope, $location){
	var service = {};

	service.initialize = function(){
		Parse.initialize('ccpnOank7Z9Zx9bM2cKx4bKfY2aXpz9YbsqGqISv', 'DsyunChoW6REhbite7qHhJDMu95gCedSvpIGkMwB');
	};

	service.newQuery = function(type){
		var objType = Parse.Object.extend(type);
		return new Parse.Query(objType);
	};

	service.getBrothers = function(){
		$("#loader").show();
		var brotherQuery = new Parse.Query(Parse.Object.extend("Brother"));
	    return brotherQuery.find({
	      	success : function(brothers){
	      		$rootScope.drivers = [];
	      		$rootScope.brothers = brothers;

		        for (var i = 0; i < brothers.length; i++){
		        	var currBrother = $rootScope.brothers[i];
		        	for (var key in currBrother.attributes){
		      			currBrother[key] = currBrother.attributes[key];
		      		}
		          	if (currBrother.isDriver){
		            	$rootScope.drivers.push(currBrother);
		          	}
		        }
		        $rootScope.$apply();
		        $("#loader").hide();
		        console.log("BROTHER RETRIEVAL SUCCESS: ", brothers);
		    },
		    error : function(error){
	        	console.log("BROTHER RETRIEVAL ERROR: ", error);
	      	}
	    });
	};

	service.getEvents = function(){
		$("#loader").show();
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
		        $rootScope.$apply();
		        console.log("EVENT RETRIEVAL SUCCESS: ", $rootScope.days);
		    },
		    function(error){
	        	console.log("EVENT RETRIEVAL ERROR: ", error);
	      	}
	    );
	};

	service.getVans = function(){
		$("#loader").show();
		var vanQuery = new Parse.Query(Parse.Object.extend("Van"));
	    return vanQuery.find({
	      	success : function(vans){
	      		var renew = $rootScope.vans.length != vans.length;
	      		for (var i = 0; i < $rootScope.vans.length; i++){
	      			renew = $rootScope.vans[i].id != vans.id && renew;
	      		}

	      		$rootScope.vanState = '';
	      		for (var i = 0; i < vans.length; i++){
	      			//concatenate id's
	      			$rootScope.vanState += vans[i].id;
		        	for (var key in vans[i].attributes){
		      			vans[i][key] = vans[i].attributes[key];
		      		}
		        }
		        $rootScope.vans = vans;
		        $rootScope.$apply();
		        if (renew){
		        	console.log("VAN RETRIEVAL SUCCESS: ", vans);
		        }	
		        $("#loader").hide();		        
		    },
		    error : function(error){
	        	console.log("VAN RETRIEVAL ERROR: ", error);
	        	$("#loader").hide();
	      	}
	    });
	};

	service.getRoutes = function(){
		$("#loader").show();
		var routeQuery = new Parse.Query(Parse.Object.extend("Route"));
	    return routeQuery.find({
	      	success : function(routes){
	      		console.log("FETCHING ROUTES: ", routes);
	      		for (var i=0; i < routes.length; i++){
	      			var key = routes[i].get("name");
	      			var locations = routes[i].get("locations");
	      			$rootScope.routes[key] = locations;

	      			for (var j = 0; j < locations.length; j++){
	      				$rootScope.requests[locations[j]] = [];
	      			}
	      		}
		        console.log("ROUTES RETRIEVAL SUCCESS: ", $rootScope.routes);
		        console.log("REQUESTS UPDATED: ", $rootScope.requests);
		        $("#loader").hide();		        
		    },
		    error : function(error){
	        	console.log("VAN RETRIEVAL ERROR: ", error);
	        	$("#loader").hide();
	      	}
	    });
	};

	service.getRequests = function(){
		$("#loader").show();
		//Reset requests to avoid duplicates
		for (var key in $rootScope.requests){
			$rootScope.requests[key] = [];
		};
		var requestQuery = new Parse.Query(Parse.Object.extend("Request"));
	    return requestQuery.find({
	      	success : function(requests){
	      		for (var i=0; i < requests.length; i++){
	      			var location = requests[i].get("location");
	      			$rootScope.requests[location].push(requests[i]);
	      		}
	      		$rootScope.$apply();
		        console.log("REQUESTS RETRIEVAL SUCCESS: ", $rootScope.requests);
		        $("#loader").hide();		        
		    },
		    error : function(error){
	        	console.log("REQUESTS RETRIEVAL ERROR: ", error);
	        	$("#loader").hide();
	      	}
	    });
	}

	service.submitRequest = function(location){
		var Request = Parse.Object.extend("Request");
		var request = new Request();
		request.set("location", location);
		if ($rootScope.me.contact){
			request.set("contact", contact);
		}
		request.save(null, {
			success: function(request){
				alert("Your request has been registered, we will send a van to come get you shortly!");
			},
			error: function(error){
				alert("Sorry, we were not able to process your request. Please check if you are connected to the internet.");
			}
		});
	}

	service.submitNewVan = function(copilotID, copilotContact, route){
		var Brother = Parse.Object.extend("Brother");

        var pilot = new Brother();
        pilot.id = $rootScope.me.id;

        var copilot = new Brother();
        copilot.id = copilotID;

        var Van = Parse.Object.extend("Van");
        $rootScope.currentVan = new Van();
        $rootScope.currentVan.set("driver", pilot);
        $rootScope.currentVan.set("copilot", copilot);
        $rootScope.currentVan.set("route", route);
        $rootScope.currentVan.set("contact", copilotContact);
        $rootScope.currentVan.set("location", 0);
        $rootScope.currentVan.set("full", false);
        $rootScope.currentVan.save({
        	success : function(van){
        		$rootScope.currentUser.set("isDriving", true);
        		$rootScope.currentUser.set("vanID", $rootScope.currentVan.id);
        		$rootScope.currentUser.save();
        		$rootScope.$apply();
        		console.log("SUCCESSFULLY ADDED NEW VAN: ", van);
        	},
        	error : function(object, error){
        		console.log("FAILED TO ADD NEW VAN: ", error);
        	}
        })
	}

	service.handleLogin = function(name, password, isBrother, isCoordinator){
		var userQuery = new Parse.Query(Parse.Object.extend("User"));
        userQuery.equalTo("username", name);
        userQuery.find().then(
            function(results){
                if (results.length > 0){
                    Parse.User.logIn(name, password, {
                        success : function(user){
                        	$rootScope.notLogged = false;
                        	$location.path('/me');
                        	$rootScope.$apply();
                            console.log("SUCCESSFULLY LOGGED IN AS: ", name);
                            service.restoreUser();
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
                    user.set("isDriving", $rootScope.isDriving);
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
            });
	};

	service.restoreUser = function(){
		console.log("CHECKING IF USER DATA IS STORED...");
	    $rootScope.currentUser = Parse.User.current();
	    if ($rootScope.currentUser){
	        console.log("RELOAD CURRENT USER DATA: ", Parse.User.current());
	        $rootScope.notLogged = false;
	        $rootScope.isBrother = $rootScope.currentUser.get("isBrother");
	        $rootScope.isCoordinator = $rootScope.currentUser.get("isCoordinator");
	        $rootScope.isDriving = $rootScope.currentUser.get("isDriving");

	        if ($rootScope.isDriving){
	        	 $rootScope.enRoute = true;
	        	var vanID = $rootScope.currentUser.get("vanID");
	        	var vanQuery = new Parse.Query(Parse.Object.extend("Van"));
	        	vanQuery.get(vanID, {
	        		success : function(van){
	        			$rootScope.currentVan = van;
	        			$rootScope.currentRoute = van.get("route");
	        			$rootScope.configComplete = true;
	        			$rootScope.$apply();
	        			console.log("SUCCESSFULLY RETRIEVED CURRENT VAN DATA: ", van);
	        		},
	        		error : function(object, error){
	        			$rootScope.currentUser.set("isDriving", false);
			            $rootScope.currentUser.set("vanID", '');
			            $rootScope.currentUser.save();
	        			$rootScope.isDriving = false;
	        			$rootScope.configComplete = true;
	        			$rootScope.$apply();
	        			console.log("FAILED TO RETRIEVE CURRENT VAN DATA: ", error);
	        		}
	        	});
	        } else{
	        	$rootScope.configComplete = true;
    			$rootScope.$apply();
	        }
	        
	        $rootScope.me = {
	          name : $rootScope.currentUser.get("username"),
	          contact : $rootScope.currentUser.get("contact"),
	          id: $rootScope.currentUser.id
	        }
	    } else{
	    	$rootScope.configComplete = true;
			$rootScope.$apply();
	    }
	}

	return service;
});