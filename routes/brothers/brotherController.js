'use strict';

angular.module('txiRushApp')
  .controller('brothersController', ['$scope', '$http', '$rootScope', 
  function($scope, $http, $rootScope) {
        $scope.pageName = "Brothers";
        $rootScope.showFooter = true;
        $rootScope.canRefresh = false;
        
    $scope.getBrotherImg = function(delta){
        return 'img/brothers/'+delta+'.jpg';
    };
    
    $scope.getClassImg = function(num){
        return 'img/txiPics/'+$scope.getYear(num)+'s.jpg';
    };
    
    $scope.validHeader = function(num){
        return ['2', '3', '4'].indexOf(num) > -1;
    };
    
    $scope.getYear = function(num){
      if (num==='2'){
          return 2017;
      }  
      else if (num==='3'){
          return 2016;
      }
      else if (num==='5'){
        return 'Super Senior';
      }
      else{
          return 2015;
      }
    };
  }]);