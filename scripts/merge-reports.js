const fs = require('fs');
const path = require('path');
const { merge } = require('mochawesome-merge');
const generator = require('mochawesome-report-generator');

(async () => {
  const jsonDir = path.resolve(__dirname, '../cypress/reports/json');
  const htmlDir = path.resolve(__dirname, '../cypress/reports/html');

  if (!fs.existsSync(jsonDir)) {
    console.error('❌ Diretório de JSONs não encontrado:', jsonDir);
    process.exit(1);
  }

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
    console.log('📁 Pasta HTML criada:', htmlDir);
  }

  // Localiza e filtra JSONs válidos
  const validFiles = fs.readdirSync(jsonDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(jsonDir, file))
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
    process.exit(0);
  }

  console.log(`🔍 ${validFiles.length} arquivo(s) encontrado(s) para merge...`);

  const mergedReport = await merge({ files: validFiles });

  await generator.create(mergedReport, {
    reportDir: htmlDir,
    reportFilename: 'report-test-accessibility-index',
    reportTitle: 'Relatório de Acessibilidade Cypress + axe-core',
    inlineAssets: true,
    inline: true,
    overwrite: true,
    saveHtml: true,
    saveJson: true,
    charts: true,
    code: true,
  });

  console.log('✅ Relatório HTML gerado com sucesso!');
})();
