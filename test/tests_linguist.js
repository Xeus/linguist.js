var assert = require('assert');
var User = require('../user');
var linguist = require('../linguist');

describe('users', function() {
    it('should test a new User with languages specified', function() {
        var u = new User([{language: 'chinese', skill: 80}], 'english');
        var msg = u.sendMsg('hi');
        assert.equal('chinese', u.languages['chinese'].language);
        assert.equal('english', msg.language);
    });
    it('should test a new User with Chinese languages specified', function() {
        var u = new User([{language: 'chinese', skill: 80}], 'chinese');
        var msg = u.sendMsg('hi');
        assert.equal('chinese', u.languages['chinese'].language);
        assert.equal('chinese', msg.language);
    });
    it('should test a new User with no languages specified', function() {
        var u = new User();
        var msg = u.sendMsg('hi');
        assert.equal('english', u.languages['english'].language);
        assert.equal(100, u.languages['english'].skill);
        assert.equal('english', msg.language);
        assert.equal('hi', msg.content);
    });
    it('should test a new User with languages specified but no default', function() {
        var u = new User([{language: 'chinese', skill: 80}]);
        var msg = u.sendMsg('hi');
        assert.equal('chinese', u.languages['chinese'].language);
        assert.equal('english', msg.language);
    });
    it('should test a default language w/ no proficiency', function() {
        var u = new User([], 'english');
        var msg = u.sendMsg('hi');
        assert.equal('english', u.languages['english'].language);
        assert.equal(100, u.languages['english'].skill);
        assert.equal('english', msg.language);
        assert.equal('hi', msg.content);
    });
});

describe('msgs', function() {
    it('should be an empty message', function() {
        var msg1 = linguist.getNewMsg();
        assert.equal('', msg1.content);
        assert.equal('english', msg1.language);
    });
});

describe('metadata', function() {
    it('should create metadata from 1 parameter', function() {
        var m1 = linguist.getNewMetaData('greek');
        assert.equal('greek', m1.language);
        assert.equal(100, m1.skill);
    });

    it('should create metadata from 0 parameters', function() {
        var m2 = linguist.getNewMetaData();
        assert.equal('english', m2.language);
        assert.equal(100, m2.skill);
    });

    it('should create metadata from 2 parameters and test 0 as a skill value parameter', function() {
        var m3 = linguist.getNewMetaData('french', 0);
        assert.equal('french', m3.language);
        assert.equal(0, m3.skill); 
    });
});

describe('send', function() {
    it('should return false for an empty translated message', function() {
        assert.equal(false, linguist.sendMsg('', 'english'));
        assert.equal(false, linguist.sendMsg(''));
    });
    it('should send a message from a msg string', function() {
        var user1 = new User([{language: 'english', skill: 80}]);
        var msg = user1.sendMsg('cold day!');
        assert.equal('english', msg.language);
        assert.equal(9, msg.content.length);
        assert.equal(8, msg.content.indexOf('!'));
        assert.equal(4, msg.content.indexOf(' '));
    });
    it('should send a message from a msg string', function() {
        var user1 = new User([{language: 'english', skill: 80}, {language: 'french', skill: 70}]);
        var msg = user1.sendMsg('cold day!', 'french');
        assert.equal('french', msg.language);
        assert.equal(9, msg.content.length);
        assert.equal(8, msg.content.indexOf('!'));
        assert.equal(4, msg.content.indexOf(' '));
    });
    it('should send a message in a language unknown to the speaker', function() {
        var user1 = new User();
        var msg = user1.sendMsg('cold day!', 'german');
        assert.equal('german', msg.language);
    });
    it('should send a message with poor proficiency', function() {
        var user1 = new User([{language: 'english', skill: 72}]);
        var msg = user1.sendMsg('cold day!');
        assert.equal(false, user1.languages['english'].skill < linguist.getMinProficiency());
    });
    it('should send a message with failing proficiency', function() {
        var user1 = new User([{language: 'english', skill: 50}]);
        var msg = user1.sendMsg('cold day!');
        assert.equal(true, 10 === linguist.getProficiencyPenalty());
        assert.equal(true, user1.languages['english'].skill < linguist.getMinProficiency());
    });
    it('should ignore sending an empty message', function() {
        var user1 = new User();
        var msg = user1.sendMsg('');
        assert.equal(false, msg);
    });
});

describe('receive', function() {
    it('should receive a message', function() {
        var user1 = new User([{language: 'english', skill: 80}]);
        var user2 = new User([{language: 'english', skill: 70}]);
        var msg = user2.receiveMsg(user1.sendMsg('cold day!'));
        assert.equal('english', msg.language);
        assert.equal(9, msg.content.length);
        assert.equal(8, msg.content.indexOf('!'));
        assert.equal(4, msg.content.indexOf(' '));
    });
    it('should handle mismatching languages', function() {
        var user1 = new User([{language: 'english', skill: 80}]);
        var user2 = new User([{language: 'romanian', skill: 70}]);
        var msg = user2.receiveMsg(user1.sendMsg('cold day!'), user2.languages);
        assert.equal('unknown', msg.language);
        assert.equal(9, msg.content.length);
        assert.equal(8, msg.content.indexOf('!'));
        assert.equal(4, msg.content.indexOf(' '));
    });
});
