var app = angular.module('MonApp', ['ngResource','restangular','ngRoute','ngCookies']);

app.config(function($routeProvider){
  $routeProvider
	.when('/',{
		templateUrl: 'templates/home.html',
  		controller: 'MaintCtrl'})
    
    .when('/articles/:categorie',{
    	templateUrl: 'templates/articles.html',
		controller: 'ArticlesCtrl'})
    
    .when('/articles/:categorie/:name',{
    	templateUrl: 'templates/articleaffiche.html',
		controller: 'ArticlesafficheCtrl'})
    
    .when('/new/article',{
    	templateUrl: 'templates/newpost.html',
    controller: 'NewpostCtrl'})

    .when('/new/donnee',{
      templateUrl: 'templates/newdonne.html',
    controller: 'NewdonneCtrl'})

    .when('/edit/donnee',{
      templateUrl: 'templates/editdonne.html',
    controller: 'EditdonneCtrl'})

    .when('/edit/article',{
      templateUrl: 'templates/editarticle.html',
    controller: 'EditarticleCtrl'})

    .when('/new/categorie-article',{
      templateUrl: 'templates/categorie_article.html',
    controller: 'CategoriearticleCtrl'})

    .when('/new/categorie-liste',{
      templateUrl: 'templates/categorie_liste.html',
    controller: 'CategorielisteCtrl'})

    .when('/listes/:categorie',{
    	templateUrl: 'templates/listes.html',
		controller: 'ListesCtrl'})
    
    .when('/personnelle/:categorie',{
    	templateUrl: 'templates/personnelle.html',
		controller: 'PersonnelleCtrl'})
    
    .when('/communaute',{
    	templateUrl: 'templates/communaute.html',
		controller: 'CommunauteCtrl'})
    
    .when('/communaute/:name/:categorie',{
    	templateUrl: 'templates/communauteuser.html',
		controller: 'CommunauteuserCtrl'})
    
    .when('/profil/:setting',{
    	templateUrl: 'templates/profil.html',
		controller: 'ProfilCtrl'})
    
    .when('/recherche/:categorie/:motcle',{
    	templateUrl: 'templates/recherche.html',
		controller: 'RechercheCtrl'})
    
    .when('/alerte',{
    	templateUrl: 'templates/alerte.html',
		controller: 'AlerteCtrl'})
    .otherwise({redirectTo : '/'});
});

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}])

// Global configuration
app.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://localhost/SkearV2/server/web/app.php/api/');

  //Injext $cookies manually
  var $cookies;
  angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
      $cookies = _$cookies_;
  }]);

  RestangularProvider.setDefaultHeaders({
    Authorization: function() {
        return 'Bearer ' + $cookies.get('access_token');
    }
  });

  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    if (operation === 'getList' && angular.isDefined(response.data._embedded)) {
        response.totalCount = response.data.total;

        return response.data._embedded.items;
    }
    return response.data;
  });

  RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
    if (operation === 'put') {
        delete element.id;
        delete element._links;
        // tchat
        delete element.idUser;
        delete element.username;
        delete element.etatTchat;
        RestangularProvider.setRequestSuffix('');
    }
    if (operation == "getList") {
        params.page = params._page;
        delete params._page;
        delete params._perPage;
        RestangularProvider.setRequestSuffix('');
    }
    if(operation == "post"){
      RestangularProvider.setRequestSuffix('/');
    }
    if(operation == "delete"){
      RestangularProvider.setRequestSuffix('');
    }
    return { params: params };
  });
});

/*-- Navbar right height --*/
app.controller('NavbarRightCtrl', function($scope, $rootScope, $http, Restangular, $cookies) {

  $scope.$on('oauth:login', function(event, token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
      console.log(token.access_token);
  });

    // base url
  var baseListitems = Restangular.all('listitems');

  baseListitems.getList().then(function(listitems) {
    $scope.listitems = listitems;
    $rootScope.loading = false;
    //console.log(JSON.stringify($scope.listitems, null, 4));
  });

  $scope.logout = function() { 
    $cookies.remove("access_token","refresh_token");
    $cookies.remove("refresh_token");
    $cookies.remove("username");
    $cookies.remove("iduser");
    window.location.href="login.html";
  }
})

/*-- Navbar left height --*/
app.controller('NavbarLeftCtrl', function($scope,$rootScope ,$cookies , $http, Restangular){
  $rootScope.loading = true;

  $scope.$on('oauth:login', function(event, token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
      console.log(token.access_token);
  });

  // base url
  var basePosts = Restangular.all('users');
  // var cookie
  var now = new Date(),
    exp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+14);

  basePosts.getList().then(function(posts) {
    angular.forEach(posts, function(value, key) {
      if(value.username == $cookies.get('username')){
        $cookies.put("iduser", value.id,{
          expires: exp
        });
      }
    });
    $rootScope.loading = false;
  });

})

/*-- Navbar side left hamburger --*/
app.controller('NavbarSideCtrl', function($scope, $rootScope, $http, Restangular){
  $rootScope.loading = true;

  $scope.$on('oauth:login', function(event, token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
      console.log(token.access_token);
  });

  // base url
  var baseListe = Restangular.all('categorymultimedia');
  var baseCategoriePosts = Restangular.all('categoryposts');

  // Cela crée une requète et renvoie une promeise.
  baseListe.getList().then(function(listes) {
    $scope.listes = listes;
    $rootScope.loading = false;
  });

  baseCategoriePosts.getList().then(function(CategoriePosts) {
    $scope.CategoriePosts = CategoriePosts;
    $rootScope.loading = false;
  });

})

/*-- Tchat --*/
app.controller('TchatCtrl', function($scope,$cookies ,$rootScope, $http, $resource, Restangular,$interval,$timeout){
  $rootScope.loading = true;
  
  $scope.$on('oauth:login', function(event, token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token.access_token;
      console.log(token.access_token);
  });

  // base url
  var basePosts = Restangular.all('tchats');
    $scope.cookiename = $cookies.get('username');
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
      post.User = $cookies.get('iduser');
      post.put();
      $scope.post = false;
    })
  }

  $scope.newArticle = function(){
    $scope.post = false; // new article
    $timeout(callAtTimeout, 1000);
  }

  $scope.newPost = function(){
    $scope.new.User = $cookies.get('iduser');
    basePosts.post($scope.new) // persister en bdd  
    $rootScope.loading = true;
    $timeout(callAtTimeout, 1000);
  }

  function callAtTimeout() {
   basePosts.getList().then(function(posts) {
        $scope.posts = posts;
        $rootScope.loading = false;
        $scope.new.content = null;
    });
  }

  $scope.refreshTchat = function(){
    $timeout(callAtInterval, 100);
    angular.element('#refreshIcon').css('animation', 'refreshMove 1s');
    $timeout(resetRefreshicon, 1000);
  }

  function resetRefreshicon(){
     angular.element('#refreshIcon').css('animation', '');
  }

   //$interval(callAtInterval, 2000);

    function callAtInterval() {
    basePosts.getList().then(function(posts) {
      if($scope.posts.length != posts.length){
        $scope.posts = posts;
      }
    });
  }

  $scope.deleteModalTchat = function(index, post){
    $scope.delpost = post;
    $scope.delpostindex = index;
  }

  $scope.deletePost = function(){
    delpost = $scope.delpost;
    delpostindex = $scope.delpostindex;

    delpost.remove(); // suppression en serveur
    //$scope.posts.splice(delpostindex, 1); // supppression en local html
    $rootScope.loading = true;
    $timeout(callAtTimeout, 1000);
    angular.element('#modaldelete').trigger('click');
  }


})
