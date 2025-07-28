const { defineConfig } = require('cypress');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      on('before:run', async () => {
        const jsonDir = 'cypress/reports/json';

        if (!fs.existsSync(jsonDir)) {
          fs.mkdirSync(jsonDir, { recursive: true });
          console.log('📁 Pasta JSON criada');
        }
      });

      on('after:run', async () => {
        const jsonDir = 'cypress/reports/json';
        const htmlDir = 'cypress/reports/html';

        if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

        const report = await merge({ files: [`${jsonDir}/*.json`] });
        await generator.create(report, {
          reportDir: htmlDir,
          reportFilename: 'report-test-accessibility-index',
          inlineAssets: true,
        });
        console.log('✅ Relatório HTML gerado!');
      });
    },
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    screenshotsFolder: 'cypress/reports/screenshots',
    video: false,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/json',
      overwrite: false,
      html: false,
      json: true
    }
  }
});
