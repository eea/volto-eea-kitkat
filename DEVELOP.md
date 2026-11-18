# volto-eea-kitkat

## Develop

1. Make sure you have `docker` and `docker compose` installed and running on your machine:

    ```Bash
    git clone https://github.com/eea/volto-eea-kitkat.git
    cd volto-eea-kitkat
    git checkout -b bugfix-123456 develop
    make
    make start
    ```

1. Wait for `Volto started at 0.0.0.0:3000` meesage

1. Go to http://localhost:3000

1. Initialize git hooks

    ```Bash
    yarn prepare
    ```

1. Happy hacking!

### Or add @eeacms/volto-eea-kitkat to your Volto project

Before starting make sure your development environment is properly set. See the official Plone documentation for [creating a project with Cookieplone](https://6.docs.plone.org/install/create-project-cookieplone.html) and [installing an add-on in development mode in Volto 18 and 19](https://6.docs.plone.org/volto/development/add-ons/install-an-add-on-dev-18.html).

For new Volto 18+ projects, use Cookieplone. It includes `mrs-developer` by default.

1.  Create a new Volto project with Cookieplone

        uvx cookieplone project
        cd project-title

1.  Add the following to `mrs.developer.json`:

        {
            "volto-eea-kitkat": {
                "output": "packages",
                "url": "https://github.com/eea/volto-eea-kitkat.git",
                "package": "@eeacms/volto-eea-kitkat",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Add `@eeacms/volto-eea-kitkat` to the `addons` key in your project `volto.config.js`

1.  Install or refresh the project setup

        make install

1.  Start backend in one terminal

        make backend-start

    ...wait for backend to setup and start, ending with `Ready to handle requests`

    ...you can also check http://localhost:8080/Plone

1.  Start frontend in a second terminal

        make frontend-start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd packages/volto-eea-kitkat

For legacy Volto 17 projects, keep using the yarn-based workflow from the Volto 17 documentation.

## Cypress

To run cypress locally, first make sure you don't have any Volto/Plone running on ports `8080` and `3000`.

You don't have to be in a `clean-volto-project`, you can be in any Volto Frontend
project where you added `volto-eea-kitkat` to `mrs.developer.json`

Go to:

  ```BASH
  cd packages/volto-eea-kitkat/
  ```

Start:

  ```Bash
  make
  make start
  ```

This will build and start with Docker a clean `Plone backend` and `Volto Frontend` with `volto-eea-kitkat` block installed.

Open Cypress Interface:

  ```Bash
  make cypress-open
  ```

Or run it:

  ```Bash
  make cypress-run
  ```

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

If the optional SMTP secrets are configured, failed scans also send an email to
the last commit committer. The workflow expects these repository or
organization secrets:

- `SMTP_URL`
- `SMTP_PORT` (optional, defaults to `25`)
- `SMTP_EMAIL`
- `SMTP_PASSWORD` (optional if the SMTP server does not require authentication)

Port `465` is sent with direct TLS; other ports use the default SMTP handshake.
The email includes a short finding summary from the redacted Betterleaks report,
including the redacted matched line from each finding.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.
