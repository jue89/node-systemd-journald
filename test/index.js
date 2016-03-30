"use strict";

const assert = require( 'assert' );
const mockery = require( 'mockery' );


describe( "node-systemd-journald", () => {

	let log;

	before( ( done ) => {

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

	after( ( done ) => {

		// Remove all mocks
		mockery.disable();

		done();

	} );

} );
