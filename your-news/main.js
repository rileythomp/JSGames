function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getChartData (chart) {
    var chartData = [];
    var len = chart.length
    for (i = 0; i < len; i++) {
        chartData.push([moment(chart[i].date).unix() * 1000, chart[i].open])
    }
    return [chartData]
}

function validSymbol(val) { // put into helpers.js
    return (symbols.indexOf(val) != -1) // symbols is array from stockSymbols.js
}

// From https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function setArticles(articles) {
    for (article in articles) {
        articles[article].publishedAt = moment(article.publishedAt).format('LL')
    }
    return shuffle(articles.filter((article, i, self) => self.findIndex(a => a.title === article.title) === i))
}

if (localStorage.getItem('name')) {
    $('#firstVisitPage').hide()
    $('.mainSection').show()
} else {
    $('.mainSection').hide()
    $('#firstVisitPage').show()
}

var app = angular.module('newsApp', []);

app.controller('headerCtrlr', function($scope, $http) {

    if (localStorage.getItem('name')) {$scope.name = localStorage.getItem('name')} 

    $http.get('http://ip-api.com/json').then(function (result) {
        var ip = result.data
        $scope.city = ip.city
        var lat = Math.round(ip.lat)
        var lon = Math.round(ip.lon)
        $http.get('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&APPID=b340badde04aef7dd81ba32faeedd94f').then(function (result) {
            var weather = result.data
            $scope.description = capitalize(weather.weather[0].description)
            $scope.temp = Math.round(weather.main.temp)
            $scope.high = Math.round(weather.main.temp_max)
            $scope.low = Math.round(weather.main.temp_min)
            $scope.wind = Math.round(weather.wind.speed * 3.6) // convert from m/s to km/h
            $scope.humidity = Math.round(weather.main.humidity)
            $scope.condition = weather.weather[0].main
            $scope.sunrise = moment(weather.sys.sunrise*1000).format('LT')
            $scope.sunset = moment(weather.sys.sunset*1000).format('LT')
        })
    })

    var date = new Date()
    var day = date.getDate()
    var month = date.getMonth()
    $http.get('http://numbersapi.com/'+(month+1)+'/'+day+'/date').then(function (result) {
        $scope.fact = result.data
    })

});

