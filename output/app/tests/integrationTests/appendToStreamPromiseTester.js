/**
 * Created by rharik on 6/10/15.
 */

'use strict';

require('must');

describe('appendToStreamPromiseTester', function () {
    var _this = this;

    var bootstrap;
    var mut;
    var EventData;
    var uuid;

    before(function () {
        bootstrap = require('../intTestBootstrap');
        EventData = bootstrap.getInstanceOf('EventData');
        uuid = bootstrap.getInstanceOf('uuid');
        mut = bootstrap.getInstanceOf('appendToStreamPromise');
    });

    beforeEach(function () {});

    context('append to stream', function () {
        it('should throw error if no stream provided', function () {
            (function () {
                mut();
            }).must['throw'](Error, 'Invariant Violation: must pass a valid stream name');
        });

        it('should throw error if no expectedVersion provided', function () {
            (function () {
                mut('myTestStream', {});
            }).must['throw'](Error, 'Invariant Violation: must pass data with an expected version of aggregate');
        });

        it('should throw error if no events provided', function () {
            var appendData = {
                expectedVersion: -2
            };
            (function () {
                mut('myTestStream', appendData);
            }).must['throw'](Error, 'Invariant Violation: must pass data with at least one event');
        });

        it('should resolve with success', function callee$2$0() {
            var appendData, result;
            return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        appendData = { expectedVersion: -2 };

                        appendData.events = [new EventData('testing1', { data: 'someData' }, { eventTypeName: 'testingEventNotificationOff' })];
                        context$3$0.next = 4;
                        return regeneratorRuntime.awrap(mut('myTestStream', appendData));

                    case 4:
                        result = context$3$0.sent;

                        result.Status.must.equal('Success');

                    case 6:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, _this);
        });
    });
});