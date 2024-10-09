const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    "reporter": "mochawesome",
    "reporterOptions": {
      "reportDir": "cypress/reports",
      "overwrite": false,
      "html": true,
      "json": true,
      "screenshots": true 
    },
    video: true,
    baseUrl: "https://app.clickup.com",  
    supportFile: 'cypress/support/index.js',
    watchForFileChanges: false,  
    screenshotOnRunFailure: true, 
    screenshotsFolder: 'cypress/screenshots', 
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
