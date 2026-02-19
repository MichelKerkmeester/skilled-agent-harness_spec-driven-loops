// ---------------------------------------------------------------
// MODULE: Extractors Index
// Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
// ---------------------------------------------------------------

export * from './file-extractor';
export * from './diagram-extractor';
export * from './conversation-extractor';
export * from './decision-extractor';
export * from './session-extractor';
export {
  buildImplementationGuideData,
  hasImplementationWork,
  extractMainTopic,
  extractWhatBuilt,
  extractKeyFilesWithRoles,
  generateExtensionGuide,
  extractCodePatterns,
  hasImplementationWork as has_implementation_work,
  extractMainTopic as extract_main_topic,
  extractWhatBuilt as extract_what_built,
} from './implementation-guide-extractor';
export type {
  ImplementationGuideData,
  ImplementationStep,
  KeyFileWithRole,
  ExtensionGuide,
  CodePattern,
  FileInput,
} from './implementation-guide-extractor';
export * from './collect-session-data';
export * from './opencode-capture';
export * from './contamination-filter';
export * from './quality-scorer';
