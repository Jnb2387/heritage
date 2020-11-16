#!/usr/bin/env sh

# abort on errors
set -e

echo Building. this may take a minute...
npm run build

# navigate into the build output directory
cd dist

echo Deploying..
git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:jnb2387/heritage.git gh-pages

cd -