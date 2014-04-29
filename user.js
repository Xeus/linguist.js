var linguist = require('./linguist');

var User = function(languages, defaultLanguage) {
    this.languages = {};
    this.defaultLanguage = defaultLanguage || 'english';
    if (typeof(languages) === 'undefined') {
        languages = [];
    }
    if (languages.length > 0) {
        for (var i=0; i<languages.length; i++) {
            this.languages[languages[i].language] = {
                language: languages[i].language,
                skill: languages[i].skill
            };
        }
    }
    else {
        this.languages = {
            'english': {
                language: 'english',
                skill: 100
            }
        };
    }
};

/**
 * Interface to send a message from a User to linguist.js.
 *
 * @param string content A plain-text message.
 * @param string language Plain-text, lowercase name of desired spoken language.
 * @return object Msg Returns Msg object of content (the message) and language (language
 * it was spoken in.
 */
User.prototype.sendMsg = function(content, language) {
    if (content === '' || content === undefined) {
        return false;
    }

    /**
     * Order of operations for the second returned parameter: if the user
     * knows a language (it exists in User.languages), it is returned.
     * If not, the language parameter is passed along.  If no parameter
     * was passed, then it defaults to the default language within User.languages
     * for the User.  If that doesn't exist, then it just sends along
     * the User's defaultLanguage.
     */
    return linguist.sendMsg(content, this.languages[language] || language || this.languages[this.defaultLanguage] || this.defaultLanguage);
};

User.prototype.receiveMsg = function(msg) {
    return linguist.receiveMsg(msg, this.languages);
};

module.exports = User;
