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

 var assert = require('assert');

var linguist = (function() {

    /* sets minimum proficiency level (out of 100) for which any
     * percentage lower than this number results in a large dropoff
     * in comprehension.
     */
    var MIN_PROFICIENCY = 70;

    var PROFICIENCY_PENALTY = 10;
    var punctuation = '!@,.:;$';
    var possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /*
     * Contains metadata about a person's language comprehension.
     *
     * Assumption: If no skill parameter, assume 100% comprehension
     * for simple no-distortion communication.
     *
     * @param string language String name of the language. (e.g. 'english')
     * @param number skill Percentage of language proficiency. (0-100)
     * @return object New MetaData object.
     */
    function MetaData(language, skill) {
        this.language = language || 'english';
        if (skill === 0) {  // needed for javascript weirdness, non-zero values work fine in else branch
            this.skill = 0;
        }
        else {
            this.skill = skill || 100;
        }

        return this;
    }

    /**
     * Contains content and related metadata for a message container.
     *
     * @param string content String representation of the message.
     * @param string language String representation of language. (e.g. 'english') Optional.
     * @return object New Msg object.
     */
    function Msg(content, language) {
        this.content = content || '';
        this.language = language || 'english';

        return this;
    }

    /**
     * Private method to scramble random characters in a message.
     *
     * If a User's proficiency is below MIN_PROFICIENCY, the
     * drop-off in comprehension is much larger due to the
     * value of PROFICIENCY_PENALTY.
     *
     * TODO: improve the realism of this distortion to match
     * real-world loss of comprehension.
     *
     * @param string c A single text character.
     * @param number skillLevel 0-100 percentage of language proficiency.
     * @return string A single text character post-distortion.
     */
    var _distort = function(c, skillLevel) {
        var randomNumFrom100 = Math.random() * 100;

        // make sure constants are actually used
        assert.equal(true, MIN_PROFICIENCY !== undefined);
        assert.equal(true, PROFICIENCY_PENALTY !== undefined);

        if (skillLevel < MIN_PROFICIENCY) {
            skillLevel += PROFICIENCY_PENALTY;
        }

        if (punctuation.indexOf(c) == -1 && c !== ' ' && skillLevel < randomNumFrom100) {
            c = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return c;
    };

    /**
     * Private method to translate a message, quality based
     * on metadata.skill.
     *
     * @param object msg Msg object.
     * @param object metadata MetaData object.
     * @return object Msg object post-translation.
     */
    var _translate = function(msg, metadata) {
        if (msg.content.length > 0) {
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

    /**
     * Public method to send a msg at sender's proficiency
     * level in a language.
     *
     * @param string content String of the message being sent/received.
     * @param object/string metadata MetaData object or language string. (e.g. 'english') Optional.
     * @return object Msg object.
     */
    var sendMsg = function(content, metadata) {
        if (typeof(metadata) === 'string' || metadata === undefined) {
            metadata = new MetaData(metadata, 0);
        }

        var newMsg = new Msg(content, metadata.language);
        return _translate(newMsg, metadata);
    };

    /**
     * Public method to receive a msg based on receiver's
     * proficiency level.
     *
     * @param string msg String of the message being sent/received.
     * @param array languages Array of language objects, representing User's language proficiencies.
     * @return object Msg object.
     */
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
