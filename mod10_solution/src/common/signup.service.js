(function () {
  "use strict";

  angular.module("common").service("SignupService", SignupService);

  SignupService.$inject = ["$http", "$q"];
  function SignupService($http, $q) {
    var service = this;
    var savedUser = null; // in‑memory profile

    /* Save / retrieve profile ------------------------------------- */
    service.saveUser = function (userObj) {
      savedUser = userObj;
    };
    service.getUser = function () {
      return savedUser;
    };

    /* Check if a favourite code exists ---------------------------- */
    service.checkFavorite = function (shortName) {
      shortName = (shortName || "").trim();

      var m = shortName.match(/^([a-z]+)(\d+)$/i); // letters + digits
      if (!m) {
        return $q.reject(false);
      }

      var category = m[1].toUpperCase(); // e.g. L
      var index = parseInt(m[2], 10) - 1; // L1 → 0
      var url =
        "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/" +
        category +
        "/menu_items/" +
        index +
        ".json";

      return $http.get(url).then(function (resp) {
        if (resp.data) {
          /* remember which folder the image lives in (L, A, SP, …) */
          resp.data.categoryShortName = category; // ← NEW
          return resp.data;
        }
      });
    };
  }
})();
