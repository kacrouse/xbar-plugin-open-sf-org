#!/bin/bash
PLUGIN_FILENAME=$(jq -r '.xbar.pluginFilename' package.json)
source .env
open $(node -e "console.log(encodeURI(process.argv[1]))" "xbar://app.xbarapp.com/refreshPlugin?path=$PLUGINS_DIR/$PLUGIN_FILENAME")