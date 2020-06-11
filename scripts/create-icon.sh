#!/bin/bash
# -trim: crop transparent edges
# -channel RGB -threshold 100%: force cloud to all black, keeping transparency as is
# -channel RGBA: reset to include transparency
# -resize: auto-width, height: 26px
curl -s https://c1.sfdcstatic.com/content/dam/web/en_us/www/images/styleguide/Logos/Salesforce_Logo_RGB_V2.png |
  magick - \
    -trim \
    -channel RGB -threshold 100% \
    -channel RGBA \
    -resize 'x26' \
    -density 144 -units pixelsperinch \
    assets/icon.png
