var app = angular.module('statsApp', []);
app.controller('statsCtrlr', function($scope) {
    $scope.highScore = localStorage.getItem('highScore') ? JSON.parse(localStorage.getItem('highScore')) : null
    $scope.longestStreak = localStorage.getItem('longestStreak') ? JSON.parse(localStorage.getItem('longestStreak')) : null
    $scope.bestPercentage = localStorage.getItem('bestPercentage') ? JSON.parse(localStorage.getItem('bestPercentage')) : null
    $scope.mostCorrect = localStorage.getItem('mostCorrect') ? JSON.parse(localStorage.getItem('mostCorrect')) : null
    document.getElementById('home').onclick = function () {
        location.href = '../index.html';
    };
});