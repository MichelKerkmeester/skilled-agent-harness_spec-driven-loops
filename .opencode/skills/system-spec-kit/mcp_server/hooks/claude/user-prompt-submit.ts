#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Claude User Prompt Submit Shim
// ───────────────────────────────────────────────────────────────
// Thin process-boundary shim. The advisor implementation lives in
// system-skill-advisor; this path stays for existing runtime settings.

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TARGET = '.opencode/skills/system-skill-advisor/mcp_server/dist/hooks/claude/user-prompt-submit.js';

const result = spawnSync(process.execPath, [TARGET, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  input: readFileSync(0),
  encoding: 'utf8',
  env: process.env,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error || result.status !== 0) process.stdout.write('{}\n');

process.exit(0);
