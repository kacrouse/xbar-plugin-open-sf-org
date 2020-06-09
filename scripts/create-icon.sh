#!/bin/bash
curl -s https://c1.sfdcstatic.com/content/dam/web/en_us/www/images/styleguide/Logos/Salesforce_Logo_RGB_V2.png \
  | magick - \
  -trim \ # crop transparent edges
  -channel RGB -threshold 100% \ # force cloud to all black, keeping transparency as is
  -channel RGBA \ # reset to include transparency
  -resize 'x26' \ # auto-width, height: 26px
  -density 144 -units pixelsperinch \ # 144ppi
  assets/icon.png