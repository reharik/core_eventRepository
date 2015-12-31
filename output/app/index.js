/**
 * Created by reharik on 8/13/15.
 */
'use strict';

var extend = require('extend');
var registry = require('./registry');

module.exports = function (_options) {
    var options = {
        logger: {
            moduleName: 'EventRepository'
        }
    };
    extend(options, _options || {});
    return registry(options);
    //var plugin = container.getInstanceOf('eventRepository');
    //
    //return plugin(options);
};