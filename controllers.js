angular.module('HoTrade.controllers', ['ionic', 'ngCordova'])

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN CONTROLLER///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  .controller('LoginCtrl', function (Backand, $scope, $state, $rootScope, LoginService, $ionicPopup, $timeout, $ionicLoading) {
        var vm = this;

        function showLoading() {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
        }

        function timeoutLoading() {
          $timeout(function () {
            $ionicLoading.hide();});
        }

        function signin() {
          LoginService.signin(vm.email, vm.password)
            .then(function () {
              timeoutLoading();
              onLogin();
            }, function (error) {
              timeoutLoading();
              unsuccessfulLogin();
            })
        }

	// Allows a user to sign in as "Guest"
      function anonymousLogin() {
        LoginService.anonymousLogin();
        onLogin('Guest');
      }


      function onLogin(username) {
        $rootScope.$broadcast('authorized');
        $state.go('app.tabs.home');
        LoginService.getUsername()
          .then(function (response) {
            vm.username = username || response.data;
          })
      }

	  // Logout confirmation
      $scope.showConfirm = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Log Out',
            template: 'Are you sure you want to log out? ',
            buttons: [{ text: 'Cancel' },
            {text: '<b>Confirm</b>',type: 'button-assertive',
              onTap: function() {
                showLoading()
                LoginService.signout()
                  .then(function () {
                    clear();
                    $rootScope.$broadcast('logout');
                    $state.go('login', {reload: true});
                    vm.username = '';
                    timeoutLoading();
                    successfulSignout();
                  })
                }
              }]
            });
          };

      function signout() {
        $scope.showConfirm();
      }

      function unsuccessfulLogin() {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: '<p style=text-align:center;>Incorrect username or password.</p>'
        });
      }

      function successfulSignout() {
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: '<p style=text-align:center;>Successfully logged out!</p>'
          });
        }

      function socialSignin(provider) {
        LoginService.socialSignin(provider)
          .then(onValidLogin, onErrorInLogin);

      }

      function socialSignup(provider) {
        LoginService.socialSignup(provider)
          .then(onValidLogin, onErrorInLogin);

      }

      var onValidLogin = function (response) {
        onLogin();
        vm.username = response.data || vm.username;
      };

      var onErrorInLogin = function (rejection) {
        vm.error = rejection.data;
        $rootScope.$broadcast('logout');

      };

      function clear() {
         window.localStorage.clear();
       }

      vm.username = '';
      vm.error = '';
      vm.signin = signin;
      vm.signout = signout;
      vm.anonymousLogin = anonymousLogin;
      vm.socialSignup = socialSignup;
      vm.socialSignin = socialSignin;
    })

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGN UP CONTROLLER/////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService, $ionicPopup, $timeout, $ionicLoading) {
        var vm = this;
        vm.signup = signUp;

        function showLoading() {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
        }

        function timeoutLoading() {
          $timeout(function () {
            $ionicLoading.hide();});
        }


        function signUp() {
        vm.errorMessage = '';

        LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
          .then(function (response) {
            // success
            onLogin();
            successfulSignup();
          }, function (reason) {
            if (reason.data.error_description !== undefined) {
              vm.errorMessage = reason.data.error_description;
              unsuccessfulSignup();
            }
            else {
              vm.errorMessage = reason.data;
              unsuccessfulSignup();
            }
        });
      }

        function onLogin() {
          $rootScope.$broadcast('authorized');
          $state.go('app.tabs.home');
        }

        function successfulSignup() {
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'Successfully signed up!'
          });
        }

        function unsuccessfulSignup() {
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: 'Unable to sign up, please check the details provided.'
          });
        }

      vm.email = '';
      vm.password = '';
      vm.again = '';
      vm.firstName = '';
      vm.lastName = '';
      vm.errorMessage = '';

    })

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// USER CONTROLLER////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  .controller('UserCtrl', function (Backand, UsersModel, $rootScope, $state, $scope, $timeout, $ionicPopup, $ionicActionSheet, $ionicLoading){
      var user = this;
	  user.userDetails = JSON.parse(window.localStorage.getItem("userDetails"));
	  user.username = '';
	  user.name = '';
	  user.role = '';

	  function getUserInfo(){
		Backand.user.getUserDetails()
		  .then(function(result){
		  user.name = result.data.fullName;
		  user.role = result.data.role;
		  user.username = result.data.username;
		});
	  }
	  getUserInfo();
    })

