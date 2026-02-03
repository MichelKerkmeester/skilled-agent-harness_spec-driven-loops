// ───────────────────────────────────────────────────────────────
// EXTRACTORS: FILE EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

const { CONFIG } = require('../core');

const {
  toRelativePath,
  cleanDescription,
  isDescriptionValid
} = require('../utils/file-helpers');

const { getPathBasename } = require('../utils/path-utils');

let extractSpecNumber, categorizeSection, generateAnchorId, validateAnchorUniqueness;
try {
  ({
    extractSpecNumber,
    categorizeSection,
    generateAnchorId,
    validateAnchorUniqueness
  } = require('../lib/anchor-generator'));
} catch (err) {
  throw new Error(`Failed to load anchor-generator library: ${err.message}`);
}

/* ─────────────────────────────────────────────────────────────
   2. OBSERVATION TYPE DETECTION
────────────────────────────────────────────────────────────────*/

function detect_observation_type(obs) {
  if (obs.type && obs.type !== 'observation') return obs.type;

  const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
  const facts = (obs.facts || []).join(' ').toLowerCase();
  const combined = text + ' ' + facts;

  if (/\b(fix(?:ed|es|ing)?|bug|error|issue|broken|patch)\b/.test(combined)) return 'bugfix';
  if (/\b(implement(?:ed|s|ing)?|add(?:ed|s|ing)?|creat(?:ed|es|ing)?|new feature|feature)\b/.test(combined)) return 'feature';
  if (/\b(refactor(?:ed|s|ing)?|clean(?:ed|s|ing)?|restructur(?:ed|es|ing)?|reorganiz(?:ed|es|ing)?)\b/.test(combined)) return 'refactor';
  if (/\b(decid(?:ed|es|ing)?|chose|select(?:ed|s|ing)?|option|alternative)\b/.test(combined)) return 'decision';
  if (/\b(research(?:ed|ing)?|investigat(?:ed|es|ing)?|explor(?:ed|es|ing)?|analyz(?:ed|es|ing)?)\b/.test(combined)) return 'research';
  if (/\b(discover(?:ed|s|ing)?|found|learn(?:ed|s|ing)?|realiz(?:ed|es|ing)?)\b/.test(combined)) return 'discovery';

  return 'observation';
}

/* ─────────────────────────────────────────────────────────────
   3. FILE EXTRACTION
────────────────────────────────────────────────────────────────*/

function extract_files_from_data(collected_data, observations) {
  const files_map = new Map();

  // BUG-001 & BUG-002: Defensive null checks
  if (!collected_data) collected_data = {};
  if (!observations) observations = [];

  const add_file = (raw_path, description) => {
    const normalized = toRelativePath(raw_path, CONFIG.PROJECT_ROOT);
    if (!normalized) return;

    const existing = files_map.get(normalized);
    const cleaned = cleanDescription(description);

    if (existing) {
      if (isDescriptionValid(cleaned) && cleaned.length < existing.length) {
        files_map.set(normalized, cleaned);
      }
    } else {
      files_map.set(normalized, cleaned || 'Modified during session');
    }
  };

  // Source 1: FILES array (primary input format)
  if (collected_data.FILES && Array.isArray(collected_data.FILES)) {
    for (const file_info of collected_data.FILES) {
      const file_path = file_info.FILE_PATH || file_info.path;
      const description = file_info.DESCRIPTION || file_info.description || 'Modified during session';
      if (file_path) add_file(file_path, description);
    }
  }

  // Source 2: files_modified array (legacy format)
  if (collected_data.files_modified && Array.isArray(collected_data.files_modified)) {
    for (const file_info of collected_data.files_modified) {
      add_file(file_info.path, file_info.changes_summary || 'Modified during session');
    }
  }

  // Source 3: observations
  for (const obs of observations) {
    if (obs.files) {
      for (const file of obs.files) {
        add_file(file, 'Modified during session');
      }
    }
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (fact.files && Array.isArray(fact.files)) {
          for (const file of fact.files) {
            add_file(file, 'Modified during session');
          }
        }
      }
    }
  }

  const files_entries = Array.from(files_map.entries());
  const with_valid_desc = files_entries.filter(([_, desc]) => isDescriptionValid(desc));
  const with_fallback = files_entries.filter(([_, desc]) => !isDescriptionValid(desc));

  const all_files = [...with_valid_desc, ...with_fallback];
  if (all_files.length > CONFIG.MAX_FILES_IN_MEMORY) {
    console.warn(`⚠️  Truncating files list from ${all_files.length} to ${CONFIG.MAX_FILES_IN_MEMORY}`);
  }

  return all_files
    .slice(0, CONFIG.MAX_FILES_IN_MEMORY)
    .map(([file_path, description]) => ({
      FILE_PATH: file_path,
      DESCRIPTION: description
    }));
}

