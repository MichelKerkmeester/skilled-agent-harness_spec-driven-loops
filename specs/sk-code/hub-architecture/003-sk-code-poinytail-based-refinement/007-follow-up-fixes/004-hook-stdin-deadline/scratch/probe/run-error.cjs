'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const helper = path.join(__dirname, 'readstdin-candidate.cjs');
const script = `const {readStdin}=require(process.argv[1]);readStdin().then(s=>console.log('RESOLVED '+JSON.stringify(s)),e=>console.log('REJECTED '+e.code))`;
const r = spawnSync(process.execPath, ['-e', script, helper], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 10000 });
console.log(JSON.stringify({ stdout: r.stdout.trim(), status: r.status }));
