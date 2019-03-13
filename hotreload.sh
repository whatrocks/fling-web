#!/bin/bash

echo "Checking dependencies..."

if ! [ -x "$(command -v wach)" ]; then
  echo "Installing wach."
  npm install -g wach
fi

if ! [ -x "$(command -v rld)" ]; then
  echo "Installing rld."
  npm install -g rld
fi

echo "Opening site in Chrome."
open index.html

echo "Heating up the hot-reloading furnace..."
wach 'clear; rld chrome'