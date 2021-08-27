# volto-eea-kitkat
[![Releases](https://img.shields.io/github/v/release/eea/volto-eea-kitkat)](https://github.com/eea/volto-eea-kitkat/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-kitkat%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-kitkat/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-eea-kitkat%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-eea-kitkat/job/develop/display/redirect)

[Volto](https://github.com/plone/volto) Add-ons bundle - A known good set of Volto addons to be used within all EEA projects and beyond

## Features

Demo GIF

## Getting started

### Try volto-eea-kitkat with Docker

1. Get the latest Docker images

   ```
   docker pull plone
   docker pull plone/volto
   ```

1. Start Plone backend
   ```
   docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone
   ```

1. Start Volto frontend

   ```
   docker run -it --rm -p 3000:3000 --link plone -e ADDONS="@eeacms/volto-eea-kitkat" plone/volto
   ```

1. Go to http://localhost:3000

### Add volto-eea-kitkat to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-eea-kitkat"
   ],

   "dependencies": {
       "@eeacms/volto-eea-kitkat": "^1.0.0"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto kitkat-volto-project --addon @eeacms/volto-eea-kitkat
   cd kitkat-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy hacking!

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-eea-kitkat/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-eea-kitkat/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
