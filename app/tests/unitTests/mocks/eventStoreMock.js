/**
 * Created by parallels on 9/7/15.
 */
module.exports = function(Promise, events) {

    var subscriptionMock = class SubscriptionMock extends events.EventEmitter {
        constructor() {
            super();
        }
    };
    var _result;
    var subscription = new subscriptionMock();
    return {
        appendToStreamPromise: function(name, data) {
            subscription.emit('event', data);
            return Promise.resolve(data);
        },
        subscribeToAllFrom: function(){
            return subscription;
        },
        readStreamEventsForwardPromise: function(){
            return _result;
        },

        readStreamEventForwardShouldReturnResult: function(result){
            _result = result;
        }

    };
};
