PLUGIN_NAME=salesforce-login.1h.js
source .env
cp "dist/$PLUGIN_NAME" "$PLUGINS_DIR"
chmod +x "$PLUGINS_DIR/$PLUGIN_NAME"