/**
 * Created by parallels on 9/7/15.
 */
'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (Promise, events) {

    var subscriptionMock = (function (_events$EventEmitter) {
        _inherits(SubscriptionMock, _events$EventEmitter);

        function SubscriptionMock() {
            _classCallCheck(this, SubscriptionMock);

            _get(Object.getPrototypeOf(SubscriptionMock.prototype), 'constructor', this).call(this);
        }

        return SubscriptionMock;
    })(events.EventEmitter);
    var _result;
    var subscription = new subscriptionMock();
    return {
        appendToStreamPromise: function appendToStreamPromise(name, data) {
            subscription.emit('event', data);
            return Promise.resolve(data);
        },
        subscribeToAllFrom: function subscribeToAllFrom() {
            return subscription;
        },
        readStreamEventsForwardPromise: function readStreamEventsForwardPromise() {
            return _result;
        },

        readStreamEventForwardShouldReturnResult: function readStreamEventForwardShouldReturnResult(result) {
            _result = result;
        }

    };
};