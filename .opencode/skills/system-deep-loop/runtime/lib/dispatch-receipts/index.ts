// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipts Public API
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { dispatchWithDurableReceipt } from './dispatch-barrier.js';
export {
  LINEAGE_DISPATCH_RESOLVED_EVENT_NAME,
  LINEAGE_DISPATCH_RESOLVED_EVENT_TYPE,
  LINEAGE_DISPATCH_RESOLVED_EVENT_VERSION,
  LINEAGE_DISPATCH_RESOLVED_FIELDS,
  asDispatchReceiptPayload,
  createDispatchReceiptEventRegistry,
  isDispatchReceiptPayload,
  lineageDispatchResolvedEventDefinition,
  prepareLineageDispatchResolvedEvent,
} from './event-contract.js';
export {
  durableAppendReceiptFromVerified,
  dispatchReceiptEvidenceFromVerified,
  unresolvedDispatchHandoff,
} from './evidence.js';
export {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';
export {
  INVOCATION_FINGERPRINT_ALGORITHM,
  INVOCATION_FINGERPRINT_NAMESPACE,
  INVOCATION_FINGERPRINT_VERSION,
  verifyAdapterInvocationFingerprint,
} from './fingerprint.js';
export {
  assertDispatchIdentity,
  deriveDispatchIdempotencyKey,
  deriveDispatchReceiptId,
} from './identity.js';
export {
  DISPATCH_RECEIPT_CANONICALIZATION_VERSION,
  attachDispatchReceiptIntegrity,
  canonicalDispatchReceiptMacInput,
  createProcessLocalDispatchReceiptMacProvider,
  verifyDispatchReceiptIntegrity,
} from './integrity.js';
export {
  projectVerifiedDispatchReceipt,
  resumeDispatchFromVerifiedLedger,
} from './resume-projection.js';

export type {
  VerifiedDispatchReceiptProjection,
} from './resume-projection.js';
export type {
  DispatchBarrierFaultInjection,
  DispatchBarrierResult,
  DispatchEffectiveConfig,
  DispatchReceiptEnvelopeInput,
  DispatchReceiptEvidence,
  DispatchReceiptMacProfile,
  DispatchReceiptMacProvider,
  DispatchReceiptMacTrustScope,
  DispatchReceiptMacVerification,
  DispatchReceiptPayload,
  DispatchResolutionPipeline,
  DispatchResumeDecision,
  DispatchWithReceiptInput,
  ResolvedAdapterInvocation,
  ResumeDispatchInput,
  UnresolvedDispatchHandoff,
  VerifiedDispatchResultEvidence,
  VerifiedLaunchFacts,
} from './types.js';
export type {
  DispatchReceiptErrorCode,
  DispatchReceiptErrorPhase,
} from './errors.js';
