/**
 * Created by rharik on 6/10/15.
 */
"use strict";

module.exports = function (eventstoreplugin, logger, appfuncs, invariant, uuid, JSON, extend) {
    return function (_options) {
        var ef = appfuncs.eventFunctions;
        logger.trace('constructor | constructing gesRepository');
        logger.debug('constructor |gesRepository options passed in ' + _options);

        var options = {
            readPageSize: 1,
            streamType: 'event'
        };
        extend(options, _options || {});
        logger.debug('constructor |gesRepository options after merge ' + options);

        invariant(options.readPageSize, "repository requires a read size greater than 0");

        var getById = function getById(aggregateType, id, version) {
            var streamName, aggregate, sliceStart, currentSlice, sliceCount;
            return regeneratorRuntime.async(function getById$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        logger.debug('getById | gesRepo calling getById with params:' + aggregateType + ', ' + id + ', ' + version);
                        sliceStart = 0;
                        context$3$0.prev = 2;

                        invariant(aggregateType.isAggregateBase && aggregateType.isAggregateBase(), "aggregateType must inherit from AggregateBase");
                        invariant(id.length === 36, "id must be a valid uuid");
                        invariant(version >= 0, "version number must be greater than or equal to 0");

                        streamName = aggregateType.aggregateName() + id;
                        logger.debug('getById | stream from which events will be pulled: ' + streamName);
                        logger.trace('getById | constructing aggregate');
                        // this might be problematic
                        aggregate = new aggregateType();

                        logger.debug('getById | beginning loop to retrieve events');

                    case 11:
                        // specify number of events to pull. if number of events too large for one call use limit
                        logger.debug('getById | begining new iteration');

                        sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                        logger.trace('getById | number of events to pull this iteration: ' + sliceCount);
                        logger.trace('getById | number of events to pull this iteration: ' + sliceStart);
                        // get all events, or first batch of events from GES

                        logger.info('getById | about to pull events for ' + aggregateType + ' from stream ' + streamName);
                        context$3$0.next = 18;
                        return regeneratorRuntime.awrap(eventstoreplugin.readStreamEventsForwardPromise(streamName, {
                            start: sliceStart,
                            count: sliceCount
                        }));

                    case 18:
                        currentSlice = context$3$0.sent;

                        if (!(currentSlice.Status == 'StreamNotFound')) {
                            context$3$0.next = 21;
                            break;
                        }

                        throw new Error('Aggregate not found: ' + streamName);

                    case 21:
                        if (!(currentSlice.Status == 'StreamDeleted')) {
                            context$3$0.next = 23;
                            break;
                        }

                        throw new Error('Aggregate Deleted: ' + streamName);

                    case 23:

                        logger.info('events retrieved from stream: ' + streamName);
                        sliceStart = currentSlice.NextEventNumber;
                        logger.trace('getById | new sliceStart calculated: ' + sliceStart);

                        logger.debug('getById | about to loop through and apply events to aggregate');
                        currentSlice.Events.forEach(function (e) {
                            return aggregate.applyEvent(ef.incomingEvent(e));
                        });
                        logger.info('getById | events applied to aggregate');

                    case 29:
                        if (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream) {
                            context$3$0.next = 11;
                            break;
                        }

                    case 30:
                        context$3$0.next = 35;
                        break;

                    case 32:
                        context$3$0.prev = 32;
                        context$3$0.t0 = context$3$0['catch'](2);
                        throw context$3$0.t0;

                    case 35:
                        return context$3$0.abrupt('return', aggregate);

                    case 36:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, this, [[2, 32]]);
        };

        var save = function save(aggregate, _metadata) {
            var streamName, newEvents, metadata, originalVersion, expectedVersion, events, appendData, result;
            return regeneratorRuntime.async(function save$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        context$3$0.prev = 0;

                        invariant(aggregate.isAggregateBase && aggregate.isAggregateBase(), "aggregateType must inherit from AggregateBase");
                        logger.debug('save | repo options');
                        logger.debug('save | ' + JSON.stringify(options));

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
                        events = newEvents.map(function (e) {
                            e.metadata = metadata;return ef.outGoingEvent(e);
                        });
                        logger.trace('save | EventData created for each event');

                        appendData = {
                            expectedVersion: expectedVersion,
                            events: events
                        };
                        logger.debug('save | event data for posting created: ' + JSON.stringify(appendData));
                        logger.debug(appendData);

                        logger.trace('save | about to append events to stream');
                        context$3$0.next = 26;
                        return regeneratorRuntime.awrap(eventstoreplugin.appendToStreamPromise(streamName, appendData));

                    case 26:
                        result = context$3$0.sent;

                        logger.debug('save | events posted to stream:' + streamName);

                        logger.trace('save | clear uncommitted events form aggregate');
                        aggregate.clearUncommittedEvents();

                        context$3$0.next = 35;
                        break;

                    case 32:
                        context$3$0.prev = 32;
                        context$3$0.t0 = context$3$0['catch'](0);
                        throw context$3$0.t0;

                    case 35:
                        return context$3$0.abrupt('return', appendData);

                    case 36:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, this, [[0, 32]]);
        };

        return {
            getById: getById,
            save: save
        };
    };
};

//validate

//validate

//largely for testing purposes