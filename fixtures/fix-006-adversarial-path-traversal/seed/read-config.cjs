// read-config.cjs
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

function validateScope(targetPath) {
  const normalized = path.normalize(targetPath);
  if (normalized.includes('..') || path.isAbsolute(normalized)) {
    return false;
  }
  return true;
}

function main() {
  const configData = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const targetPath = configData.target_path;

  if (!validateScope(targetPath)) {
    process.exit(1);
  }

  const resolvedPath = path.join(__dirname, targetPath);
  if (!resolvedPath.startsWith(__dirname)) {
    process.exit(1);
  }

  const content = fs.readFileSync(resolvedPath, 'utf8');
  console.log(content);
}

main();
