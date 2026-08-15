---
title: "Implementation Summary: Agent Improvement Certificates and Receipts"
description: "Delivered additive-dark Agent Improvement run certificates, transition receipts, and offline verification over authorized ledger events, sealed artifacts, reducer projections, replay fingerprints, and preserved common-service receipt identities."
trigger_phrases:
  - "agent improvement certificates implementation"
  - "agent-improvement receipt issuer"
  - "agent improvement offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-08-15T14:36:34Z"
    last_updated_by: "codex"
    recent_action: "Verified certificate closeout with focused suite 14/14 passed at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane plain-digest closure map is explicitly empty"
      - "Mode receipts preserve the complete ordered common receipt identity vector"
      - "Absent certified bytes produce an unverifiable verdict"
      - "Certificates remain dark evidence and never grant execution authority"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-certificates-and-receipts |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and authority are unchanged |
| **Candidate SHA** | `fbf3c7291eb432ca541666397b95bf5da7bc500b` |
| **BASE SHA** | `9c5c7c5bde4dbb468fdb11df3c5afdbaa87443e3` |
| **Fixture manifest SHA-256** | `6cf23b23aadd53368b9cbb632c89c5d2fd67a6c27f647d654065f519a9cfba57` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf exports one dark per-run certificate, three ordered mode-specific transition receipts, strict transport parsers,
a typed error vocabulary, and a network-free verifier. Issuance and verification both read the real authorized ledger,
fold the landed Agent Improvement reducer, verify sealed artifact bytes, derive the shared replay fingerprint, and use
the durable boundary-receipt certification path.

The mode-specific receipt order is `proposal-created`, `score-reduced`, then
`benchmark-evidence-recorded`. Their output roles resolve through the real sealed store as:

| Certificate role | Expected sealed artifact kind |
|------------------|-------------------------------|
| `proposal` | `agent-improvement-candidate-proposal` |
| `scoring-evidence` | `agent-improvement-behavior-coverage` |
| `benchmark-evidence` | `agent-improvement-trial-trajectory` |

