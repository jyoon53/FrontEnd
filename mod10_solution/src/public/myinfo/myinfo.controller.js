(function () {
  "use strict";

  angular.module("public").controller("MyInfoController", MyInfoController);

  MyInfoController.$inject = ["SignupService"];
  function MyInfoController(SignupService) {
    var infoCtrl = this;
    infoCtrl.user = SignupService.getUser();
  }
})();
