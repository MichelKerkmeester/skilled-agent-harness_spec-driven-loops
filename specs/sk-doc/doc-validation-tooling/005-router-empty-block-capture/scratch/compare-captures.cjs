#!/usr/bin/env node
'use strict';
// Compares what the old and the new block pattern capture from every ROUTER.md,
// so a pattern change can be shown to alter only one-line blocks.
// usage: node compare-captures.cjs [skills-root]   (default: .skilled/skills)
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.argv[2] || '.skilled/skills');
const patterns = (name) => ({
  old: new RegExp(`${name}\\s*=\\s*\\{([\\s\\S]*?)\\n\\}`),
  next: new RegExp(`${name}\\s*=\\s*\\{([^\\n]*(?=\\}[ \\t]*$)|[\\s\\S]*?(?=\\n\\}))`, 'm'),
});

function routers(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) routers(full, out);
    else if (entry.name === 'ROUTER.md') out.push(full);
  }
  return out;
}

const files = routers(root).sort();
for (const name of ['INTENT_SIGNALS', 'RESOURCE_MAP']) {
  const { old, next } = patterns(name);
  const differ = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const a = old.exec(text);
    const b = next.exec(text);
    if ((a ? a[1] : null) !== (b ? b[1] : null)) differ.push(path.relative(root, file));
  }
  console.log(`${name}: files=${files.length} identical=${files.length - differ.length} differ=${differ.length}`);
  for (const file of differ) console.log(`  ${file}`);
}
