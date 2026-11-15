#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Render Vibe Home Hooks
// ───────────────────────────────────────────────────────────────────
// Writes the repository's .vibe/hooks.toml into a disposable VIBE_HOME with
// every command anchored to the checkout by absolute path. Vibe loads the
// project hooks file only from a trusted project root, so a run from a scratch
// folder never sees it; the home file loads regardless of the cwd. The project
// file resolves its scripts through git rev-parse, which fails outside the
// checkout, so the copy replaces that expression with the resolved root.

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_REPO_ROOT = path.resolve(__dirname, '../../..');
const TOPLEVEL_EXPRESSION = '$(git rev-parse --show-toplevel)';
// The root lands inside a TOML basic string that the shell then reads, so any
// character either layer would interpret is refused rather than escaped. A
// newline would end the TOML line and a carriage return would hide the rest of
// the value from the shell, so both are refused beside the metacharacters.
const UNSAFE_PATH_CHARACTERS = /["\\$`\r\n]/;
// A command that keeps any substitution form would resolve against the scratch
// cwd at hook time and silently skip its guard. The forms are a named variable,
// a braced expansion, a command substitution and a backtick command.
const LEFTOVER_SUBSTITUTION = /\$(?:[A-Za-z_][A-Za-z0-9_]*|\{|\()|`/;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Resolves a path through symlinks where it exists, so /var and /private/var
 * compare equal; a missing path resolves its nearest existing parent.
 * @param {string} target - The path to resolve.
 * @returns {string} The resolved absolute path.
 */
function resolveReal(target) {
  const absolute = path.resolve(target);
  if (fs.existsSync(absolute)) return fs.realpathSync(absolute);
  return path.join(resolveReal(path.dirname(absolute)), path.basename(absolute));
}

/**
 * Refuses the operator's own Vibe home: hooks written there would run this
 * checkout's guards in every Vibe session on the machine, in any repository.
 * Where a disposable home may live is the dispatch rules' concern, since a
 * fan-out lineage keeps its home inside its own artifact folder by design.
 * @param {string} home - The resolved VIBE_HOME.
 */
function assertNotOperatorHome(home) {
  const operatorHome = resolveReal(path.join(os.homedir(), '.vibe'));
  if (home === operatorHome) {
    throw new Error(`refusing to write hooks into the operator's Vibe home: ${home}`);
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Renders the repository hooks file into a disposable Vibe home.
 * @param {Object} options - Render options.
 * @param {string} options.vibeHome - The disposable VIBE_HOME to write into.
 * @param {string} [options.repoRoot] - The checkout whose hooks are rendered.
 * @returns {string} The path of the written hooks file.
 */
function renderHomeHooks({ vibeHome, repoRoot = DEFAULT_REPO_ROOT } = {}) {
  if (typeof vibeHome !== 'string' || vibeHome.trim() === '') {
    throw new Error('a disposable VIBE_HOME is required');
  }
  const root = resolveReal(repoRoot);
  if (UNSAFE_PATH_CHARACTERS.test(root)) {
    throw new Error(
      `refusing a checkout path with a quote, backslash, dollar, backtick, newline or carriage return: ${root}`,
    );
  }
  const home = resolveReal(vibeHome);
  assertNotOperatorHome(home);

  const source = fs.readFileSync(path.join(root, '.vibe', 'hooks.toml'), 'utf8');
  const rendered = source.split(TOPLEVEL_EXPRESSION).join(root);
  const leftover = rendered
    .split('\n')
    .find((line) => /^\s*command\s*=/.test(line) && LEFTOVER_SUBSTITUTION.test(line));
  if (leftover) {
    throw new Error(`hooks.toml command still holds a shell substitution: ${leftover.trim()}`);
  }

  fs.mkdirSync(home, { recursive: true });
  const target = path.join(home, 'hooks.toml');
  fs.writeFileSync(target, rendered, 'utf8');
  return target;
}

// ───────────────────────────────────────────────────────────────────
// 5. MAIN
// ───────────────────────────────────────────────────────────────────

if (require.main === module) {
  // The home is never read from an inherited VIBE_HOME: an exported value may name a
  // long-lived home, and the guards must land only in the run's own disposable one.
  const vibeHome = process.argv[2];
  try {
    process.stdout.write(`${renderHomeHooks({ vibeHome })}\n`);
  } catch (error) {
    process.stderr.write(`render-home-hooks: ${error.message}\n`);
    process.exitCode = 1;
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = { renderHomeHooks };
