(function () {
  // Array of names.
  var names = [
    "Yaakov",
    "John",
    "Jen",
    "Jason",
    "Paul",
    "Frank",
    "Larry",
    "Paula",
    "Laura",
    "Jim",
  ];

  // === First Printout: Using a for loop and speak (which logs directly) ===
  for (var i = 0; i < names.length; i++) {
    var firstLetter = names[i].charAt(0).toLowerCase();
    if (firstLetter === "j") {
      byeSpeaker.speak(names[i]);
    } else {
      helloSpeaker.speak(names[i]);
    }
  }

  // === Second Printout: Using map and speakSimple (which returns the greeting string) ===
  function generateGreeting(name) {
    var firstLetter = name.charAt(0).toLowerCase();
    if (firstLetter === "j") {
      return byeSpeaker.speakSimple(name);
    } else {
      return helloSpeaker.speakSimple(name);
    }
  }

  // Map over the names array to get an array of greeting strings.
  var greetingsArray = names.map(generateGreeting);

  // Loop over the greetingsArray and print each greeting.
  greetingsArray.forEach(function (greeting) {
    console.log(greeting);
  });

  // === Third Printout (Bonus): Using reduce to separate greetings into hello and bye groups ===
  var greetingsByType = names.reduce(
    function (accumulator, name) {
      var firstLetter = name.charAt(0).toLowerCase();
      if (firstLetter === "j") {
        accumulator.bye.push(byeSpeaker.speakSimple(name));
      } else {
        accumulator.hello.push(helloSpeaker.speakSimple(name));
      }
      return accumulator;
    },
    { hello: [], bye: [] }
  );

  // Print all hello greetings.
  greetingsByType.hello.forEach(function (greeting) {
    console.log(greeting);
  });

  // Print all bye greetings.
  greetingsByType.bye.forEach(function (greeting) {
    console.log(greeting);
  });
})();
