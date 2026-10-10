'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const helper = path.join(__dirname, 'readstdin-candidate.cjs');
const script = `const {readStdin}=require(process.argv[1]);readStdin().then(s=>process.stdout.write(s))`;
const input = JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'a.js' }, cwd: '/x' });
const r = spawnSync(process.execPath, ['-e', script, helper], { input, encoding: 'utf8', timeout: 10000 });
console.log(JSON.stringify({ same: r.stdout === input, status: r.status, signal: r.signal, stderr: r.stderr }));
