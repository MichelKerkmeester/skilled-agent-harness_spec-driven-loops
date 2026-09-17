// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Research Authority Composition (production admission seam)
// ───────────────────────────────────────────────────────────────────
//
// The single production composition root that binds the dark per-mode authority substrate to the
// deep-research serving path. This first increment exposes only the READ path: given the durable,
// mode-global authority record, it returns the route the canonical write boundary must honor.
//
// Safety invariant: a mode whose authority record was never written reads back
// `legacy_authoritative`, so admission stays on the legacy writer and the serving path is
// byte-identical until an explicit, authorized cutover flips the durable record. The serving path
// must treat a `denied` result as fail-closed — admit neither the legacy nor the ledger writer.
import {
  AuthorityRegistry,
  selectAuthorityRoute,
} from '../per-mode-authority-flip/index.js';
import type {
  AuthoritySelectorResult,
  CutoverCertificateMode,
} from '../per-mode-authority-flip/index.js';

export interface DeepResearchAuthorityOptions {
  /**
   * Durable, mode-global authority-record root. This is a single fact across all runs — it must NOT
   * be a per-run spec folder, or authority would fork per run.
   */
  readonly authorityRoot: string;
  readonly now?: () => Date;
}

/**
 * Resolve the admission route for a canonical deep-research write by reading the durable per-mode
 * authority record and applying the shared selector. Read-only: constructs a registry over the
 * durable root, reads the record, and returns the selector result. Performs no authority mutation.
 */
export function admitCanonicalWrite(
  mode: CutoverCertificateMode,
  options: DeepResearchAuthorityOptions,
): AuthoritySelectorResult {
  const registry = new AuthorityRegistry(options.authorityRoot, options.now);
  const record = registry.read(mode);
  return selectAuthorityRoute(record, { mode });
}
