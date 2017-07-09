app.controller('EditarticleCtrl', function($scope, $rootScope, $http,$resource,Restangular, editdonneService,$timeout){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        //console.log(token.access_token);
    });

	// donné à editer
	$scope.donnee = editdonneService.getDonnee();
	$scope.donnee.idCategorypost = $scope.donnee.idCategorypost.toString()

    // base url
	var basePosts = Restangular.all('posts');
	var baseCategorie = Restangular.all('categoryposts');
	var datasend;

	// Cela crée une requète et renvoie une promeise.
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		$rootScope.loading = false;
	});

	$scope.editPost = function(){
		datasend = $scope.donnee;
		delete datasend.userpathimage;
		delete datasend.categoryTitle;
		delete datasend.categoryUrl;
		var categoriesPost = $scope.donnee.idCategorypost;
		datasend.Categorypost = categoriesPost;
		delete datasend.idCategorypost;
		var userId = $scope.donnee.idUser;
		datasend.User = userId;
		delete datasend.idUser;

		$scope.donnee.put();
		$timeout(callRedirectEdit, 500);
	}

	function callRedirectEdit() {
		window.location.href="#!/articles/All";
	}
})