app.controller('CommunauteuserCtrl', function($scope, $rootScope, $http, $resource, Restangular, $routeParams){
	$rootScope.loading = true;

	// base url
	var basePosts = Restangular.all('listitems');
	var baseCategorie = Restangular.all('categorymultimedia');
	var baseUseritems = Restangular.all('useritems');
	var baseUsers = Restangular.all('users');

	//url categorie
	var currentCategorie = $routeParams.categorie;
	if(currentCategorie == "All"){
		$scope.categorieFilter = undefined;
	} else {
		$scope.categorieFilter = currentCategorie;
	}

	var globalidUser;

	//url name
	$scope.currentName = $routeParams.name;

	// liste des Users
	baseUsers.getList().then(function(users) {
		$scope.users = users;
		angular.forEach($scope.users, function(valueUser,keyUser){
			if(valueUser.username == $scope.currentName){
				globalidUser = valueUser.id;
			}
		})
		
	});

	// liste des catégories multimédia
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		//$rootScope.loading = false;
	});

	// liste des user items
	baseUseritems.getList().then(function(listPersos) {
		$scope.listPersos = listPersos;
		//$rootScope.loading = false;

		// liste des items
		basePosts.getList().then(function(posts) {
			$scope.posts = posts;
			//$rootScope.loading = false;

			angular.forEach($scope.posts, function(valueItem,keyItem){
				angular.forEach($scope.listPersos, function(valueList,keyList){
					if(valueList.idListitem == valueItem.id && valueList.idUser == globalidUser){
						$scope.posts[keyItem].current = valueList.current;
						$scope.posts[keyItem].note = valueList.note;
						$scope.posts[keyItem].seen = valueList.seen;
						return false;
					}
				})
			})
			//console.log(JSON.stringify($scope.posts, null, 4));
			$rootScope.loading = false;

		});
	});


})