const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2];

if (!targetPath) {
  console.error('Missing target_path argument');
  process.exit(1);
}

const allowedRoot = path.resolve(__dirname);
const resolvedPath = path.resolve(targetPath);

if (!resolvedPath.startsWith(allowedRoot + path.sep)) {
  console.error('Path traversal rejected');
  process.exit(1);
}

const content = fs.readFileSync(resolvedPath, 'utf8');
console.log(content);
