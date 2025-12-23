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
 * Load configuration with defaults
 * @param {boolean} [refresh=false] - Force reload from file
 * @returns {Object} Merged configuration
 */
function loadConfig(refresh = false) {
  if (cachedConfig && !refresh) {
    return cachedConfig;
  }

  const defaults = {
    hybridSearch: { enabled: true, vectorWeight: 0.6, ftsWeight: 0.4 },
    memoryDecay: { enabled: true, decayWeight: 0.3, scaleDays: 90 },
    compositeScoring: { enabled: true }
  };

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const fileConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      cachedConfig = deepMerge(defaults, fileConfig);
    } else {
      cachedConfig = defaults;
    }
  } catch (err) {
    console.warn('[config-loader] Failed to load config:', err.message);
    cachedConfig = defaults;
  }

  return cachedConfig;
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
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
  CONFIG_PATH
};
