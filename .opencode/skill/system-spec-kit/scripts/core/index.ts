// ---------------------------------------------------------------
// MODULE: Core Index
// Barrel export for core modules (config, spec-folder utilities)
// ---------------------------------------------------------------

// workflow.ts not exported here to avoid circular dependencies
// Import directly: import { runWorkflow } from './core/workflow';

export {
  CONFIG,
  getSpecsDirectories,
  findActiveSpecsDir,
  getAllExistingSpecsDirs,
} from './config';

export type {
  WorkflowConfig,
  SpecKitConfig,
} from './config';
