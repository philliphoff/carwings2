#!/bin/bash

npm install .
sudo npm install gulp-cli -g
sudo npm install gulp -D
sudo npm install npx -g
npm install babel-register
npx -p touch nodetouch gulpfile.js
gulp build -f gulpfile.babel.js
sudo npm link

