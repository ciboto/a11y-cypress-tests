const { defineConfig } = require('cypress');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Log simples via cy.task
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // Cria pasta JSON antes da execução
      on('before:run', async () => {
        const jsonDir = 'cypress/reports/json';
        if (!fs.existsSync(jsonDir)) {
          fs.mkdirSync(jsonDir, { recursive: true });
          console.log('📁 Pasta JSON criada');
        }
      });

      // Gera o relatório HTML após o merge
      on('after:run', async () => {
        const jsonDir = 'cypress/reports/json';
        const htmlDir = 'cypress/reports/html';

        if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });

        // Apenas arquivos JSON válidos (contêm "stats")
        const validFiles = fs.readdirSync(jsonDir)
          .filter(file => file.endsWith('.json'))
          .map(file => `${jsonDir}/${file}`)
          .filter(file => {
            try {
              const content = fs.readFileSync(file, 'utf8');
              return content.includes('"stats"');
            } catch {
              return false;
            }
          });

        if (validFiles.length === 0) {
          console.log('⚠️ Nenhum JSON válido encontrado para o merge.');
          return;
        }

        const report = await merge({ files: validFiles });
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
