const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 8888,
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  screenshotOnRunFailure: false,
  reporter: 'junit',
  video: true,
  retries: {
    runMode: 8,
    openMode: 0,
  },
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
    },
    baseUrl: 'http://localhost:3000',
    specPattern: '../**/cypress/e2e/**/*.cy.js',
    // excludeSpecPattern:
    //   '../../../node_modules/@eeacms/volto-slate-zotero/cypress/e2e/**/*.js',
    fixturesFolder: '../volto-slate-zotero/cypress/fixtures',
  },
});
