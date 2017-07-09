app.controller('PersonnelleCtrl', function($scope, $rootScope, $http, $resource, Restangular, $routeParams, $cookies, $timeout){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        //console.log(token.access_token);
    });

    // base url
	var basePosts = Restangular.all('listitems');
	var baseCategorie = Restangular.all('categorymultimedia');
	var baseUseritems = Restangular.all('useritems');

	//params
	var globalidUser = $cookies.get('iduser');

	//url
	var currentCategorie = $routeParams.categorie;
	if(currentCategorie == "All"){
		$scope.categorieFilter = undefined;
	} else {
		$scope.categorieFilter = currentCategorie;
	}

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

  	function callAtTimeoutBaseUserItems() {
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
	}

	
	$scope.modalList = function(post){
		var idListItemSelect = post.id;
		var etatSearch = false;

		angular.forEach($scope.listPersos, function(value,key){
			if(value.idListitem == idListItemSelect && value.idUser == globalidUser){
				$scope.listPerso = value;
				$scope.listPerso.seen = value.seen.toString();
				etatSearch = true;
				return false;
			}
		})
		if(!etatSearch){
			$scope.listPerso = null;
		}
	}
	
	$scope.editList = function(){ // editer une valeur dans la liste //alert(JSON.stringify($scope.listPerso, null, 4));
		$scope.listPerso.Listitem = $scope.listPerso.idListitem;
		$scope.listPerso.User = $scope.listPerso.idUser;
		delete $scope.listPerso.idListitem;
		delete $scope.listPerso.idUser;
		//alert(JSON.stringify($scope.listPerso, null, 4));
  		$scope.listPerso.put();
  		angular.element('#personnel-list-edit').trigger('click');
  		$rootScope.loading = true;
  		$timeout(callAtTimeoutBaseUserItems, 1000);
	}

	$scope.deleteList = function(){ // supprimer la donnéee de la liste
		//alert(JSON.stringify($scope.listPerso, null, 4));
		$scope.delpostlist = $scope.listPerso; // suppression en serveur
	}

	$scope.deletePostlist = function(){
		delpostliste = $scope.delpostlist;
		//alert(JSON.stringify(delpostliste, null, 4));

  		delpostliste.remove(); // suppression en serveur
  		angular.element('#delete-perso').trigger('click');
  		angular.element('#personnel-list-edit').trigger('click');
  		$rootScope.loading = true;
  		$timeout(callAtTimeoutBaseUserItems, 1000);
	}

})