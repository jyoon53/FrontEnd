(function () {
  "use strict";

  // Create the AngularJS module "ShoppingListCheckOff" to match ng-app
  angular
    .module("ShoppingListCheckOff", [])
    .controller("ToBuyController", ToBuyController)
    .controller("AlreadyBoughtController", AlreadyBoughtController)
    .service("ShoppingListCheckOffService", ShoppingListCheckOffService)
    .filter("tripleDollarFilter", TripleDollarFilter);

  // Protect dependency injection for ToBuyController
  ToBuyController.$inject = ["ShoppingListCheckOffService"];
  function ToBuyController(ShoppingListCheckOffService) {
    var toBuy = this;
    // Expose the "to buy" items array from the service
    toBuy.items = ShoppingListCheckOffService.getToBuyItems();

    // When the user clicks the "Buy" button, move the item using the service
    toBuy.buyItem = function (itemIndex) {
      ShoppingListCheckOffService.buyItem(itemIndex);
    };
  }

  // Protect dependency injection for AlreadyBoughtController
  AlreadyBoughtController.$inject = ["ShoppingListCheckOffService"];
  function AlreadyBoughtController(ShoppingListCheckOffService) {
    var bought = this;
    // Expose the "already bought" items array from the service
    bought.items = ShoppingListCheckOffService.getBoughtItems();
  }

  // Service to share data between controllers
  function ShoppingListCheckOffService() {
    var service = this;

    // Pre-populated "to buy" list:
    // Each item has a name, an initial quantity, and a strictly numeric pricePerItem
    var toBuyItems = [
      { name: "cookies", quantity: 10, pricePerItem: 2 },
      { name: "chips", quantity: 5, pricePerItem: 1.5 },
      { name: "soda", quantity: 3, pricePerItem: 1.75 },
      { name: "apples", quantity: 7, pricePerItem: 0.5 },
      { name: "oranges", quantity: 8, pricePerItem: 0.8 },
    ];

    // Initially, the "already bought" list is empty
    var boughtItems = [];

    service.getToBuyItems = function () {
      return toBuyItems;
    };

    service.getBoughtItems = function () {
      return boughtItems;
    };

    // Move an item from the "to buy" list to the "already bought" list
    service.buyItem = function (itemIndex) {
      var item = toBuyItems[itemIndex];
      // Remove the item from the "to buy" list
      toBuyItems.splice(itemIndex, 1);
      // Add the item to the "already bought" list
      boughtItems.push(item);
    };
  }

  // Custom filter to format the total price with a triple dollar sign (e.g., $$$20.00)
  function TripleDollarFilter() {
    return function (input) {
      if (isNaN(input)) {
        return input;
      }
      return "$$$" + parseFloat(input).toFixed(2);
    };
  }
})();
