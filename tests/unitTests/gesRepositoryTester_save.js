///**
// * Created by rharik on 6/10/15.
// */
//
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
        level:'error'
    }
};
var testAgg;
//
describe('getEventStoreRepository', function() {
    var BadAgg = function(){};
    var badAgg = new BadAgg();

    var container = require('../../registry_test')(options.dagon);
    before(function(){
        eventmodels = container.getInstanceOf('eventmodels');
        uuid = container.getInstanceOf('uuid');
        TestAgg = container.getInstanceOf('testAgg');
        mut = container.getInstanceOf('eventRepository')();
    });

    beforeEach(function(){
        testAgg = new TestAgg();
    });

    describe('#save', function() {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', async function() {
                var errorMsg = '';
                try {
                    await mut.save(badAgg, '', '')
                } catch (ex) {
                    errorMsg = ex.message;
                }
                errorMsg.should.equal('Invariant Violation: aggregateType must inherit from AggregateBase');
            });
        });

        context('when calling save with proper aggtype', function () {
            it('should save proper number of events', async function () {
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                console.log(result);
                result.events.length.should.equal(3);
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should add proper metadata to events', async function () {
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, '');
                var metadata = result.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                parsed.aggregateTypeHeader.should.equal("TestAgg");
            })
        });
        context('when adding and altering metadata', function () {
            it('should result in proper metadata to events', async function () {
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, {favoriteCheeze:'headcheeze',aggregateTypeHeader:'MF.TestAgg' });
                var metadata = result.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                console.log(parsed)
                parsed.favoriteCheeze.should.equal("headcheeze");
                parsed.aggregateTypeHeader.should.equal("MF.TestAgg");
            })
        });
        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.expectedVersion.should.equal(-1);
            })
        });

        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg._version = 5;
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(eventmodels.gesEvent('someAggEvent',null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.expectedVersion.should.equal(4);
            })
        });
    });
});
