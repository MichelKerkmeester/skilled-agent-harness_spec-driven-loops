// ---------------------------------------------------------------
// MODULE: Spec Folder Index
// Barrel export for spec folder detection, validation, and setup modules
// ---------------------------------------------------------------

import { detectSpecFolder, filterArchiveFolders } from './folder-detector';
import {
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment,
} from './alignment-validator';
import { setupContextDirectory } from './directory-setup';

/* -----------------------------------------------------------------
   EXPORTS - Primary (camelCase)
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  detectSpecFolder,
  filterArchiveFolders,
  setupContextDirectory,
  extractConversationTopics,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment,
};

/* -----------------------------------------------------------------
   EXPORTS - Backwards compatibility aliases (snake_case)
------------------------------------------------------------------*/

export {
  detectSpecFolder as detect_spec_folder,
  filterArchiveFolders as filter_archive_folders,
  setupContextDirectory as setup_context_directory,
  validateContentAlignment as validate_content_alignment,
};
