// ───────────────────────────────────────────────────────────────
// CONFIG-LOADER: JSONC configuration file loader with caching
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const CONFIG_PATH = path.join(__dirname, '../configs/search-weights.json');

let cached_config = null;

/* ───────────────────────────────────────────────────────────────
   2. UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Strip JSON comments (JSONC support) while preserving strings
function strip_json_comments(json_string) {
  return json_string
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m)
    .trim();
}

function deep_merge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const source_val = source[key];
    if (source_val === null) {
      result[key] = null;
    } else if (typeof source_val === 'object' && !Array.isArray(source_val)) {
      const target_val = target[key];
      if (target_val && typeof target_val === 'object' && !Array.isArray(target_val)) {
        result[key] = deep_merge(target_val, source_val);
      } else {
        result[key] = source_val;
      }
    } else {
      result[key] = source_val;
    }
  }
  return result;
}

/* ───────────────────────────────────────────────────────────────
   3. CORE FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

function get_default_config() {
  return {
    hybrid_search: { enabled: true, vector_weight: 0.6, fts_weight: 0.4 },
    memory_decay: { enabled: true, decay_weight: 0.3, scale_days: 90 },
    composite_scoring: { enabled: true },
  };
}

function load_config(config_path = CONFIG_PATH, refresh = false) {
  if (cached_config && !refresh) {
    return cached_config;
  }

  const defaults = get_default_config();

  if (!config_path || typeof config_path !== 'string') {
    throw new Error('Config path must be a non-empty string');
  }

  const resolved_path = path.resolve(config_path);

  if (!fs.existsSync(resolved_path)) {
    console.warn(`[config-loader] Config file not found: ${resolved_path}, using defaults`);
    cached_config = defaults;
    return cached_config;
  }

  try {
    const raw_content = fs.readFileSync(resolved_path, 'utf-8');
    const stripped_content = strip_json_comments(raw_content);
    let file_config;
    try {
      file_config = JSON.parse(stripped_content);
    } catch (parse_err) {
      throw new Error(`Failed to parse config file ${resolved_path}: ${parse_err.message}`);
    }
    cached_config = deep_merge(defaults, file_config);
  } catch (err) {
    console.warn('[config-loader] Failed to load config:', err.message);
    cached_config = defaults;
  }

  return cached_config;
}

function get_section(section) {
  const config = load_config();
  return config[section] || {};
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  load_config,
  get_section,
  get_default_config,
  strip_json_comments,
  CONFIG_PATH,
};
