// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-rollout — require evidence before command promotion             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_CONFIG_PATH = path.join(__dirname, 'command-injection-rollout.json');
const EVIDENCE_FIELDS = Object.freeze({
  captureManifest: ['captureManifest', 'capture_manifest'],
  fallbackHash: ['fallbackHash', 'fallback_hash'],
  comparatorRuns: ['comparatorRuns', 'comparator_runs'],
  baselineDivergence: ['baselineDivergence', 'baseline_divergence'],
});

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (isRecord(value)) return Object.keys(value).length > 0;
  return true;
}

function readEvidenceField(evidence, field) {
  const names = EVIDENCE_FIELDS[field];
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(evidence, name)) return evidence[name];
  }
  return undefined;
}

function getEntryMode(entry) {
  if (isRecord(entry)) return entry.mode;
  return entry;
}

function validateRolloutConfig(config) {
  if (!isRecord(config)) {
    return { valid: false, errors: ['rollout configuration must be a JSON object'] };
  }

  const errors = [];
  for (const [command, entry] of Object.entries(config)) {
    if (getEntryMode(entry) !== 'fix') continue;

    const evidence = isRecord(entry) && isRecord(entry.evidence) ? entry.evidence : {};
    const missing = Object.keys(EVIDENCE_FIELDS).filter((field) => !hasValue(readEvidenceField(evidence, field)));

    if (missing.length > 0) {
      errors.push(`${command}: fix entry missing evidence: ${missing.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function readConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function main(argv = process.argv.slice(2)) {
  const configFlagIndex = argv.indexOf('--config');
  const configPath = configFlagIndex >= 0
    ? argv[configFlagIndex + 1]
    : (argv[0] || DEFAULT_CONFIG_PATH);

  if (!configPath || configPath === '--config') {
    console.error('[command-injection-rollout] missing config path');
    return 2;
  }

  let config;
  try {
    config = readConfig(configPath);
  } catch (error) {
    console.error(`[command-injection-rollout] unable to read ${configPath}: ${error.message}`);
    return 2;
  }

  const result = validateRolloutConfig(config);
  if (!result.valid) {
    for (const error of result.errors) console.error(`[command-injection-rollout] ${error}`);
    return 1;
  }

  console.log(`[command-injection-rollout] evidence validation passed: ${configPath}`);
  return 0;
}

if (require.main === module) process.exitCode = main();

module.exports = {
  DEFAULT_CONFIG_PATH,
  EVIDENCE_FIELDS,
  getEntryMode,
  main,
  validateRolloutConfig,
};
