/**
 * Created by rharik on 7/6/15.
 */

'use strict';

require('must');

describe('readStreamEventsForwardPromiseTester', function () {
    var _this = this;

    var bootstrap;
    var mut;

    before(function () {});

    beforeEach(function () {
        bootstrap = require('../intTestBootstrap');
        mut = bootstrap.getInstanceOf('readStreamEventsForwardPromise');
        var uuid = bootstrap.getInstanceOf('uuid');
        var EventData = bootstrap.getInstanceOf('EventData');
        var append = bootstrap.getInstanceOf('appendToStreamPromise');
        var appendData = { expectedVersion: -2 };
        appendData.events = [new EventData('testing1', {}, appendData)];
        append('readStream', appendData);
    });

    context('when calling readStreamEventsForwardPromise with no stream name', function () {
        it('should throw proper error', function () {
            (function () {
                mut();
            }).must['throw'](Error, 'Invariant Violation: must pass a valid stream name');
        });
    });

    context('when calling readStreamEventsForwardPromise with no skiptake', function () {
        it('should throw proper error', function () {
            (function () {
                mut('readStream');
            }).must['throw'](Error, 'Invariant Violation: must provide the skip take');
        });
    });

    context('when calling readStreamEventsForwardPromise with bad stream name', function () {
        it('should return error', function callee$2$0() {
            var results;
            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return regeneratorRuntime.awrap(mut('badstreamname', { start: 0, count: 10 }));

                    case 2:
                        results = context$3$0.sent;

                        results.Status.must.equal('NoStream');

                    case 4:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, _this);
        });
    });

    context('when calling readStreamEventsForwardPromise', function () {
        it('should return events', function callee$2$0() {
            var results;
            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.next = 2;
                        return regeneratorRuntime.awrap(mut('readStream', { start: 0, count: 10 }));

                    case 2:
                        results = context$3$0.sent;

                        results.Status.must.equal('Success');
                        results.Events.length.must.be.at.most(10);

                    case 5:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, _this);
        });
    });
});