app.controller('ListesCtrl', function($scope, $rootScope, $http, $resource, Restangular,$interval, $timeout, $routeParams, $sce, $cookies, editdonneService,$filter){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var basePosts = Restangular.all('listitems');
	var baseCategorie = Restangular.all('categorymultimedia');
	var baseUseritems = Restangular.all('useritems');

	//params
	var globalidUser = $cookies.get('iduser');
	var UserListe;

	// liste des catégories multimédia
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		$rootScope.loading = false;
	});
	
	// liste des items
	basePosts.getList().then(function(posts) {
		$scope.posts = posts;
		$rootScope.loading = false;
	});

	// liste des user items
	baseUseritems.getList().then(function(listPersos) {
		UserListe = listPersos;
		$scope.listPersos = listPersos;
		$rootScope.loading = false;
		//console.log(listPersos);
	});

	//url
	var currentCategorie = $routeParams.categorie;
	if(currentCategorie == "All"){
		$scope.categorieFilter = undefined;
		//$scope.categorieFilterIcon = 'database';
	} else {
		$scope.categorieFilter = currentCategorie;
		/*angular.forEach($scope.categories, function(value,key){
			if(value.title == currentCategorie){
				$scope.categorieFilterIcon = value.faIcone;
			}
		})*/
	}

  	function callAtTimeoutBaseUserItems() {
		baseUseritems.getList().then(function(listPersos) {
			$scope.listPersos = listPersos;
			$rootScope.loading = false;
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

	$scope.modalEdit = function(post){ // editer le contenue du film
		//alert(JSON.stringify(post, null, 4));
		//console.log(JSON.stringify(post, null, 4));
	    editdonneService.addDonne(post);
	    angular.element('#myModal').trigger('click');
	    $timeout(callRedirectEdit, 500);
	}

	function callRedirectEdit() {
		window.location.href="#!/edit/donnee";
	}


	$scope.ajoutList = function(){ // ajouter une nouvelle valeur dans la liste
		$scope.newListPerso.User = globalidUser;
		$scope.newListPerso.Listitem = $scope.modalPost.id;
		baseUseritems.post($scope.newListPerso);
		angular.element('#personnel-list-add').trigger('click');
		$rootScope.loading = true;
		$timeout(callAtTimeoutBaseUserItems, 1000);
		$scope.newListPerso = {};
	}

	$scope.editList = function(){ // editer une valeur dans la liste 
		$scope.listPerso.Listitem = $scope.listPerso.idListitem;
		$scope.listPerso.User = $scope.listPerso.idUser;
		delete $scope.listPerso.idListitem;
		delete $scope.listPerso.idUser;
		//alert(JSON.stringify($scope.listPerso, null, 4));
  		$scope.listPerso.put();
  		angular.element('#personnel-list-add').trigger('click');
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
  		angular.element('#delete-list').trigger('click');
  		angular.element('#personnel-list-add').trigger('click');
  		$rootScope.loading = true;
  		$timeout(callAtTimeoutBaseUserItems, 1000);
	}
	
	$scope.selectModal = function(post){
		$scope.modalPost = post;
		var allNotes = [];
		var resuNote = 0;

		angular.forEach(UserListe, function(value,key){
			//console.log(value);
			if($scope.modalPost.id == value.idListitem && value.note != null){
				allNotes.push(parseInt(value.note))
				//console.log(value.note);
			}
		})
		if (allNotes.length > 0){
			allNotes.forEach(function(element){
				resuNote = resuNote + element;
				//console.log(resuNote);
			})
			resuNote = (resuNote / allNotes.length).toFixed();
			//console.log(resuNote);
		}

		$scope.modalScore = resuNote;
		$scope.modalNbrPers =  allNotes.length;
		//console.log($scope.modalScore);

		$scope.modalDescription = $sce.trustAsHtml(post.description);
		//console.log($scope.modalPost);
	}

	$scope.modalDelete = function(post){
		$scope.delpost = post;
	}

	$scope.deletePost = function(){
		delpost = $scope.delpost;
		$rootScope.loading = true;
  		angular.element('#myModal').trigger('click');
  		angular.element('#modaldelete').trigger('click');

  		delpost.remove(); // suppression en serveur
  		$timeout(callAtTimeoutGetList, 1000);
	}

  	function callAtTimeoutGetList() {
		basePosts.getList().then(function(posts) {
			$scope.posts = posts;
			$rootScope.loading = false;
		});
	}

	/*$scope.pushAlert = function(itemSelect){
		Push.create(itemSelect.title, {
		    body: $filter('date')(itemSelect.realeaseDate, "d MMMM yyyy"),
		    icon: {
		        x16: itemSelect.pathposter,
		        x32: itemSelect.pathposter
		    },
		    //timeout: 5000
		});
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