////////////////////////////////////////////////////////////////////////////////
//////////////////////MISC. CONTROLLERS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Home Page Controller
  .controller('HomeTabCtrl', function($scope, $ionicSideMenuDelegate) {
      $scope.openMenu = function() {
    		$ionicSideMenuDelegate.toggleRight();
    	};
    })
	
// Help Page Controller
  .controller('HelpCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state) {
      $scope.goBack = function() {
         $state.go('app.tabs.home');
      };
    })

// About Us Page Controller
  .controller('AboutCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory, $state) {
      $scope.goBack = function() {
         $state.go('app.tabs.home');
      };
    })

// Bottom Tabs Controller
  .controller('TabsController', function($scope, $ionicSideMenuDelegate) {
      	$scope.openMenu = function() {
      		$ionicSideMenuDelegate.toggleRight();
      	};
    })

// Contact Us Page Controller
  .controller('ContactCtrl', function(Backand, $scope, $http, $stateParams, $state, $ionicPopup, $timeout, $ionicLoading) {
        $scope.contact = {};

        $scope.goBack = function() {
           $state.go('app.tabs.home');
        };

        function successfulSent() {
            var alertPopup = $ionicPopup.alert({
              title: 'Success',
              template: '<p style=text-align:center;>Message sent!</p>'
            });
          }

          function timeoutLoading() {
            $timeout(function () {
              $ionicLoading.hide();});
          }

        $scope.sendEmail = function(){
          return Backand.object.action.get("users", "sendEmail", {
            "name": $scope.contact.name,
            "email": $scope.contact.email,
            "phone": $scope.contact.phone,
            "comment": $scope.contact.comment
          }).then(function(){
            timeoutLoading();
            successfulSent();
            $state.go('app.tabs.home');
          })
        }
    })
	  
