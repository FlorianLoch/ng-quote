angular.module("ng-quote", []).directive("ngquote", ["$http", function ($http) {

	var template = "<div style='font-style: italic; width: 500px;'><div ng-if='!loading'>{{quote}}<br><div style='width: 100%; text-align: right;'><small>{{author}}</small></div></div><div ng-if='loading'>{{loadingText}}</div></div>";

	var linkFn = function ($scope) {
		$scope.loadingText = ($scope.loadingText || "Loading...");
		$scope.errorText = ($scope.errorText || "Error while loading quote. Sorry :(");
		$scope.loading = true;
		var url = "http://quotesondesign.com/api/3.0/api-3.0.json?callback=JSON_CALLBACK";

		$http.jsonp(url).
			success(function (data, status, headers, config) {
				$scope.quote = decodeEntities(data.quote);
				$scope.author = decodeEntities(data.author);
				$scope.loading = false;
			}).
			error(function (data, status, headers, config) {
				$scope.quote = $scope.errorText;
				$scope.author = "";
				$scope.loading = false;
			});
	};

	return {
		link: linkFn,
		scope: {
			"loadingText": "@loadingtext", //Browsers mess up cases of parameters in dom, but JS is exact afterwards -> this won't work, therefore everything is written small
			"errorText": "@errortext"
		},
		template: template,
		restrict: "E",
    replace: true,
	};
}]);


//Taken from http://stackoverflow.com/a/13091266/1339560, slightly modified
function decodeEntities (str) {
    // Remove HTML Entities
    var element = document.createElement('div');

    if(str && typeof str === 'string') {

        // Escape HTML before decoding for HTML Entities
        str = escape(str).replace(/%26/g,'&').replace(/%23/g,'#').replace(/%3B/g,';');

        element.innerHTML = str;
        if(element.innerText){
            str = element.innerText;
            element.innerText = '';
        }else{
            // Firefox support
            str = element.textContent;
            element.textContent = '';
        }
    }
    return unescape(str);
}