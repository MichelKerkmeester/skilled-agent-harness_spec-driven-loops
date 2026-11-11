#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret CLI
// ───────────────────────────────────────────────────────────────────
// The value-free way to inspect a dotenv file on a runtime whose hooks cannot
// register agent tools. The guard refuses `cat .env`; this command answers the
// questions an agent actually has without printing a single value:
//
//   env-secret.cjs keys <file>               keys the file defines
//   env-secret.cjs validate <file>           line numbers that fail to parse
//   env-secret.cjs fingerprint <file> <KEY>  HMAC-SHA256 of one value
//
// The fingerprint is keyed by ENV_SECRET_GUARD_PEPPER from the environment.
// Output is one JSON object on stdout. Exit 0 on success, 1 on a refusal or a
// missing key, 2 on bad usage.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const core = require('../lib/env-secret-guard.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. MAIN
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = 'usage: env-secret.cjs keys|validate <file> | fingerprint <file> <KEY>';

function run(argv, cwd) {
  const [action, filePath, key] = argv;
  if (action === 'keys' && filePath) return core.listKeys(filePath, cwd);
  if (action === 'validate' && filePath) return core.validate(filePath, cwd);
  if (action === 'fingerprint' && filePath && key) return core.fingerprint(filePath, key, cwd);
  return null;
}

const result = run(process.argv.slice(2), process.cwd());
if (result === null) {
  process.stderr.write(USAGE + '\n');
  process.exit(2);
}
process.stdout.write(JSON.stringify(result) + '\n');
process.exit(result.ok ? 0 : 1);
