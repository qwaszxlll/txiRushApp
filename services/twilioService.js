'use strict';

app.factory('Twilio', function($rootScope, $location, $http){
	var service = {};

	service.post = function(contact, message){
		var sID = 'AC92b9ab9b171489153d04798aac62ab7d';
		var authToken = 'ef9b478e97d542494223d6b85a816785';
		
		var auth = "AC92b9ab9b171489153d04798aac62ab7d:ef9b478e97d542494223d6b85a816785";
		var url = "https://api.twilio.com/2010-04-01/Accounts/" + sID + "/SMS/Messages";
		var headers = {'Authorization': 'Basic ' + btoa(sID + ":" + authToken), 
			'Content-Type': 'application/x-www-form-urlencoded'
		}
		console.log("AUTHTEST: ", authTest);
		// var msgData = encodeURIComponent("{From : 6504928546, To : " + contact + ",Body : " + message + " }");
		var msgData = {
			from: "+15005550006",
			to: contact,
			body: message
		}
		$http({
		    method: 'POST',
		    url: url,
		    headers: headers,
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		    data: msgData
		}).then(
			function(object){
				console.log("What: ", object);
			},
			function(error){
				console.log(error);
			});

		// $http.post("https://api.twilio.com/2010-04-01/Accounts/" + sID + "/SMS/Messages", msgData, {
		// 	'Content-Type': 'application/x-www-form-urlencoded',
		// 	headers: {'Authorization': 'Basic ' + btoa(sID + ":" + authToken)}
		// }).then(
		// 	function(object){
		// 		console.log("What: ", object);
		// 	},
		// 	function(error){
		// 		console.log(error);
		// 	});
	}

	return service;
});