(function () {
  "use strict";

  // Create the AngularJS module named 'LunchCheck'
  angular
    .module("LunchCheck", [])
    .controller("LunchCheckController", LunchCheckController);

  // Protect the controller against minification by explicitly declaring dependencies
  LunchCheckController.$inject = ["$scope"];
  function LunchCheckController($scope) {
    // Initialize properties
    $scope.lunchItems = "";
    $scope.message = "";
    $scope.messageClass = "";

    // Function that checks the lunch items and sets the message and styling
    $scope.checkLunch = function () {
      // Check if input is empty or contains only spaces
      if (!$scope.lunchItems || $scope.lunchItems.trim() === "") {
        $scope.message = "Please enter data first";
        $scope.messageClass = "red";
        return;
      }

      // Split the input by commas and filter out empty items
      var items = $scope.lunchItems.split(",").filter(function (item) {
        return item.trim() !== "";
      });

      // Set the message based on the count of valid items
      if (items.length <= 3) {
        $scope.message = "Enjoy!";
        $scope.messageClass = "green";
      } else {
        $scope.message = "Too much!";
        $scope.messageClass = "green";
      }
    };
  }
})();
