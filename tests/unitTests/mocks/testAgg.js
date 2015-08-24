//var bs = require('../../bootstrap');


var eventModels = require('eventmodels');
var appdomain = require('appdomain')();



module.exports = class TestAgg extends appdomain.AggregateRootBase {
    constructor() {
        super();
        this.eventsHandled = [];
        this.type = 'TestAgg';
    }

    getEventsHandled() {
        return this.eventsHandled
    }

    clearEventsHandled() {
        return this.eventsHandled = []
    }

    static aggregateName() {
        return 'TestAgg';
    }

    commandHandlers() {
        return {
            'someCommand': function (command) {
                var vent1 = new eventModels.gesEvent('someAggEvent', {blah: command.value}, {someMetadata: '1234'});
                this.raiseEvent(vent1);
            },
            'someOtherCommand': function (command) {
                var vent2 = new eventModels.gesEvent('someOtherAggEvent', {blah: command.value}, {someOtherMetadata: '1234'});
                this.raiseEvent(vent2);
            }
        }
    }

    applyEventHandlers() {
        return {
            'someAggEvent': function (event) {
                this.eventsHandled.push(event);
            }.bind(this),
            'someOtherAggEvent': function (event) {
                this.eventsHandled.push(event);
            }.bind(this)
        }
    }
};