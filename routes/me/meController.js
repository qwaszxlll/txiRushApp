'use strict';

angular.module('txiRushApp')
  .controller('meController', ['$scope', '$rootScope', '$http','$interval', '$location',
    function($scope, $rootScope, $http, $interval, $location) {
        console.log("STARTING ME PAGE: ", $rootScope.me);
        $rootScope.showFooter = false;
        $rootScope.canRefresh = false;

        if ($rootScope.notLogged){
            $location.path("/login");
        } else {
            $scope.pageName = "Me";
            $scope.changeSuccess = false;
            $scope.changeFail = false;
            $scope.saveMessage = '';
            $scope.name = $rootScope.me.name;
            $scope.contact = $rootScope.me.contact;
        }   

        $scope.saveMe = function(){
            if ($rootScope.isBrother){
                var Brother = Parse.Object.extend("Brother");
                var brotherPromise = new Parse.Query(Brother);
                var getID = $rootScope.me.id;
                brotherPromise.get(getID).then(
                    function(object){
                        object.set("name", $scope.name);
                        object.set("contact", parseInt($scope.contact));
                        object.save({
                            success : function(){
                                $rootScope.me.name = $scope.name;
                                $rootScope.me.contact = $scope.contact;
                                $scope.changeSuccess = true;
                                $scope.saveMessage = "Changes Saved";
                                $scope.$apply();
                            },
                            error : function(){
                                $scope.changeFail = true;
                                $scope.saveMessage = "Failed to save changes, please check your connection.";
                                $scope.$apply();
                            }
                        });
                    });
            } else{
                //TODO
            }
                
        }

        $scope.clearFields = function(){
            $rootScope.me.name = $rootScope.me.attributes.name;
            $rootScope.me.contact = $rootScope.me.attributes.contact;
            $scope.changeSuccess = true;
            $scope.saveMessage = "Changes Discarded";
        }
  }]);