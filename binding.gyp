{
	"targets": [
		{
			"target_name": "journal_send",
			"sources": [
				"src/journal_send.cc"
			],
			"libraries": [
        "-lsystemd",
      ],
			'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
		} 
	]
}
