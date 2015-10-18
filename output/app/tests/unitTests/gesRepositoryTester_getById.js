/**
 * Created by rharik on 6/10/15.
 */

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
    var BadAgg = function () {};

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
            it('should throw proper error', async function () {
                var errorMsg = '';
                try {
                    await mut.getById(BadAgg, uuid.v1(), '');
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal("Invariant Violation: aggregateType must inherit from AggregateBase");
            });
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', async function () {
                var errorMsg = '';
                try {
                    await mut.getById(testAgg, 'some non uuid', '');
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal("Invariant Violation: id must be a valid uuid");
            });
        });
        context('when calling getById with bad version', function () {
            it('should throw proper error', async function () {
                var errorMsg = '';
                try {
                    await mut.getById(testAgg, uuid.v1(), -6);
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal("Invariant Violation: version number must be greater than or equal to 0");
            });
        });
        context('when calling getById with proper args', function () {
            it('should return proper agg', async function () {
                var data = JSON.stringify(eventmodels.gesEvent('someAggEvent', null, { blah: 'blah' }));
                var result = {
                    Status: 'OK',
                    NextEventNumber: 3,
                    Events: [{ OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Data: data, Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } }],
                    IsEndOfStream: false
                };
                eventstore.readStreamEventForwardShouldReturnResult(result);
                var results = await mut.getById(testAgg, uuid.v1(), 0);
                results.should.be.instanceof(testAgg);
            });
        });
        context('when calling getById with multiple events returned', function () {
            it('should return apply all events and presumably loop', async function () {
                var result = {
                    Status: 'OK',
                    NextEventNumber: 3,
                    Events: [{ OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }, { OriginalEvent: { EventType: 'someAggEvent', Metadata: { eventName: 'someAggEvent', streamType: 'command' } } }],
                    IsEndOfStream: false
                };
                eventstore.readStreamEventForwardShouldReturnResult(result);
                var agg = await mut.getById(testAgg, uuid.v1(), 0);
                agg.getEventsHandled().length.should.equal(3);
            });
        });

        context('when calling getById with multiple events returned', function () {
            it('should set the agg version properly', async function () {
                var byId = await mut.getById(testAgg, uuid.v1(), 0);
                byId._version.should.equal(3);
            });
        });

        context('when calling getById with proper args but stream deleted', function () {
            it('should throw proper error', async function () {
                var data = JSON.stringify(eventmodels.gesEvent('someEventNotificationOn', null, { blah: 'blah' }));
                var result = {
                    Status: 'StreamDeleted',
                    NextEventNumber: 3,
                    Events: [{ Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                eventstore.readStreamEventForwardShouldReturnResult(result);

                var errorMsg = '';
                try {
                    var byId = await mut.getById(testAgg, id, 0);
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal('Aggregate Deleted: ' + testAgg.aggregateName() + id);
            });
        });

        context('when calling getById with proper args but stream not found', function () {
            it('should throw proper error', async function () {
                var data = JSON.stringify(eventmodels.gesEvent('someEventNotificationOn', null, { blah: 'blah' }));
                var result = {
                    Status: 'StreamNotFound',
                    NextEventNumber: 3,
                    Events: [{ Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }, { Event: { EventType: 'someAggEvent', Data: data, OriginalEvent: { Metadata: { eventName: 'someEventNotificationOn', streamType: 'command' } } } }],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                var streamName = testAgg.aggregateName() + id;
                eventstore.readStreamEventForwardShouldReturnResult(result);

                var errorMsg = '';
                try {
                    await mut.getById(testAgg, id, 0);
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal('Aggregate not found: ' + streamName);
            });
        });
    });
});