
// put in helpers.js
function validSymbol(val) {
    return (symbols.indexOf(val) != -1) // symbols is array from stockSymbols.js
}

function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

var app = angular.module('customizeApp', []);


app.controller('customizeCtrlr', function($scope) {

    $scope.keywordPlaceholder = "Keyword"
    $scope.countryPlaceholder = "Country"

    var news;
    if (!localStorage.defaultNews) {
        localStorage.setItem('defaultNews', '{}')
    }
    news = JSON.parse(localStorage.getItem('defaultNews'))
    if (news.keyword) { 
        $scope.defaultKeyword = news.keyword 
        $scope.showDefaultKeyword = true
    }
    if (news.country)  { 
        $scope.defaultCountry = capitalize(news.country) 
        $scope.showDefaultCountry = true
    }

    $scope.checkNewsEnter = (e) => {
        if (e.target.id == 'country') { $scope.countryPlaceholder = 'Country' }
        if (e.key == 'Enter') {
            var keyword = $scope.keyword ?  $scope.keyword.replace(/\s/g, '').toLowerCase() : ''
            var country = $scope.country ?  $scope.country.replace(/\s/g, '').toLowerCase() : ''
            if (country && !countries.hasOwnProperty(country)) {
                $scope.countryPlaceholder = 'No news available from '+country+''
                $scope.country = ''
            } else {
                if (!localStorage.defaultNews) {
                    localStorage.setItem('defaultNews', '{}')
                }
                var currentNews = JSON.parse(localStorage.getItem('defaultNews'))
                var defaultNews = {}
                defaultNews.keyword = keyword || currentNews.keyword
                defaultNews.country = country || currentNews.country
                localStorage.setItem('defaultNews', JSON.stringify(defaultNews))
                $scope.defaultKeyword = defaultNews.keyword
                $scope.defaultCountry = defaultNews.country ? capitalize(defaultNews.country) : ''
                $scope.keyword = ''
                $scope.country = ''
                if (defaultNews.keyword) {
                    $scope.showDefaultKeyword = true
                }
                if (defaultNews.country) {
                    $scope.showDefaultCountry = true
                }
            }
        }
    }

    $scope.symbolPlaceholder = "Stock symbol"
    if (localStorage.getItem('defaultSymbols') == null) {
        localStorage.setItem('defaultSymbols', '')
    }

    $scope.stocks = [];
    if (localStorage.getItem('defaultSymbols') != '') {
        $scope.stocks = localStorage.getItem('defaultSymbols').split(',')
    }

    $scope.checkStockEnter = (e) => {
        $scope.symbolPlaceholder = "Stock symbol"
        if (e.key == 'Enter') {
            if (validSymbol($scope.symbol.toUpperCase())) {
                if ($scope.stocks.indexOf($scope.symbol) == -1) {
                    defaultSymbols = localStorage.getItem('defaultSymbols')
                    defaultSymbols += $scope.symbol + ','
                    localStorage.setItem('defaultSymbols', defaultSymbols)
                    $scope.stocks.push($scope.symbol)
                    e.target.value = ''
                } else {
                    $scope.symbol = ""
                    $scope.symbolPlaceholder = "That is already a default stock"
                }
            } else {
                $scope.symbol = ""
                $scope.symbolPlaceholder = "No data for that symbol"
            }
        }
    }

    $scope.removeDefaultNews = (e) => {
        var defaultNews = JSON.parse(localStorage.defaultNews)
        defaultNews[$(e.target.parentElement).attr('name')] = ''
        localStorage.setItem('defaultNews', JSON.stringify(defaultNews))
        if ($(e.target.parentElement).attr('name') == 'keyword') {
            $scope.showDefaultKeyword = false
        } else {
            $scope.showDefaultCountry = false
        }
        $('[name='+$(e.target.parentElement).attr('name')+']').remove()
    }

    $scope.removeDefaultStock = (e) => {
        localStorage.setItem('defaultSymbols', localStorage.defaultSymbols.replace(e.target.parentElement.id + ',',''))
        $('#' + e.target.parentElement.id).remove()
    }

});