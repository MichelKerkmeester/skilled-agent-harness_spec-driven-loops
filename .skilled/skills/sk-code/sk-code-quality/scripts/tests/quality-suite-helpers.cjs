// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Suite Helpers
// ───────────────────────────────────────────────────────────────────
'use strict';

// The runner's suites are split by the behavior each part covers, and the parts share one
// throwaway-repository wrapper, the text a config is seeded as, the path a config travels to
// and the accessors a verdict is read through. A shared value lives here once, so two parts
// cannot drift apart and a part carries only the case it proves.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { buildRepo } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(__dirname, '..', '..');
const RUNNER = path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs');
const ARGUMENTS = path.join(path.dirname(RUNNER), 'lib', 'gate-arguments.cjs');
const DEFAULTS = JSON.parse(fs.readFileSync(path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json'), 'utf8'));
const NODE = process.execPath;
const CLEAN_GO = 'package a\n\nfunc A() {}\n';
const CHANGED_GO = 'package a\n\nfunc A() {}\nfunc B() {}\n';
const REPO_IDENTITY = 'acme/widget';
// The config travels with the skill, so a repository that installs skills under .opencode/
// keeps it there, and the two paths differ only in that first folder.
const TARGET = '.skilled/skills/sk-code/sk-code-quality/repository/quality.json';
const OPENCODE_TARGET = '.opencode/skills/sk-code/sk-code-quality/repository/quality.json';
const LEGACY_TARGET = '.sk-code/quality.json';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function withRepo(options, body) {
  const repo = buildRepo(options);
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// A repository config is always a schemaVersion 1 document, so a case names only the
// settings it proves and never restates the version.
function config(value) {
  return json({ schemaVersion: 1, ...value });
}

function check(verdict, id) {
  return verdict.checks.find((entry) => entry.id === id);
}

function fields(verdict) {
  return verdict.config.errors.map((entry) => entry.field);
}

function hygieneFindings(verdict) {
  return verdict.findings.filter((entry) => entry.check === 'comment-hygiene');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ARGUMENTS, CHANGED_GO, CLEAN_GO, DEFAULTS, LEGACY_TARGET, NODE, OPENCODE_TARGET, QUALITY_ROOT,
  REPO_IDENTITY, RUNNER, TARGET, check, config, fields, hygieneFindings, json, withRepo,
};
