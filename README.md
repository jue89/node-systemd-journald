# node-systemd-journald

Node.js module for native bindings to the ~~dearly beloved~~ systemd-journald.

Successfully tested under NodeJS v0.10.36, v0.11.16, v0.12.12, v4.4.1, v5.9.1.


## Example

This example will start an ExpressJS server. Open your browser and visit: ```http://localhost:3000/{a}/{b}```

The server will return the result of ```a``` divided by ```b```. You feel subversive and may want to try ```b``` equals zero?! ;)

```javascript
// npm install express systemd-journald
"use strict";

const log = require( 'systemd-journald' );
const app = require( 'express' )();

// This will be the displayed name in the journal
process.title = "awesome-devide";

app.get( '/:a/:b', ( req, res ) => {
  try {

    // Convert numbers
    let a = parseInt( req.params.a );
    let b = parseInt( req.params.b );

    // Divide a by b
    let q = a / b;

    // Throw an error if the result is not a number
    // Funny side fact: In the first place I checked:
    // if( typeof q != 'number' ) ...
    // Well, this was not working. Infinity is recognised as 'number' and, you
    // might already guessed it, NaN as well! Javascript as we know and love it.
    if( isNaN( q ) || q === Infinity ) throw new Error( "No number!" );

    // Send the result to the client
    res.end( q.toString() );

    // Log this request with priority 7
    log.debug( "Just answered a request", {
      'DIVIDEND'   : a,
      'DIVISOR'    : b,
      'QUOTIENT'   : q,
      'REMOTE_ADDR': req.connection.remoteAddress
    } );

    // Are you interested in the requests of a specific IP? Try:
    // $ journalctl -t awesome-devide REMOTE_ADDR={IP}

  } catch( e ) {

    // The user screwed up! This will write the error message and stack trace to
    // the journal with priority 3. Checkout your journal:
    // $ journalctl -t awesome-devide -p 3 -o json-pretty
    log.err( e );

    res.status( 400 ).end( e.message );

  }
} );

app.listen( 3000 );
```


## Installation

Debian-flavoured Linux distributions:

```bash
sudo apt-get install build-essential \
                     python \
                     pkg-config \
                     libsystemd-dev

npm install systemd-journald --save
```


## API

```javascript
const log = require( 'systemd-journald' );

                                // Log level:
log.emerg( message, fields );   // - 0
log.alert( message, fields );   // - 1
log.crit( message, fields );    // - 2
log.err( message, fields );     // - 3
log.warning( message, fields ); // - 4
log.notice( message, fields );  // - 5
log.info( message, fields );    // - 6
log.debug( message, fields );   // - 7
```

 * ```message```: String or instance of Error.
 * ```fields```: Further key-value data attached to the journal. Nested objects will be also included in the journal. ```{ "OBJ": { "NESTED": "Chuck Norris" } }``` will become ```OBJ_NESTED=Chuck Norris```. Quite handy for filtering the journal.


## Why?

This module has been written after some unsuccessful attempts to get the module [journald](https://www.npmjs.com/package/journald) version 0.0.5 working under NodeJS 4.x / 5.x. Due to massive API changes of the v8 engine this module is fully broken from the point of view of recent NodeJS releases. So I rewrote it - this time with a little help of *Native Abstractions for Node.js* (nan). The nice guys from nan promised to ensure compatibility even on future API changes of v8. We will see ;)
