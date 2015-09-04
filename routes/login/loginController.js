'use strict';

angular.module('txiRushApp')
  .controller('loginController', ['$scope', '$rootScope', '$http','$interval', '$location', 'parseLogic', 
    function($scope, $rootScope, $http, $interval, $location, parseLogic) {
        if (!$rootScope.notLogged){
            $location.path("/me");
        }

        $rootScope.showFooter = false;
        $scope.pageName = "Login";
        $scope.isBrother = false;
        $scope.failedLogin = false;
        $scope.failMessage = '';

        $scope.toggleLogin = function(isBrother){
            $scope.isBrother = isBrother;
        }

        $scope.submitLogin = function(name, field){
            if ($scope.isBrother){
                var passwordPromise = new Parse.Query(Parse.Object.extend("Password"));
                passwordPromise.equalTo("password", field);
                passwordPromise.find({
                    success : function(results){
                        if (results.length > 0){
                            $rootScope.isBrother = true;
                            $rootScope.notLogged = false;
                            var meQuery = new Parse.Query(Parse.Object.extend("Brother"));
                            meQuery.equalTo("delta", parseInt(name));
                            meQuery.first({
                                success : function(object){
                                    for (var key in object.attributes){
                                        object[key] = object.attributes[key];
                                    }

                                    $rootScope.me = object;
                                    if ($rootScope.me.access === "admin"){
                                        $rootScope.isCoordinator = true;
                                    };

                                    parseLogic.handleLogin($rootScope.me.name, field, $rootScope.isBrother, $rootScope.isCoordinator);

                                },
                                error : function(error){
                                    console.log("BROTHER QUERY ERROR");
                                }
                            });
                        } else {
                            $scope.failedLogin = true;
                            $scope.failMessage = 'Invalid delta and password combination';
                            $scope.$apply();
                        }
                    },
                    error : function(error) {
                        console.log("PASSWORD PROMISE FAILURE");
                        $scope.failedLogin = true;
                        $scope.failMessage = 'Login failed';
                        $scope.$apply();
                    }
                });
            } else{
                $rootScope.me.name = name;
                $rootScope.me.contact = field;
                parseLogic.handleLogin(name, "rush2015", false, false);


                // var Rushee = Parse.Object.extend("Rushee");
                // var rushee = new Rushee();
                // rushee.set("name", name);
                // rushee.set("contact", field);

                // rushee.save(null, {
                //     success: function(){
                //         $rootScope.notLogged = false;
                //         rushee.name = name;
                //         rushee.contact = field;
                //         $rootScope.me = rushee;
                //         console.log("SAVED NEW RUSHEE DATA: ", $rootScope.me);

                //         $location.path('/events');
                //         $scope.$apply();
                //     },
                //     error: function(error){
                //         $scope.failedLogin = true;
                //         $scope.failMessage = 'Registration failed, please check your connection.';
                //         $scope.$apply();
                //         console.log("FAILED TO SAVE NEW RUSHEE DATA: ");
                //     }
                // });
            }
        }
  }]);