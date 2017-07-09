var app = angular.module('myApp', ['restangular', 'ngResource','ngRoute','ngCookies']);
var now = new Date(),
    // this will set the expiration to 14 days
    exp = new Date(now.getFullYear(), now.getMonth(), now.getDate()+14);


app.controller('mainCtrl', 
  function($scope, $resource, $http, $httpParamSerializer, $cookies) {
     
    $scope.data = {
        grant_type:"password", 
        username: "", 
        password: "", 
    };

    $scope.encoded = btoa("3_126fg4qGSDGFqrg4r8q4g6rgQGqh4d9h8645d64fRDG8498dgf:7fd89gt4sh5sh4GSdefghsth46s4hrtQAEGqhgh89d8h948th4"); // client_id  :  client_secret

    $scope.login = function() {   
        var req = {
            method: 'POST',
            url: "http://localhost/SkearV2/server/web/app.php/oauth/v2/token",
            headers: {
                "Authorization": "Basic " + $scope.encoded,
                "Content-type": "application/x-www-form-urlencoded"
            },
            data: $httpParamSerializer($scope.data)
        }
        $http(req).then(function(data){
            $http.defaults.headers.common.Authorization = 
              'Bearer ' + data.data.access_token;
            $cookies.put("access_token", data.data.access_token,{
              expires: exp
            });
            $cookies.put("refresh_token", data.data.refresh_token,{
              expires: exp
            });
            $cookies.put("username", $scope.data.username,{
              expires: exp
            });
            window.location.href="application.html";
        });   
   }

   // gestion de la redirection
   var isLoginPage = window.location.href.indexOf("login") != -1;
    if(isLoginPage){
        if($cookies.get("access_token")){
            window.location.href = "application.html";
        }
    } else{
        if($cookies.get("access_token")){
            $http.defaults.headers.common.Authorization = 
              'Bearer ' + $cookies.get("access_token");
        } else{
            window.location.href = "login.html";
        }
    }    
});

// interception des requetes erreurs par le serveurs
app.service('authInterceptor', function($q) {
    var service = this;
    service.responseError = function(response) {
        if (response.status == 400){
            alert('Identifiant ou mot de passe incorrect');
        }
        return $q.reject(response);
    };
})
app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}])