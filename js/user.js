let app = angular.module('user', []);
app.controller('userController', ['$scope', '$http', function ($scope, $http) {

    $scope.showmovietable = false;
    $scope.moviemsg = false;
    $scope.snacktable = false;
    $scope.snackmsg = false;
    $scope.totalamount = "";
    $scope.variable = "";
    $scope.contenttype = "";
    $scope.payment = false;
    $scope.selectedMov = false;
    $scope.message = "Pls select a movie";
    $scope.bev1 = false;
    $scope.bev2 = true;
    $scope.user_movie = JSON.parse(localStorage.getItem('user_movie')) || []; 

    $scope.currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];
    console.log("User res");
    

    $http.get('movies.json').then(function (response) {
        $scope.movies = response.data;
        console.log( response.data)
        let approvedMovies = JSON.parse(localStorage.getItem('approvedMovies')) || [];

        $scope.filteredMovies = $scope.movies.filter(function (movie) {
            return approvedMovies.includes(movie.title);
        });

    });

    $http.get('bevrage.json').then(function (response) {
        $scope.beverages = response.data;
        let approvedBeverages = JSON.parse(localStorage.getItem('approvedBeverages')) || [];

        $scope.filteredBeverages = $scope.beverages.filter(function (beverage) {
            return approvedBeverages.includes(beverage.type);
        });

    });

    $scope.showContent = function (element) {
        $scope.contenttype = element;
        if ($scope.filteredMovies.length > 0) {
            $scope.showmovietable = true;
        } else {
            $scope.moviemsg = true;
        }

        if ($scope.filteredBeverages.length > 0) {
            $scope.snacktable = true;
        } else {
            $scope.snackmsg = true;
        }
    };

    $scope.arr = [];
    $scope.arr2 = [];

    let userrequest = JSON.parse(localStorage.getItem('users')) || [];
    for (let i = 0; i < userrequest.length; i++) {
        if (userrequest[i].username != $scope.currentUser) {
            $scope.arr.push(userrequest[i].username);
        };
    };

    $scope.addFriend = function (element) {
 
      let inddd= $scope.arr.indexOf(element);
      $scope.arr.splice(inddd,1);
    $scope.arr2.push(element);                         
    };

    $scope.calculateGrandTotal = function () {
        $scope.grandTotal = 0;
        $scope.totalamount = 'show';
        $scope.payment = true;
        $scope.contenttype = 'payment';

        angular.forEach($scope.filteredBeverages, function (beverage) {
            let quantity = beverage.quant || 0;
            $scope.grandTotal += quantity * beverage.price;
        });

        if ($scope.grandTotal > 0) {
            $scope.bev1 = true;
            $scope.bev2 = false;
        } else {
            $scope.bev2 = true;
        }
    };

    $scope.MovieSelected = function (element) {
        $scope.variable = element;
        $scope.contenttype = 'payment';
        $scope.payment = true;
        $scope.message = "Selected Movies";
        $scope.selectedMov = true;

        $scope.paymentButton = function () {
            let isMovieAlreadyAdded = $scope.user_movie.some(function (item) {
                return item.user === $scope.currentUser && item.movie === $scope.variable.title;
            });

            if (!isMovieAlreadyAdded) {
                let newEntry = {
                    user: $scope.currentUser,
                    movie: $scope.variable.title
                };
               

                $scope.user_movie.push(newEntry);

                localStorage.setItem('user_movie', JSON.stringify($scope.user_movie));

            } 
            new bootstrap.Modal(document.getElementById('payment')).show();

        };
    };


    $scope.finalshow = function (friend) {
        let friendMovies = $scope.user_movie.filter(function (entry) {
            return entry.user === friend; 
        });
    
        if (friendMovies.length > 0) {
            let movieTitle = friendMovies[0].movie;
    
            let matchedMovie = $scope.movies.find(function (movie) {
                return movie.title === movieTitle;
            });
    
            if (matchedMovie) {
                $scope.selectedFriendMovie = matchedMovie;
                new bootstrap.Modal(document.getElementById('friendMovieModal')).show();
            } else {
                alert("Movie not found in the database.");
            }
        } else {
            new bootstrap.Modal(document.getElementById('nomovie')).show();

        }
    };
    $scope.logout=function(){
        window.location.href="index.html";
    }   
   

}]);
