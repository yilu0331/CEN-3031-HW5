angular.module('listings').controller('ListingsController', ['$scope', '$location', '$stateParams', '$state', 'Listings',
  function($scope, $location, $stateParams, $state, Listings){
    $scope.find = function() {
      /* set loader*/
      $scope.loading = true;

      /* Get all the listings, then bind it to the scope */
      Listings.getAll().then(function(response) {
        $scope.loading = false; //remove loader
        $scope.listings = response.data;
      }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });
    };

    $scope.findOne = function() {
      debugger;
      $scope.loading = true;

      /*
        Take a look at 'list-listings.client.view', and find the ui-sref attribute that switches the state to the view
        for a single listing. Take note of how the state is switched:

          ui-sref="listings.view({ listingId: listing._id })"

        Passing in a parameter to the state allows us to access specific properties in the controller.

        Now take a look at 'view-listing.client.view'. The view is initialized by calling "findOne()".
        $stateParams holds all the parameters passed to the state, so we are able to access the id for the
        specific listing we want to find in order to display it to the user.
       */

      var id = $stateParams.listingId;

      Listings.read(id)
              .then(function(response) {
                $scope.listing = response.data;
                $scope.loading = false;
              }, function(error) {
                $scope.error = 'Unable to retrieve listing with id "' + id + '"\n' + error;
                $scope.loading = false;
              });
    };

    $scope.create = function(isValid) {
      $scope.error = null;

      /*
        Check that the form is valid. (https://github.com/paulyoder/angular-bootstrap-show-errors)
       */
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      /* Create the listing object */
      var listing = {
        name: $scope.name,
        code: $scope.code,
        address: $scope.address
      };

      /* Save the article using the Listings factory */
      Listings.create(listing)
              .then(function(response) {
                //if the object is successfully saved redirect back to the list page
                $state.go('listings.list', { successMessage: 'Listing succesfully created!' });
              }, function(error) {
                //otherwise display the error
                $scope.error = 'Unable to save listing!\n' + error;
              });
    };

    $scope.update = function(isValid) {

      /*
        Fill in this function that should update a listing if the form is valid. Once the update has
        successfully finished, navigate back to the 'listing.list' state using $state.go(). If an error
        occurs, pass it to $scope.error.
       */
       var idlisting = $stateParams.listingId;

       var listingschema = {
         name: $scope.name,
         code: $scope.code,
         address: $scope.address
       };

       Listings.update(idlisting, listingschema)
       .then(function(response) {
       $state.go('listings.list', { successMessage: 'Update listing success' });
       }, function(error) {
                 //otherwise display the error
       $scope.error = 'Update listing failed\n' + error;
       });

        };

    $scope.remove = function() {
      /*
        Implement the remove function. If the removal is successful, navigate back to 'listing.list'. Otherwise,
        display the error.
       */
       console.log("show");

       var id = $stateParams.listingId;
       Listings.delete(id)
      .then(function(response) {
       $state.go('listings.list',
       { successMessage: 'Listing removed' });
       }, function(error) {
             //otherwise display the error
       $scope.error = 'Remove listing failed\n' + error;
       });
    };

    /* Bind the success message to the scope if it exists as part of the current state */
    if($stateParams.successMessage) {
      $scope.success = $stateParams.successMessage;
    }

    $scope.marker = [];
    $scope.initMap = function(){

      Listings.getAll().then(function(response) {
        $scope.loading = false; //remove loader
       // console.log(response.data);

    response.data.forEach(function(listing){

      var markerItem = {
        "name" : listing.name,
        "code" : listing.code,
        "address":listing.address,
        "latitude": "",
        "longitude" : ""
      }

      markerItem["id"] = listing.code;

      if(listing.coordinates){
         markerItem.latitude = listing.coordinates.latitude;
         markerItem.longitude = listing.coordinates.longitude;
      }

      $scope.marker.push(markerItem);

    });

      }, function(error) {
        $scope.loading = false;
        $scope.error = 'Unable to retrieve listings!\n' + error;
      });

      

    };

    /* Map properties */
    $scope.map = {
        center: {
        latitude: 29.65163059999999,
        longitude: -82.3410518
      },
      zoom: 14
    }
  }
]);
