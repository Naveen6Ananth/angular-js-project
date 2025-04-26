let myApp = angular.module('myApp', []);
myApp.controller('myController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.activeform = 'login';

    $scope.admin = "admin";
    $scope.password = "123456";
    $scope.tablecontent=false;
    $scope.tablemsg=true;

    $scope.showForm = function (element) {

        $scope.activeform = element;

        $http.get('movies.json').then(function (response) {
            $scope.movies = response.data;
            $scope.approvedMovies = JSON.parse(localStorage.getItem('approvedMovies')) || [];
    
            $scope.filteredMovies = $scope.movies.filter(function (movie) {
                return $scope.approvedMovies.includes(movie.title);
            });
            if($scope.filteredMovies.length > 0){
                $scope.tablecontent=true;
                $scope.tablemsg=false;

            }
            else{
                $scope.tablemsg=true;
                $scope.tablecontent=false;
            }
    
        });



    }
    $scope.clearSignup = function () {
        $scope.signupName = "";
        $scope.signupPassword = "";
        $scope.signupRePassword = "";
    }
    $scope.clearLogin=function(){
        $scope.loginName = "";
        $scope.loginPassword = "";
    }

    $scope.handleSignUp = function () {
        $scope.signmessage = "";
        var users = JSON.parse(localStorage.getItem('users')) || [];

        var existingUser = users.find(user => user.username === $scope.signupName);
        if (existingUser) {
            $scope.signmessage = "Username already exists.";
            $scope.clearSignup();
            return;
        }

        if ($scope.signupPassword === $scope.signupRePassword) {
            var newUser = {
                username: $scope.signupName,
                password: $scope.signupPassword
            };

            $scope.clearSignup();

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            $scope.signmessage = "Account Created Successfully";
        }
        else {
            $scope.clearSignup();
            $scope.signmessage = "Passwords do not match.";
        }

    };
    $scope.handleLogin = function () {
        $scope.message2 = "";
        var users = JSON.parse(localStorage.getItem("users")) || [];
        if ($scope.loginName === $scope.admin && $scope.loginPassword === $scope.password) {
            $timeout(function () {
                $scope.clearLogin();
                window.location.href = "admin.html";
            }, 500);

        } else {
            var loggedUser = users.find(user =>
                user.username === $scope.loginName &&
                user.password === $scope.loginPassword
            );
            if (loggedUser) {
                localStorage.setItem('currentUser', JSON.stringify($scope.loginName));
                $scope.message2 = "Login Successfull!";

                $scope.clearLogin();
                $timeout(function(){
                    window.location.href = "user.html";
                },500);
            } else {
                $scope.message2 = "Invalid Credentials";
                $scope.clearLogin();
            }

        }


    };
}]);




