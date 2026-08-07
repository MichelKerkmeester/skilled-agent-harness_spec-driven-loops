---
title: "Verification Checklist: Pathspec Integrity"
description: "Evidence for the noise measurement, including the two false signals the audit produced before it was trustworthy."
trigger_phrases:
  - "advisory noise audit"
  - "git advisory fire rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T23:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Measured the real fire rate with a control group"
    next_safe_action: "Operator reviews the packet"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Pathspec Integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The pathspec failure is covered by a rule with a reproduction
  - **Evidence**: `commit-scope-drops-untracked`, reproduced in the phase 002 suite
- [x] CHK-002 [P1] Ordinary shapes reflect real prevalence
  - **Evidence**: weighted to reflog distribution; includes plain reset, rebase and merge

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] The audit writes nothing
  - **Evidence**: reads state and prints; no mutation path exists
- [x] CHK-004 [P1] Probes resolve real paths from the target repository
  - **Evidence**: hardcoded README probe replaced after it manufactured a 4% false reading
- [x] CHK-005 [P1] Comment hygiene holds
  - **Evidence**: durable reasoning only; no spec paths or task ids

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Measured against the build worktree
  - **Evidence**: 0 of 25 ordinary commands fired
- [x] CHK-007 [P0] Measured against a deliberately dirty repository
  - **Evidence**: 0 of 25 after the probe fix, with untracked files present throughout
- [x] CHK-008 [P0] Control shapes fire
  - **Evidence**: 5 of 5 in both repositories
- [x] CHK-009 [P0] Aggregate stays within the research budget
  - **Evidence**: 0% against a 3% ceiling

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P0] The audit cannot report success while measuring nothing
  - **Evidence**: no rules loaded exits 2 without a verdict; caught on the main checkout
- [x] CHK-011 [P0] A quiet result with no control fire is reported invalid
  - **Evidence**: verdict path checks the control count first
- [x] CHK-012 [P1] Over-budget exits non-zero
  - **Evidence**: exit code follows the aggregate comparison

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P0] No repository content is written or transmitted
  - **Evidence**: output is counts, rule ids and the probe strings
- [x] CHK-014 [P1] Probe commands are never executed
  - **Evidence**: shapes are evaluated as strings; only read-only state queries run

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P0] The result is described as a replay, not a fire rate
  - **Evidence**: stated in the summary and in the module header
- [x] CHK-016 [P1] Both false signals are recorded rather than quietly fixed
  - **Evidence**: the false green and the manufactured 4% are both in the summary

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P0] The audit lives with the rules it measures
  - **Evidence**: `sk-git/scripts/lib/`
- [x] CHK-018 [P2] Nothing runs it automatically
  - **Evidence**: invoked by hand; recorded as a limitation

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Complete | Outstanding |
|----------|-------|----------|-------------|
| P0 | 10 | 10 | 0 |
| P1 | 7 | 7 | 0 |
| P2 | 1 | 1 | 0 |

The headline number survived two corrections to the measurement itself before it could be trusted:
a false green from an empty rule set, and a manufactured over-budget reading from a hardcoded
probe path. Both are recorded above.

<!-- /ANCHOR:summary -->
