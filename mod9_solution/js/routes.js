(function () {
  "use strict";

  angular.module("MenuApp").config(RoutesConfig);

  RoutesConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
  function RoutesConfig($stateProvider, $urlRouterProvider) {
    // default route
    $urlRouterProvider.otherwise("/");

    $stateProvider

      // HOME ----------
      .state("home", {
        url: "/",
        templateUrl: "templates/home.template.html",
      })

      // CATEGORIES ----
      .state("categories", {
        url: "/categories",
        resolve: {
          categoriesData: [
            "MenuDataService",
            function (MenuDataService) {
              return MenuDataService.getAllCategories();
            },
          ],
        },
        template:
          '<categories categories="$resolve.categoriesData"></categories>',
      })

      // ITEMS ---------
      .state("items", {
        url: "/items/{shortName}",
        resolve: {
          itemsData: [
            "MenuDataService",
            "$stateParams",
            function (MenuDataService, $stateParams) {
              return MenuDataService.getItemsForCategory(
                $stateParams.shortName
              );
            },
          ],
        },
        template: '<items items="$resolve.itemsData"></items>',
      });
  }
})();
