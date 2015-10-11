///**
// * Created by rharik on 6/10/15.
// */
//
'use strict';

var chai = require("chai");
//var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
var uuid = require('uuid');
var TestAgg;
var eventmodels;
//var JSON = require('JSON');
//var index = require('../../src/index');
var mut;
var eventStore;
var options = {
    logger: {
        moduleName: 'EventRepository',
        level: 'error'
    }
};
var testAgg;
//
describe('getEventStoreRepository', function () {
    var BadAgg = function BadAgg() {};
    var badAgg = new BadAgg();

    var container = require('../../registry_test')(options.dagon);
    before(function () {
        eventmodels = container.getInstanceOf('eventmodels');
        uuid = container.getInstanceOf('uuid');
        TestAgg = container.getInstanceOf('testAgg');
        mut = container.getInstanceOf('eventRepository')();
    });

    beforeEach(function () {
        testAgg = new TestAgg();
    });

    describe('#save', function () {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', function callee$3$0() {
                var errorMsg;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            errorMsg = '';
                            context$4$0.prev = 1;
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.save(badAgg, '', ''));

                        case 4:
                            context$4$0.next = 9;
                            break;

                        case 6:
                            context$4$0.prev = 6;
                            context$4$0.t0 = context$4$0['catch'](1);

                            errorMsg = context$4$0.t0.message;

                        case 9:
                            errorMsg.should.equal('Invariant Violation: aggregateType must inherit from AggregateBase');

                        case 10:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this, [[1, 6]]);
            });
        });

        context('when calling save with proper aggtype', function () {
            it('should save proper number of events', function callee$3$0() {
                var result;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg._id = uuid.v1();
                            context$4$0.next = 6;
                            return regeneratorRuntime.awrap(mut.save(testAgg, uuid.v1(), ''));

                        case 6:
                            result = context$4$0.sent;

                            console.log(result);
                            result.events.length.should.equal(3);

                        case 9:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
        context('when calling save with proper aggtype', function () {
            it('should add proper metadata to events', function callee$3$0() {
                var result, metadata, parsed;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg._id = uuid.v1();
                            context$4$0.next = 4;
                            return regeneratorRuntime.awrap(mut.save(testAgg, ''));

                        case 4:
                            result = context$4$0.sent;
                            metadata = result.events[0].Metadata;
                            parsed = JSON.parse(metadata);

                            parsed.aggregateTypeHeader.should.equal("TestAgg");

                        case 8:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
        context('when adding and altering metadata', function () {
            it('should result in proper metadata to events', function callee$3$0() {
                var commitId, result, metadata, parsed;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, null, { variousProperties: "yeehaw" }));
                            testAgg._id = uuid.v1();
                            commitId = uuid.v1();
                            context$4$0.next = 5;
                            return regeneratorRuntime.awrap(mut.save(testAgg, { favoriteCheeze: 'headcheeze', aggregateTypeHeader: 'MF.TestAgg' }));

                        case 5:
                            result = context$4$0.sent;
                            metadata = result.events[0].Metadata;
                            parsed = JSON.parse(metadata);

                            console.log(parsed);
                            parsed.favoriteCheeze.should.equal("headcheeze");
                            parsed.aggregateTypeHeader.should.equal("MF.TestAgg");

                        case 11:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', function callee$3$0() {
                var result;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg._id = uuid.v1();
                            context$4$0.next = 6;
                            return regeneratorRuntime.awrap(mut.save(testAgg, uuid.v1(), ''));

                        case 6:
                            result = context$4$0.sent;

                            result.expectedVersion.should.equal(-1);

                        case 8:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });

        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', function callee$3$0() {
                var result;
                return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
                    while (1) switch (context$4$0.prev = context$4$0.next) {
                        case 0:
                            testAgg._version = 5;
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent', null, { variousProperties: "yeehaw" }));
                            testAgg._id = uuid.v1();
                            context$4$0.next = 7;
                            return regeneratorRuntime.awrap(mut.save(testAgg, uuid.v1(), ''));

                        case 7:
                            result = context$4$0.sent;

                            result.expectedVersion.should.equal(4);

                        case 9:
                        case 'end':
                            return context$4$0.stop();
                    }
                }, null, this);
            });
        });
    });
});