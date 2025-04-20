(function () {
  "use strict";

  angular.module("MenuApp").component("items", {
    bindings: { items: "<" },
    templateUrl: "templates/items.template.html",
  });
})();
