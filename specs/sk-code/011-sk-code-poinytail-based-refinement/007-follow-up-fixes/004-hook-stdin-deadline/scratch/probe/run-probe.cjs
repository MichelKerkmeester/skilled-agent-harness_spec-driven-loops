'use strict';
const { spawn } = require('node:child_process');
const path = require('node:path');
const helper = path.join(__dirname, 'readstdin-candidate.cjs');
const script = `const {readStdin}=require(process.argv[1]);const t=Date.now();readStdin().then(s=>{process.stdout.write(JSON.stringify({s,ms:Date.now()-t}))})`;
const child = spawn(process.execPath, ['-e', script, helper], { stdio: ['pipe', 'pipe', 'pipe'] });
let out = '';
child.stdout.on('data', (d) => { out += d; });
const started = Date.now();
child.stdin.write('{"tool_name":"Write"');
const killer = setTimeout(() => { child.kill('SIGKILL'); console.log('HUNG: killed after 10000 ms'); }, 10000);
child.on('close', (code, signal) => {
  clearTimeout(killer);
  console.log(JSON.stringify({ out, code, signal, wallMs: Date.now() - started }));
});
