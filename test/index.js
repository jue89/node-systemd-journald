"use strict";

var assert = require( 'assert' );
var mockery = require( 'mockery' );


describe( "node-systemd-journald", function() {

	var log;

	before( function( done ) {

		// Load mocks
		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

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
