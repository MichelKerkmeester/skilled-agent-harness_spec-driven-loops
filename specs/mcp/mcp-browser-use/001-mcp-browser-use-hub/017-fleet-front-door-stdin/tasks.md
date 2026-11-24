---
title: "Tasks: Phase 17: fleet-front-door-stdin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fleet front door stdin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 17: fleet-front-door-stdin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills`. `C` is `.skilled/skills/sk-doc/sk-create-skill`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 List every live `--prompt "<task>"` line. Verify: `git grep` at HEAD outside changelogs and benchmarks. Evidence: 32 lines.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Rewrite the 29 doc lines with one script (`$S/*/SKILL.md`, `$S/*/ROUTER.md`, READMEs, feature catalogs, `$C/assets/parent-skill/parent-skill-root-router-template.md`, `$C/references/parent-skill/compiled-routing-architecture.md`). Verify: the script reports 0 left per file. Evidence: `total 29`.
- [x] T003 Rewrite the three code surfaces by hand (`$C/scripts/init_skill.py`, `$C/scripts/tests/compiled-routing-lockstep-parity.test.cjs`, `.skilled/bin/README.md`). Verify: the grep finds no live line. Evidence: empty output.
- [x] T004 Sync the `007-sk-doc` authored `registry-compiler.cjs` word. Verify: `compiled-route-sync.cjs --check`. Evidence: "all 61 served copies match their authored files".
- [x] T005 Re-mint seven activation manifests and copy each to its archive path. Verify: `compiled-route-guard.cjs --json`. Evidence: 8 hubs `ok: true`.
- [x] T006 Regenerate intent signals for all eight hubs. Verify: the generator prints RESULT: PASSED. Evidence: eight PASSED, no hub `graph-metadata.json` changed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Heredoc injection check on every hub. Verify: each prints a decision and no file appears. Evidence: eight JSON decisions; `ls` reports no such file.
- [x] T008 `parent-skill-check` on all eight hubs. Verify: each prints OK. Evidence: eight "all hard invariants passed, 0 warnings".
- [x] T009 Eight canary harnesses. Verify: each exits 0. Evidence: `canary=0` for all eight; their untracked build output was removed.
- [x] T010 sk-doc tests and the parity test. Verify: pytest passes and the parity test exits 0. Evidence: 462 passed; parity exit 0.
- [x] T011 Bin suite. Verify: no failure. Evidence: tests 197, pass 197, fail 0.
- [x] T012 Worktree quality gate. Verify: no blocker. Evidence: `NO_BLOCKER_FOUND`.
- [x] T013 Validate the hub epic. Verify: `validate.sh --strict --recursive` prints RESULT: PASSED. Evidence: recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision**: See `decision-record.md` (Q011)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: sections 1 to 4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: `--prompt-stdin` already in `compiled-route.cjs`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The edited Python and test file run. Evidence: pytest 462 passed; parity exit 0.
- [x] CHK-011 [P0] No debug code left. Evidence: `NO_BLOCKER_FOUND`.
- [x] CHK-012 [P1] No ephemeral ids in code. Evidence: the edits add no comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` reads Closeable Yes.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the injection check on eight hubs.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a task holding `"`, `$()` and a backtick.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the guard flagged seven stale manifests before the re-mint.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class. Evidence: class-of-bug, one instruction copied to every hub.
- [x] CHK-FIX-002 [P0] Same-class inventory done. Evidence: repo grep at HEAD, 32 lines, all rewritten.
- [x] CHK-FIX-003 [P0] Consumer inventory done. Evidence: manifests, intent signals, canaries, scaffold tests.
- [x] CHK-FIX-004 [P1] Producer fixed. Evidence: the template and `init_skill.py`.
- [x] CHK-FIX-005 [P1] Evidence pinned to the phase commit named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: none added.
- [x] CHK-031 [P0] Input handling. Evidence: the task reaches every front door on stdin, never through shell expansion.
- [x] CHK-032 [P1] Auth and authz: N/A. No change touches sign-in or permissions.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree. Evidence: REQ-001 to REQ-005.
- [x] CHK-041 [P1] The bin README leads with `--prompt-stdin`. Evidence: line 162.
- [x] CHK-042 [P2] Changelogs: not written. The hub versions are unchanged and the commit hook bumps doc versions.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: the rewrite script lives in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the untracked canary build folders were removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
