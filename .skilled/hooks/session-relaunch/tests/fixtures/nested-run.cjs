// ───────────────────────────────────────────────────────────────────
// MODULE: Nested Relaunch Run Harness
// ───────────────────────────────────────────────────────────────────
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

// The outer script stands in for the loop's own runtime: it runs one shell tool call and
// waits for it, the way a runtime runs a command the session asked for.
const OUTER_SOURCE = `'use strict';
const { spawnSync } = require('node:child_process');

const nodeExe = process.execPath;
const nestedScript = process.env.NESTED_RUN_NESTED;
// The trailing commands keep sh from exec-replacing itself with node, so the runtime keeps a
// shell between the loop's own runtime and itself, and the runtime status still comes back.
const command = '"' + nodeExe + '" "' + nestedScript + '"; status=$?; :; exit $status';
const result = spawnSync('/bin/sh', ['-c', command], { stdio: 'inherit' });
process.exit(result.status ?? 1);
`;

// The nested script is the runtime the shell tool started; it runs the hook or CLI and
// carries its exit status back up the chain.
const NESTED_SOURCE = `'use strict';
const { spawnSync } = require('node:child_process');

const argv = JSON.parse(process.env.NESTED_RUN_ARGV || '[]');
const result = spawnSync(process.execPath, argv, { stdio: 'inherit' });
process.exit(result.status ?? 1);
`;

/**
 * Run a command from a runtime started inside the loop's shell tool.
 *
 * @param {Object} options - Command and environment to run.
 * @param {string[]} [options.argv=[]] - Script path and arguments handed to node.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Environment the chain inherits.
 * @param {string} [options.cwd] - Working directory of the outer runtime.
 * @param {string} [options.input=''] - Text written to the chain's stdin.
 * @returns {Promise<{code: number, stdout: string, stderr: string}>} Child outcome.
 */
async function runNested({ argv = [], env = process.env, cwd, input = '' }) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'session-relaunch-nested-'));
  const outerPath = path.join(directory, 'outer.cjs');
  const nestedPath = path.join(directory, 'nested.cjs');
  fs.writeFileSync(outerPath, OUTER_SOURCE);
  fs.writeFileSync(nestedPath, NESTED_SOURCE);
  // argv travels as JSON so a script path never has to survive shell quoting.
  const childEnv = {
    ...env,
    NESTED_RUN_NESTED: nestedPath,
    NESTED_RUN_ARGV: JSON.stringify(argv),
  };

  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [outerPath], {
        cwd,
        env: childEnv,
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (chunk) => { stdout += chunk; });
      child.stderr.on('data', (chunk) => { stderr += chunk; });
      child.once('error', reject);
      child.once('close', (code) => resolve({ code, stdout, stderr }));
      // A command that exits before reading stdin fails the write, and the close event
      // still carries the outcome the caller asserts on.
      child.stdin.on('error', () => {});
      child.stdin.end(input);
    });
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

module.exports = { runNested };
