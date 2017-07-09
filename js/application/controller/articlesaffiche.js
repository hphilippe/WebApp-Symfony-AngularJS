app.controller('ArticlesafficheCtrl', function($scope, $rootScope, $http, $resource, $sce, Restangular, $routeParams, $cookies, $timeout, editdonneService,$location){
	$rootScope.loading = true;

	$scope.$on('oauth:login', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
        //console.log(token.access_token);
    });

    // base url
	var baseCategories = Restangular.all('categoryposts');
	var basePosts = Restangular.all('posts');
	var baseComments = Restangular.all('comments');

	//params
	var globalidUser = $cookies.get('iduser');
	var globalUsername = $cookies.get('username');
	$scope.UsernameCookie = globalUsername;
	var idArticle;
	var Article;
	var CommentSelect;

	//url
	var currentName = $routeParams.name;
	var currentCategorie = $routeParams.categorie;
	$scope.categorieFilter = currentCategorie;

	var allComments = [];

	basePosts.getList().then(function(posts) {
		angular.forEach(posts, function(value,key){
			if(value.title == currentName){
				$scope.posts = value;
				idArticle = $scope.posts.id;
				Article = $scope.posts;
				$scope.description = $sce.trustAsHtml(value.body);

				baseComments.getList().then(function(comments) {
					angular.forEach(comments, function(value,key){
						if(value.idPost == idArticle){
							allComments.push(value);
						}
					})
					$scope.comments = allComments;

					$rootScope.loading = false;
				})
				
			}
		})
	})

	$scope.newComment = function(){
		$scope.new.User = globalidUser;
		$scope.new.Post = idArticle;
		$rootScope.loading = true;
		baseComments.post($scope.new) // persister en bdd
    	$timeout(callAtTimeoutReloadpCom, 1000);
    	$scope.new = {};
	}

	$scope.deleteArticle = function(){
		delpost = Article;

		//console.log(JSON.stringify(delpost, null, 4));
		$rootScope.loading = true;
  		delpost.remove(); // suppression en serveur
  		angular.element('#delete').trigger('click');
  		$timeout(callAtTimeoutDelete, 1000);
	}

  	function callAtTimeoutDelete() {
  		$rootScope.loading = false;
  		window.location.href = "#!/articles/"+currentCategorie;
	}

	$scope.modalEdit = function(){ // editer le contenue du film
		//console.log(JSON.stringify(Article, null, 4));
	    editdonneService.addDonne(Article);
	    window.location.href="#!/edit/article";
	}

	$scope.modalComSelect = function(comment){
		CommentSelect = comment;
  	}

  	$scope.deleteCom = function(){
		delpostcom = CommentSelect;

		//console.log(JSON.stringify(delpostcom, null, 4));
		$rootScope.loading = true;
  		delpostcom.remove(); // suppression en serveur
  		$timeout(callAtTimeoutReloadpCom, 1000);
	}

  	function callAtTimeoutReloadpCom() {
  		allComments = [];

  		basePosts.getList().then(function(posts) {
  			angular.forEach(posts, function(value,key){
				if(value.title == currentName){
					idArticle = $scope.posts.id;

					baseComments.getList().then(function(comments) {
						angular.forEach(comments, function(value,key){
							if(value.idPost == idArticle){
								allComments.push(value);
							}
						})
						$scope.comments = allComments;
						$rootScope.loading = false;
					})
				}
  			})
  		})

  		/*console.log(window.location.hash);
  		console.log(window.location.href);
  		var hashUrl = window.location.hash.slice(3);
  		var hrefUrl = window.location.href;
  		var AllUrl = hrefUrl + window.location.hash;
  		console.log(hashUrl);
  		$location.url("articles/All");*/
	}

	$scope.editComment = function(commment){
	    var iduser = $scope.comm.idUser;
	    var idpost = $scope.comm.idPost;
	    var editCom = $scope.comm;
	    editCom.User = iduser;
	    editCom.Post = idpost;
	    delete editCom.username;
	    delete editCom.userimage;
	    delete editCom.idUser;
	    delete editCom.idPost;

	    editCom.put();
	    alert('message modifier');
	    $scope.comm = {};
	    //console.log(JSON.stringify(editCom, null, 4));
	}

	$scope.modalComEditSelect = function(comment){
		$scope.comm = comment;
		//console.log(comment);
  	}

  	$scope.newCom = function(){
  		$scope.comm = {};
  	}

	/*$scope.pushAlert = function(itemSelect){
		Push.create(itemSelect.title, {
		    body: itemSelect.categoryTitle,
		    icon: {
		        x16: itemSelect.pathcoverimage,
		        x32: itemSelect.pathcoverimage
		    },
		    //timeout: 5000
		});
	}*/

	$scope.pushAlert = function(itemSelect){
		var datapush = {
			"app_id" : "e7954b36-f0f3-4175-8716-7af725d096b1",
			"included_segments": ["All"],
			"url": window.location.href,
			"chrome_web_icon" : itemSelect.pathcoverimage,
			"headings" : {"en": itemSelect.title},
			"contents": {"en": itemSelect.categoryTitle}
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