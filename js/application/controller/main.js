app.controller('MaintCtrl', function($scope, $rootScope, $http, Restangular){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var baseListitems = Restangular.all('listitems');
	var basePosts = Restangular.all('posts');
	var baseCatPosts = Restangular.all('categoryposts');
	var baseCatMedia = Restangular.all('categorymultimedia');

	baseListitems.getList().then(function(listitems) {
		$scope.listitems = listitems;
		$scope.mainitems = listitems;
		$rootScope.loading = false;
		//console.log(JSON.stringify($scope.listitems, null, 4));
	});

	basePosts.getList().then(function(posts) {
		$scope.postsArticles = posts;
		$rootScope.loading = false;
	});

	baseCatPosts.getList().then(function(catposts) {
		$scope.categoriePosts = catposts;
		$rootScope.loading = false;
	});

	baseCatMedia.getList().then(function(catmedia) {
		$scope.categorieMedias = catmedia;
		$rootScope.loading = false;
	});
})