The predecessor declared no plain-digest closure fields, so
`AGENT_IMPROVEMENT_NAMED_DIGEST_CLOSURE_RULES` is the explicit empty map `{}`. This does not weaken reference
verification: every typed binding is re-read by exact sealed identity and checked for kind, borne evaluation epoch,
canonical bytes, dependency closure, authorized origin-event ownership, ordered receipt use, and replay inclusion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/agent-improvement-certificates/agent-improvement-certificate-types.ts` | Created | Declares certificate, receipt, verifier, transition, and typed failure contracts |
| `runtime/lib/agent-improvement-certificates/agent-improvement-certificate-validation.ts` | Created | Parses exact fields, closed enums, bindings, receipts, certificates, and bundles |
| `runtime/lib/agent-improvement-certificates/agent-improvement-certificates.ts` | Created | Issues receipts and certificates and independently verifies their ordered closure |
| `runtime/lib/agent-improvement-certificates/index.ts` | Created | Exports the public runtime surface |
| `runtime/tests/unit/agent-improvement-certificates.vitest.ts` | Created | Drives valid and fail-closed paths through the real substrate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The extension consumes `parseDeepImprovementCommonCertificateBundle`,
`verifyDeepImprovementCommonCertificateOffline`, `DeepImprovementCommonCertificateBundle`,
`DeepImprovementCommonOfflineVerificationInput`, and `DeepImprovementCommonReceiptIdentity` from
`deep-improvement-common-certificates`. It embeds the verified common bundle, common certificate digest, evaluator and
canary epochs, disposition, and the exact ordered common receipt identity vector.

The identity vector remains owned by the common service. It retains the required identities for candidate generation,
evaluator epoch establishment, evaluation start, scoring, canary checking, and promotion proposal, plus any common
outcome-specific promotion, abort, or restoration identities already present. The Agent Improvement layer neither
reissues nor rewrites them. Its own receipts use `BoundaryReceiptIssuer`, the shared authorized evidence writer, and
registered certification providers; the run certificate uses the same boundary certification substrate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the mode receipt order to proposal, score evidence, and benchmark evidence | Shared evaluator, canary, promotion, abort, and restoration transitions retain their common receipt identities |
| Declare the plain-digest map as empty | The landed predecessor declared no mode-owned deferred fields |
| Re-read every typed binding from the real store | Shape-valid digests cannot prove sealed existence, kind, canonical bytes, or epoch |
| Return `unverifiable` for absent certified bytes | Missing offline material is distinct from contradictory evidence |
| Keep authority fixed to `dark-evidence-only` | A certificate attests recorded evidence and does not decide promotion or execution |

### Successor Contract

Successor `005-resume-adapter` consumes:

- `AgentImprovementTransitionReceiptInput`, `AgentImprovementTransitionReceiptFacts`,
  `AgentImprovementTransitionReceipt`, and `AgentImprovementReceiptIdentity`.
- `AgentImprovementRunCertificateBody`, `AgentImprovementRunCertificate`, and
  `AgentImprovementCertificateBundle`.
- `AgentImprovementOfflineVerificationInput`, `AgentImprovementOfflineVerificationResult`, and
  `AgentImprovementOfflineVerifierReceipt`.
- `AgentImprovementCertificateError`, `AgentImprovementCertificateFailureCodes`, and
  `AgentImprovementTransitionKinds`.
- `issueAgentImprovementTransitionReceipt`, `issueAgentImprovementRunCertificate`,
  `verifyAgentImprovementCertificateOffline`, and the three exported parse functions.

Resume checkpoints over the verified certificate digest, composite replay fingerprint, projection integrity digest,
receipt-chain digest, final authorized ledger head, mode receipt identities, and preserved common receipt identities.
Only a `valid` offline result is eligible for reuse. `invalid`, `incomplete`, or `unverifiable` evidence requires
reconciliation or re-execution; this leaf does not choose or execute the resume action.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest closeout at HEAD | PASS: 1 file, 14 tests, exit 0, 61.04s |
| Whole-runtime TypeScript closeout | PASS: exit 0 with `--noEmit --ignoreDeprecations 6.0` |
| Plain-digest closure coverage | PASS: declared map is explicitly empty |
| Strict packet validation | PASS: zero errors and zero warnings through the landed dependency tree |

`substrateImportsReal: true`. Runtime imports and tests drive
`agent-improvement-ledger-schema`, `agent-improvement-reducers`,
`agent-improvement-sealed-artifacts`, `authorized-ledger`, `event-envelope`, `replay-fingerprint`,
`sealed-reference-artifacts`, `receipts-and-effect-recovery`, and the common certificate verifier. There is no local
hash, ledger, reducer, artifact store, signature provider, receipt issuer, or replay implementation.

The verifier tests reject fabricated and wrong-kind references, mutated artifact claims, stale evaluation epochs,
changed replay inputs, reordered receipts, broken predecessors, changed common identities, mutated projection events,
missing evidence, and unauthorized result events. A separate pruned store proves that legitimately referenced but absent
bytes return `unverifiable`, distinct from `invalid` and `valid`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The module remains additive-dark and cannot move execution authority or modify the legacy writer.
2. The lane declares no mode-owned plain-digest closure fields; shared common-service fields remain verified by the
   common offline verifier.
3. Resume policy, checkpoint persistence, effect reconciliation, and re-entry execution belong to
   `005-resume-adapter`.
<!-- /ANCHOR:limitations -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Mode-local receipts for all evaluation and promotion operations | Three Agent Improvement receipts plus preserved common receipt identities | Evaluator, canary, scoring, promotion, abort, and restoration identities remain owned by `deep-improvement-common` |
| Named plain-digest closure fields | Explicit empty map | The landed sealed-artifact contract declared no deferred fields for this lane |
