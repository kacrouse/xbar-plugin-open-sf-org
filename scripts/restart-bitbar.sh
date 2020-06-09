#!/bin/bash
# ideally we'd just refresh the individual plugin, but this will do for now
osascript <<EOD
	tell application "BitBar" to quit
	delay 1
	tell application "BitBar" to activate
EOD