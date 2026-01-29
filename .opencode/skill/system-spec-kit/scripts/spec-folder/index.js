// ───────────────────────────────────────────────────────────────
// SPEC-FOLDER: MODULE INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const { detect_spec_folder, filter_archive_folders } = require('./folder-detector');
const {
  ALIGNMENT_CONFIG,
  extract_conversation_topics,
  extract_observation_keywords,
  parse_spec_folder_topic,
  calculate_alignment_score,
  validate_content_alignment,
  validate_folder_alignment
} = require('./alignment-validator');
const { setup_context_directory } = require('./directory-setup');

/* ─────────────────────────────────────────────────────────────────
   2. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  ALIGNMENT_CONFIG,
  // Primary exports (snake_case)
  detect_spec_folder,
  filter_archive_folders,
  setup_context_directory,
  extract_conversation_topics,
  extract_observation_keywords,
  parse_spec_folder_topic,
  calculate_alignment_score,
  validate_content_alignment,
  validate_folder_alignment,
  // Backwards compatibility aliases (camelCase)
  detectSpecFolder: detect_spec_folder,
  filterArchiveFolders: filter_archive_folders,
  setupContextDirectory: setup_context_directory,
  extractConversationTopics: extract_conversation_topics,
  extractObservationKeywords: extract_observation_keywords,
  parseSpecFolderTopic: parse_spec_folder_topic,
  calculateAlignmentScore: calculate_alignment_score,
  validateContentAlignment: validate_content_alignment,
  validateFolderAlignment: validate_folder_alignment
};
