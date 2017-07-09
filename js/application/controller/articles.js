app.controller('ArticlesCtrl', function($scope, $rootScope, $http, $resource, Restangular, $interval, $timeout, $routeParams){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var baseCategorie = Restangular.all('categoryposts');
	var basePosts = Restangular.all('posts');

	//url
	var currentCategorie = $routeParams.categorie;
	$scope.categorieFilter = currentCategorie;

	var valueCurrentCategorie = [];
	var valueCurrentArticle = [];

  	$scope.post = false;
  	$scope.new = {};

  	// liste des catégorie
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		

		// tri arbre catégorie
		angular.forEach($scope.categories, function(value,key){
			if(value.id == 1){
				$scope.posttree = value;
				//alert(JSON.stringify($scope.posttree, null, 4));
				if($scope.posttree.idEnfant.length>0){
					$scope.posttreeLvl2 = $scope.posttree.idEnfant
				}
			}
		})

		//liste des articles
		basePosts.getList().then(function(posts) {
			$scope.posts = posts;
			

			//tri article en fct des catégories
			angular.forEach($scope.categories, function(value,key){
				if(value.title == currentCategorie){
					valueCurrentCategorie.push(value.id);

					angular.forEach(value.idEnfant, function(valuelvl1,keylvl1){
						valueCurrentCategorie.push(valuelvl1.id);

						angular.forEach(valuelvl1.idEnfant, function(valuelvl2,keylvl2){
							valueCurrentCategorie.push(valuelvl2.id);

							angular.forEach(valuelvl2.idEnfant, function(valuelvl3,keylvl3){
								valueCurrentCategorie.push(valuelvl3.id);

								angular.forEach(valuelvl3.idEnfant, function(valuelvl4,keylvl4){
									valueCurrentCategorie.push(valuelvl4.id);

								})
							})
						})
					})
				}
			})
			//console.log(valueCurrentCategorie);

			angular.forEach(valueCurrentCategorie, function(value,key){
				//console.log(value);
				angular.forEach($scope.posts, function(valueArticle,keyArticle){
					//console.log(valueArticle.idCategorypost);
					if(valueArticle.idCategorypost == value){
						valueArticle.categorypostTitle = value;
						valueCurrentArticle.push(valueArticle);
						//console.log(valueArticle);
					}
				})
			})

			$scope.articles = valueCurrentArticle;
			//console.log(JSON.stringify($scope.articles, null, 4));
			$rootScope.loading = false;
			
		});
	});

})