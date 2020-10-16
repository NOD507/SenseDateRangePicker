#!/bin/bash
set -o errexit

echo "$(new JsonSlurper().parseText(new File('package.json').text).version)"

# Usage
# $ get-bumped-version.sh
