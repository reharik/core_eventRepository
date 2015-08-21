/**
 * Created by reharik on 8/13/15.
 */

var extend = require('extend');
var eventRepository = require('./eventRepository');
var yowlWrapper = require('yowlwrapper');

module.exports = function index(eventStore, _options) {
    console.log('here2');

    var options = {
        logger: {
            moduleName: 'EventRepository'
        }
    };

    extend(options, _options || {});

    var logger = yowlWrapper(options.logger);

    return eventRepository(eventStore, logger, options);
};