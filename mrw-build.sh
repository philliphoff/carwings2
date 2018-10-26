#!/bin/bash
. ~/.nvm/nvm.sh install lts/boron
. ~/.nvm/nvm.sh use lts/boron
npm install .
npm install gulp-cli -g
npm install gulp -D
npm install babel-register
npx -p touch nodetouch gulpfile.js
gulp build -f gulpfile.babel.js

