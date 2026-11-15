// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Folder Index
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
// Barrel export for spec folder detection, validation, and setup modules
import { detectSpecFolder, filterArchiveFolders } from './folder-detector.js';
import {
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  extractObservationKeywords,
  calculateAlignmentScore,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
} from './alignment-validator.js';
import { ensureSpecFolderExists } from './directory-setup.js';

// ───────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  ALIGNMENT_CONFIG,
  detectSpecFolder,
  filterArchiveFolders,
  ensureSpecFolderExists,
  ensureSpecFolderExists as setupContextDirectory,
  extractConversationTopics,
  extractObservationKeywords,
  calculateAlignmentScore,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
};
