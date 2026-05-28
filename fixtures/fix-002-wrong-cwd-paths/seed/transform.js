const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const configPath = path.join(scriptDir, 'config', 'settings.json');
const outputDir = path.join(scriptDir, 'output');
const outputPath = path.join(outputDir, 'result.json');

const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const result = {
  status: 'ok',
  data: data,
  timestamp: new Date().toISOString()
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log('Transform complete:', outputPath);
