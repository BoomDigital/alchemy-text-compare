var ALCHEMY_API_URL = "http://access.alchemyapi.com/calls/"
  , ALCHEMY_API_KEY = "35857293ebb9f7309de666daa8b04ecb1977ef9e"

angular.module('alchemy',[])
.config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})
.controller('split', function($scope, $http) {
    $(document).ready(function() {
      $("[tabindex=1]").focus().select() // focus on URL 1
    })
    /* -----
    | Config
    */

    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    $scope.nPages = 2;
    $scope.metrics = [
        { name: "entities", endpoint: "url/URLGetRankedNamedEntities" },
        { name: "keywords", endpoint: "url/URLGetRankedKeywords" },
        { name: "concepts", endpoint: "url/URLGetRankedConcepts" },
        { name: "relations", endpoint: "url/URLGetRelations" }
    ]

    $scope.getNumber = function(num) {
        return new Array(num);
    }
    $scope.page = [
        { url: "http://en.wikipedia.org/wiki/Refrigerator", data: {} },
        { url: "http://www.appliancecity.co.uk/products/fridges-and-freezers/", data: {} }
    ]

    $scope.alchemy = function(i,callback) {
        page = $scope.page[i];

        _.each($scope.metrics, function(metric) {
            $scope.AlchemyApi(page.url, metric, function(res) {
              $scope.$apply(function(){
                $scope.page[i].data[res.metric] = {};
                $scope.page[i].data[res.metric].raw = res.data;
                if(Object.keys($scope.page[i].data).length == $scope.metrics.length) {
                  console.log("Finished analysing "+$scope.page[i].url);
                  if(callback) callback();
                }
              });
            });
        });
    }

    $scope.compare = function() {
      // Check that all pages have all metric data
      _.each(new Array($scope.nPages), function(p,i) {
        $scope.alchemy(i,function() {
          if(i+1 == $scope.nPages) {
            onAlchemyDataLoaded();
          }
        })
      });

      // Find similarities and differences
      function onAlchemyDataLoaded() {
        console.log(JSON.stringify($scope.page));
        // console.log("Starting comparison analysis");
        _.each($scope.metrics, function(metric) {

          $scope.identical[metric.name] = "";
          $scope.page[0].data[metric.name].unique = "";

          // $scope.intersection = _.intersection(
          //                         $scope.page[0].data[metric.name],
          //                         $scope.page[1].data[metric.name]
          //                       );
          // $scope.difference = _.difference(
          //                         $scope.page[0].data[metric.name],
          //                         $scope.page[1].data[metric.name]
          //                       );
        })
      }
    }

    $scope.AlchemyApi = function(url, metric, callback) {
        $.ajax({
          url: 'https://access.alchemyapi.com/calls/'+metric.endpoint,
          dataType: 'jsonp',
          jsonp: 'jsonp',
          type: "post",
          data: {
            apikey: ALCHEMY_API_KEY,
            url: url,
            outputMode: 'json'
        },
          success: function(res) {
            if (res["status"] === "OK") {
              callback({metric: metric.name, data: res[metric.name]});
            }
            // else if (res["status"] === "ERROR") {
            //   //Do something bad
            // }
          },
          // error: function(jqxhr) {
          //   //console.log(jqxhr);
          // }
        });
    }
})
.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
})
.filter('strToHSL', function() {
  return function(input, all) {
    return intToHSL(getHashCode(input))
  }
});

function strToHSL(value) {
    return intToHSL(getHashCode(value));
}
function getHashCode(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
function intToHSL(int) {
    var shortened = int % 360;
    return "hsl(" + shortened + ",100%,30%)";
};