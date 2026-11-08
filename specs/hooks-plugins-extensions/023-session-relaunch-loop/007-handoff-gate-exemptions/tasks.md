---
title: "Tasks: Phase 7: handoff-gate-exemptions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "handoff gate exemptions tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: handoff-gate-exemptions

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

**Task Format**: `T### [P?] Description (file path)`

The exemption test is written first and must fail on the code before the fix. The phase is not committed, so the evidence is pinned to the worktree state and to `file:line` references, not to a commit SHA.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase 006 record of G20 and G21 (`../006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi-run5-pane.txt`, lines 184 to 203 and 307 to 334) and the parent phase map (`../spec.md`)
- [x] T002 Check that the Gate 3 classifier does not fire on the relaunch seed or on a read-only prompt, run through tsx during this phase, which returned `no_match`. `gate-3-classifier.ts` therefore stays unchanged (`.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts`)
- [x] T003 Scaffold the Level 2 phase docs under `007-handoff-gate-exemptions/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the exemption test first, which asserts `allow` for a handoff note under `.skilled/skills/.state/`, `deny` for the concern README and `deny` for a nested `src/.state` file. Before the fix the assertion failed with an actual `deny` (`.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`, line 896)
- [x] T005 Add `RUNTIME_STATE_RELATIVE_PATH` and the runtime-state exemption, so the test goes green (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`, lines 71 and 1573 to 1579)
- [x] T006 [P] Add the runtime-state clause to the Gate 2 artifact trigger and to the Gate 3 "does not fire" clause (`AGENTS.md`, lines 70 and 75)
- [x] T007 [P] Pin the default `model` and set the `build` and `plan` agents to the same model with variant `max` (`opencode.json`, lines 3, 6 to 7 and 10 to 11)
- [x] T008 Run live run 10 on Claude, Pi and OpenCode, with no Gate 3 answer in the prompt, and save the evidence in `evidence/live-run10-2026-10-19/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run `spec-gate-core.test.mjs` from the final state: tests 110, pass 107, fail 0, skipped 3, exit 0. The hostile specs-dir variant also passes
- [x] T010 Create the run folder `2026-10-19--manual-testing-playbook--session-relaunch-gate-exemptions` with its index row and the three playbook pointers, then run the manifest script with `--write` and confirm `reproduced=True`
- [x] T011 Update the parent phase map row 7, the parent binding rows (006 and 007) and the G20 and G21 pointers in phase 006
- [x] T012 Run `validate.sh --strict` on this folder and recursively on the parent, the playbook validator, `validate_document.py` and `hvr_scan.py`, and record each result in `implementation-summary.md`
- [x] T013 Confirm that every AC row is Met with evidence, and that the metadata agrees across `spec.md`, the AC rows, `goal.md` and `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. `node --check` on `spec-gate-core.mjs` exits 0, and no lint configuration exists at the repo root
- [x] CHK-011 [P0] No console errors or warnings. The normal test run has 0 console or unhandled-error lines
- [x] CHK-012 [P1] Error handling implemented. The exemption adds no error path, and a blank path stays exempt as before
- [x] CHK-013 [P1] Code follows project patterns. The new constant follows the `*_RELATIVE_PATH` pattern of `GATE_STATE_DIR_RELATIVE_PATH`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-009 are Met with evidence)
- [x] CHK-021 [P0] Manual testing complete. Live run 10 covered Claude, Pi and OpenCode
- [x] CHK-022 [P1] Edge cases tested. The concern README and the nested `.state` file are both covered
- [x] CHK-023 [P1] Error scenarios validated. Both `deny` cases return `deny` in the test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The finding is `cross-consumer`: the spec-gate core, the Codex and Devin adapters and the framework rules all read the same path rule.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. The `rg` inventory is recorded in `implementation-summary.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. `spec-gate-core.mjs:1787`, `codex/spec-gate-enforce.mjs:27` and `devin/permission-request-policy.mjs:128` are recorded.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. The table test `runtime-state exemption holds against lookalike, joined and outside-root paths` in `spec-gate-core.test.mjs` covers eight rows: a `.stateful` lookalike (deny), absolute and relative `..` escapes (deny), the state dir itself (deny), a root-level state README and a deeper README (allow), a relative handoff note (allow) and an outside-root path (allow). Suite: tests 110, pass 107, fail 0, skipped 3.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. The axes are in `plan.md`, and the test covers three rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. The test file was run with `SPEC_KIT_SPECS_DIR=/etc`, `SPECKIT_SPECS_DIR=../..` and `SYSTEM_SPEC_GATE_ENFORCE=1`, and it passes (106 pass, 0 fail).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. OPEN: nothing is committed, so no SHA exists. The evidence is pinned to the worktree state and `file:line`, and the pin becomes a SHA only after the operator's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The secret-pattern scan of the evidence and the run folder finds only the variable name `OPENAI_API_KEY`
- [x] CHK-031 [P0] Input validation implemented. The path is resolved through real symlinks and `..` segments before the rule applies
- [x] CHK-032 [P1] Auth/authz working correctly. No auth surface changed, and the deny matrix still denies source writes with the gate open and enforcement on
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The comment above the exemption states the durable reason: runtime state is gitignored, and a concern README stays gated
- [x] CHK-042 [P2] README updated (if applicable). `runtime/hooks/lib/spec-gate/README.md` section 2 now lists the exempt target classes, including runtime state and the gated concern README. `validate_document.py` reports 0 issues
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Working files stayed outside the repo, and the phase folder holds only the deliverables and `evidence/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. `007-handoff-gate-exemptions/scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

Open item: CHK-FIX-007 (P1, no commit SHA until the operator commits).

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
