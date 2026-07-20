---
title: "Checklist: Lane C Compiled-Routing Benchmark Alignment"
description: "Planned QA gate for compiled-path invocation, route-gold equality, drift classification, report non-regression, isolation, and frozen-file integrity."
trigger_phrases:
  - "Lane C compiled routing checklist"
  - "benchmark parity QA gate"
importance_tier: "critical"
contextType: "implementation"
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

All checks are **Planned** and remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Frozen file hashes and representative legacy reports are captured.
  - **Planned evidence**: Digest ledger and baseline report fixtures.
- [ ] CHK-002 [P0] P0/P3 shared interfaces are stable and no local hub list is planned.
  - **Planned evidence**: API review and dependency note.
- [ ] CHK-003 [P1] Normalized routing schema covers all hub bundle shapes.
  - **Planned evidence**: Seven-hub shape matrix.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] New parity logic lives outside the frozen scorer/replay/loader files.
  - **Planned evidence**: Scoped diff and module ownership review.
- [ ] CHK-011 [P0] Normalization is registry-driven and order-stable.
  - **Planned evidence**: Unit tests for single, ordered, surface, defer, and reject shapes.
- [ ] CHK-012 [P0] Sentinel cause comes from the shared status probe, not local inference.
  - **Planned evidence**: Adapter test and no duplicate classifier search.
- [ ] CHK-013 [P1] Parity diagnostics name scenario and first differing routing field.
  - **Planned evidence**: Forced divergence snapshot.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Eligible rows invoke the public front door with flag `1`.
  - **Planned evidence**: Child-process call record and report flag.
- [ ] CHK-021 [P0] Legacy and compiled observations each pass the same route gold.
  - **Planned evidence**: Per-row dual gold results.
- [ ] CHK-022 [P0] Routing projections compare equal for fresh current hubs.
  - **Planned evidence**: Parity counts and zero mismatches.
- [ ] CHK-023 [P0] Forced route divergence blocks the new gate.
  - **Planned evidence**: Distinct verdict and non-zero exit.
- [ ] CHK-024 [P0] Drift, missing manifest, and breakage produce distinct results.
  - **Planned evidence**: State-matrix fixture results.
- [ ] CHK-025 [P1] Scenarios without route gold do not enter the hard parity denominator.
  - **Planned evidence**: Diagnostic-only row test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] JSON report contains resolved mode, eligible rows, parity counts, drift rows, breakages, and frozen hashes.
  - **Planned evidence**: Report schema fixture.
- [ ] CHK-031 [P0] Markdown renders only from report JSON.
  - **Planned evidence**: JSON-to-Markdown snapshot test.
- [ ] CHK-032 [P0] CLI exit behavior distinguishes parity breakage from existing structural/route-gold gates.
  - **Planned evidence**: End-to-end exit matrix.
- [ ] CHK-033 [P1] README and CLI usage match implemented option/default semantics.
  - **Planned evidence**: Documentation consistency check.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Child flag-on environment does not mutate parent `process.env`.
  - **Planned evidence**: Before/after environment assertion.
- [ ] CHK-041 [P0] Fixtures cannot write live activation manifests or routing inputs.
  - **Planned evidence**: Temp-root path assertions and live hash inventory.
- [ ] CHK-042 [P1] Reports do not persist raw secrets or unrelated environment values.
  - **Planned evidence**: Report schema inspection.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary all report Planned status.
  - **Planned evidence**: Status audit.
- [ ] CHK-051 [P1] Lane C docs reference the authoritative contracts without duplicating them.
  - **Planned evidence**: Cross-link review.
- [ ] CHK-052 [P1] Strict packet validation reports zero errors.
  - **Planned evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Parity code, fixtures, and tests stay inside the Lane C harness tree.
  - **Planned evidence**: Scoped path inventory.
- [ ] CHK-061 [P0] The three frozen files have identical before/after hashes.
  - **Planned evidence**: SHA-256 comparison.
- [ ] CHK-062 [P1] Production manifests and hub routing inputs remain byte-unchanged during tests.
  - **Planned evidence**: Before/after live artifact hashes.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 18 | 0/18 | Planned |
| P1 Items | 9 | 0/9 | Planned |
| P2 Items | 0 | 0/0 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Flag-on compiled invocation, dual route-gold checks, normalized routing equality, drift/no-manifest/breakage classification, report and exit gating, environment/filesystem isolation, D1-D5 non-regression, and frozen-file integrity.
<!-- /ANCHOR:summary -->

