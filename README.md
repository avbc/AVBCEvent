# AVBCEvent

This is just a very, very simple Event Queue written for Javascript.  This uses native methods and should be cross-browser compatiable (thought I must admist I haven't tested it in anything aside from Chrome =)).  Currently, all callbacks are executed FIFO - a more asynchronous(ish) approach will be something solved in the future.

### Methods

<a name="avbceventon"></a>
[`AVBCEvent.on( event, callback, dequeueAfter )`](#avbceventon "AVBCEvent.on( event : String, callback : Function, dequeueAfter : Boolean )") registers a callback to be executed for a given event.  When dequeueAfter is true, the callback will be executed 
only the first time this event is triggered (otherwise, it is called everytime)


<a name="avbceventtrigger"></a>
[`AVBCEvent.trigger( event, arg1,... )`](#avbceventtrigger "AVBCEvent.trigger( event : String, arg1 : *, ... )") triggers an event and executes any callbacks registered with it.  Optionally supply parameters to be passed along with each callback.


<a name="avbceventdequeue"></a>
[`AVBCEvent.dequeue( event )`](#avbceventdequeue "AVBCEvent.dequeue( event : String )") completely removes an event and any registered callbacks from the queue


<a name="avbceventdrainpool"></a>
[`AVBCEvent.drainPool()`](#avbceventdrainpool "AVBCEvent.drainPool()") completely removes **all** events (queued and processed).


### Basic Usage

This simple example shows how to add a simple listener to a custom event named *customEvent*.

```js
AVBCEvent.on( 'customEvent', function( data ) {
    console.log( data );
    console.log( 'customEvent was triggered!' );
});
```

Later on, you can trigger this event (as many times as you like) and have the above registered callback (and any other callback registered to this event) executed each time it is triggered.

```js
// Trigger the "customEvent" without passing any data to any registered callbacks
AVBCEvent.trigger( 'customEvent' );
// []
// customEvent was triggered!

// Trigger the "customEvent" and pass some random data to any registered callbacks
AVBCEvent.trigger( 'customEvent', 'someData', ['some', 'other', 'data'], { yet: 'even', more: 'data!' } );  // Trigger with data
// ["someData", Array[3], Object]
// customEvent was triggered!
```

### Dequeue a Callback After an Event is Triggered
Rather than having a callback be executed everytime our custom event is triggered, instead we can just have it removed from the event's callback list.  This way, our callback is executed once ever.

>> NOTE: While it is true that this callback will be executed once ever for a given event, you should be aware that
>> if the event has already been executed, the callback will be immediatley executed and the previous data (if any)
>> will be supplied.

```js
AVBCEvent.on( 'customEvent', function( data ) {
    console.log( data );
    console.log( 'customEvent was triggered!' );
}, true);
```

Notice that we are passing *true* as the 3rd parameter to the *on* method above - which will ensure our callback is executed once ever.


Later on, you can trigger this event (as many times as you like) with the callback being executed only once and then being dequeued from the event's list.

```js
AVBCEvent.trigger( 'customEvent' );
// []
// customEvent was triggered!


AVBCEvent.trigger( 'customEvent', 'someData', ['some', 'other', 'data'], { yet: 'even', more: 'data!' } );  // Trigger with data
// ...
```


## License 
The MIT License (MIT)
Copyright (c) 2015 Jonathon Hibbard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
