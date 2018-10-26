#!/bin/bash

if [ -f ~/.nvm/nvm.sh ]; then
  . ~/.nvm/nvm.sh install lts/boron
  . ~/.nvm/nvm.sh use lts/boron
  npm install .
  sudo npm install gulp-cli -g
  sudo npm install gulp -D
  sudo npm install npx -g
  npm install babel-register
  npx -p touch nodetouch gulpfile.js
  gulp build -f gulpfile.babel.js
  sudo npm link
else
  echo "Install NVM so the script can install the correct version of nodejs"
fi

