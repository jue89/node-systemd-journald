{
	"targets": [ {
		"target_name":  "journal_send",
		"sources":      [ "src/journal_send.cc" ],
		"include_dirs": [ "<!@(node -p \"require('node-addon-api').include\")" ],
		"libraries":    [ "-lsystemd" ],
		"dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
		"cflags":       [ "-fno-exceptions" ],
		"cflags_cc":    [ "-fno-exceptions" ],
		"defines":      [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
	} ]
}
