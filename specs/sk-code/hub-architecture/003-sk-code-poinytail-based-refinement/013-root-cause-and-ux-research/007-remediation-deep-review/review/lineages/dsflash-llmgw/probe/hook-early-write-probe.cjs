// Read-only probe: reproduce the 006 phase's claimed mutant detection. Spawn the
// Claude prompt-submit shim with a held-open stdin whose payload is written BEFORE the
// 500 ms deadline; the payload should be read and forwarded to the stub, so stdout is
// NOT '{}' — i.e. an early write makes the late-write test's assertion fail, proving
// the test detects the mutant at 100 ms. Writes only a temp dir under os.tmpdir.
// Usage: node hook-early-write-probe.cjs <repo-root>
'use strict';
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(process.argv[2] ?? '.');
const runtimeRoot = path.join(repoRoot, '.skilled/skills/system-spec-kit/runtime');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-early-write-'));
const target = path.join(workspace, 'advisor-stub.cjs');
fs.writeFileSync(
  target,
  "let text = ''; process.stdin.on('data', (chunk) => { text += chunk; }).on('end', () => { process.stdout.write(JSON.stringify({ received: JSON.parse(text) })); });\n",
);

const started = Date.now();
const child = spawn(process.execPath, [path.join(runtimeRoot, 'dist/hooks/claude/user-prompt-submit.js')], {
  cwd: repoRoot,
  env: { ...process.env, SPECKIT_USER_PROMPT_TARGET: target },
  stdio: ['pipe', 'pipe', 'pipe'],
});
let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk; });
child.stderr.on('data', (chunk) => { stderr += chunk; });
child.stdin.on('error', () => {});
setTimeout(() => child.stdin.write(JSON.stringify({ prompt: 'early prompt' })), 100);
const killer = setTimeout(() => child.kill('SIGKILL'), 15000);
child.on('close', (code, signal) => {
  clearTimeout(killer);
  const elapsedMs = Date.now() - started;
  console.log(JSON.stringify({ code, signal, elapsedMs, stdout: stdout.trim(), stderr: stderr.trim(), sawPayload: stdout.trim() !== '{}' }));
});
