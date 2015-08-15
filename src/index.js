/**
 * Created by reharik on 8/13/15.
 */

var extend = require('extend');
var eventRepository = require('./eventRepository');
var yowlWrapper = require('yowlWrapper');

module.exports = function index(eventStore, _options) {
    var options = {
        logger: {
            moduleName: 'EventRepository'
        }
    };
    extend(options, _options || {});

    var logger = yowlWrapper(options.logger);

    return eventRepository(eventStore, logger, options);
};