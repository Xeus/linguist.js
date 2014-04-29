/*
 * Example script to see how linguist.js works.
 */

// var linguist = require('./linguist');
var User = require('./user');

var user1 = new User([{language: 'english', skill: 75}]);
var user2 = new User([{language: 'english', skill: 85}]);

var msg = user1.sendMsg('cold day!');
console.log('sent:');
console.log(msg);
console.log('received:');
console.log(user2.receiveMsg(msg));
console.log(user1.sendMsg('cold day!', 'romanian'));
console.log(user1.sendMsg('"hold on here\'s some quotation marks"'));
