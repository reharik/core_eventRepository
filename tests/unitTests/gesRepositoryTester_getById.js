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

describe('getEventStoreRepository', function() {
    var BadAgg = function(){};

    before(function(){
        eventStore = _eventStore({unitTest: true});
        mut = index(eventStore);
    });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error', function () {
                mut.getById(BadAgg, uuid.v1(), '').must.reject.error(Error,"Invariant Violation: aggregateType must inherit from AggregateBase");
            })
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function () {
                mut.getById(TestAgg,'some non uuid','').must.reject.error(Error,"Invariant Violation: id must be a valid uuid");
            })
        });
        context('when calling getById with bad version', function (){
            it('should throw proper error', function () {
                mut.getById(TestAgg,uuid.v1(),-6).must.reject.error(Error, "Invariant Violation: version number must be greater than or equal to 0");

            })
        });
        context('when calling getById with proper args',function (){
            it('should return proper agg', async function () {
                var data = JSON.stringify(eventModels.gesEvent.init('someAggEvent',null,{blah:'blah'}));
                var result = {
                    Status: 'OK',
                    NextEventNumber:3,
                    Events: [{OriginalEvent:{EventType:'someAggEvent',Data: data, Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}},
                        {OriginalEvent:{EventType:'someAggEvent',Data: data, Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}},
                        {OriginalEvent:{EventType:'someAggEvent',Data: data, Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}],
                    IsEndOfStream: false
                };
                eventStore.gesConnection.readStreamEventForwardShouldReturnResult(result);
                var results = await mut.getById(TestAgg,uuid.v1(),0);
                results.must.be.instanceof(TestAgg);
            })
        });
        context('when calling getById with multiple events returned',function (){
            it('should return apply all events and presumably loop', async function () {
                var result = {
                    Status: 'OK',
                    NextEventNumber:3,
                    Events: [{OriginalEvent:{EventType:'someAggEvent', Metadata: {eventName:'someAggEvent', streamType: 'command'}}},
                        {OriginalEvent:{EventType:'someAggEvent', Metadata: {eventName:'someAggEvent', streamType: 'command'}}},
                        {OriginalEvent:{EventType:'someAggEvent', Metadata: {eventName:'someAggEvent', streamType: 'command'}}}],
                    IsEndOfStream: false
                };
                eventStore.gesConnection.readStreamEventForwardShouldReturnResult(result);
                var agg = await mut.getById(TestAgg,uuid.v1(),0);
                agg.getEventsHandled().length.must.equal(3);
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should set the agg version properly', async function () {
                var byId = await mut.getById(TestAgg, uuid.v1(), 0);
                byId._version.must.equal(3);
            })
        });

        context('when calling getById with proper args but stream deleted', function (){
            it('should throw proper error', function () {
                var data = JSON.stringify(eventModels.gesEvent.init('someEventNotificationOn',null,{blah:'blah'}));
                var result = {
                    Status: 'StreamDeleted',
                    NextEventNumber:3,
                    Events: [{Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}},
                        {Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}},
                        {Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}}],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                eventStore.gesConnection.readStreamEventForwardShouldReturnResult(result);
                var byId = mut.getById(TestAgg, id, 0);
                byId.must.reject.error(Error, 'Aggregate Deleted: '+TestAgg.aggregateName()+id);
            })
        });
        context('when calling getById with proper args but stream not found', function (){
            it('should throw proper error', function () {
                var data = JSON.stringify(eventModels.gesEvent.init('someEventNotificationOn',null,{blah:'blah'}));
                var result = {
                    Status: 'StreamNotFound',
                    NextEventNumber:3,
                        Events: [{Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}},
                            {Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}},
                            {Event:{EventType:'someAggEvent',Data: data, OriginalEvent: {Metadata: {eventName:'someEventNotificationOn', streamType: 'command'}}}}],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                var streamName = TestAgg.aggregateName()+id;
                eventStore.gesConnection.readStreamEventForwardShouldReturnResult(result);
                var byId = mut.getById(TestAgg, id, 0);
                byId.must.reject.error(Error, 'Aggregate not found: '+streamName);

            })
        });
    });

});
