const { merge } = require('mochawesome-merge');
const fs = require('fs');
const path = require('path');

const dir = 'cypress/reports/json';
const output = path.join(dir, 'mochawesome.json');

(async () => {
  try {
    const files = fs.readdirSync(dir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dir, file))
      .filter(file => fs.readFileSync(file, 'utf8').includes('"stats"'));

    if (files.length === 0) {
      console.log('Nenhum JSON válido para mesclar.');
      process.exit(0);
    }

    const report = await merge({ files });
    fs.writeFileSync(output, JSON.stringify(report, null, 2));
    console.log('✅ Mochawesome report merged!');
  } catch (err) {
    console.error('❌ Erro ao mesclar reports:', err);
    process.exit(1);
  }
})();
