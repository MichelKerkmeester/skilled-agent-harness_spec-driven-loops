---
title: "Checklist: Lane C Compiled-Routing Benchmark Alignment"
description: "Completed QA record for compiled-path invocation, route-gold equality, drift classification, report non-regression, isolation, and frozen-file integrity."
trigger_phrases:
  - "Lane C compiled routing checklist"
  - "benchmark parity QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment"
    last_updated_at: "2026-07-21T06:48:08Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Restored default-off benchmark parity isolation"
    next_safe_action: "Keep activation operator-gated"
---
# Checklist: Lane C Compiled-Routing Benchmark Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot report compiled-reality alignment while unchecked |
| **[P1]** | Required | Must verify or record an operator-approved deferral |
| **[P2]** | Optional | May defer with an explicit reason |

All checks are verified against the shared harness and the delivered acceptance-gap extensions.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Frozen file hashes and representative legacy reports are captured. [Evidence: `implementation-summary.md`]
  - **Evidence**: Digest ledger and baseline report fixtures.
- [x] CHK-002 [P0] P0/P3 shared interfaces are stable and no local hub list is planned. [Evidence: `implementation-summary.md`]
  - **Evidence**: API review and dependency note.
- [x] CHK-003 [P1] Normalized routing schema covers all hub bundle shapes. [Evidence: `implementation-summary.md`]
  - **Evidence**: Seven-hub shape matrix.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] New parity logic lives outside the frozen scorer/replay/loader files. [Evidence: `implementation-summary.md`]
  - **Evidence**: Scoped diff and module ownership review.
- [x] CHK-011 [P0] Normalization is registry-driven and order-stable. [Evidence: `implementation-summary.md`]
  - **Evidence**: Unit tests for single, ordered, surface, defer, and reject shapes.
- [x] CHK-012 [P0] Sentinel cause comes from the shared status probe, not local inference. [Evidence: `implementation-summary.md`]
  - **Evidence**: Adapter test and no duplicate classifier search.
- [x] CHK-013 [P1] Parity diagnostics name scenario and first differing routing field. [Evidence: `implementation-summary.md`]
  - **Evidence**: Forced divergence snapshot.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Eligible rows invoke the public front door with flag `1`. [Evidence: `implementation-summary.md`]
  - **Evidence**: Child-process call record and report flag.
- [x] CHK-021 [P0] Legacy and compiled observations each pass the same route gold. [Evidence: `implementation-summary.md`]
  - **Evidence**: Per-row dual gold results.
- [x] CHK-022 [P0] Routing projections compare equal for fresh current hubs. [Evidence: `implementation-summary.md`]
  - **Evidence**: Parity counts and zero mismatches.
- [x] CHK-023 [P0] Forced route divergence blocks the new gate. [Evidence: `implementation-summary.md`]
  - **Evidence**: Distinct verdict and non-zero exit.
- [x] CHK-024 [P0] Drift, missing manifest, and breakage produce distinct results. [Evidence: `implementation-summary.md`]
  - **Evidence**: State-matrix fixture results.
- [x] CHK-025 [P1] Scenarios without route gold do not enter the hard parity denominator. [Evidence: `implementation-summary.md`]
  - **Evidence**: Diagnostic-only row test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] JSON report contains resolved mode, eligible rows, parity counts, drift rows, breakages, and frozen hashes. [Evidence: `implementation-summary.md`]
  - **Evidence**: Report schema fixture.
- [x] CHK-031 [P0] Markdown renders only from report JSON. [Evidence: `implementation-summary.md`]
  - **Evidence**: JSON-to-Markdown snapshot test.
- [x] CHK-032 [P0] CLI exit behavior distinguishes parity breakage from existing structural/route-gold gates. [Evidence: `implementation-summary.md`]
  - **Evidence**: End-to-end exit matrix.
- [x] CHK-033 [P1] README and CLI usage match the default-off baseline-isolation contract and explicit `on|auto` semantics. [Evidence: `implementation-summary.md`]
  - **Evidence**: Documentation consistency check plus option-resolution tests.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Child flag-on environment does not mutate parent `process.env`. [Evidence: `implementation-summary.md`]
  - **Evidence**: Before/after environment assertion.
- [x] CHK-041 [P0] Fixtures cannot write live activation manifests or routing inputs. [Evidence: `implementation-summary.md`]
  - **Evidence**: Temp-root path assertions and live hash inventory.
- [x] CHK-042 [P1] Reports do not persist raw secrets or unrelated environment values. [Evidence: `implementation-summary.md`]
  - **Evidence**: Report schema inspection.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary report the implemented state consistently. [Evidence: `implementation-summary.md`]
  - **Evidence**: Final cross-document status audit.
- [x] CHK-051 [P1] Lane C docs reference the authoritative contracts without duplicating them. [Evidence: `implementation-summary.md`]
  - **Evidence**: Cross-link review.
- [x] CHK-052 [P1] Strict packet validation reports zero errors. [Test: validate.sh --strict]
  - **Evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Parity code, fixtures, and tests stay inside the Lane C harness tree. [Evidence: `implementation-summary.md`]
  - **Evidence**: Scoped path inventory.
- [x] CHK-061 [P0] The three frozen files have identical before/after hashes. [Evidence: `implementation-summary.md`]
  - **Evidence**: SHA-256 comparison.
- [x] CHK-062 [P1] Production manifests and hub routing inputs remain byte-unchanged during tests. [Evidence: `implementation-summary.md`]
  - **Evidence**: Before/after live artifact hashes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 18 | 18/18 | Verified |
| P1 Items | 9 | 9/9 | Verified |
| P2 Items | 0 | 0/0 | Not applicable |

**Verification Date**: 2026-07-21.

**Verification Scope**: Default-off Mode-A isolation, explicit flag-on compiled invocation, dual route-gold checks, normalized routing equality, drift/no-manifest/breakage classification, report and exit gating, environment/filesystem isolation, D1-D5 non-regression, and frozen-file integrity.
<!-- /ANCHOR:summary -->