////////////////////////////////////////////////////////////////////////////////
////////////////////// MAP CONTROLLER////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  .controller('MapCtrl', function(Backand, $scope, $state, $cordovaGeolocation, $ionicHistory, $http, $ionicPopup, $parse) {
    $scope.data = {};
    $scope.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Wait for splash screen then load Google map
	$scope.$on('$ionicView.loaded', function() {
		 
	  ionic.Platform.ready( function() {
		if(navigator && navigator.splashscreen){
		  navigator.splashscreen.hide();
		}
	  });

	  $scope.$on( "$ionicView.enter", function() {
		google.maps.event.trigger($scope.map, 'resize');
	  });

	  // Displays map legend
	  $scope.showMapLegend = function(){
		var alertPopup = $ionicPopup.alert({
		  title: 'Legend',
		  template: '<p><span style="color:#0000FF;">Buyers market:</span> More supply than demand.</p> <p><span style="color:#006400;">Sellers market:</span> More demand than supply.</p> <p><span style="color:#FFD700;">Neutral market:</span> Balanced supply and demand.</p>'
		});
	  }

	  // Allows the user to filter map results based on month and year
      $scope.showMapFilter = function(){
        var myPopup = $ionicPopup.show({
          title: 'Filter',
          template: 'Search From<br><input type="month" ng-model="data.filterDate" min="1995-12-01"></input><br>',
          subTitle: 'Refine search result..',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Apply</b>',
              type: 'button-positive',
              onTap: function(e) {
                  $scope.year = $scope.data.filterDate.getFullYear();
                  $scope.month = $scope.monthNames[$scope.data.filterDate.getMonth()];
                  initMap();
              }
            },
          ]
        });
        myPopup.then(function(res) {
          console.log($scope.year, $scope.month);
        });
       };

      $ionicHistory.clearCache();
      $scope.infoWindow = new google.maps.InfoWindow();
      var date = new Date();
      $scope.year = "2016";
	  //$scope.year = date.getFullYear();  Will be used when data for 2017 is added to the database.
      $scope.month = $scope.monthNames[date.getMonth()];
      initMap();
    });

    // Function draws GTA map and handles events when we do not have location enabled
	function initMap(){
      var options = {timeout: 10000, enableHighAccuracy: true};
      var latLng = new google.maps.LatLng(43.5681, -79.7648);
      var mapOptions = {
          center: latLng,
          zoom: 9,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles:                             // Plain Map
            [
              {"featureType": "administrative.locality","elementType": "geometry","stylers": [{"visibility": "off"}]},
              {"featureType": "poi","stylers": [{"visibility": "off"}]},
              {"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},
              {"featureType": "road","elementType": "labels.icon","stylers": [{"visibility": "off"}]},
              {"featureType": "road","elementType": "labels.icon","stylers": [{"visibility": "off"}]},
            ]
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, $scope.map, $scope.infoWindow);

        centerControlDiv.index = 1;
        $scope.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

        google.maps.event.trigger($scope.map, 'resize' );
        loadRegionalData();
    }

    // Function draws zoomed-in map and handles events when we have location enabled. Map style is changed to dark.
    $scope.initMapWithLocation = function(polygons){
      var options = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles:                    // Map with Dark Background
            [
              {"elementType": "geometry","stylers": [{"color": "#242f3e"}]},
              {"elementType": "labels.text.fill","stylers": [{"color": "#746855"}]},
              {"elementType": "labels.text.stroke","stylers": [{"color": "#242f3e"}]},
              {"featureType": "administrative.locality","elementType": "geometry","stylers": [{"visibility": "off"}]},
              {"featureType": 'poi.park',elementType: 'geometry',stylers: [{color: '#263c3f'}]},
              {"featureType": 'road',elementType: 'geometry',stylers: [{color: '#38414e'}]},
              {"featureType": 'road',elementType: 'geometry.stroke',stylers: [{color: '#212a37'}]},
              {"featureType": 'road',elementType: 'labels.text.fill',stylers: [{color: '#9ca5b3'}]},
              {"featureType": 'road.highway',elementType: 'geometry',stylers: [{color: '#746855'}]},
              {"featureType": 'road.highway',elementType: 'geometry.stroke',stylers: [{color: '#1f2835'}]},
              {"featureType": "water","elementType": "geometry","stylers": [{"color": "#17263c"}]},
              {"featureType": "water","elementType": "labels.text","stylers": [{"visibility": "off"}]},
              {"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#515c6d"}]},
              {"featureType": "water","elementType": "labels.text.stroke","stylers": [{"color": "#17263c"}]}
            ]
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        // Add marker to map
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          loadMarker(latLng);
        });
     },
         // For when location is disabled
        function(error){
          alert("Location cannot be found. Change App permissions.");
        });
    }

////////////////////////////////////////////////////////////////////////////////
////////////////////// HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Uses the load data function to access the database, retrieve coordinates for given municipality, draw them on the map and add listeners that display information about the municipality 
  function loadMunicipalityData(){
    var i;
    $scope.municipalities = ["Mississauga", "Caledon", "Brampton", "Vaughan", "Ajax", "Clarington", "Oshawa", "Pickering", "Uxbridge", "Whitby", "Burlington", "Oakville", "Milton",
    "Aurora", "Georgina", "Markham", "Newmarket", "King", "Scugog", "Etobicoke", "Scarborough", "TorontoYork"];

    for(i = 0; i < $scope.municipalities.length; i++){
      loadData($scope.municipalities[i]);
    }
    loadHaltonHillsData();
    loadNewTecumsethData();
    loadRichmondHillData();
    loadEastGwillimburyData();
    loadWhitchurchStouffvilleData();
    loadNorthYorkData();
    loadEastYorkData();
    $scope.loadMunicipality = true;
  }

