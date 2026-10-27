#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Hygiene Config Flags
// ───────────────────────────────────────────────────────────────────
'use strict';

// The quality runner is not the only caller of the comment-hygiene checker that blocks.
// The pre-commit hook and the CI job each run it on their own, and a repository that
// switched a rule off in its quality config must not be blocked at commit by the rule it
// switched off. Each of those callers asks this module for the checker flags, and this
// module reads the config through the same loader the runner uses. It returns only the
// --disable-rule flags: a ticket prefix, an extra pattern or a mapped extension tightens
// the author gate alone, so those layers keep the core set minus the disabled rules.
//
// Usage:
//   hygiene-config-flags.cjs [--repo DIR] [--json]
//
// Prints the flags NUL-separated, the form a shell reads into an array without word
// splitting, or one JSON document with --json. A repository with no config prints
// nothing. Exit 0 on success, 3 when the config is missing or invalid, with one line
// per fault on stderr, and 2 on a usage error or outside a git repository.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const qualityConfig = require('./lib/quality-config.cjs');
const { runGit } = require('./lib/run-check.cjs');
const { CHECK_IDS } = require('./quality-gate.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULTS_PATH = path.join(__dirname, '..', 'assets', 'quality-defaults.json');
const EXIT = Object.freeze({ OK: 0, USAGE: 2, CONFIG: 3 });
const USAGE_TEXT = 'Usage: hygiene-config-flags.cjs [--repo DIR] [--json]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a repository's quality config and return the --disable-rule flags its
 * commentHygiene block asks for. Discovery follows the runner: the file-scoped git config value, then
 * .sk-code/quality.json at the root.
 *
 * @param {Object} options - root, the repository root, and env.
 * @returns {{flags:string[], disabled:string[], source:string, path:string|null, errors:Array<{code:string, message:string}>}}
 *   flags is empty whenever errors is not.
 */
function resolveHygieneFlags({ root, env = process.env }) {
  let loaded;
  try {
    const defaults = JSON.parse(fs.readFileSync(DEFAULTS_PATH, 'utf8'));
    loaded = qualityConfig.loadConfig({ cwd: root, root, git: true, env, defaults, builtinIds: [...CHECK_IDS] });
  } catch (error) {
    return { flags: [], disabled: [], source: error.source || 'unknown', path: error.path || null,
      errors: [{ code: error.code || 'CONFIG_INVALID', message: error.message }] };
  }
  if (loaded.errors.length > 0) {
    return { flags: [], disabled: [], source: loaded.source, path: loaded.display, errors: loaded.errors };
  }
  const hygiene = loaded.merged.commentHygiene;
  return {
    flags: qualityConfig.hygieneDisableFlags(hygiene),
    disabled: hygiene.disableRules.map((rule) => `hygiene.${rule}`),
    source: loaded.source,
    path: loaded.display,
    errors: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { repo: null, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--repo' && argv[index + 1] !== undefined) {
      options.repo = argv[index + 1];
      index += 1;
    } else return null;
  }
  return options;
}

function main(argv, { cwd = process.cwd(), env = process.env, out = process.stdout, err = process.stderr } = {}) {
  const options = parseArgs(argv);
  if (!options) {
    err.write(`${USAGE_TEXT}\n`);
    return EXIT.USAGE;
  }
  const top = runGit(['rev-parse', '--show-toplevel'], { cwd: path.resolve(cwd, options.repo || '.'), env });
  if (!top.ok) {
    err.write(`hygiene-config-flags: not inside a git repository: ${path.resolve(cwd, options.repo || '.')}\n`);
    return EXIT.USAGE;
  }
  const result = resolveHygieneFlags({ root: top.stdout.trim(), env });
  if (options.json) out.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (result.flags.length > 0) out.write(`${result.flags.join('\0')}\0`);
  for (const entry of result.errors) err.write(`hygiene-config-flags: ${entry.code}: ${entry.message}\n`);
  return result.errors.length > 0 ? EXIT.CONFIG : EXIT.OK;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { USAGE_TEXT, main, resolveHygieneFlags };
