app.service('authInterceptor', function($q, $cookies, $httpParamSerializer,$injector) {
    var service = this;

    if(!$cookies.get('access_token')){
      alert('accès interdit');
      window.location.href="login.html";
    }

    service.responseError = function(response) {
        if (response.status == 401){

            if($cookies.get('refresh_token')){
              var data = {
                  grant_type:"refresh_token", 
                  refresh_token: $cookies.get("refresh_token")
              };

              var encoded = btoa("2_1ya46vo8q3fo4oggow4wss488s8oo0488o0c0sgosco4csgssc:648gv48m6ccgwoos0s0wccw4gkg044oo848ckc0ko00sk84ggg");

              var req = {
                  method: 'POST',
                  url: "http://localhost/SkearV2/server/web/app_dev.php/oauth/v2/token",
                  headers: {
                      "Authorization": "Basic " + encoded,
                      "Content-type": "application/x-www-form-urlencoded"
                  },
                  data: $httpParamSerializer(data)
              }
              var $http = $injector.get('$http'); // permet utiliser le $http dans un service grace a injector, evite les pb de $injector:cdep, de boucle de module
              $http(req).then(function(data){
                  $http.defaults.headers.common.Authorization = 
                    'Bearer ' + data.data.access_token;
                  $cookies.put("access_token", data.data.access_token);
				          $cookies.put("refresh_token", data.data.refresh_token);
                  window.location.href="index.html";
              });   
            } else {
               alert('accès interdit');
               window.location.href="login.html";
            }

        }
        if(response.status == 500){
          //window.location.reload();
          //console.log('error 500');
          $route = $injector.get('$route'); // relancer les script du controller de la page sans reload toute la page
          $route.reload();
        }
        return $q.reject(response);
    };
})