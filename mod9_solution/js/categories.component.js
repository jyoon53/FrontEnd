(function () {
  "use strict";

  angular.module("MenuApp").component("categories", {
    bindings: { categories: "<" },
    templateUrl: "templates/categories.template.html",
  });
})();
