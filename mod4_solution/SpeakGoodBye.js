(function (global) {
  // Create the byeSpeaker object.
  var byeSpeaker = {};

  // The greeting word for byeSpeaker.
  var speakWord = "Good Bye";

  // The 'speak' method prints the greeting to the console.
  byeSpeaker.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  // The 'speakSimple' method returns the greeting as a string.
  byeSpeaker.speakSimple = function (name) {
    return speakWord + " " + name;
  };

  // Expose byeSpeaker to the global scope.
  global.byeSpeaker = byeSpeaker;
})(window);
