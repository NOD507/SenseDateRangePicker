#!/bin/bash
set -o errexit

echo "Creating release for version: $PACKAGE_VERSION"
echo "Artifact name: ./dist/${3}_${PACKAGE_VERSION}.zip"

echo "1: ${1}"
echo "2: ${2}"
echo "3: ${3}"
echo "4: ${4}"

LATEST_VERSION=$(curl --silent "https://api.github.com/repos/$1/$2/releases/latest" | 
  grep '"tag_name":' |                                                                
  sed -E 's/.*"([^"]+)".*/\1/')

echo "LATEST_VERSION: ${LATEST_VERSION}"

if [ "${LATEST_VERSION}" != "${PACKAGE_VERSION}" ]; then

$HOME/bin/ghr -t ${ghoauth} -u ${1} -r ${2} -c ${CIRCLE_SHA1} -delete ${PACKAGE_VERSION} "./dist/${3}_${4}.zip"

else

echo "VERSION: ${PACKAGE_VERSION} already released"

fi