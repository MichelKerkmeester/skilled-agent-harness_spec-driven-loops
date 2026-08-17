---
title: "Implementation Summary: Model Benchmark Certificates and Receipts"
description: "Delivered additive-dark Model Benchmark run certificates, ordered transition receipts, and offline verification over authorized ledger events, sealed matrix evidence, reducer projections, replay fingerprints, and preserved common-service receipt identities."
trigger_phrases:
  - "model benchmark certificates implementation"
  - "model-benchmark receipt issuer"
  - "model benchmark offline certificate verification"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/006-model-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified certificate closeout with focused suite 47 of 47 at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/model-benchmark-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/model-benchmark-certificate-validation.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/model-benchmark-certificates/model-benchmark-certificate-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane plain-digest closure map is explicitly empty"
      - "Eight ordered mode receipts preserve the complete common receipt identity vector"
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
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority** | Additive-dark evidence only; legacy writers and authority are unchanged |
| **Candidate SHA** | `e4aee609f3957f7bd9255d0b7c2e491c7b4dee90` |
| **BASE SHA** | `efb524964bc60ef8df7ef2ad4d4c6beff20c0448` |
| **Fixture manifest SHA-256** | N/A - the focused suite constructs typed fixtures in memory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf exports one dark per-run certificate, eight ordered mode-specific transition receipts, strict transport
parsers, a typed error vocabulary, and a network-free verifier. Issuance and verification both read the real authorized
ledger, fold the landed Model Benchmark reducer, verify sealed artifact bytes, derive the shared replay fingerprint, and
use the durable boundary-receipt certification path.

The mode-specific receipt order is `benchmark_started`, `model_cell_started`, `model_cell_completed`,
`score_matrix_reduced`, `judge_calibrated`, `contamination_checked`, `diagnostic_tail_allocated`, then
`selection_proposed`. Their artifact roles resolve through the real sealed store as:

| Certificate role | Expected sealed artifact kind |
|------------------|-------------------------------|
| `benchmark-recipe` | `model-benchmark-recipe` |
| `run-manifest` | `model-benchmark-run-manifest` |
| `model-cell-input` | `model-benchmark-model-cell-input` |
| `raw-cell-output` | `model-benchmark-raw-cell-output` |
| `scoring-matrix` | `model-benchmark-scoring-matrix` |
| `common-anchor-selection` | `model-benchmark-common-anchor-selection` |
| `adaptive-diagnostic-selection` | `model-benchmark-adaptive-diagnostic-selection` |
| `validity-evidence` | `model-benchmark-validity-evidence` |
| `contamination-lineage` | `model-benchmark-contamination-lineage` |
| `workload-evidence` | `model-benchmark-workload-evidence` |
| `selection-evidence` | `model-benchmark-selection-evidence` |

The predecessor declared no plain-digest closure fields, so
`MODEL_BENCHMARK_NAMED_DIGEST_CLOSURE_RULES` is the explicit empty list `[]`. This does not weaken reference
verification: every typed binding is re-read by exact sealed identity and checked for expected kind, evaluation epoch,
canonical bytes, dependency closure, authorized origin-event ownership, ordered receipt use, and replay inclusion.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/model-benchmark-certificates/model-benchmark-certificate-types.ts` | Created | Declares certificate, receipt, verifier, transition, and typed failure contracts |
| `runtime/lib/model-benchmark-certificates/model-benchmark-certificate-validation.ts` | Created | Parses exact fields, closed enums, bindings, receipts, certificates, and bundles |
| `runtime/lib/model-benchmark-certificates/model-benchmark-certificates.ts` | Created | Issues receipts and certificates and independently verifies their ordered closure |
| `runtime/lib/model-benchmark-certificates/index.ts` | Created | Exports the public runtime surface |
| `runtime/tests/unit/model-benchmark-certificates.vitest.ts` | Created | Drives valid and fail-closed paths through the real substrate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The extension consumes the common certificate parser and offline verifier from
`deep-improvement-common-certificates`. It embeds the verified common bundle, common certificate digest, evaluator and
canary epochs, disposition, and the exact ordered common receipt identity vector.

The identity vector remains owned by the common service. Every Model Benchmark receipt preserves the complete common
receipt set instead of reissuing or rewriting shared evaluator, canary, promotion, abort, or restoration identities. Its
own receipts use `BoundaryReceiptIssuer`, the shared authorized evidence writer, and registered certification providers;
the run certificate uses the same boundary certification substrate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the mode receipt order to the eight matrix lifecycle transitions | The certificate binds the complete benchmark path from admission through selection evidence |
| Declare the plain-digest map as empty | The landed predecessor declared no mode-owned deferred fields |
| Re-read every typed binding from the real store | Shape-valid digests cannot prove sealed existence, kind, canonical bytes, or epoch |
| Return `unverifiable` for absent certified bytes | Missing offline material is distinct from contradictory evidence |
| Keep authority fixed to `dark-evidence-only` | A certificate attests recorded evidence and does not decide promotion or execution |

### Successor Contract

Successor `005-resume-adapter` consumes:

- `ModelBenchmarkTransitionReceiptInput`, `ModelBenchmarkTransitionReceiptFacts`,
  `ModelBenchmarkTransitionReceipt`, and `ModelBenchmarkReceiptIdentity`.
- `ModelBenchmarkRunCertificateBody`, `ModelBenchmarkRunCertificate`, and
  `ModelBenchmarkCertificateBundle`.
- `ModelBenchmarkOfflineVerificationInput`, `ModelBenchmarkOfflineVerificationResult`, and
  `ModelBenchmarkOfflineVerifierReceipt`.
- `ModelBenchmarkCertificateError`, `ModelBenchmarkCertificateFailureCodes`, and
  `ModelBenchmarkTransitionKinds`.
- `issueModelBenchmarkTransitionReceipt`, `issueModelBenchmarkRunCertificate`,
  `verifyModelBenchmarkCertificateOffline`, and the three exported parse functions.

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
| Targeted Vitest closeout at HEAD | PASS: 1 file, 47 tests, exit 0, 139.43s |
| Whole-runtime TypeScript closeout | PASS: exit 0 with `--noEmit --ignoreDeprecations 6.0` |
| Plain-digest closure coverage | PASS: declared list is explicitly empty |
| Strict packet validation | Errors 0, Warnings 1, exit 2; only the known `METADATA_DISK_PATH_CONSISTENCY` false-positive |

`substrateImportsReal: true`. Runtime imports and tests drive
`model-benchmark-ledger-schema`, `model-benchmark-reducers`, `model-benchmark-sealed-artifacts`, `authorized-ledger`,
`event-envelope`, `replay-fingerprint`, `sealed-reference-artifacts`, `receipts-and-effect-recovery`, and the common
certificate verifier. There is no local hash, ledger, reducer, artifact store, signature provider, receipt issuer, or
replay implementation.

The verifier tests reject wrong-kind and never-sealed owned references, missing certified bytes, fabricated and
wrong-kind artifact claims, stale evaluation epochs, unresolved typed evidence references, reordered receipts, broken
predecessors, unauthorized result events, changed replay inputs, stale evidence, blocked or incomplete lifecycles, and
mutated sealed bytes. A separate pruned store proves that legitimately referenced but absent bytes return
`unverifiable`, distinct from `invalid` and `valid`.
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
| Mode-local receipts for all benchmark transitions | Eight Model Benchmark receipts plus preserved common receipt identities | Shared evaluator, canary, promotion, abort, and restoration identities remain owned by `deep-improvement-common` |
| Named plain-digest closure fields | Explicit empty list | The landed sealed-artifact contract declared no deferred fields for this lane |
