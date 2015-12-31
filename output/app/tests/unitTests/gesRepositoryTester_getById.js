/**
 * Created by rharik on 6/10/15.
 */

'use strict';

var chai = require("chai");
//var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
//chai.use(chaiAsPromised);
//var _eventstore = require('eventstore');
var uuid;
//var testAgg = require('./mocks/testAgg');
var eventmodels;
//var JSON = require('JSON');
//var index = require('../../src/index');
var testAgg;
var mut;
var eventstore;
var options = {
    logger: {
        moduleName: 'EventRepository',
        level: 'error'
    }
};

describe('geteventstoreRepository', function () {
    var BadAgg = function BadAgg() {};

    var container = require('../../registry_test')(options.dagon);
    before(function () {
        eventstore = container.getInstanceOf('eventstore');
        eventmodels = container.getInstanceOf('eventmodels');
        uuid = container.getInstanceOf('uuid');
        testAgg = container.getInstanceOf('testAgg');
        mut = container.getInstanceOf('eventRepository')();
    });

    describe('#getById', function () {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error', function callee$3$0() {
                var errorMsg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            errorMsg = '';
                            context$4$0.prev = 1;
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.getById(BadAgg, uuid.v1(), ''));

                        case 4:
                            context$4$0.next = 9;
                            break;

                        case 6:
                            context$4$0.prev = 6;
                            context$4$0.t0 = context$4$0['catch'](1);

                            errorMsg = context$4$0.t0.message;

                        case 9:
                            errorMsg.should.equal("Invariant Violation: aggregateType must inherit from AggregateBase");

                        case 10:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[1, 6]]);
            });
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function callee$3$0() {
                var errorMsg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            errorMsg = '';
                            context$4$0.prev = 1;
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, 'some non uuid', ''));

                        case 4:
                            context$4$0.next = 9;
                            break;

                        case 6:
                            context$4$0.prev = 6;
                            context$4$0.t0 = context$4$0['catch'](1);

                            errorMsg = context$4$0.t0.message;

                        case 9:
                            errorMsg.should.equal("Invariant Violation: id must be a valid uuid");

                        case 10:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[1, 6]]);
            });
        });
        context('when calling getById with bad version', function () {
            it('should throw proper error', function callee$3$0() {
                var errorMsg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            errorMsg = '';
                            context$4$0.prev = 1;
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, uuid.v1(), -6));

                        case 4:
                            context$4$0.next = 9;
                            break;

                        case 6:
                            context$4$0.prev = 6;
                            context$4$0.t0 = context$4$0['catch'](1);

                            errorMsg = context$4$0.t0.message;

                        case 9:
                            errorMsg.should.equal("Invariant Violation: version number must be greater than or equal to 0");

                        case 10:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[1, 6]]);
            });
        });
        context('when calling getById with proper args', function () {
            it('should return proper agg', function callee$3$0() {
                var data, result, results;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            data = JSON.stringify(eventmodels.gesEvent('someAggEvent', null, { blah: 'blah' }));
                            result = {
                                Status: 'OK',
                                NextEventNumber: 3,
                                Events: [{ OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }],
                                IsEndOfStream: false
                            };

                            eventstore.readStreamEventForwardShouldReturnResult(result);
                            context$4$0.next = 5;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, uuid.v1(), 0));

                        case 5:
                            results = context$4$0.sent;

                            results.should.be['instanceof'](testAgg);

                        case 7:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
        context('when calling getById with multiple events returned', function () {
            it('should return apply all events and presumably loop', function callee$3$0() {
                var result, agg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            result = {
                                Status: 'OK',
                                NextEventNumber: 3,
                                Events: [{ OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }],
                                IsEndOfStream: false
                            };

                            eventstore.readStreamEventForwardShouldReturnResult(result);
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, uuid.v1(), 0));

                        case 4:
                            agg = context$4$0.sent;

                            agg.getEventsHandled().length.should.equal(3);

                        case 6:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });

        context('when calling getById with multiple events returned', function () {
            it('should set the agg version properly', function callee$3$0() {
                var byId;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            context$4$0.next = 2;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, uuid.v1(), 0));

                        case 2:
                            byId = context$4$0.sent;

                            byId._version.should.equal(3);

                        case 4:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });

        context('when calling getById with proper args but stream deleted', function () {
            it('should throw proper error', function callee$3$0() {
                var data, result, id, errorMsg, byId;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            data = JSON.stringify(eventmodels.gesEvent('someEventNotificationOn', null, { blah: 'blah' }));
                            result = {
                                Status: 'StreamDeleted',
                                NextEventNumber: 3,
                                Events: [{ Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }],
                                IsEndOfStream: false
                            };
                            id = uuid.v1();

                            eventstore.readStreamEventForwardShouldReturnResult(result);

                            errorMsg = '';
                            context$4$0.prev = 5;
                            context$4$0.next = 8;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, id, 0));

                        case 8:
                            byId = context$4$0.sent;
                            context$4$0.next = 14;
                            break;

                        case 11:
                            context$4$0.prev = 11;
                            context$4$0.t0 = context$4$0['catch'](5);

                            errorMsg = context$4$0.t0.message;

                        case 14:
                            errorMsg.should.equal('Aggregate Deleted: ' + testAgg.aggregateName() + id);

                        case 15:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[5, 11]]);
            });
        });

        context('when calling getById with proper args but stream not found', function () {
            it('should throw proper error', function callee$3$0() {
                var data, result, id, streamName, errorMsg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            data = JSON.stringify(eventmodels.gesEvent('someEventNotificationOn', null, { blah: 'blah' }));
                            result = {
                                Status: 'StreamNotFound',
                                NextEventNumber: 3,
                                Events: [{ Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }],
                                IsEndOfStream: false
                            };
                            id = uuid.v1();
                            streamName = testAgg.aggregateName() + id;

                            eventstore.readStreamEventForwardShouldReturnResult(result);

                            errorMsg = '';
                            context$4$0.prev = 6;
                            context$4$0.next = 9;
                            return regeneratorRuntime.awrap(mut.getById(testAgg, id, 0));

                        case 9:
                            context$4$0.next = 14;
                            break;

                        case 11:
                            context$4$0.prev = 11;
                            context$4$0.t0 = context$4$0['catch'](6);

                            errorMsg = context$4$0.t0.message;

                        case 14:
                            errorMsg.should.equal('Aggregate not found: ' + streamName);

                        case 15:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[6, 11]]);
            });
        });
    });
});