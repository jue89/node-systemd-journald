# node-systemd-journald

[![Build Status](https://travis-ci.org/jue89/node-systemd-journald.svg?branch=master)](https://travis-ci.org/jue89/node-systemd-journald)

Node.js module for native bindings to the ~~dearly beloved~~ systemd-journald.

## Example

This example will start an ExpressJS server. Open your browser and visit: `http://localhost:3000/{a}/{b}`

The server will return the result of `a` divided by `b`. You feel subversive and may want to try `b` equals zero?! ;)

```javascript
// npm install express systemd-journald
const Journald = require('systemd-journald');
const app = require('express')();

// This creates a new logging instance. The stated object defines default
// journal fields attached to every logging entry. syslog_identifier is the
// name displayed along with the log lines.
const log = new Journald({syslog_identifier: 'awesome-divide'});

app.get('/:a/:b', (req, res) => {
  try {

    // Convert numbers
    let a = parseInt(req.params.a);
    let b = parseInt(req.params.b);

    // Divide a by b
    let q = a / b;

    // Throw an error if the result is not a number
    // Funny side fact: In the first place I checked:
    // if( typeof q != 'number' ) ...
    // Well, this was not working. Infinity is recognised as 'number' and, you
    // might already guessed it, NaN as well! Javascript as we know and love it.
    if(isNaN(q) || q === Infinity ) throw new Error('No number!');

    // Send the result to the client
    res.end(q.toString());

    // Log this request with priority 7
    log.debug('Just answered a request', {
      'dividend'   : a,
      'divisor'    : b,
      'quotient'   : q,
      'remote_addr': req.connection.remoteAddress
    });

    // Are you interested in the requests of a specific IP? Try:
    // $ journalctl -t awesome-divide REMOTE_ADDR={IP}
    // As you can see, you have to enter the field names in capital letters.

  } catch(e) {

    // The user screwed up! This will write the error message and stack trace to
    // the journal with priority 3. Checkout your journal:
    // $ journalctl -t awesome-divide -p 3 -o json-pretty
    log.err(e);

    res.status(400).end(e.message);

  }
});

app.listen(3000);
```


## Installation

### Install build dependencies
Debian-flavoured Linux distributions:

```bash
sudo apt-get install build-essential \
                     pkg-config \
                     libsystemd-dev
```

If the above doesn't work, it is likely that you are using an older version of systemd as it is shipped with Ubuntu <= 14.04 or Mint <= 17. No problem just try this instead:

```bash
sudo apt-get install build-essential \
                     pkg-config \
                     libsystemd-journal-dev
```

RHEL 7 flavoured Linux distributions:

```bash
sudo yum install gcc gcc-c++ make git \
                 systemd-devel
```

### NPM Install
In all cases, once the build dependencies are installed:

```bash
npm install systemd-journald --save
```


## API

```javascript
const Journald = require( 'systemd-journald' );
const log = new Journald( defaultFields );

                                // Corresponding syslog level:
log.emerg( message, fields );   // - LOG_EMERG
log.alert( message, fields );   // - LOG_ALERT
log.crit( message, fields );    // - LOG_CRIT
log.err( message, fields );     // - LOG_ERR
log.warning( message, fields ); // - LOG_WARNING
log.notice( message, fields );  // - LOG_NOTICE
log.info( message, fields );    // - LOG_INFO
log.debug( message, fields );   // - LOG_DEBUG
```

 * `message`: String or instance of Error.
 * `fields`: Further key-value data attached to the journal. Nested objects will be also included in the journal. Keys will be converted to upper-case. `{'obj': {'nested': 'Chuck Norris'}}` will become `OBJ_NESTED=Chuck Norris`. Quite handy for filtering the journal.
 * `defaultFields`: Fields attached to every entry. They may be overridden by `fields`.


## Acknowledgement

Sepcial thanks to:
 * [ianare](https://github.com/ianare) for improving compatibility with older systemd versions.
 * [jez9999](https://github.com/jez9999) for making this module immune to future changes of syslog levels.
 * [Z3TA](https://github.com/Z3TA) is responsible for `CODE_FILE`, `CODE_FUNC` and `CODE_LINE` being settable by the `fields` parameter.
 * [bryanburgers](https://github.com/bryanburgers) introduced the idea of default fields.
 * [spion](https://github.com/spion) for introducing compatibility with NodeJS 12 while preserving compatibility down to Node 0.10.

I owe you a drink!


## Why?

This module has been written after some unsuccessful attempts to get the module [journald](https://www.npmjs.com/package/journald) version 0.0.5 working under NodeJS 4.x / 5.x. Due to massive API changes of the v8 engine this module is fully broken from the point of view of recent NodeJS releases. So I rewrote it - this time with a little help of *Native Abstractions for Node.js* (nan). The nice guys from nan promised to ensure compatibility even on future API changes of v8. We will see ;)
