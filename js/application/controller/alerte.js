app.controller('AlerteCtrl', function($scope, $rootScope, $http, Restangular,$filter){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var baseListitems = Restangular.all('listitems');

	baseListitems.getList().then(function(listitems) {
		$scope.listitems = listitems;
		$rootScope.loading = false;
		//console.log(JSON.stringify($scope.listitems, null, 4));
	});

	/*$scope.pushAlert = function(itemSelect){
		//console.log(itemSelect.description.replace(/(<([^>]+)>)/g, ""));
		//console.log(itemSelect.description.replace(/(<([^>]+)>)/g, "").replace('&#39;', "\'").replace('&eacute;', 'é').replace('&agrave;', 'à'));
		//console.log($filter('date')(itemSelect.realeaseDate, "d MMMM yyyy"));

		Push.create(itemSelect.title, {
		    body: $filter('date')(itemSelect.realeaseDate, "d MMMM yyyy"),
		    icon: {
		        x16: itemSelect.pathposter,
		        x32: itemSelect.pathposter
		    },
		    //timeout: 5000
		    requireInteraction : true
		});
		console.log(JSON.stringify(itemSelect, null, 4));
	}*/

	$scope.pushAlert = function(itemSelect){
		var datapush = {
			"app_id" : "e7954b36-f0f3-4175-8716-7af725d096b1",
			"included_segments": ["All"],
			"url": window.location.href,
			"chrome_web_icon" : itemSelect.pathposter,
			"headings" : {"en": itemSelect.title},
			"contents": {"en": $filter('date')(itemSelect.realeaseDate, "d MMMM yyyy")}
		}
		//console.log(JSON.stringify(itemSelect, null, 4));
		$http({
			method: 'POST',
			url: "https://onesignal.com/api/v1/notifications",
			data: datapush,
			headers: {
				"Authorization": "Basic MTg1ZDlmNTctZGYxZC00YzkyLWEzZWMtZGIzZmQzMjVhMGYx",
				"Content-type": "application/json"
			}
		});
	}

})