// Uses the load data function to access the database, retrieve coordinates for given region, draw them on the map and add listeners that display information about the region 
  function loadRegionalData(){
    var i;
    $scope.regions = ["Peel", "Durham", "York", "Toronto", "Halton"];

    for(i = 0; i < $scope.regions.length; i++){
      loadRegionData($scope.regions[i]);
    }
    $scope.loadRegion = true;
  }

// Uses the load data function to access the database, retrieve coordinates for given community, draw them on the map and add listeners that display information about the community
  function loadCommunityData(){
    var i;
    $scope.community = ["Milliken", "Steeles", "Malvern", "Hillcrest", "Rouge"];

    for(i = 0; i < $scope.community.length; i++){
      loadData($scope.community[i]);
    }
    $scope.loadCommunity = true;
  }
  
// Displays marker at a given location
  function loadMarker(markerPosition){
    var marker = new google.maps.Marker({
		map: $scope.map,
		animation: google.maps.Animation.DROP,
		position: markerPosition
	});
	
	showLocation(marker, markerPosition);
   }

// Returns current user location
  function showLocation(marker, markerPosition){
    var geocoder = new google.maps.Geocoder;
	geocoder.geocode({'latLng': markerPosition}, function(results, status){
	  if(status == google.maps.GeocoderStatus.OK){
		var location = results[0].formatted_address;
		//  var location = '<p><span class="buyers">Buyers Mkt:</span> or password.</p> <p><span class="sellers">Sellers Mkt:</span> or password.</p> ';
		addInfoWindow(marker, location);
	  }
	});
   }

 // Adds data to infowindow displayed on marker location
  function addInfoWindow(marker, location) {
	var infoWindow = new google.maps.InfoWindow({
		content: location
	});
	google.maps.event.addListener(marker, 'click', function () {
		infoWindow.open(map, marker);
	});
  }

 // Gets "Townhouse" data from database on infowindow click
  function getMapData(evt, name, propertyType, type){
      $scope.infoWindow.close();
      $scope.infoWindow.setPosition(evt.latLng);

      if (type == "Region"){
        var avgPriceArr = [];
        var snlrArr = [];
        var moiArr = [];
        var domArr = [];
        var splpArr = [];
        var avgPrice = "";
        var snlr = "";
        var moi = "";
        var dom = "";
        var splp = "";
        return Backand.query.post("getAvgData", {
          "Year": $scope.year,
          "Month": $scope.month,
          "Region": name,
          "PropertyType": "Townhouse"
        }).then(function(result){

          if (result.data.length > 0){
            for(var i = 0; i < result.data.length; i++){
               avgPriceArr.push(result.data[i].AvgPrice);
               snlrArr.push(result.data[i].SNLR);
               moiArr.push(result.data[i].MOI);
               domArr.push(result.data[i].DOM);
               splpArr.push(result.data[i].SPLP);
             }
             snlr = calculateAvgValue(snlrArr) + "%";
             dom = calculateAvgValue(domArr);
             moi = calculateAvgValue(moiArr);
             splp = calculateAvgValue(splpArr) + "%";
             avgPrice = "$" + calculateAvgPrice(avgPriceArr);
          }else{
             snlr = "N/A";
             avgPrice = "N/A";
             moi = "N/A";
             dom = "N/A";
             splp = "N/A";
           }
          outputData(name, avgPrice, snlr, moi, dom, splp, "Region");
        });
      }

      if (type == "City"){
        var avgPrice = "";
        var snlr = "";
        var moi = "";
        var dom = "";
        var splp = "";
        return Backand.query.post("getData", {
          "Year": $scope.year,
          "Month": $scope.month,
          "Municipality": name,
          "PropertyType": "Townhouse"
        }).then(function(result){
           if (result.data.length > 0){
             avgPrice = result.data[0].AvgPrice;
             snlr = result.data[0].SNLR;
             moi = result.data[0].MOI;
             dom = result.data[0].DOM;
             splp = result.data[0].SPLP;
           }else{
             avgPrice = "N/A";
             snlr = "N/A";
             moi = "N/A";
             dom = "N/A";
             splp = "N/A";
           }
          outputData(name, avgPrice, snlr, moi, dom, splp, "City");
        });
      }

    }

 // Outputs data to infowindow based on property type selected
  function outputData(cityname, avgPrice, snlr, moi, dom, splp, type){
       var content =
       "<div style='clear: both'>" +
       '<h1 id="firstHeading" class="infoBoxHeaderLeft">' + cityname + '</h1>'+ '<h5 class="infoBoxHeaderRight">' + $scope.month + '</h5>'+ '<h5 class="infoBoxHeaderRight">' + $scope.year + '</h5>'+
       '<div id="bodyContent">'+
       '<p><b>Average Price: </b>' + avgPrice + '</p>' +
       '<p><b>Average Days on Market: </b>' + dom + '</p>' +
       '<p><b>Average Sales/List Price: </b>' + splp + '</p>' +
       '<p><b>Months of Inventory: </b>' + moi  + '</p>' +
       '<p><b>Sales to new listings ratio: </b>' + snlr + '</p>' +

       '<div class="infowindowtab">' +
       "<button class='tablinks' id='towns'" + '<p>Town</p></button>' +
       "<button class='tablinks' id='condoApt'"  + '<p>Condo</p>' +
       "<button class='tablinks' id='semi'"  + '<p>Semi</p></button>' +
       "<button class='tablinks' id='condoTown'" + '<p>CondoTown</p></button>' +
       "<button class='tablinks' id='detached'" + '<p>Det</p></button>' + '</div>';

       $scope.infoWindow.setContent(content);
       $scope.infoWindow.open($scope.map);

      document.getElementById("condoApt").addEventListener("click", function(){
         openProperty(cityname, 'Condo Apt', type);
       });

       document.getElementById("semi").addEventListener("click", function(){
         openProperty(cityname,'Semi-Detached', type);
       });

       document.getElementById("condoTown").addEventListener("click", function(){
         openProperty(cityname, 'Condo Town', type);
       });

       document.getElementById("towns").addEventListener("click", function(){
         openProperty(cityname, 'Townhouse', type);
       });

       document.getElementById("detached").addEventListener("click", function(){
         openProperty(cityname, 'Detached', type);
       });
     }

 // Gets input Property Type data from database on infowindow click
  function openProperty(name, propertyType, type){
    if (type == "Region"){
      var avgPriceArr = [];
      var snlrArr = [];
      var moiArr = [];
      var domArr = [];
      var splpArr = [];
      var avgPrice = "";
      var snlr = "";
      var moi = "";
      var dom = "";
      var splp = "";
      return Backand.query.post("getAvgData", {
        "Year": $scope.year,
        "Month": $scope.month,
        "Region": name,
        "PropertyType": propertyType
      }).then(function(result){
        if (result.data.length > 0){
          for(var i = 0; i < result.data.length; i++){
             avgPriceArr.push(result.data[i].AvgPrice);
             snlrArr.push(result.data[i].SNLR);
             moiArr.push(result.data[i].MOI);
             domArr.push(result.data[i].DOM);
             splpArr.push(result.data[i].SPLP);
           }
           snlr = calculateAvgValue(snlrArr) + "%";
           dom = calculateAvgValue(domArr);
           moi = calculateAvgValue(moiArr);
           splp = calculateAvgValue(splpArr) + "%";
           avgPrice = "$" + calculateAvgPrice(avgPriceArr);
        }else{
           snlr = "N/A";
           avgPrice = "N/A";
           moi = "N/A";
           dom = "N/A";
           splp = "N/A";
         }
        outputData(name, avgPrice, snlr, moi, dom, splp, "Region");
      });
    }

    if (type == "City"){
      var avgPrice = "";
      var snlr = "";
      var moi = "";
      var dom = "";
      var splp = "";
      return Backand.query.post("getData", {
        "Year": $scope.year,
        "Month": $scope.month,
        "Municipality": name,
        "PropertyType": propertyType
      }).then(function(result){
         if (result.data.length > 0){
           avgPrice = result.data[0].AvgPrice;
           snlr = result.data[0].SNLR;
           moi = result.data[0].MOI;
           dom = result.data[0].DOM;
           splp = result.data[0].SPLP;
         }else{
           avgPrice = "N/A";
           snlr = "N/A";
           moi = "N/A";
           dom = "N/A";
           splp = "N/A";
         }
        outputData(name, avgPrice, snlr, moi, dom, splp, "City");
      });
    }
  }

 // Calculates average SNLR value for all properties in a given region
  function calculateAverageSNLR(s_nlr){
    var colour = "";
    var averageSNLR = 0;

    averageSNLR = calculateAvgValue(s_nlr);
    if (averageSNLR != 0){
      if (averageSNLR > 50){
        colour = '#32CD32'; // Green (Sellers Market)
      }else if (averageSNLR < 50){
        colour = '#0000CD'; // Blue (Buyers Market)
      }else if (averageSNLR == 50){
        colour = '#FFD700'; // Yellow (Balanced Market)
      }
    }else{
      colour = '#FFD700';
    }
      return colour;
  }

 // Calculates average value for all properties in the region
  function calculateAvgValue(snlr){
    var colour = "";
    var getSnlr = 0;
    var countSNLR = 0;
    var count = 0;

    var otherThanNull = snlr.every(checkNull);

    if (otherThanNull){
      for (var j = 0; j < snlr.length; j++){
        if (snlr[j] != null){
           countSNLR =  parseInt(snlr[j].substring(0,4));
           getSnlr += countSNLR;
           count++;
        }
      }
      var averageSNLR = getSnlr/count;
    }else{
      averageSNLR = 0;
    }
      return averageSNLR.toFixed(0);
  }

 // Calculates average price for all properties in the region
  function calculateAvgPrice(arr){
    var colour = "";
    var getSnlr = 0;
    var countSNLR = 0;
    var count = 0;

    var otherThanNull = arr.every(checkNull);

    if (otherThanNull){
      for (var j = 0; j < arr.length; j++){
        if (arr[j] != null){
           countSNLR =  parseFloat(arr[j].replace(/,/g, '').substring(1,7));
           getSnlr += countSNLR;
           count++;
        }
      }
      var averagePrice = getSnlr/count;
    }else{
      averagePrice = 0;
    }
      return averagePrice.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

 //Get coordinates from databased and create new google map latlng object
  function parsePoints(coordinates){
    var points = [];
    for (var i = 0; i < coordinates.length; i++){
      var splitter = coordinates[i].split(" ");
      var lat = splitter[0];
      var lng = splitter[1];
      points.push(new google.maps.LatLng(lat,lng));
    }
    return points;
  }
  
 // Create polygon using google map latlng
  function createPolygon(points, colour){
    var poly = new google.maps.Polygon({
      paths: points,
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: colour,
      fillOpacity: 0.35
    });
    return poly;
  }

  function checkNull(snlr){
    return snlr !== null;
 }

/*
SELECT DISTINCT r.regionName, r.coordinates, d.SNLR
FROM region as r
INNER JOIN DataBank as d
ON r.cityName = '{{region}}' AND d.Month = '{{month}}' AND d.Year = '{{year}}' AND d.region = '{{region}}'
GROUP BY r.regionName, r.coordinates, d.SNLR;
*/

////////////////////////////////////////////////////////////////////////////////
////////////////////// Load Data Function Definition ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  function loadData(name){
      var cityName = "";
      var s_nlr = [];
      var countPoints = "";

      return Backand.query.post("getMapInfo", {
        "name": name,
        "month": $scope.month,
        "year": $scope.year
      }).then(function (result){
        for(var i = 0; i < result.data.length; i++){
          if (result.data[i].cityName == name){
            cityName = result.data[i].cityName;
            countPoints = result.data[i].coordinates.split(",");
            s_nlr.push(result.data[i].SNLR);
          }
        }
        var colour = calculateAverageSNLR(s_nlr);
        var points = parsePoints(countPoints);
        var poly = createPolygon(points, colour);
        var model = $parse(name);

        model.assign($scope, poly);
        $scope[name] = poly;
        $scope[name].setMap($scope.map);
        $scope[name].addListener('click', function(evt){
          getMapData(evt, cityName, "Townhouse", "City");
        });
    });
  }

  function loadRegionData(name){
      var regionName = "";
      var s_nlr = [];
      var countPoints = "";

      return Backand.query.post("getRegionInfo", {
        "month": $scope.month,
        "year": $scope.year,
        "region": name
      }).then(function (result){
        for(var i = 0; i < result.data.length; i++){
          if (result.data[i].cityName == name){
            regionName = result.data[i].cityName;
            countPoints = result.data[i].coordinates.split(",");
            s_nlr.push(result.data[i].SNLR);
          }
        }
        var colour = calculateAverageSNLR(s_nlr);
        var points = parsePoints(countPoints);
        var poly = createPolygon(points, colour);
        var model = $parse(name);

        model.assign($scope, poly);
        $scope[name] = poly;
        $scope[name].setMap($scope.map);
        $scope[name].addListener('click', function(evt){
          getMapData(evt, regionName, "Townhouse", "Region");
        });
    });
  }

  function loadHaltonHillsData(){
    var cityName = "";
    var s_nlr = [];
    var countPoints = "";

    return Backand.query.post("getMapInfo", {
      "name": "Halton Hills",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "Halton Hills"){
          cityName = result.data[i].cityName;
          countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.haltonHillsCity= createPolygon(points, colour);
      $scope.haltonHillsCity.setMap($scope.map);
      $scope.haltonHillsCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadRichmondHillData(){
    var cityName = "";
    var s_nlr =[];

    return Backand.query.post("getMapInfo", {
      "name": "Richmond Hill",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "Richmond Hill"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }

      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.richmondHillCity = createPolygon(points, colour);
      $scope.richmondHillCity.setMap($scope.map);
      $scope.richmondHillCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadWhitchurchStouffvilleData(){
    var cityName = "";
    var s_nlr = [];

    return Backand.query.post("getMapInfo", {
      "name": "Whitchurch-Stouffville",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "Whitchurch-Stouffville"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.whitchurchStouffvilleCity = createPolygon(points, colour);
      $scope.whitchurchStouffvilleCity.setMap($scope.map);
      $scope.whitchurchStouffvilleCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadNorthYorkData(){
    var cityName = "";
    var s_nlr = [];

    return Backand.query.post("getMapInfo", {
      "name": "North York",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "North York"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.northYorkCity= createPolygon(points, colour);
      $scope.northYorkCity.setMap($scope.map);
      $scope.northYorkCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadEastYorkData(){
    var cityName = "";
    var s_nlr = [];
    return Backand.query.post("getMapInfo", {
      "name": "East York",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "East York"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.eastYorkCity= createPolygon(points, colour);
      $scope.eastYorkCity.setMap($scope.map);
      $scope.eastYorkCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadNewTecumsethData(){
    var cityName = "";
    var s_nlr = [];

    return Backand.query.post("getMapInfo", {
      "name": "New Tecumseth",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "New Tecumseth"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.newTCity= createPolygon(points, colour);
      $scope.newTCity.setMap($scope.map);
      $scope.newTCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

  function loadEastGwillimburyData(){
    var cityName = "";
    var s_nlr = [];
    return Backand.query.post("getMapInfo", {
      "name": "East Gwillimbury",
      "month": $scope.month,
      "year": $scope.year
    }).then(function (result){
      for(var i = 0; i < result.data.length; i++){
        if (result.data[i].cityName == "East Gwillimbury"){
          cityName = result.data[i].cityName;
          var countPoints = result.data[i].coordinates.split(",");
          s_nlr.push(result.data[i].SNLR);
        }
      }
      var colour = calculateAverageSNLR(s_nlr);
      var points = parsePoints(countPoints);
      $scope.eastGwilCity= createPolygon(points, colour);
      $scope.eastGwilCity.setMap($scope.map);
      $scope.eastGwilCity.addListener('click', function(evt){
      getMapData(evt, cityName, "Townhouse", "City");
      });
    });
  }

////////////////////////////////////////////////////////////////////////////////
////////////////////// MAP-SPECIFIC HELPER FUNCTIONS ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    function CenterControl(controlDiv, map, infoWindow) {
       var control = this;
       controlDiv.style.clear = 'both';

       var region = document.createElement('div');
       region.id = 'mapViewRegionButton';
       region.title = 'Display region data';
       controlDiv.appendChild(region);
       var regionText = document.createElement('div');
       regionText.id = 'mapRegionMunicipalityCommnunityText';
       regionText.innerHTML = 'Region';
       region.appendChild(regionText);

       var municipality = document.createElement('div');
       municipality.id = 'mapViewMunicipalityButton';
       municipality.title = 'Display municipality data';
       controlDiv.appendChild(municipality);
       var municipalityText = document.createElement('div');
       municipalityText.id = 'mapRegionMunicipalityCommnunityText';
       municipalityText.innerHTML = 'Municipality';
       municipality.appendChild(municipalityText);

       var community = document.createElement('div');
       community.id = 'mapViewCommunityButton';
       community.title = 'Display Community data';
       controlDiv.appendChild(community);
       var communityText = document.createElement('div');
       communityText.id = 'mapRegionMunicipalityCommnunityText';
       communityText.innerHTML = 'Community';
       community.appendChild(communityText);


       region.addEventListener('click', function() {
         if ($scope.loadMunicipality){
            clearMap("municipality");
         }

         if ($scope.loadCommunity){
            clearMap("community");
         }

         if (!$scope.loadRegion){
           $scope.map.setZoom(9);
           loadRegionalData();
         }
       });

       municipality.addEventListener('click', function() {
         if ($scope.loadRegion){
          clearMap("region");
         }

         if ($scope.loadCommunity){
          clearMap("community");
         }

         if (!$scope.loadMunicipality){
           $scope.map.setZoom(10);
           loadMunicipalityData();
         }
       });

       community.addEventListener('click', function() {
         if ($scope.loadRegion){
           clearMap("region");
         }

         if ($scope.loadMunicipality){
            clearMap("municipality");
         }

         if (!$scope.loadCommunity){
           $scope.map.setZoom(11);
           loadCommunityData();
         }
       });
      }

    function clearMap(type){
      var i;
      $scope.infoWindow.close();

      if (type == "region"){
        for (i = 0; i < $scope.regions.length; i++){
          $scope[$scope.regions[i]].setMap(null);
        }
        $scope.loadRegion = false;
      }
      else if (type == "municipality"){
        for (i = 0; i < $scope.municipalities.length; i++){
          $scope[$scope.municipalities[i]].setMap(null);
        }
        $scope.newTCity.setMap(null);
        $scope.haltonHillsCity.setMap(null);
        $scope.eastGwilCity.setMap(null);
        $scope.richmondHillCity.setMap(null);
        $scope.whitchurchStouffvilleCity.setMap(null);
        $scope.northYorkCity.setMap(null);
        $scope.eastYorkCity.setMap(null);
        $scope.loadMunicipality = false;
      }
      else if (type == "community"){
        for (i = 0; i < $scope.community.length; i++){
          $scope[$scope.community[i]].setMap(null);
        }
        $scope.loadCommunity = false;
      }
    }


/************ Functions to Add Later ******************
    function enableMap(){
      $ionicLoading.hide();
    }

    function disableMap(){
      $ionicLoading.show({
        template: 'You must be connected to the Internet to view this map.'
      });
    }
*******************************************************/
});
