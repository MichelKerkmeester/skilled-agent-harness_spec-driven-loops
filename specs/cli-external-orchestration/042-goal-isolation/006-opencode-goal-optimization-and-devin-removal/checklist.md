---
title: "Verification Checklist: OpenCode Goal Optimization and Devin Goal Remnant Removal"
description: "Evidence gate for fixed OpenCode goal-state keys, compatibility migration, runtime-boundary preservation, and active Devin goal-remnant removal."
trigger_phrases:
  - "opencode goal optimization checklist"
  - "goal state migration verification"
  - "devin goal residue verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/006-opencode-goal-optimization-and-devin-removal"
    last_updated_at: "2026-08-10T17:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verification matrix established"
    next_safe_action: "Verify storage-key tests and implementation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-state.test.cjs"
---
# Verification Checklist: OpenCode Goal Optimization and Devin Goal Remnant Removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim completion until verified with evidence |
| **P1** | Required | Must complete or receive explicit user deferral |
| **P2** | Optional | May defer with a recorded reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and scope are documented. [EVIDENCE: `spec.md` defines REQ-001 through REQ-009 and the scope boundary.]
- [x] CHK-002 [P0] Technical approach and rollback are defined. [EVIDENCE: `plan.md` defines migration algorithms, failure handling, and rollback.]
- [x] CHK-003 [P0] Baseline focused suite passes 119/119. [EVIDENCE: `node --test` reported 119 tests passed and 0 failed.]
- [x] CHK-004 [P0] Long-id negative control reproduces the exact failure. [EVIDENCE: a 140-character session id produced a 285-character filename and `ENAMETOOLONG`.]
- [x] CHK-005 [P1] Active and historical Devin matches are separated. [EVIDENCE: `.opencode/hooks/goal/README.md:1` anchors the active inventory; historical spec matches are excluded.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `mk-goal.js` passes `node --check`. [Test: pending]
- [ ] CHK-011 [P0] Modified code and tests pass comment hygiene. [Test: pending]
- [ ] CHK-012 [P0] Digest and migration paths preserve fail-open injection and fail-closed selection. [Test: pending]
- [ ] CHK-013 [P1] ESM plugin export and default-off debug-output contracts remain unchanged. [Test: pending]
- [ ] CHK-014 [P1] OpenCode alignment guards have zero Phase 6 delta. [Test: pending]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Session keys are fixed-length, opaque, unique, and lowercase hexadecimal. [Test: pending]
- [ ] CHK-021 [P0] Long native ids set and read goals successfully. [Test: pending]
- [ ] CHK-022 [P0] Valid legacy active state migrates without data loss. [Test: pending]
- [ ] CHK-023 [P0] Occupied targets, malformed state, and embedded-id mismatches preserve sources. [Test: pending]
- [ ] CHK-024 [P0] Legacy archived state remains available exactly once in history. [Test: pending]
- [ ] CHK-025 [P0] Full focused OpenCode suite passes without regressing the 119-test baseline. [Test: pending]
- [ ] CHK-026 [P1] Native token usage and de-duplication tests remain unchanged and green. [Test: pending]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classified as cross-consumer persistence/path behavior. [EVIDENCE: `plan.md` maps the storage-key producer to all persistent consumers.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers state, archive, sweep, history, cache, and tests. [EVIDENCE: `rg` results for `sessionKeyForSession` and `goalPathForSession` cover every path consumer.]
- [x] CHK-FIX-003 [P0] Consumer inventory covers plugin tools, transforms, lifecycle events, docs, and runtime mirrors. [EVIDENCE: the affected-surfaces table in `plan.md` records each consumer class.]
- [ ] CHK-FIX-004 [P0] Adversarial tests cover long, unicode, malformed, mismatched, occupied-target, and duplicate-history cases. [Test: pending]
- [x] CHK-FIX-005 [P1] Matrix axes are listed before implementation. [EVIDENCE: `spec.md` lists identity, state, archive, failure, and runtime-boundary axes.]
- [ ] CHK-FIX-006 [P1] Environment-sensitive plugin tests run with restored process state. [Test: pending]
- [ ] CHK-FIX-007 [P1] Final evidence is pinned to the scoped working-tree diff and exact commands. [Source: pending final diff]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] New filenames contain neither raw nor reversible session identity. [Test: pending]
- [ ] CHK-031 [P0] Migration validates embedded session identity before adoption. [Test: pending]
- [ ] CHK-032 [P0] Private directory/file modes and atomic persistence remain intact. [Test: pending]
- [ ] CHK-033 [P1] No new dependency, secret, unbounded log, or default-on debug output is introduced. [Source: pending diff review]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Active goal-specific Devin residue scan returns zero matches. [Test: pending]
- [ ] CHK-041 [P0] Unrelated Devin runtime surfaces remain unchanged. [Source: pending diff review]
- [ ] CHK-042 [P1] Goal architecture, constitutional, feature-catalog, and playbook docs match current runtime truth. [File: pending]
- [ ] CHK-043 [P1] Phase 6, parent map, predecessor, summaries, handover, and metadata agree. [File: pending]
- [ ] CHK-044 [P1] Modified markdown passes sk-doc structure and validation checks. [Test: pending]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] No task-created backup, renderer output, or temporary state remains. [Source: pending final inventory]
- [ ] CHK-051 [P1] Scoped diff contains no unrelated Phase 6 modification. [Source: pending git diff]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 8/22 |
| P1 Items | 14 | 4/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation completion
<!-- /ANCHOR:summary -->
