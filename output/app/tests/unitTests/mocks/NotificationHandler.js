/**
 * Created by rharik on 6/19/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = function () {
    return (function () {
        function NotificationHandler() {
            _classCallCheck(this, NotificationHandler);

            this.handlesEvents = ['notificationEvent'];
            this.eventsHandled = [];
            this.eventHandlerName = 'NotificationHandler';
        }

        _createClass(NotificationHandler, [{
            key: 'notificationEvent',
            value: function notificationEvent(vnt) {
                this.eventsHandled.push(vnt);
            }
        }, {
            key: 'clearEventsHandled',
            value: function clearEventsHandled() {
                this.eventsHandled = [];
            }
        }]);

        return NotificationHandler;
    })();
};