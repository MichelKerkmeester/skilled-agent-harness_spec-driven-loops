// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config
// ───────────────────────────────────────────────────────────────────
'use strict';

// A repository names its own checks in one committed file, and this module is the
// only reader of it, so the quality runner and the doctor see the same thing. It
// finds the file, validates every field before anything can spawn and merges it over
// the shipped base layer. Only the repository layer may name a command. The base
// layer and the manifest readers never supply one that runs: a command read from a
// manifest comes back as a suggestion with the entry that would enable it.
//
// This is the one module every caller requires, and it exports exactly the names it
// always has. The work sits in four modules beside it, one concern each: the schema and
// its validation rules, the comment-hygiene policy, the source trust decisions, and the
// config file's discovery and merge.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const discovery = require('./quality-config-discovery.cjs');
const hygiene = require('./quality-config-hygiene.cjs');
const schema = require('./quality-config-schema.cjs');
const trust = require('./quality-config-trust.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // The schema and every validation rule.
  ConfigError: schema.ConfigError,
  FILES_TOKEN: schema.FILES_TOKEN,
  PACKAGE_MARKERS: schema.PACKAGE_MARKERS,
  displayPath: schema.displayPath,
  isInside: schema.isInside,
  validateConfig: schema.validateConfig,

  // The comment-hygiene checker's own rule set and the flags a policy yields.
  SPEC_KIT_HYGIENE_RULES: hygiene.SPEC_KIT_HYGIENE_RULES,
  disabledHygieneRule: hygiene.disabledHygieneRule,
  hygieneCheckerFlags: hygiene.hygieneCheckerFlags,
  hygieneDisableFlags: hygiene.hygieneDisableFlags,
  readHygieneRules: hygiene.readHygieneRules,

  // Which config source a run may trust, and where the repository config lives.
  CONFIG_CANDIDATES: trust.CONFIG_CANDIDATES,
  GIT_CONFIG_KEY: trust.GIT_CONFIG_KEY,
  LEGACY_CONFIG_FILE: trust.LEGACY_CONFIG_FILE,
  REPO_CONFIG_FILE: trust.REPO_CONFIG_FILE,
  repoConfigTarget: trust.repoConfigTarget,

  // Finding the config, merging its layers, and the draft init writes.
  TEMPLATE_PATH: discovery.TEMPLATE_PATH,
  discoverConfig: discovery.discoverConfig,
  initialConfig: discovery.initialConfig,
  loadConfig: discovery.loadConfig,
  mergeConfig: discovery.mergeConfig,
  readSuggestions: discovery.readSuggestions,
};
