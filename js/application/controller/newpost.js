app.controller('NewpostCtrl', function($scope, $rootScope, $http, Restangular, $cookies){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        console.log(token.access_token);
    });

    // base url
	var basePosts = Restangular.all('posts');
	var baseCategorie = Restangular.all('categoryposts');
	var baseUsers = Restangular.all('users');

	//params
	var globalidUser = $cookies.get('iduser');
	$scope.date = new Date();
	
	// Cela crée une requète et renvoie une promeise.
	baseCategorie.getList().then(function(categories) {
		$scope.categories = categories;
		$rootScope.loading = false;
	});

	baseUsers.getList().then(function(users) {
		angular.forEach(users, function(value,key){
			if(globalidUser == value.id){
				$scope.user = value;
			}
		})
	})

	$scope.newPost = function(){
		$scope.new.published = true;
		$scope.new.User = globalidUser;
		if($scope.new.Categorypost == "null"){
			alert("veuillez entrez une catégorie pour l'article")
		} else {
			//console.log(JSON.stringify($scope.new, null, 4));
			basePosts.post($scope.new) // persister en bdd
			window.location.href= "#!/articles/All";
		}
	}

	
})