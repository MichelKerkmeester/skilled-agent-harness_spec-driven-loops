// Usage: node smoke.cjs <fanout-run.cjs> <label> <out-dir>   (run with cwd = the project the child should use)
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const [fanoutPath, label, outDir] = process.argv.slice(2);
const fanout = require(fanoutPath);
fs.mkdirSync(outDir, { recursive: true });
const lineageDir = path.join(outDir, 'lineage');
fs.mkdirSync(lineageDir, { recursive: true });
const token = `SMOKE-OK-${label}`;
const lineageFile = path.join(lineageDir, 'smoke.txt');
const prompt = `Use your shell tool once to run exactly: printf '%s\\n' ${token} > ${lineageFile}\nThen reply with only: ${token}`;
const built = fanout.buildLineageCommand(
  { kind: 'cli-opencode', label: `smoke-${label}`, model: 'llmgateway/deepseek-v4.1-flash' },
  prompt, 'danger-full-access', 'bypassPermissions', { env: process.env },
);
const cwd = built.cwd || process.cwd();
fs.writeFileSync(path.join(outDir, 'argv.json'), JSON.stringify({ command: built.command, args: built.args.map((a) => (a === prompt ? '<prompt>' : a)), cwd, effectiveConfig: built.effectiveConfig }, null, 2));
const r = spawnSync(built.command, built.args, { cwd, env: process.env, stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000, maxBuffer: 20 * 1024 * 1024 });
fs.writeFileSync(path.join(outDir, 'stdout.jsonl'), r.stdout || '');
fs.writeFileSync(path.join(outDir, 'stderr.txt'), r.stderr || '');
let cost = 0; let text = '';
for (const line of String(r.stdout || '').split('\n')) {
  try { const o = JSON.parse(line); const p = o.part || {}; if (p.type === 'step-finish') cost += p.cost || 0; if (p.type === 'text') text += p.text || ''; } catch { /* non-JSON line */ }
}
const fileText = fs.existsSync(lineageFile) ? fs.readFileSync(lineageFile, 'utf8').trim() : null;
const summary = { label, command: built.command, exit: r.status, signal: r.signal, error: r.error ? String(r.error.message) : null, tokenInReply: text.includes(token), lineageFile: fileText, lineageFileMatches: fileText === token, costUsd: Number(cost.toFixed(6)) };
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
