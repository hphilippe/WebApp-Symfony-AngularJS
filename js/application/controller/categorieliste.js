app.controller('CategorielisteCtrl', function($scope, $rootScope, $http, $resource, Restangular,$interval,$timeout){
	$rootScope.loading = true;
	
	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var basePosts = Restangular.all('categorymultimedia');
  	$scope.post = false;
  	$scope.new = {};

	// Cela crée une requète et renvoie une promeise.
	basePosts.getList().then(function(posts) {
		$scope.posts = posts;
		$rootScope.loading = false;
	});

	$scope.showEditPost = function(post){
		$scope.post = post;
  	}

  	$scope.editPost = function(post){
  		basePosts.getList().then(function(posts) { // recupereation du json 
	  		var posts = posts[post.id];
	  		posts = post;
	  		post.put();
	  		$scope.post = false;
  		})
  	}

  	$scope.newArticle = function(){
  		$scope.post = false; // new article
  		$timeout(callAtTimeout, 1000);
  	}

	$scope.newPost = function(){
		basePosts.post($scope.new) // persister en bdd
		$rootScope.loading = true;
    	$timeout(callAtTimeout, 1000);
	}

    function callAtTimeout() {
       basePosts.getList().then(function(posts) {
            $scope.posts = posts;
            $rootScope.loading = false;
        });
	}
	
    /*$interval(callAtInterval, 60000);

    function callAtInterval() {
		basePosts.getList().then(function(posts) {
		  if($scope.posts.length != posts.length){
		    $scope.posts = posts;
		  }
		});
	}*/

	$scope.deleteModal = function(index, post){
		$scope.delpost = post;
		$scope.delpostindex = index;
	}

	$scope.deletePost = function(){
		delpost = $scope.delpost;
		delpostindex = $scope.delpostindex;

  		delpost.remove(); // suppression en serveur
  		$scope.posts.splice(delpostindex, 1); // supppression en local html
  		angular.element('#modaldelete').trigger('click');
	}

})