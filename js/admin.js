var admin=angular.module('admin',[]);
admin.controller('adminController',['$scope','$http',function($scope,$http){
    $scope.contentType='movies';
    $scope.showContent=function(element){
        $scope.contentType =element;
        checkApprovals(); 

    }
    $http.get('movies.json').then(function(response){
        $scope.movies=response.data; 
        console.log($scope.movies);
        checkApprovals(); 

    });
    $http.get('bevrage.json').then(function(response) {
        $scope.beverages = response.data;
        checkApprovals(); 

    });
    
    $scope.toggleMovieApproval = function(index) {
        let movie = $scope.movies[index];
        toggleApproval('approvedMovies', movie.title, movie.approved);
        checkApprovals(); 
    };

    $scope.toggleBeverageApproval = function(index) {
        let beverage = $scope.beverages[index];
        toggleApproval('approvedBeverages', beverage.type, beverage.approved);
        checkApprovals(); 
    };
    function toggleApproval(storageKey, itemKey, isApproved) {
        let approvedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        if (isApproved) {
            approvedItems = approvedItems.filter(item => item !== itemKey);
        } else {
            approvedItems.push(itemKey);
        }

        localStorage.setItem(storageKey, JSON.stringify(approvedItems));
    }

    function checkApprovals() {
        let approvedMovies = JSON.parse(localStorage.getItem('approvedMovies')) || [];
        let approvedBeverages = JSON.parse(localStorage.getItem('approvedBeverages')) || [];

        if ($scope.movies) {
            $scope.movies.forEach(function(movie) {
                movie.approved = approvedMovies.includes(movie.title);
            });
        }

        if ($scope.beverages) {
            $scope.beverages.forEach(function(beverage) {
                beverage.approved = approvedBeverages.includes(beverage.type);
            });
        }
    }

    checkApprovals();

    $scope.logout=function(){
      window.location.href="index.html";
    }
         
      

}]);

