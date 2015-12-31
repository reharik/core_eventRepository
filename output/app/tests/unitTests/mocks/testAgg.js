//var bs = require('../../bootstrap');

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (eventmodels, appdomain) {
    return (function (_appdomain$AggregateRootBase) {
        _inherits(TestAgg, _appdomain$AggregateRootBase);

        function TestAgg() {
            _classCallCheck(this, TestAgg);

            _get(Object.getPrototypeOf(TestAgg.prototype), 'constructor', this).call(this);
            this.eventsHandled = [];
            this.type = 'TestAgg';
        }

        _createClass(TestAgg, [{
            key: 'getEventsHandled',
            value: function getEventsHandled() {
                return this.eventsHandled;
            }
        }, {
            key: 'clearEventsHandled',
            value: function clearEventsHandled() {
                return this.eventsHandled = [];
            }
        }, {
            key: 'commandHandlers',
            value: function commandHandlers() {
                return {
                    'someCommand': function someCommand(command) {
                        var vent1 = new eventmodels.gesEvent('someAggEvent', { blah: command.value }, { someMetadata: '1234' });
                        this.raiseEvent(vent1);
                    },
                    'someOtherCommand': function someOtherCommand(command) {
                        var vent2 = new eventmodels.gesEvent('someOtherAggEvent', { blah: command.value }, { someOtherMetadata: '1234' });
                        this.raiseEvent(vent2);
                    }
                };
            }
        }, {
            key: 'applyEventHandlers',
            value: function applyEventHandlers() {
                return {
                    'someAggEvent': (function (event) {
                        this.eventsHandled.push(event);
                    }).bind(this),
                    'someOtherAggEvent': (function (event) {
                        this.eventsHandled.push(event);
                    }).bind(this)
                };
            }
        }], [{
            key: 'aggregateName',
            value: function aggregateName() {
                return 'TestAgg';
            }
        }]);

        return TestAgg;
    })(appdomain.AggregateRootBase);
};