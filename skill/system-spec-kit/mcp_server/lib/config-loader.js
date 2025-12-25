/**
 * Configuration Loader Module
 * @module lib/config-loader
 * @version 11.0.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '../configs/search-weights.json');

let cachedConfig = null;

/**
 * Strip JSON comments (JSONC support)
 * Removes single-line and multi-line comments
 * while preserving comment-like sequences inside strings
 * @param {string} jsonString - Raw JSONC content
 * @returns {string} Clean JSON string
 */
function stripJsonComments(jsonString) {
  return jsonString
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m)
    .trim();
}

/**
 * Get default configuration
 * @returns {Object} Default config object
 */
function getDefaultConfig() {
  return {
    hybridSearch: { enabled: true, vectorWeight: 0.6, ftsWeight: 0.4 },
    memoryDecay: { enabled: true, decayWeight: 0.3, scaleDays: 90 },
    compositeScoring: { enabled: true }
  };
}

/**
 * Load configuration with defaults
 * @param {string} [configPath] - Optional custom config path
 * @param {boolean} [refresh=false] - Force reload from file
 * @returns {Object} Merged configuration
 */
function loadConfig(configPath = CONFIG_PATH, refresh = false) {
  if (cachedConfig && !refresh) {
    return cachedConfig;
  }

  const defaults = getDefaultConfig();

  // Path validation
  if (!configPath || typeof configPath !== 'string') {
    throw new Error('Config path must be a non-empty string');
  }

  // Resolve to absolute path
  const resolvedPath = path.resolve(configPath);

  // Check file exists
  if (!fs.existsSync(resolvedPath)) {
    console.warn(`[config-loader] Config file not found: ${resolvedPath}, using defaults`);
    cachedConfig = defaults;
    return cachedConfig;
  }

  try {
    const rawContent = fs.readFileSync(resolvedPath, 'utf-8');
    const strippedContent = stripJsonComments(rawContent);
    let fileConfig;
    try {
      fileConfig = JSON.parse(strippedContent);
    } catch (parseErr) {
      throw new Error(`Failed to parse config file ${resolvedPath}: ${parseErr.message}`);
    }
    cachedConfig = deepMerge(defaults, fileConfig);
  } catch (err) {
    console.warn('[config-loader] Failed to load config:', err.message);
    cachedConfig = defaults;
  }

  return cachedConfig;
}

/**
 * Deep merge objects with proper null handling
 * @param {Object} target - Base object
 * @param {Object} source - Object to merge in (takes precedence)
 * @returns {Object} Merged result
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    // Handle null explicitly - null overwrites
    if (sourceVal === null) {
      result[key] = null;
    } else if (typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
      // Deep merge objects, but handle target being null/undefined
      const targetVal = target[key];
      if (targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        result[key] = sourceVal;
      }
    } else {
      result[key] = sourceVal;
    }
  }
  return result;
}

/**
 * Get specific config section
 * @param {string} section - Config section name
 * @returns {Object}
 */
function getSection(section) {
  const config = loadConfig();
  return config[section] || {};
}

module.exports = {
  loadConfig,
  getSection,
  getDefaultConfig,
  stripJsonComments,
  CONFIG_PATH
};
