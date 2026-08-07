---
title: "Checklist: cli-opencode Driver Leg + Matrix Schema Extension"
description: "Verification checklist for the matrix-schema child phase — parse, validateManifest, count reconciliation, and byte-stable regression. Unchecked pending implementation."
trigger_phrases:
  - "checklist matrix schema opencode driver"
  - "validateManifest checklist"
  - "requiredCellCount verification checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/001-driver-leg-and-matrix-schema"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 checklist"
    next_safe_action: "Edit matrix schema on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-001-driver-leg-matrix-schema-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: cli-opencode Driver Leg + Matrix Schema Extension

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: Pending
- [ ] CHK-002 [P0] Additive-edit approach defined in plan.md
  - **Evidence**: Pending
- [ ] CHK-003 [P0] Extend-vs-parallel + coverage decisions recorded
  - **Evidence**: Pending (parent OPEN QUESTIONS)


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Matrix is valid JSON (`JSON.parse` succeeds)
  - **Evidence**: Pending
- [ ] CHK-011 [P0] `validateManifest()` passes with no throw
  - **Evidence**: Pending
- [ ] CHK-012 [P1] New cell ids are unique and follow the `driver:DAB-0XX:cli-opencode` convention
  - **Evidence**: Pending
- [ ] CHK-013 [P1] Each new cell declares exactly one `skip` (skip-xor-resultPointer)
  - **Evidence**: Pending


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `requiredCellCount === requiredCells.length`
  - **Evidence**: Pending (target 52 → 52 + N)
- [ ] CHK-021 [P0] Each new cell `fixtureRef` resolves to an existing `fixtures` key
  - **Evidence**: Pending
- [ ] CHK-022 [P1] `executor` default is `deepseek/deepseek-v4-pro` + `high`
  - **Evidence**: Pending
- [ ] CHK-023 [P1] `driverLegs` has a 4th entry distinct from the frozen three
  - **Evidence**: Pending


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets or credentials embedded in the manifest
  - **Evidence**: Pending (model ids only, no keys)
- [ ] CHK-031 [P1] No path outside the benchmark asset is referenced by new cells
  - **Evidence**: Pending
- [ ] CHK-032 [P1] `restorePolicy` stays `git`; fixtures untouched
  - **Evidence**: Pending


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final manifest edit
  - **Evidence**: Pending
- [ ] CHK-041 [P1] Open questions resolved and recorded
  - **Evidence**: Pending
- [ ] CHK-042 [P2] Handoff note to child 002 (leg name = `LEG_TABLE` key) written
  - **Evidence**: Pending


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only `command-benchmark-matrix.json` changed on the worktree
  - **Evidence**: Pending (`git diff --name-only`)
- [ ] CHK-051 [P1] Existing 52 cells + 3 legs + fixtures byte-stable in the diff
  - **Evidence**: Pending


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: Pending
**Verified By**: Pending — implementation not yet started

<!-- /ANCHOR:summary -->