/* ─────────────────────────────────────────────────────────────
   4. SEMANTIC DESCRIPTION ENHANCEMENT
────────────────────────────────────────────────────────────────*/

function enhance_files_with_semantic_descriptions(files, semantic_file_changes) {
  return files.map(file => {
    const file_path = file.FILE_PATH;
    const file_basename = getPathBasename(file_path);

    // Priority 1: Exact full path match
    if (semantic_file_changes.has(file_path)) {
      const info = semantic_file_changes.get(file_path);
      return {
        FILE_PATH: file.FILE_PATH,
        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
        ACTION: info.action === 'created' ? 'Created' : 'Modified'
      };
    }

    // Priority 2: Basename match only if unique
    let match_count = 0;
    let basename_match = null;

    for (const [path, info] of semantic_file_changes) {
      const path_basename = getPathBasename(path);
      if (path_basename === file_basename) {
        match_count++;
        basename_match = { path, info };
      }
    }

    if (match_count > 1) {
      console.warn(`   ⚠️  Multiple files with basename '${file_basename}' - using default description`);
    }

    if (match_count === 1 && basename_match) {
      const info = basename_match.info;
      return {
        FILE_PATH: file.FILE_PATH,
        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
        ACTION: info.action === 'created' ? 'Created' : 'Modified'
      };
    }

    return file;
  });
}

/* ─────────────────────────────────────────────────────────────
   5. OBSERVATION ANCHORING
────────────────────────────────────────────────────────────────*/

function build_observations_with_anchors(observations, spec_folder) {
  const used_anchor_ids = [];
  const spec_number = extractSpecNumber(spec_folder);

  return (observations || [])
    .filter(obs => obs != null)
    .map(obs => {
      const category = categorizeSection(
        obs.title || 'Observation',
        obs.narrative || ''
      );

      let anchor_id = generateAnchorId(
        obs.title || 'Observation',
        category,
        spec_number
      );
      anchor_id = validateAnchorUniqueness(anchor_id, used_anchor_ids);
      used_anchor_ids.push(anchor_id);

      const obs_type = detect_observation_type(obs);

      return {
        TYPE: obs_type.toUpperCase(),
        TITLE: obs.title || 'Observation',
        NARRATIVE: obs.narrative || '',
        HAS_FILES: obs.files && obs.files.length > 0,
        FILES_LIST: obs.files ? obs.files.join(', ') : '',
        HAS_FACTS: obs.facts && obs.facts.length > 0,
        FACTS_LIST: obs.facts ? obs.facts.join(' | ') : '',
        ANCHOR_ID: anchor_id,
        IS_DECISION: obs_type === 'decision'
      };
    });
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  detect_observation_type,
  extract_files_from_data,
  enhance_files_with_semantic_descriptions,
  build_observations_with_anchors,
  // Backward-compatible aliases (camelCase)
  detectObservationType: detect_observation_type,
  extractFilesFromData: extract_files_from_data,
  enhanceFilesWithSemanticDescriptions: enhance_files_with_semantic_descriptions,
  buildObservationsWithAnchors: build_observations_with_anchors
};
