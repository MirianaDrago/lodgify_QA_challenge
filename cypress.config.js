const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://app.clickup.com",  
    supportFile: 'cypress/support/index.js',
    watchForFileChanges: false,  
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
