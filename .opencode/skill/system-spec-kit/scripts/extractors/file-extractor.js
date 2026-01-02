'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

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
  console.error('Failed to load anchor-generator library:', err.message);
  process.exit(1);
}

/* ─────────────────────────────────────────────────────────────
   2. OBSERVATION TYPE DETECTION
──────────────────────────────────────────────────────────────── */

function detectObservationType(obs) {
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
──────────────────────────────────────────────────────────────── */

function extractFilesFromData(collectedData, observations) {
  const filesMap = new Map();
  
  const addFile = (rawPath, description) => {
    const normalized = toRelativePath(rawPath, CONFIG.PROJECT_ROOT);
    if (!normalized) return;
    
    const existing = filesMap.get(normalized);
    const cleaned = cleanDescription(description);
    
    if (existing) {
      if (isDescriptionValid(cleaned) && cleaned.length < existing.length) {
        filesMap.set(normalized, cleaned);
      }
    } else {
      filesMap.set(normalized, cleaned || 'Modified during session');
    }
  };
  
  // Source 1: FILES array (primary input format)
  if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
    for (const fileInfo of collectedData.FILES) {
      const filePath = fileInfo.FILE_PATH || fileInfo.path;
      const description = fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session';
      if (filePath) addFile(filePath, description);
    }
  }
  
  // Source 2: files_modified array (legacy format)
  if (collectedData.files_modified && Array.isArray(collectedData.files_modified)) {
    for (const fileInfo of collectedData.files_modified) {
      addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session');
    }
  }
  
  // Source 3: observations
  for (const obs of observations) {
    if (obs.files) {
      for (const file of obs.files) {
        addFile(file, 'Modified during session');
      }
    }
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (fact.files && Array.isArray(fact.files)) {
          for (const file of fact.files) {
            addFile(file, 'Modified during session');
          }
        }
      }
    }
  }
  
  const filesEntries = Array.from(filesMap.entries());
  const withValidDesc = filesEntries.filter(([_, desc]) => isDescriptionValid(desc));
  const withFallback = filesEntries.filter(([_, desc]) => !isDescriptionValid(desc));
  
  const allFiles = [...withValidDesc, ...withFallback];
  if (allFiles.length > CONFIG.MAX_FILES_IN_MEMORY) {
    console.warn(`⚠️  Truncating files list from ${allFiles.length} to ${CONFIG.MAX_FILES_IN_MEMORY}`);
  }
  
  return allFiles
    .slice(0, CONFIG.MAX_FILES_IN_MEMORY)
    .map(([filePath, description]) => ({
      FILE_PATH: filePath,
      DESCRIPTION: description
    }));
}

/* ─────────────────────────────────────────────────────────────
   4. SEMANTIC DESCRIPTION ENHANCEMENT
──────────────────────────────────────────────────────────────── */

function enhanceFilesWithSemanticDescriptions(files, semanticFileChanges) {
  return files.map(file => {
    const filePath = file.FILE_PATH;
    const fileBasename = getPathBasename(filePath);

    // Priority 1: Exact full path match
    if (semanticFileChanges.has(filePath)) {
      const info = semanticFileChanges.get(filePath);
      return {
        FILE_PATH: file.FILE_PATH,
        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
        ACTION: info.action === 'created' ? 'Created' : 'Modified'
      };
    }

    // Priority 2: Basename match only if unique
    let matchCount = 0;
    let basenameMatch = null;

    for (const [path, info] of semanticFileChanges) {
      const pathBasename = getPathBasename(path);
      if (pathBasename === fileBasename) {
        matchCount++;
        basenameMatch = { path, info };
      }
    }

    if (matchCount > 1) {
      console.warn(`   ⚠️  Multiple files with basename '${fileBasename}' - using default description`);
    }

    if (matchCount === 1 && basenameMatch) {
      const info = basenameMatch.info;
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
──────────────────────────────────────────────────────────────── */

function buildObservationsWithAnchors(observations, specFolder) {
  const usedAnchorIds = [];
  const specNumber = extractSpecNumber(specFolder);
  
  return (observations || [])
    .filter(obs => obs != null)
    .map(obs => {
      const category = categorizeSection(
        obs.title || 'Observation',
        obs.narrative || ''
      );
      
      let anchorId = generateAnchorId(
        obs.title || 'Observation',
        category,
        specNumber
      );
      anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
      usedAnchorIds.push(anchorId);
      
      const obsType = detectObservationType(obs);
      
      return {
        TYPE: obsType.toUpperCase(),
        TITLE: obs.title || 'Observation',
        NARRATIVE: obs.narrative || '',
        HAS_FILES: obs.files && obs.files.length > 0,
        FILES_LIST: obs.files ? obs.files.join(', ') : '',
        HAS_FACTS: obs.facts && obs.facts.length > 0,
        FACTS_LIST: obs.facts ? obs.facts.join(' | ') : '',
        ANCHOR_ID: anchorId,
        IS_DECISION: obsType === 'decision'
      };
    });
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  detectObservationType,
  extractFilesFromData,
  enhanceFilesWithSemanticDescriptions,
  buildObservationsWithAnchors
};
