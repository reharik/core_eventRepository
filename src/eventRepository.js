/**
 * Created by rharik on 6/10/15.
 */

var invariant = require('invariant');
var eventModels = require('eventmodels')();
var uuid = require('uuid');
var JSON = require('JSON');
var extend = require('extend');


module.exports = function(_eventStore, _logger, _options) {
    var logger = _logger;
    var eventStore = _eventStore;
    logger.trace('constructor | constructing gesRepository');
    logger.debug('constructor |gesRepository options passed in ' + _options);

    var options = {
        readPageSize: 1,
        streamType: 'event'
    };
    extend(options, _options || {});
    logger.debug('constructor |gesRepository options after merge ' + options);

    invariant(
        options.readPageSize,
        "repository requires a read size greater than 0"
    );

    var getById = async function (aggregateType, id, version) {
        logger.debug('getById | gesRepo calling getById with params:' + aggregateType + ', ' + id + ', ' + version);

        var streamName;
        var aggregate;
        var sliceStart = 0;
        var currentSlice;
        var sliceCount;
        try {
            invariant(
                (aggregateType.isAggregateBase && aggregateType.isAggregateBase()),
                "aggregateType must inherit from AggregateBase"
            );
            invariant(
                id.length === (36),
                "id must be a valid uuid"
            );
            invariant(
                (version >= 0),
                "version number must be greater than or equal to 0"
            );

            streamName = aggregateType.aggregateName() + id;
            logger.debug('getById | stream from which events will be pulled: ' + streamName);
            logger.trace('getById | constructing aggregate');
            // this might be problematic
            aggregate = new aggregateType();

            logger.debug('getById | beginning loop to retrieve events');
            do {
                // specify number of events to pull. if number of events too large for one call use limit
                logger.debug('getById | begining new iteration');

                sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                logger.trace('getById | number of events to pull this iteration: ' + sliceCount);
                logger.trace('getById | number of events to pull this iteration: ' + sliceStart);
                // get all events, or first batch of events from GES

                logger.info('getById | about to pull events for ' + aggregateType + ' from stream ' + streamName);
                currentSlice = await eventStore.readStreamEventsForwardPromise(streamName, {
                    start: sliceStart,
                    count: sliceCount
                });
                //validate
                console.log(JSON.stringify(currentSlice));
                if (currentSlice.Status == 'StreamNotFound') {
                    throw new Error('Aggregate not found: ' + streamName);
                }
                //validate
                if (currentSlice.Status == 'StreamDeleted') {
                    throw new Error('Aggregate Deleted: ' + streamName);
                }

                logger.info('events retrieved from stream: ' + streamName);
                sliceStart = currentSlice.NextEventNumber;
                logger.trace('getById | new sliceStart calculated: ' + sliceStart);

                logger.debug('getById | about to loop through and apply events to aggregate');
                console.log(currentSlice.Events);
                currentSlice.Events.forEach(e=> aggregate.applyEvent(eventModels.gesEvent.gesEventFromStream(e)));
                logger.info('getById | events applied to aggregate');
            } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);
        } catch (error) {
            logger.error('getById | error retrieving aggregate: ' + error);
            throw(error);
        }
        return aggregate;
    };

    var save = async function(aggregate, _metadata) {
        var streamName;
        var newEvents;
        var metadata;
        var originalVersion;
        var expectedVersion;
        var events;
        var appendData;
        var result;
        try {
            invariant(
                (aggregate.isAggregateBase && aggregate.isAggregateBase()),
                "aggregateType must inherit from AggregateBase"
            );
            logger.debug('save | repo options');
            logger.debug('save | '+ JSON.stringify(options));

            // standard data for metadata portion of persisted event
            metadata = {
                // handy tracking id
                commitIdHeader: uuid.v1(),
                // type of aggregate being persisted
                aggregateTypeHeader: aggregate.constructor.name,
                // stream type
                streamType: options.streamType
            };
            logger.debug('save | default metadata:' + metadata);

            // add extra data to metadata portion of persisted event
            extend(metadata, _metadata);
            logger.debug('save | merged metadata: ' + metadata);
            logger.debug('save | gesRepo calling save with params:' + aggregate + ', ' + metadata.commitIdHeader + ', ' + _metadata);

            streamName = aggregate.constructor.name + aggregate._id;
            logger.debug('save | gesRepo calling save with params:' + aggregate + ', ' + metadata.commitIdHeader + ', ' + _metadata);
            logger.trace('save | retrieving uncommitted events');
            newEvents = aggregate.getUncommittedEvents();

            originalVersion = aggregate._version - newEvents.length;
            logger.trace('save | calculating original version number:' + aggregate._version + ' - ' + newEvents.length + ' = ' + originalVersion);
            expectedVersion = originalVersion == 0 ? -1 : originalVersion - 1;
            logger.trace('save | calculating expected version :' + expectedVersion);

            logger.debug('save | creating EventData for each event');
            events = newEvents.map(x=> eventModels.eventData(x.eventName, x.data, metadata));
            logger.trace('save | EventData created for each event');

            appendData = {
                expectedVersion: expectedVersion,
                events: events
            };
            logger.debug('save | event data for posting created: ' + JSON.stringify(appendData));
            logger.debug(appendData);

            logger.trace('save | about to append events to stream');
            result = await eventStore.appendToStreamPromise(streamName, appendData);
            logger.debug('save | events posted to stream:' + streamName);

            logger.trace('save | clear uncommitted events form aggregate');
            aggregate.clearUncommittedEvents();

        } catch (error) {
            throw(error);
        }
        //largely for testing purposes
        return appendData;
    };

    return {
        getById: getById,
        save: save
    }
};
