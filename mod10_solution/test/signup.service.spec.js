(function () {
  "use strict";

  angular.module("common").service("SignupService", SignupService);

  SignupService.$inject = ["$http", "$q"];
  function SignupService($http, $q) {
    var savedUser = null;

    this.saveUser = function (u) {
      savedUser = angular.copy(u);
    };
    this.getUser = function () {
      return savedUser;
    };

    this.checkFavorite = function (shortName) {
      if (!shortName || shortName.length < 2) {
        return $q.reject(false);
      }

      var cat = shortName[0].toUpperCase(); // L1 → L
      var idx = parseInt(shortName.slice(1), 10) - 1; // 1 → 0
      if (isNaN(idx) || idx < 0) {
        return $q.reject(false);
      }

      var url =
        "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/" +
        cat +
        "/menu_items/" +
        idx +
        ".json";

      return $http.get(url).then(function (resp) {
        return resp.data ? resp.data : $q.reject(false);
      });
    };
  }
})();
