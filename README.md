# linguist.js

linguist.js, a module for multiplayer gaming communication.

This module allows a game developer to implement simple language translation and communication.  A player can talk in a language at x% proficiency and be understood at another player's proficiency level in the same language.  Random distortion is added to a message with lower degrees of proficiency on both the sender and receiver ends, and incompatible languages being spoken and heard will result in a completely incomprehensible message being sent and received.

`user.js` is provided as an example of an interface using the public sendMsg() and receiveMsg() methods of the module.

`chat.js` is a quick and dirty script to print out some linguist.js interaction output.

## Tests

### Runner

mocha: `mocha test/tests_linguist.js`

### Code Coverage

istanbul: `istanbul cover _mocha test/tests_linguist.js`

## TODO

* more realistic _distort() method
* voice, volume, speaking vs. writing vs. digital?
* accents
* insert characteristics of various languages (Portuguese -ho, etc.)
