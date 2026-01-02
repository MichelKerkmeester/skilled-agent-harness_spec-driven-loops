/* ─────────────────────────────────────────────────────────────────
   SPEC-FOLDER: MODULE INDEX
──────────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const { detectSpecFolder, filterArchiveFolders } = require('./folder-detector');
const {
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  extractObservationKeywords,
  parseSpecFolderTopic,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment
} = require('./alignment-validator');
const { setupContextDirectory } = require('./directory-setup');

/* ─────────────────────────────────────────────────────────────────
   2. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  detectSpecFolder,
  filterArchiveFolders,
  setupContextDirectory,
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  extractObservationKeywords,
  parseSpecFolderTopic,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment
};
