# volto-eea-kitkat

[Volto](https://github.com/plone/volto) Add-ons bundle - A known good set of Volto addons to be used within all EEA projects and beyond

## Develop

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://docs.voltocms.com/getting-started/install/)

1.  Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        npm install -g yo @plone/generator-volto mrs-developer

1.  Create new volto app

        yo @plone/volto kitkat-volto-project --addon @eeacms/volto-eea-kitkat --skip-install
        cd kitkat-volto-project

1.  Add the following to `mrs.developer.json`:

        {
            "volto-eea-kitkat": {
                "url": "https://github.com/eea/volto-eea-kitkat.git",
                "package": "@eeacms/volto-eea-kitkat",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install

        yarn develop
        yarn

1.  Start backend

        docker pull plone
        docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone

    ...wait for backend to setup and start - `Ready to handle requests`:

        docker logs -f plone

    ...you can also check http://localhost:8080/Plone

1.  Start frontend

        yarn start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd src/addons/volto-eea-kitkat/
