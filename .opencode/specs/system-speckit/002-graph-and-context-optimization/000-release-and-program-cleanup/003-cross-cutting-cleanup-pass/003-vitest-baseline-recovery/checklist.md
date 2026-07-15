---
title: "Verification Checklist: Vitest baseline recovery"
description: "REQ-mapped verification checklist for baseline recovery and release-note correction."
trigger_phrases:
  - "vitest baseline recovery checklist"
  - "baseline verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/003-vitest-baseline-recovery"
    last_updated_at: "2026-05-08T21:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored baseline recovery checklist"
    next_safe_action: "Close remaining baseline failures"
    blockers: ["post-run still has 196 failures"]
---
# Verification Checklist: Vitest baseline recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim done until complete |
| **[P1]** | Required | Must complete or document explicit deferral |
| **[P2]** | Refinement | Can defer with reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] REQ-001 triage scope documented.
  - **Evidence**: `spec.md` defines the 4-bucket taxonomy and 198-failure scope.
- [x] CHK-002 [P0] REQ-002 net-regression gate planned.
  - **Evidence**: `plan.md` and `tasks.md` require pre/post JSON comparison.
- [x] CHK-003 [P0] REQ-003 changelog correction planned.
  - **Evidence**: `tasks.md` T014 targets the v3.4.1.0 row.
- [x] CHK-004 [P1] REQ-004 through REQ-007 action rules documented.
  - **Evidence**: `spec.md` and `plan.md` define fix/skip/follow-up annotation rules.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Forbidden Unit A files untouched.
  - **Evidence**: Pending final `git diff --name-only` check.
- [ ] CHK-011 [P1] Fixture-drift fixes are expectation-only or test-fixture-only.
  - **Evidence**: Pending final diff review.
- [ ] CHK-012 [P1] Each fixture-drift fix carries `// drift: <packet>` lineage.
  - **Evidence**: Pending final annotation scan.
- [ ] CHK-013 [P1] Runtime-regression repairs stay within the <=30 LOC single-file rule or are escalated.
  - **Evidence**: Pending final triage ledger.
- [ ] CHK-014 [P1] No new tests or clarity refactors added.
  - **Evidence**: Pending final diff review.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-001 all failing tests classified.
  - **Evidence**: Pending triage ledger count.
- [ ] CHK-021 [P0] REQ-002 post-recovery run has zero new failures vs pre-recovery baseline.
  - **Evidence**: Pending pre/post JSON comparison.
- [ ] CHK-022 [P1] REQ-004 all fixture-drift failures fixed in packet.
  - **Evidence**: Pending triage ledger count.
- [ ] CHK-023 [P1] REQ-005 runtime regressions fixed or escalated.
  - **Evidence**: Pending triage ledger count.
- [ ] CHK-024 [P1] REQ-006 environmental failures skipped with reason.
  - **Evidence**: Pending annotation scan.
- [ ] CHK-025 [P1] REQ-007 flaky failures sampled and quarantined.
  - **Evidence**: Pending flake sampling log, or zero flaky classification.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every failing test has a classification.
  - **Evidence**: `scratch/triage-classification.json` classifies all 198 pre-recovery failures.
- [ ] CHK-FIX-002 [P0] Every fixture drift is fixed or explicitly deferred.
  - **Evidence**: Not complete; post-run still reports fixture-drift failures.
- [ ] CHK-FIX-003 [P0] Every runtime-regression cluster is fixed or follow-up scoped.
  - **Evidence**: Not complete; 152 runtime-regression classifications remain in follow-up scope.
- [ ] CHK-FIX-004 [P1] Environmental failures identify the missing local fixture or generated artifact.
  - **Evidence**: `scratch/triage-classification.json` lists 28 environmental classifications.
- [ ] CHK-FIX-005 [P1] Final post-run proves zero new failures.
  - **Evidence**: Not complete; post-run still has 196 failures.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No auth, secret, or external-service configuration is introduced.
  - **Evidence**: Pending final diff review.
- [ ] CHK-031 [P1] Environmental skips do not expose credentials or local-only paths beyond existing fixture references.
  - **Evidence**: Pending annotation review.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] REQ-003 changelog row replaced outright with truthful post-recovery numbers.
  - **Evidence**: Pending changelog diff.
- [ ] CHK-041 [P1] REQ-009 implementation summary embeds drift/regression/environmental/flaky counts.
  - **Evidence**: Pending `implementation-summary.md` completion.
- [ ] CHK-042 [P1] `description.json` and `graph-metadata.json` status set to complete / 100%.
  - **Evidence**: Pending metadata update.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Pre/post JSON reports live in packet `scratch/`.
  - **Evidence**: Pending scratch file check.
- [ ] CHK-051 [P1] Triage ledger lives in packet `scratch/`.
  - **Evidence**: Pending scratch file check.
- [ ] CHK-052 [P1] Temporary `/tmp` reports are copied into packet artifacts before completion.
  - **Evidence**: Pending file check.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 3/6 |
| P1 Items | 17 | 1/17 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-08
**Verified By**: Codex

<!-- /ANCHOR:summary -->
