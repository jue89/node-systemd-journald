"use strict";

var assert = require( 'assert' );
var mockery = require( 'mockery' );


describe( "node-systemd-journald", function() {

	var journal_send;
	var log;

	before( function( done ) {

		// Load mocks
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );
		journal_send = require( './mocks/journal_send.js' );
		mockery.registerMock( './build/Release/journal_send.node', journal_send );

		// Require library under test
		log = require( '../index.js' );

		done();

	} );

	after( function( done ) {

		// Remove all mocks
		mockery.disable();

		done();

	} );

	it( "should throw an error if no message has been defined", function( done ) {

		try {
			log.debug();
		} catch( e ) {
			done();
		}

	} );

	it( "should log an emerg", function( done ) {

		log.emerg( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '0' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log an alert", function( done ) {

		log.alert( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '1' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log a crit", function( done ) {

		log.crit( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '2' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log an err", function( done ) {

		log.err( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '3' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log a warning", function( done ) {

		log.warning( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '4' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log a notice", function( done ) {

		log.notice( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '5' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log a info", function( done ) {

		log.info( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '6' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should log a debug", function( done ) {

		log.debug( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '7' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should append specified fields", function( done ) {

		log.debug( 'Test', {
			number: 3,
			boolean: true,
			string: 'Chuck Norris',
			OBJ: {
				nUmBer: 4
			},
			ARR: [ 5 ]
		} );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '7' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			assert.strictEqual( journal_send.getField( 'NUMBER' ), '3' );
			assert.strictEqual( journal_send.getField( 'BOOLEAN' ), 'true' );
			assert.strictEqual( journal_send.getField( 'STRING' ), 'Chuck Norris' );
			assert.strictEqual( journal_send.getField( 'OBJ_NUMBER' ), '4' );
			assert.strictEqual( journal_send.getField( 'ARR_0' ), '5' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should convert Error instances", function( done ) {

		log.debug( new Error( 'Test' ) );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '7' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			assert.strictEqual( journal_send.getField( 'CODE_LINE' ), '190' );
			assert.strictEqual( journal_send.getField( 'CODE_FUNC' ), 'Context.<anonymous>' );
			assert.strictEqual( journal_send.getField( 'CODE_FILE' ).substr( -13 ), 'test/index.js' );
			assert.notStrictEqual( journal_send.getField( 'STACK_TRACE' ), undefined );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should set the syslog identifier", function( done ) {

		var localLog = new log( { syslog_identifier: 'test-identifier' } );
		localLog.debug( 'Test' );

		try {
			assert.strictEqual( journal_send.getField( 'SYSLOG_IDENTIFIER' ), 'test-identifier' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should prefer the identifier set in the options to the global identifier", function( done ) {

		var localLog = new log( { syslog_identifier: 'test-identifier' } );
		localLog.debug( 'Test', {
			syslog_identifier: 'local-identifier'
		} );

		try {
			assert.strictEqual( journal_send.getField( 'SYSLOG_IDENTIFIER' ), 'local-identifier' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should not touch default fields", function( done ) {

		var defaultFields = { syslog_identifier: 'test-identifier' };
		var localLog = new log( defaultFields );
		localLog.debug( new Error('test error') );

		try {
			assert.deepEqual( Object.keys( defaultFields ), [ 'syslog_identifier' ] );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should convert buffers into strings", function( done ) {

		log.debug( 'test', {
			test: new Buffer([0x00, 0x01, 0x02, 0xff])
		} );

		try {
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'test' );
			assert.strictEqual( journal_send.getField( 'TEST' ), '000102ff' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

	it( "should convert null into string 'null'", function( done ) {

		log.debug( 'test', {
			test: null
		} );

		try {
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'test' );
			assert.strictEqual( journal_send.getField( 'TEST' ), 'null' );
			done();
		} catch( e ) {
			done( e );
		}

	} );

} );


describe("real module", function() {
	it("should not crash when logging", function() {
		var log = require( '../index.js' );
		log.debug("debug message", {test: true});
	})
})
