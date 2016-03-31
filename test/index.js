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
		//log = TODO

		done();

	} );

	after( function( done ) {

		// Remove all mocks
		mockery.disable();

		done();

	} );

} );
