/**
 * linguist.js, a module for multiplayer gaming communication.
 *
 * also see: user.js and test/tests_linguist.js
 *
 * This module allows a game developer to implement simple language
 * translation and communication.  A player can talk in a language
 * at x% proficiency and be understood at another player's
 * proficiency level in the same language.  Random distortion is
 * added to a message with lower degrees of proficiency on both the
 * sender and receiver ends, and incompatible languages being spoken
 * and heard will result in a completely incomprehensible message
 * being sent and received.
 * 
 * user.js is provided as an example of an interface using the public
 * sendMsg() and receiveMsg() methods of the module.
 *
 * mocha: mocha test/tests_linguist.js
 * istanbul: istanbul cover _mocha test/tests_linguist.js
 * 
 */

var linguist = (function() {

    /* sets minimum proficiency level (out of 100) for which any
     * percentage lower than this number results in a large dropoff
     * in comprehension.
     */
    var MIN_PROFICIENCY = 70;

    var PROFICIENCY_PENALTY = 10;
    var punctuation = '!@,.:;$';
    var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    // contains metadata about a person's language comprehension
    function MetaData(language, skill) {
        this.language = language || 'english';
        if (skill === 0) {
            this.skill = 0;
        }
        else {
            this.skill = skill || 100;
        }

        return this;
    }

    // contains content and related metadata for a message container
    function Msg(content, language) {
        this.content = content || '';
        this.language = language || 'english';

        return this;
    }

    // private method to scramble random characters in a message
    var _distort = function(c, skillLevel) {
        var randomNumFrom100 = Math.random() * 100;
        if (skillLevel < MIN_PROFICIENCY) {
            skillLevel += PROFICIENCY_PENALTY;
        }

        if (punctuation.indexOf(c) == -1 && c !== ' ' && skillLevel < randomNumFrom100) {
            c = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return c;
    };

    // private method to translate a message, quality based on metadata.skill
    var _translate = function(msg, metadata) {
        if (msg.content.length > 0) {
            var handicap = 0;
            var msgAsArr = msg.content.split('');

            for (var i=0; i<msgAsArr.length; i++) {
                msgAsArr[i] = _distort(msgAsArr[i], metadata.skill);
            }

            msg.content = msgAsArr.join('');
        }
        else {
            return false;
        }
        return msg;
    };

    // public method to send a msg at sender's proficiency level in a language
    var sendMsg = function(content, metadata) {
        if (typeof(metadata) === 'string' || metadata === undefined) {
            metadata = new MetaData(metadata, 0);
        }

        var newMsg = new Msg(content, metadata.language);
        return _translate(newMsg, metadata);
    };

    // public method to receive a msg based on receiver's proficiency level
    var receiveMsg = function(msg, languages) {
        if (msg.language in languages) {
            return _translate(msg, languages[msg.language]);
        }
        else {
            msg.language = 'unknown';
            return _translate(msg, {language: 'unknown', skill: 0});
        }
    };

    var getMinProficiency = function() {
        return MIN_PROFICIENCY;
    };

    var getProficiencyPenalty = function() {
        return PROFICIENCY_PENALTY;
    };

    return {  // public methods
        sendMsg: sendMsg,
        receiveMsg: receiveMsg,
        getNewMetaData: MetaData,
        getNewMsg: Msg,
        getMinProficiency: getMinProficiency,
        getProficiencyPenalty: getProficiencyPenalty
    };
})();

module.exports = linguist;
