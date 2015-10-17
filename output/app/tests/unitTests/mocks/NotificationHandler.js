/**
 * Created by rharik on 6/19/15.
 */


module.exports = function() {
    return class NotificationHandler {
        constructor() {
            this.handlesEvents = ['notificationEvent'];
            this.eventsHandled = [];
            this.eventHandlerName = 'NotificationHandler';
        }

        notificationEvent(vnt) {
            this.eventsHandled.push(vnt);
        }

        clearEventsHandled() {
            this.eventsHandled = [];
        }
    };
};
