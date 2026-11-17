// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Runs the advisor subprocess against a child that writes a busy marker after one
// mebibyte of stderr, and against one that writes it first, and prints the error
// code and retry count of each. Builds and removes its own temporary folder.
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const { runAdvisorSubprocess } = await import(resolve('.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts'));
const root = mkdtempSync(join(tmpdir(), 'probe-busy-cap-'));
try {
  for (const [label, body] of [
    ['marker after 1 MiB', "process.stderr.write('e'.repeat(1024 * 1024)); process.stderr.write('\\ndatabase is locked\\n');"],
    ['marker first', "process.stderr.write('database is locked\\n');"],
  ]) {
    const scriptPath = join(root, 'child.cjs');
    writeFileSync(scriptPath, `process.stdin.resume();\nprocess.stdin.on('end', () => { ${body} process.exitCode = 1; });\n`);
    const result = await runAdvisorSubprocess('prompt', { workspaceRoot: root, pythonBin: process.execPath, scriptPath, timeoutMs: 10000 });
    console.log(`${label}: errorCode ${result.errorCode}, retriesAttempted ${result.retriesAttempted}`);
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
