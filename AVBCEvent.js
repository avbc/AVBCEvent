/*!
 * A very, very simple Event Queue
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 Jonathon Hibbard
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
( function() {
    'use strict';

    var self = this;

    // The primary object being produced
    var AVBCEvent;

    var processedEventDefaults = {
        wasTriggered: false,
        callbackArgs: []
    };

    // A Process Queue for handling Queued Requests.
    function AVBCEvent( obj ) {
        if( obj instanceof AVBCEvent ) {
            return obj;
        }

        if( !( this instanceof AVBCEvent ) ) {
            return new AVBCEvent;
        }
    
        this._AVBCEvent = obj;  // in case we need it...
    }

    self.AVBCEvent = AVBCEvent;

    if( typeof self['AVBCEventQueue'] === 'undefined' ) {
        self.AVBCEventQueue = {};
    }

    if( typeof self['AVBCEventProcessed'] === 'undefined' ) {
        self.AVBCEventProcessed = {};
    }

    AVBCEvent.trigger = function( event ) {
        var queue = self.AVBCEventQueue[event];
        // we only need to populate this variables at the last responsible moment
        var args, i, listenerCount, enqueuedItem;

        if( typeof queue === 'undefined' ) {
            // nothing to do if this event doesn't exist in the queue
            return;
        }

        args = Array.prototype.slice.call( arguments, 1 );

        for( i = 0; i < queue.length; i++ ) {
            enqueuedItem = queue[i];

            enqueuedItem.callback( args.slice() );

            if( !!enqueuedItem.dequeueAfter ) {
                queue.splice( i, 1 );
            }
        }

        self.AVBCEventProcessed[event] = {
            wasTriggered: true,
            callbackArgs: args
        };
    };

    /**
     * @param {Bool} dequeueAfter  When true, the callback being registered along with this event will only be executed once ever if the event is triggered multiple times.
     */ 
    AVBCEvent.on = function( event, callback, dequeueAfter ) {
        if( typeof self.AVBCEventQueue[event] === 'undefined' ) {
            self.AVBCEventQueue[event] = [];
        }

        if( typeof self.AVBCEventProcessed[event] === 'undefined' ) {
            self.AVBCEventProcessed[event] = Object.create( processedEventDefaults );
        }

        // If this event has already been triggered then execute the callback immediately
        if( AVBCEventProcessed[event].wasTriggered ) {
            callback( self.AVBCEventProcessed[event].callbackArgs.slice() );

            // bypass enqueing this callback to this event and execute the callback
            if( !!dequeueAfter ) {
                return;
            }
        }

        self.AVBCEventQueue[event].push({
            callback: callback,
            dequeueAfter: dequeueAfter
        });
    };

    // Completely remove this event and all listeners from the pool
    AVBCEvent.dequeue = function( event ) {
        if( typeof self.AVBCEventQueue[event] !== 'undefined' ) {
            delete self.AVBCEventQueue[event];
        }

        if( typeof self.AVBCEventProcessed[event] !== 'undefined' ) {
            delete self.AVBCEventProcessed[event];
        }
    };

    // Completely remove all events (queued and processed)
    AVBCEvent.drainPool = function() {
        self.AVBCEventQueue = [];
        self.AVBCEventProcessed = [];
    };
}).call( this );
