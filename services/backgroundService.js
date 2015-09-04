'use strict';

app.factory('backgroundService', function($rootScope, $location, parseLogic){
	var service = {};

	service.refresh = function(){
		parseLogic
	}
	return service;
});