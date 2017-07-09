app.directive('datepicker', function(){
	return{
		restrict : 'C', // sur une classe
		scope: {
			options : '=datepickerOptions' // modification d'attribut de datepicker datepicker-options => datepickerOptions le O est transformer en - ou _ ou : 
		},
		link : function(scope, element, attrs){
			$(element).pickadate(scope.options); //$(element) forcer a utiliser jquery => ça revient aux même avec element $('.datepicker').pickadate()
			// voir doc datepicker, ça revient a envoyer : $('.datepicker').pickadate({today: 'Aujourdhui'});
		}
	}
})