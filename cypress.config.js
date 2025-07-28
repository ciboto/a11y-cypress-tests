const { defineConfig } = require('cypress');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
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

        // Faz o merge dos arquivos
        const mergedReport = await merge({ files: validFiles });

        // Gera HTML com tudo embutido
        await generator.create(mergedReport, {
          reportDir: htmlDir,
          reportFilename: 'report-test-accessibility-index',
          reportTitle: 'Relatório de Acessibilidade',
          inline: true,               // força assets inline
          inlineAssets: true,         // garante scripts e CSS dentro do HTML
          overwrite: true,            // sobrescreve relatório antigo
          saveHtml: true,
          saveJson: true,
          charts: true,
          code: true,
        });

        console.log('✅ Relatório HTML gerado com sucesso (inline)!');
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
