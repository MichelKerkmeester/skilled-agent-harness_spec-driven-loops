// ───────────────────────────────────────────────────────────────────
// MODULE: Versioning Public API
// ───────────────────────────────────────────────────────────────────

export {
  SupportedSchemaVersions,
  assessSchemaCompatibility,
  parseSemanticVersion,
} from './compatibility.js';

export type {
  CompatibilityBehavior,
  CompatibilityDecision,
  SemanticVersion,
} from './compatibility.js';
