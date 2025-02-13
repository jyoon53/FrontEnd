(function (global) {
  // Create the helloSpeaker object.
  var helloSpeaker = {};

  // The greeting word for helloSpeaker.
  var speakWord = "Hello";

  // The 'speak' method prints the greeting to the console.
  helloSpeaker.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  // The 'speakSimple' method returns the greeting as a string.
  helloSpeaker.speakSimple = function (name) {
    return speakWord + " " + name;
  };

  // Expose helloSpeaker to the global scope.
  global.helloSpeaker = helloSpeaker;
})(window);
