(function () {
	var app = angular.module('MyReddit', ['ionic', 'angularMoment'])
	app.controller('RedditCtrl', function($http, $scope){
		$scope.stories = [];
		
		//Get entries by parsing JSON returned from the Reddit site(Funny section) 
		function loadStories(params, callback){
			$http.get('https://www.reddit.com/r/funny/new/.json', {params: params})
			.success(function(response){
				var stories = [];
				angular.forEach(response.data.children, function(child){
					stories.push(child.data);
				});
				callback(stories);
			});
			
		}
		
		//Get Older entries
		$scope.loadOlderStories = function() {
			var params = {};
			if ($scope.stories.length > 0){
				params['after'] = $scope.stories[$scope.stories.length -1].name;
			}
			loadStories(params, function(olderStories) {
				$scope.stories = $scope.stories.concat(olderStories);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};
	
		// Get new entries
		$scope.loadNewStories = function() {
			var params = {'before': $scope.stories[0].name};
			loadStories(params, function(newerStories) {
				$scope.stories = newerStories.concat($scope.stories);
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
		
		$scope.openLink = function(url){
			window.open(url, '_blank');
		}
	});
	app.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}	
			if (window.cordova && window.cordova.InAppBrowser){
				window.open = window.cordova.InAppBrowser.open;
			}
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	});
}());
