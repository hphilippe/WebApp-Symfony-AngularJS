app.controller('NewdonneCtrl', function($scope, $rootScope, $http, Restangular){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var basePosts = Restangular.all('listitems');
	var baseCategorie = Restangular.all('categorymultimedia');

	// Cela crée une requète et renvoie une promeise.
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		$rootScope.loading = false;
	});

	$scope.newPost = function(){
		$scope.new.published = true;
		if($scope.new.idCategorymultimedia == "null"){
			alert("veuillez entrez une catégorie pour la donnée")
		} else {
			//console.log(JSON.stringify($scope.new, null, 4));
			basePosts.post($scope.new) // persister en bdd
			window.location.href= "#!/listes/All";
		}

	}

})