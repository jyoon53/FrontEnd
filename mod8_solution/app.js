(function () {
  "use strict";

  angular
    .module("NarrowItDownApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service("MenuSearchService", MenuSearchService)
    .directive("foundItems", FoundItemsDirective);

  // Controller definition with dependency injection protected
  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
    ctrl.searchTerm = "";
    ctrl.found = [];

    // Called when the user clicks the button
    ctrl.narrowDown = function () {
      // If searchTerm is empty, simply reset the found list.
      if (!ctrl.searchTerm.trim()) {
        ctrl.found = [];
        return;
      }

      // Get the matched items from the service and assign them to ctrl.found
      MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
        .then(function (foundItems) {
          ctrl.found = foundItems;
        })
        .catch(function (error) {
          console.error("Error fetching menu items:", error);
        });
    };

    // Remove an item from the found list based on its index
    ctrl.removeItem = function (index) {
      ctrl.found.splice(index, 1);
    };
  }

  // Service definition with dependency injection protected
  MenuSearchService.$inject = ["$http"];
  function MenuSearchService($http) {
    var service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json",
      }).then(function (response) {
        var foundItems = [];
        // Loop through each category (e.g., "A", "B", etc.) in the returned data
        angular.forEach(response.data, function (categoryObj) {
          // Check if the current object has a menu_items array
          if (
            categoryObj.menu_items &&
            angular.isArray(categoryObj.menu_items)
          ) {
            angular.forEach(categoryObj.menu_items, function (item) {
              if (
                item.description &&
                item.description
                  .toLowerCase()
                  .indexOf(searchTerm.toLowerCase()) !== -1
              ) {
                foundItems.push(item);
              }
            });
          }
        });
        return foundItems;
      });
    };
  }

  // Directive definition to display found items
  function FoundItemsDirective() {
    var ddo = {
      restrict: "E",
      scope: {
        found: "<", // One-way binding for the found items array
        onRemove: "&", // Function binding for removal action
      },
      template:
        "<ul>" +
        '<li ng-repeat="item in found track by $index">' +
        "{{ item.name }}, {{ item.short_name }}, {{ item.description }} " +
        '<button ng-click="onRemove({ index: $index })">Don\'t want this one!</button>' +
        "</li>" +
        "</ul>" +
        '<p ng-if="found && found.length === 0">Nothing found</p>',
    };
    return ddo;
  }
})();
