/**
 * Created by rharik on 7/8/15.
 */
'use strict';

var demand = require('must');

describe('repositoryTester', function () {
    var _this = this;

    var bootstrap;
    var Mut;
    var mut;
    var uuid;
    var EventData;
    var TestAgg;
    var testAgg;

    before(function () {
        bootstrap = require('../intTestBootstrap');
    });

    beforeEach(function () {
        Mut = bootstrap.getInstanceOf('gesRepository');
        uuid = bootstrap.getInstanceOf('uuid');
        EventData = bootstrap.getInstanceOf('EventData');
        TestAgg = bootstrap.getInstanceOf('TestAgg');
        mut = new Mut();
    });

    context('when saving agg for first time', function () {
        it('should save agg with all events', function callee$2$0() {
            var agg;
            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        testAgg = new TestAgg();
                        testAgg.someCommand({ value: 'something Really important!' });
                        testAgg.someCommand({ value: 'not wait. I mean something REALLY important!' });
                        context$3$0.next = 5;
                        return regeneratorRuntime.awrap(mut.save(testAgg, null, { metametadata: 'data' }));

                    case 5:
                        context$3$0.next = 7;
                        return regeneratorRuntime.awrap(mut.getById(TestAgg, testAgg._id, 1));

                    case 7:
                        agg = context$3$0.sent;

                        agg._version.must.equal(2);
                        agg.eventsHandled.length.must.equal(2);
                        agg.eventsHandled[0].metadata.metametadata.must.equal('data');

                    case 11:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, _this);
        });
    });
});