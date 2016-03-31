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
			NUMBER: 3,
			BOOLEAN: true,
			STRING: 'Chuck Norris'
		} );

		try {
			assert.strictEqual( journal_send.getField( 'PRIORITY' ), '7' );
			assert.strictEqual( journal_send.getField( 'MESSAGE' ), 'Test' );
			assert.strictEqual( journal_send.getField( 'NUMBER' ), '3' );
			assert.strictEqual( journal_send.getField( 'BOOLEAN' ), 'true' );
			assert.strictEqual( journal_send.getField( 'STRING' ), 'Chuck Norris' );
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
			assert.notStrictEqual( journal_send.getField( 'STACK_TRACE' ), undefined );
			done();
		} catch( e ) {
			done( e );
		}

	} );

} );
