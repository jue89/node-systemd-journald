{
	"targets": [ {
		"target_name":  "journal_send",
		"sources":      [ "src/journal_send.cc" ],
		"include_dirs": [ "<!(node -e \"require('nan')\")" ],
		"libraries":    [ "<!@(pkg-config --libs-only-l --silence-errors libsystemd || pkg-config --libs-only-l libsystemd-journal)" ]
	} ]
}
