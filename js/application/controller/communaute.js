app.controller('CommunauteCtrl', function($scope, $rootScope, $http, $resource, Restangular){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        //console.log(token.access_token);
    });

    // base url
	var baseUsers = Restangular.all('users');

	// liste des Users
	baseUsers.getList().then(function(users) {
		$scope.users = users;
		$rootScope.loading = false;
	});
})