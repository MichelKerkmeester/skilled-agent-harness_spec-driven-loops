// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Skill Folders
// ───────────────────────────────────────────────────────────────────
'use strict';

// The one sk-code quality folder this doctor reads, and the handles inside it that
// answer every question the modes ask. Each path resolves from this file's own
// location, so the doctor works from a checkout anywhere and never assumes the
// working directory.
//
// WHY THE HANDLES LIVE HERE: the modes are split into modules of their own, and each
// would otherwise resolve the same folder and load the same three skill modules. One
// resolution keeps every mode on one skill folder, one config schema and the one
// runner the quality gate itself starts, which is what makes the state the doctor
// reports the state the gate would act on.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const QUALITY_ROOT = path.resolve(__dirname, '../../../../skills/sk-code/sk-code-quality');
const DEFAULTS_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json');
const RUNNER = path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs');
const SKILLS_DIR = path.resolve(QUALITY_ROOT, '..', '..');
const OVERRIDE_LINTER_PATH = path.join(QUALITY_ROOT, '..', 'shared', 'scripts', 'check-rule-overrides.cjs');
const RULE_REGISTRY_PATH = path.join(QUALITY_ROOT, '..', 'shared', 'scripts', 'lib', 'rule-registry.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. SKILL MODULES
// ─────────────────────────────────────────────────────────────────────────────

const qualityConfig = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'quality-config.cjs'));
const { findTool, runGit, spawnArgv } = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'run-check.cjs'));
const { CHECK_IDS, TRUST_REPAIR, checkTrust, probeLayers } = require(path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CHECK_IDS,
  DEFAULTS_PATH,
  OVERRIDE_LINTER_PATH,
  QUALITY_ROOT,
  RULE_REGISTRY_PATH,
  RUNNER,
  SKILLS_DIR,
  TRUST_REPAIR,
  checkTrust,
  findTool,
  probeLayers,
  qualityConfig,
  runGit,
  spawnArgv,
};
