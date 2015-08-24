/**
 * Created by rharik on 6/10/15.
 */

require('must');
var _eventStore = require('eventstore');
var uuid = require('uuid');
var TestAgg = require('./mocks/testAgg');
var eventModels = require('eventmodels')();
var JSON = require('JSON');
var index = require('../../src/index');
var mut;
var eventStore;
var testAgg;

describe('getEventStoreRepository', function() {
    var BadAgg = function(){};
    var badAgg = new BadAgg();
    before(function(){
        eventStore = _eventStore({unitTest: true});
        mut = index(eventStore);
    });

    beforeEach(function(){
        testAgg = new TestAgg();
    });

    describe('#save', function() {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', function () {
                mut.save(badAgg,'','').must.reject.error(Error, 'Invariant Violation: aggregateType must inherit from AggregateBase');
            })
        });

        context('when calling save with proper aggtype', function () {
            it('should save proper number of events', async function () {
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.events.length.must.equal(3);
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should add proper metadata to events', async function () {
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, '');
                var metadata = result.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                parsed.aggregateTypeHeader.must.equal("TestAgg");
            })
        });
        context('when adding and altering metadata', function () {
            it('should result in proper metadata to events', async function () {
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, {favoriteCheeze:'headcheeze',aggregateTypeHeader:'MF.TestAgg' });
                var metadata = result.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                console.log(parsed)
                parsed.favoriteCheeze.must.equal("headcheeze");
                parsed.aggregateTypeHeader.must.equal("MF.TestAgg");
            })
        });
        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.expectedVersion.must.equal(-1);
            })
        });

        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg._version = 5;
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventModels.gesEvent.init('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.expectedVersion.must.equal(4);
            })
        });
    });
});