app.controller('newsCtrlr', function ($scope, $http) {

    //$scope.show = false;
    $scope.stockPlaceholder = "Search by stock symbol"
    
    $http.get('http://ip-api.com/json').then(function (result) {
        var ip = result.data
        $scope.country = ip.country
        var countryCode = ip.countryCode
        $http.get('https://newsapi.org/v2/top-headlines?country='+countryCode+'&language=en&pageSize=10&apiKey=2479eb795a8c4439b60e56fd936329f4').then(function (result) {
            countryArticles = setArticles(result.data.articles)
            if (localStorage.defaultNews) {
                var defaultNews = JSON.parse(localStorage.defaultNews)
                defaultKeyword = defaultNews.keyword || ''
                defaultCountry = defaultNews.country ? countries[defaultNews.country.replace(/\s/g, '').toLowerCase()] : ''
                if (defaultKeyword || defaultCountry) {
                    $http.get('https://newsapi.org/v2/top-headlines?q='+defaultKeyword+'&country='+defaultCountry+'&language=en&pageSize=10&apiKey=2479eb795a8c4439b60e56fd936329f4').then(function (result) {
                        $scope.articles = setArticles(result.data.articles).concat(setArticles(countryArticles))
                    })
                } else {
                    $scope.articles = setArticles(countryArticles)
                }
            } else {
                $scope.articles = setArticles(countryArticles)
            }
        })
    })

    $scope.searchNews = function(keyObj) {
        // ADD TRANSLATION OF ARTICLES
        $('#noArticles').hide()
        if ($scope.source && ($scope.category || $scope.region)) {
            $('#sourceNote').show()
        } else {
            $('#sourceNote').hide()
        }
        if (keyObj && keyObj.key == "Enter") {
            var keyword = $scope.keyword ? $scope.keyword : ''
            if ($scope.source) {
                var searchedSource = $scope.source.replace(/\s/g, '').toLowerCase()
                var sources = ''
                Object.keys(sourcesObj).forEach(function(key,index) {
                            // key: the name of the object key
                            // index: the ordinal position of the key within the object 
                            if (~key.indexOf(searchedSource)) {
                                sources += sourcesObj[key] + ','
                            }
                });
                if (sources) {
                    $http.get('https://newsapi.org/v2/top-headlines?q='+keyword+'&sources='+sources+'&language=en&pageSize=10&apiKey=2479eb795a8c4439b60e56fd936329f4').then(function (result) {
                        if (result.data.articles.length) {
                            $scope.searchedArticles = setArticles(result.data.articles)
                        } else {
                            $('#noArticles').show()
                        }
                    }, function () {$('#noArticles').show()})
                } else {
                    $('#noArticles').show()
                }
            } else {
                var category = $scope.category && $scope.category != 'Any Category' ? $scope.category : ''
                var region = $scope.region ? countries[$scope.region.replace(/\s/g, '').toLowerCase()] : '' 
                $http.get('https://newsapi.org/v2/top-headlines?q='+keyword+'&category='+category+'&country='+region+'&pageSize=10&apiKey=2479eb795a8c4439b60e56fd936329f4').then(function (result) {
                    if (result.data.articles.length) {
                        $scope.searchedArticles = setArticles(result.data.articles)
                    } else {
                        $('#noArticles').show()
                    }
                }, function () {$('#noArticles').show()})
            }
        }
    }

    $('#newsInfo').on('scroll', function () {
        $('#noArticles, #sourceNote').hide()
    })

    $scope.formatNumber = function (num) {return num < 1000 ? num.toLocaleString('en-us', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                                                            : num.toLocaleString('en-us')
    }
    $scope.Math = window.Math

    var defaultSymbols = localStorage.getItem('defaultSymbols')
    // Original stock request https://api.iextrading.com/1.0/stock/market/batch?symbols=spy,qqq,dia,jpxn,aapl,amzn,msft,fb,brk.a,jphf,jnj,xom,v,bac,wfc,wmt,cvx,pfe,bud,intc,vz,ma,ba,csco,tm,orcl,t,hsbc,c,dis,pep,cmcsa,nflx,un,nvda,sap,ibm,adbe,mcd,nke,mmm,ge,hon,ry,unp,txn,acn,crm,ups,pypl&types=quote,news,chart&range=1m&last=1
    $http.get('https://api.iextrading.com/1.0/stock/market/batch?symbols='+defaultSymbols+'spy,qqq,dia,jpxn,aapl,amzn,goog,msft,fb,brk.a,jphf,jnj,xom,v&types=quote,news,chart&range=1m&last=1')
    .then(function (result) {
        var stocks = result.data
        for (stock in stocks) {
            stocks[stock].quote.primaryExchange = stocks[stock].quote.primaryExchange.replace(/ .*/,'').toUpperCase()
            stocks[stock].chartData = getChartData(stocks[stock].chart)
        }
        $scope.stocks = stocks
    })

    $scope.searchSymbol = function (keyObj) {
        $scope.stockPlaceholder = "Search by stock symbol"
        if (keyObj.key == "Enter") {
            var symbol = $scope.symbolEntered.toUpperCase()
            if (validSymbol(symbol)) {
                $http.get('https://api.iextrading.com/1.0/stock/market/batch?symbols='+symbol+'&types=quote,news,chart&range=1m&last=1')
                .then(function (result) {
                    var stock = result.data[symbol]
                    stock.quote.primaryExchange = stock.quote.primaryExchange.replace(/ .*/,'').toUpperCase()
                    stock.chartData = getChartData(stock.chart)
                    $scope.searched = stock
                    $scope.show = true;
                    $('searchedInterval').css({'color':'black', 'border-color':'darkgrey'})
                    $scope.symbolEntered = ""
                })
            } else {
                $scope.symbolEntered = ""
                $scope.stockPlaceholder = "No data for given symbol"
            }
        }
    }

    $scope.updateStockChart = function ($event) {
        var symbol = $event.target.classList[0]
        $scope.chartInterval = $event.target.innerHTML
        $('.'+symbol+'').css({'color':'black', 'border-color':'darkgrey'})
        $($event.target).css({'color':'darkgrey', 'border-color':'black'})
        $http.get('https://api.iextrading.com/1.0/stock/market/batch?symbols='+symbol+'&types=chart&range='+$event.target.innerHTML+'')
        .then(function (result) {
            var opts = {
                yaxis: {tickDecimals: 0, tickLength: 10, tickColor: '#dddddd'},
                xaxis: {tickLength: 5, tickColor: '#000000', mode: "time", timeformat: "%m/%d/%y", ticks: 5},
                series: {color: '#000000'},
                grid: {borderWidth: {top: 0, right: 0, bottom: 2, left: 2},
                       borderColor: 'black',
                       hoverable: true
                }
            };
            $('chart').css({'width':'95%', 'height':'16em', 'margin-bottom':'0.5em'})
            var chartPlot = $.plot($('#'+symbol+''), getChartData(result.data[symbol].chart), opts)
        })
    }

    $scope.goToEdit = function () {
        location.href = 'customize.html'
    }

})

app.directive('chart', function(){
    return{
        restrict: 'E',
        link: function(scope, elem, attrs){
            var chart = null,
            opts = {
                yaxis: {tickDecimals: 0, tickLength: 25, tickColor: '#dddddd'},
                xaxis: {tickLength: 5, tickColor: '#000000', mode: "time", timeformat: "%m/%d/%y", ticks: 4},
                series: {color: '#000000'},
                grid: {borderWidth: {top: 0, right: 0, bottom: 2, left: 2},
                       borderColor: 'black',
                       hoverable: true
                }
            };          
            
            scope.$watch(attrs.ngModel, function(v){
                if(!chart){
                    chart = $.plot(elem, v , opts);
                    elem.show();
                } else{
                    chart.setData(v);
                    chart.setupGrid();
                    chart.draw();
                }
            });
        }
    };
});

app.controller('firstVisitCtrlr', function($scope) {

    $scope.enterName = function (keyObj) {
        if (keyObj.key == "Enter") {
            localStorage.setItem('name', capitalize($scope.userName))
            location.reload()
        }
    }

});