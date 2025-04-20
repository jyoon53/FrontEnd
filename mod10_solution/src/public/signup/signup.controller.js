(function () {
  "use strict";

  angular.module("public").controller("SignUpController", SignUpController);

  SignUpController.$inject = ["SignupService", "$state", "$timeout"];
  function SignUpController(SignupService, $state, $timeout) {
    var suCtrl = this;

    /*  Model bound to the form  */
    suCtrl.user = {
      first: "",
      last: "",
      email: "",
      phone: "",
      fav: "",
    };

    suCtrl.favoriteError = "";
    suCtrl.saved = false;

    /* ---------- live validation of the “Favourite” field ---------- */
    suCtrl.blurFav = function () {
      if (!suCtrl.user.fav) {
        // blank field ➜ clear message
        suCtrl.favoriteError = "";
        return;
      }

      SignupService.checkFavorite(suCtrl.user.fav)
        .then(function (item) {
          // valid code
          suCtrl.item = item;
          suCtrl.favoriteError = "";
        })
        .catch(function () {
          // invalid code
          suCtrl.item = null;
          suCtrl.favoriteError = "No such menu number exists";
        });
    };

    /* ---------------------- final submission ---------------------- */
    suCtrl.submit = function (form) {
      if (form.$invalid || suCtrl.favoriteError) {
        return;
      }

      SignupService.checkFavorite(suCtrl.user.fav)
        .then(function (item) {
          suCtrl.user.item = item; // attach full dish record
          SignupService.saveUser(angular.copy(suCtrl.user));
          suCtrl.saved = true;

          /* brief pause so user sees success banner */
          $timeout(function () {
            $state.go("public.myinfo");
          }, 300);
        })
        .catch(function () {
          suCtrl.favoriteError = "No such menu number exists";
        });
    };
  }
})();
