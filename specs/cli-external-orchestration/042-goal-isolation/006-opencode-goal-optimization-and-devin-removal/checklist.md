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
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "All required Phase 6 verification gates completed"
    next_safe_action: "Monitor digest-keyed state and compatibility migration during normal use"
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

- [x] CHK-010 [P0] `mk-goal.js` passes `node --check`. [EVIDENCE: final syntax command exited 0.]
- [x] CHK-011 [P0] Modified code and tests pass comment hygiene. [EVIDENCE: `check-comment-hygiene.sh` exited 0 for `.opencode/plugins/mk-goal.js`, both changed test files, and both runtime-mirror scripts.]
- [x] CHK-012 [P0] Digest and migration paths preserve fail-open injection and fail-closed selection. [EVIDENCE: `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs` covers passive injection, malformed state, mismatched ids, and occupied targets.]
- [x] CHK-013 [P1] ESM plugin export and default-off debug-output contracts remain unchanged. [EVIDENCE: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` includes passing export-contract and capabilities suites.]
- [x] CHK-014 [P1] OpenCode alignment guards have zero Phase 6 delta. [EVIDENCE: `verify_alignment_drift.py --root .opencode/hooks/goal --root .opencode/plugins` scanned 42 files with zero findings.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Session keys are fixed-length, opaque, unique, and lowercase hexadecimal. [EVIDENCE: `.opencode/plugins/tests/mk-goal-state.test.cjs` and the `CO-039` snippet observe only `^[a-f0-9]{64}\.json$` basenames.]
- [x] CHK-021 [P0] Long native ids set and read goals successfully. [EVIDENCE: `.opencode/plugins/tests/mk-goal-state.test.cjs` passes the 140-character session-id regression.]
- [x] CHK-022 [P0] Valid legacy active state migrates without data loss. [EVIDENCE: `.opencode/plugins/tests/mk-goal-state.test.cjs` proves the goal remains readable and the validated source disappears.]
- [x] CHK-023 [P0] Occupied targets, malformed state, and embedded-id mismatches preserve sources. [EVIDENCE: adversarial cases in `.opencode/plugins/tests/mk-goal-state.test.cjs` pass.]
- [x] CHK-024 [P0] Legacy archived state remains available exactly once in history. [EVIDENCE: `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` archive/history cases pass.]
- [x] CHK-025 [P0] Full focused OpenCode suite passes without regressing the 119-test baseline. [EVIDENCE: `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` reports 125 pass and 0 fail.]
- [x] CHK-026 [P1] Native token usage and de-duplication tests remain unchanged and green. [EVIDENCE: native `message.updated` accounting and duplicate-event cases pass; playbook snippet reports `tokensUsed:160`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classified as cross-consumer persistence/path behavior. [EVIDENCE: `plan.md` maps the storage-key producer to all persistent consumers.]
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers state, archive, sweep, history, cache, and tests. [EVIDENCE: `rg` results for `sessionKeyForSession` and `goalPathForSession` cover every path consumer.]
- [x] CHK-FIX-003 [P0] Consumer inventory covers plugin tools, transforms, lifecycle events, docs, and runtime mirrors. [EVIDENCE: the affected-surfaces table in `plan.md` records each consumer class.]
- [x] CHK-FIX-004 [P0] Adversarial tests cover long, unicode, malformed, mismatched, occupied-target, and duplicate-history cases. [EVIDENCE: `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs` pass inside the 125-test run.]
- [x] CHK-FIX-005 [P1] Matrix axes are listed before implementation. [EVIDENCE: `spec.md` lists identity, state, archive, failure, and runtime-boundary axes.]
- [x] CHK-FIX-006 [P1] Environment-sensitive plugin tests run with restored process state. [EVIDENCE: `.opencode/plugins/tests/mk-goal-{capabilities,lifecycle}.test.cjs` pass without leaking `MK_GOAL_PLUGIN_DISABLED`.]
- [x] CHK-FIX-007 [P1] Final evidence is pinned to the scoped working-tree diff and exact commands. [EVIDENCE: `implementation-summary.md` and `handover.md` record the final commands and excluded dirty paths.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] New filenames contain neither raw nor reversible session identity. [EVIDENCE: privacy assertions in `.opencode/plugins/tests/mk-goal-state.test.cjs` and `CO-039` report only SHA-256 basenames.]
- [x] CHK-031 [P0] Migration validates embedded session identity before adoption. [EVIDENCE: mismatched-id source-preservation cases pass in `.opencode/plugins/tests/mk-goal-state.test.cjs`.]
- [x] CHK-032 [P0] Private directory/file modes and atomic persistence remain intact. [EVIDENCE: permissions and atomic-write cases pass in `.opencode/plugins/tests/mk-goal-{state,lifecycle}.test.cjs`.]
- [x] CHK-033 [P1] No new dependency, secret, unbounded log, or default-on debug output is introduced. [EVIDENCE: scoped implementation diff adds only built-in `node:crypto` and bounded diagnostics.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Active goal-specific Devin residue scan returns zero matches. [EVIDENCE: `rg -n -i devin` across `.opencode/hooks/goal`, runtime goal scenarios, policy, catalog, Pi, and Cursor goal surfaces exits with no match.]
- [x] CHK-041 [P0] Unrelated Devin runtime surfaces remain unchanged. [EVIDENCE: `.devin` and `cli-devin` have zero worktree diff.]
- [x] CHK-042 [P1] Goal architecture, constitutional, feature-catalog, and playbook docs match current runtime truth. [EVIDENCE: `.opencode/hooks/goal/goal-plugin.md` and the five `goal-hook`/`goal-manage-cli` scenarios agree on OpenCode, Pi, Cursor, Claude Code, and Codex boundaries.]
- [x] CHK-043 [P1] Phase 6, parent map, predecessor, summaries, handover, and metadata agree. [EVIDENCE: all surfaces report Phase 6 complete and 125/125 OpenCode tests.]
- [x] CHK-044 [P1] Modified markdown passes sk-doc structure and validation checks. [EVIDENCE: `validate_document.py` passes all ten goal playbook documents; `validate-playbook-package.cjs` reports zero goal-file violations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] No task-created backup, renderer output, or temporary state remains. [EVIDENCE: `find 006-opencode-goal-optimization-and-devin-removal -maxdepth 2 -type d` shows only the canonical folder and `scratch/`.]
- [x] CHK-051 [P1] Scoped diff contains no unrelated Phase 6 modification. [EVIDENCE: `git diff --cached --name-status` excludes Codex config, discovery fixtures, and packet 019.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-10

**Current verdict**: Phase 6 implementation and required verification complete.
<!-- /ANCHOR:summary -->
