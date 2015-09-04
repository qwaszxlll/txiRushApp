'use strict';

angular.module('txiRushApp')
  .controller('eventsController', ['$scope', '$http', '$rootScope', '$window',
    function($scope, $http, $rootScope, $window) {
 
    //Directive for testing if an event is out of house or not
    $scope.pageName = "Events";
    $rootScope.requesting = false;
    $rootScope.showFooter = true;
    $rootScope.canRefresh = false;

    $scope.isOutOfHouse = function(location){
        if (location == 'TXI'){
            return false;
        }
        else{
            return true;
        }
    };
    
    //Directives for controlling popups
    $scope.currentEvent='';
    $rootScope.hasPopup=false;
    $scope.openPopup = function(event){
        $rootScope.hasPopup=true;
        $scope.scroll=document.body.scrollTop;
        $('html, body').css({
        'overflow': 'hidden',
        'height': '100%'
        });
        $scope.currentEvent=event;
    };
    $scope.closePopup = function(){
        $rootScope.hasPopup=false;
        $('html, body').css({
        'overflow': 'auto',
        'height': 'auto'
        });
        $window.scrollTo(0,$scope.scroll);
        $scope.currentEvent='';
    };
    $scope.getEventImg = function(id){
        return 'img/events/'+id+'.jpg';
    };

    $scope.getImageStyle = function(id){
        return "background: url('img/events/"+id+".jpg') center center; background-size: cover;";
    }
  }]);
