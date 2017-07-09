app.controller('EditdonneCtrl', function($scope, $rootScope, $http,$resource,Restangular, editdonneService){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        //console.log(token.access_token);
    });

	// donné à editer
	$scope.donnee = editdonneService.getDonnee();
	$scope.donnee.idCategorymultimedia.id = $scope.donnee.idCategorymultimedia.id.toString()

    // base url
	var basePosts = Restangular.all('listitems');
	var baseCategorie = Restangular.all('categorymultimedia');

	// Cela crée une requète et renvoie une promeise.
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		$rootScope.loading = false;
	});

	$scope.editPost = function(){
		var CategorieMultimediaId = $scope.donnee.idCategorymultimedia.id;
		//delete $scope.donnee.idCategorymultimedia;
		$scope.donnee.idCategorymultimedia = CategorieMultimediaId;
		//console.log(JSON.stringify($scope.donnee, null, 4));
		$scope.donnee.put();
		window.location.href= "#!/listes/All";
	}
})