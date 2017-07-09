app.service('editdonneService', function() {
  var productList;

  var addDonne = function(newObj) {
      productList = newObj;
  };

  var getDonnee = function(){
      return productList;
  };

  return {
    addDonne: addDonne,
    getDonnee: getDonnee
  };

});