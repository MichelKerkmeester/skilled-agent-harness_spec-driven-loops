// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Alignment Certificates Public API
// ───────────────────────────────────────────────────────────────────

export {
  DEEP_ALIGNMENT_CERTIFICATE_VERSION,
  DEEP_ALIGNMENT_NAMED_DIGEST_CLOSURE_RULES,
  DEEP_ALIGNMENT_RECEIPT_VERSION,
  DEEP_ALIGNMENT_REQUIRED_TRANSITION_ORDER,
  issueDeepAlignmentRunCertificate,
  issueDeepAlignmentTransitionReceipt,
  verifyDeepAlignmentCertificateOffline,
} from './deep-alignment-certificates.js';
export {
  parseDeepAlignmentCertificateBundle,
  parseDeepAlignmentRunCertificate,
  parseDeepAlignmentTransitionReceipt,
} from './deep-alignment-certificate-validation.js';
export {
  DeepAlignmentCertificateError,
  DeepAlignmentCertificateFailureCodes,
  DeepAlignmentTransitionKinds,
} from './deep-alignment-certificate-types.js';

export type * from './deep-alignment-certificate-types.js';
