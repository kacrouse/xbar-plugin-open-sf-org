#!/bin/bash
PLUGIN_FILENAME=$(jq -r '.xbar.pluginFilename' package.json)
source .env
cp "dist/$PLUGIN_FILENAME" "$PLUGINS_DIR"
chmod +x "$PLUGINS_DIR/$PLUGIN_FILENAME"