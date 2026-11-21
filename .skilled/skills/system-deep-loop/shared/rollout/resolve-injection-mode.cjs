// -----------------------------------------------------------------------------
// COMPONENT: command-injection rollout resolver
// PURPOSE: Resolve staged command injection mode without mutating command plugins.
// -----------------------------------------------------------------------------
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_MODE = 'fallback';
const OVERRIDE_ENV = 'SPECKIT_COMMAND_INJECTION_MODE';
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'command-injection-rollout.json');
const VALID_MODES = new Set([DEFAULT_MODE, 'fix']);

/**
 * Normalize a command name to its config key: trimmed, leading slash dropped and
 * colons turned into slashes, so `/deep:research` becomes `deep/research`.
 *
 * @param {unknown} command - Command name as typed or configured.
 * @returns {string} The config key, or an empty string for a non-string or blank value.
 */
function canonicalizeCommand(command) {
  if (typeof command !== 'string') return '';

  const trimmed = command.trim();
  if (!trimmed) return '';

  const withoutSlash = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return withoutSlash.replace(/:/g, '/');
}

function isValidMode(mode) {
  return VALID_MODES.has(mode);
}

/**
 * Parse a `<command>:<mode>` override, splitting on the last colon so namespaced
 * command names keep their own colons.
 *
 * @param {unknown} rawValue - The raw override environment value.
 * @returns {{command: string, mode: string}|null} The override, or null when it is blank, malformed or names an unknown mode.
 */
function parseEnvOverride(rawValue) {
  if (typeof rawValue !== 'string') return null;

  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  const separatorIndex = trimmed.lastIndexOf(':');
  if (separatorIndex <= 0 || separatorIndex === trimmed.length - 1) return null;

  const command = canonicalizeCommand(trimmed.slice(0, separatorIndex));
  const mode = trimmed.slice(separatorIndex + 1).trim();

  if (!command || !isValidMode(mode)) return null;
  return { command, mode };
}

/**
 * Read the per-command mode map. A missing file means nothing is rolled out yet and
 * yields an empty map; any other read failure, invalid JSON or a non-object root is
 * a config error and throws, because an empty map would silently resolve every
 * command to `fallback`.
 *
 * @param {string} configPath - Path to the rollout JSON file.
 * @returns {Object} The mode map, or an empty object when the file does not exist.
 * @throws {Error} When the file exists but cannot be read or parsed as a JSON object.
 */
function loadModeMap(configPath) {
  let raw;
  try {
    raw = fs.readFileSync(configPath, 'utf8');
  } catch (error) {
    if (error && error.code === 'ENOENT') return {};
    throw new Error(`[command-injection-rollout] unable to read ${configPath}: ${error.message}`, { cause: error });
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`[command-injection-rollout] invalid JSON in ${configPath}: ${error.message}`, { cause: error });
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`[command-injection-rollout] ${configPath} must hold a JSON object of command modes`);
  }
  return parsed;
}

/**
 * Read the mode from a config entry, which may be a bare mode string or an object with a `mode` field.
 *
 * @param {unknown} entry - One command's config entry.
 * @returns {unknown} The configured mode, unvalidated.
 */
function getConfiguredMode(entry) {
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    return entry.mode;
  }

  return entry;
}

/**
 * Resolve the injection mode for one command. A matching environment override
 * wins; otherwise the configured mode is used when valid, else `fallback`.
 *
 * @param {string} command - Command name in any accepted form.
 * @param {{env?: Object, configPath?: string}} [options] - Environment and config path overrides.
 * @returns {string} `fix` or `fallback`.
 */
function resolveInjectionMode(command, options = {}) {
  const canonicalCommand = canonicalizeCommand(command);
  const env = options.env || process.env;
  const override = parseEnvOverride(env[OVERRIDE_ENV]);

  if (override && override.command === canonicalCommand) return override.mode;

  const modeMap = loadModeMap(options.configPath || DEFAULT_CONFIG_PATH);
  const configuredMode = getConfiguredMode(modeMap[canonicalCommand]);

  return isValidMode(configuredMode) ? configuredMode : DEFAULT_MODE;
}

module.exports = {
  DEFAULT_CONFIG_PATH,
  DEFAULT_MODE,
  OVERRIDE_ENV,
  VALID_MODES: Array.from(VALID_MODES),
  canonicalizeCommand,
  getConfiguredMode,
  parseEnvOverride,
  resolveInjectionMode,
};
