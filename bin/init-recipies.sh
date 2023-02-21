#!/bin/bash

# Initialize recipes for next Ibexa DXP version base on previous one.
if [ ! -n "$1" ]
then
    echo "Usage: `basename $0` <prev-version> <next-version>"
    exit 1
fi

PREV_VERSION=$1;
NEXT_VERSION=$2;

for package in ibexa/*; do
  if [[ -d "$package/$PREV_VERSION" ]]
  then
    cp -rf $package/$PREV_VERSION/. "$package/$NEXT_VERSION"
  fi
done
