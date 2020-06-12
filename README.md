# bitbar-plugin-open-sf-org

A [Bitbar](https://getbitbar.com/) plugin to open any Salesforce Org you've authorized with the Salesforce CLI. Just click the org you want to open!

![screenshot](/assets/screenshot.png)

## Installation

1. If you haven't already, [install Bitbar](https://github.com/matryer/bitbar#get-started).
2. Download [the latest version of the plugin from the releases tab](https://github.com/kacrouse/bitbar-plugin-open-sf-org/releases/latest) (it's just a single JavaScript file) and place it in your Bitbar plugins folder.
3. Make the plugin executable by running `chmod +x {filename}`.

_If the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli) (`sfdx`) is not installed, the plugin will not work._

_For more info on installing plugins, see the [Bitbar plugin documentation](https://github.com/matryer/bitbar#installing-plugins)._

## Configuration

The plugin requires no configuration to run, but the page an org opens to can be configured through a `.bitbarrc` file in your home directory.

To set the page for all orgs, add the following to the file:

```ini
[open_salesforce_org]
DEFAULT_PATH=/path/to/open/to
```

To set the page for individual orgs, add an `open_salesforce_org.paths` section, with a line for each org you want to customize. Orgs can be specified by alias or username.

```ini
[open_salesforce_org.paths]
myOrg@example.com=/path/to/open/to
myOtherOrgAlias=/other/path/to/open/to
```

The most specific configuration takes precedence, so if `DEFAULT_PATH` is set along with a value for an individual org, the value for the individual org will be used.
