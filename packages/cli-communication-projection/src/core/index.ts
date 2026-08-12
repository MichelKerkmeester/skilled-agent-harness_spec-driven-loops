// ───────────────────────────────────────────────────────────────────
// MODULE: Core Public API
// ───────────────────────────────────────────────────────────────────

export {
  createNormalizedSequenceDigest,
  normalizeEvent,
  normalizeEventSequence,
} from './normalizer.js';
export {
  MessageAssembler,
  serializeGenerationKey,
} from './assembler.js';
export { AssemblyReasonCodes } from './assembly-types.js';

export type {
  AssemblyOrderCoordinate,
  AssemblyOrderSnapshot,
  AssemblyReasonCode,
  AssemblyRejection,
  AssemblyTerminalBase,
  AssemblyTerminalResult,
  CompletedAssembly,
  ExactOriginalAssembly,
  GenerationKey,
  IngestEventInput,
  IngestEventResult,
  MessageAssemblerOptions,
  StartGenerationInput,
  StartGenerationResult,
} from './assembly-types.js';
export type { NormalizedEventBatch } from './normalizer.js';
