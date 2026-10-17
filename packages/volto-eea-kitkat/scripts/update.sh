#!/bin/bash
DEPENDENCIES=$(jq -r '.dependencies|keys[]' package.json)
for dependency in $DEPENDENCIES; do
    yarn add "$dependency"
    version=$(jq -r ".dependencies[\"$dependency\"]" package.json)
done
