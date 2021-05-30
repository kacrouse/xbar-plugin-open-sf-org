#!/bin/bash
PLUGIN_FILENAME=$(jq -r '.pluginFilename' package.json).1h.js
source .env
cp "dist/$PLUGIN_FILENAME" "$PLUGINS_DIR"
chmod +x "$PLUGINS_DIR/$PLUGIN_FILENAME"