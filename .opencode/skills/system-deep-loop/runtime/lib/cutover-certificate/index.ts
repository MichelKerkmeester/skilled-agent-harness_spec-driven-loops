// ───────────────────────────────────────────────────────────────────
// MODULE: Cutover Certificate & Rollback Window Public API
// ───────────────────────────────────────────────────────────────────

export {
  appendCutoverCertificateEvent,
  buildCutoverCertificate,
  createCutoverCertificateEventRegistry,
  prepareCutoverCertificateEventWrite,
  verifyCutoverCertificate,
} from './certificate.js';
export type { CutoverCertificateEnvelopeFields } from './certificate.js';

export {
  buildRollbackRevertRecord,
  closeRollbackWindow,
  evaluateMonitoredSignals,
  evaluateRollbackWindow,
  openRollbackWindow,
} from './rollback-window.js';

export {
  CUTOVER_CERTIFICATE_EVENT_TYPE,
  CUTOVER_CERTIFICATE_SCHEMA_VERSION,
  CutoverCertificateModes,
  MonitoredSignalFamilies,
  ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS,
  ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS,
} from './types.js';

export type {
  CutoverCertificate,
  CutoverCertificateAssemblyResult,
  CutoverCertificateEvidenceBindings,
  CutoverCertificateEvidenceSources,
  CutoverCertificateFacts,
  CutoverCertificateMode,
  CutoverCertificateRejectionReasonCode,
  CutoverCertificateRequest,
  CutoverCertificateVerificationExpectation,
  CutoverCertificateVerificationResult,
  MonitoredSignalFamily,
  MonitoredSignalReading,
  MonitoredSignalSeverity,
  RollbackRevertSequenceRecord,
  RollbackRevertSequenceRequest,
  RollbackRevertSequenceResult,
  RollbackWindowClosureEvidence,
  RollbackWindowClosureFacts,
  RollbackWindowClosureRequest,
  RollbackWindowClosureResult,
  RollbackWindowEvaluation,
  RollbackWindowEvaluationInput,
  RollbackWindowExecution,
  RollbackWindowOpenRequest,
  RollbackWindowRecord,
  RollbackWindowRejectionReasonCode,
  RollbackWindowSignalDecision,
  RollbackWindowSignalDecisionKind,
} from './types.js';
