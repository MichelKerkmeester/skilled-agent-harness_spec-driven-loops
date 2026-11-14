---
title: "Tasks: Phase 19: relaunch-doc-coverage"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "relaunch doc coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: relaunch-doc-coverage

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

**Task variables**: `PB` is `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`. `FC` is `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md`. `PKT` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title`. `PHASE` is this phase folder. `FIX` is the commit that lands this phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 15, 16 and 17 landed (`PKT`). Verify: `rg -n '^\| \*\*Status\*\* \| Complete' PKT/015-wrapper-start-checksum/spec.md PKT/016-ended-goal-mark-match/spec.md PKT/017-missing-transcript-notice/spec.md` prints three lines, and each child's fix commit named in its `goal.md` is an ancestor of `HEAD`.
- [ ] T002 Save a baseline of the four sk-doc checks and the mirror check before any edit (`PHASE/scratch/baseline.txt`). Verify: the commands of T012 and T013 run once with their output and exit status saved.
- [ ] T003 Re-read the lines the new text will cite: the start-checksum guard, the change notice and its log call, the missing-transcript notice, the claimed-last helper and the fallback bound (`.skilled/bin/skilled-loop`, `.skilled/hooks/session-relaunch`). Verify: the line numbers are written into `goal.md` section 4 with the commit they were read at.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Change "links" to "copies" in the HS-8 prose (`PB`). Verify: `rg -c 'The check links that helper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints nothing with exit 1.
- [ ] T005 Make the goal switch sentence name both fields (`.skilled/commands/speckit/handoff.md`). Verify: `rg -c 'turns the field off' .skilled/commands/speckit/handoff.md` prints nothing with exit 1, and `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/commands/speckit/handoff.md` prints a line that names `goal_packet` and `goal_ended`.
- [ ] T006 Extend the playbook evidence: the Wrapper edge cases name the change notice, the `wrapper-changed` line, the unreadable-at-hop case and the empty-at-start case, GR-3 names the ended-goal cases of `relaunch-core.test.cjs` and `session-relaunch-cli.test.cjs`, and the adapter session gate names the missing-transcript notice (`PB`). Verify: `rg -c 'wrapper-changed'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the playbook each print 1 or more.
- [ ] T007 Extend the catalog: the Killer And Wrapper section gains the change notice, its log line and the empty-checksum rule, the Nudge Prepare And Arm section gains the `deferredAt` stamp, the withdrawal on the next prompt, the missing-transcript notice and the record with no `handoff`, and the Goal Carry-Over section gains `goal_ended`, the claimed-last rule, the unreadable log and the fallback bound (`FC`). Verify: `rg -c 'wrapper-changed'`, `rg -c 'deferredAt'`, `rg -c 'goal_ended'` and `rg -c 'no transcript path'` on the catalog each print 1 or more.
- [ ] T008 Pin both citations of child 004 to commit `89e246760e` (`PKT/004-wrapper-change-notice/acceptance-criteria.md`, `PKT/004-wrapper-change-notice/plan.md`). Verify: `rg -n '1469' PKT/004-wrapper-change-notice --glob '*.md'` prints two lines, each also holding `89e246760e`.
- [ ] T009 Pin the ten citations of child 013 to commit `c69f278cfc` (`PKT/013-conformance-stamp-pin`). They use three spellings: `stop-arm.mjs:183`, `:183` and `line 183`. Verify: `rg -n ':183|line 183' PKT/013-conformance-stamp-pin --glob '*.md'` prints ten lines, each also holding `c69f278cfc`.
- [ ] T010 Record the trigger phrase decision with the advisor output (`PHASE/goal.md`). Verify: `rg -c 'trigger phrase' PHASE/goal.md` prints 1 or more and `git diff --quiet HEAD -- .skilled/skills/system-spec-kit/graph-metadata.json` exits 0.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Check each new playbook and catalog sentence against the line or test it names (`PB`, `FC`). Verify: every cited `file:line` in the diff of `PB` and `FC` resolves to the text it describes on the current tree, and the list is saved to `PHASE/scratch/citations.txt`.
- [ ] T012 Run sk-doc's playbook and catalog checks (`.skilled/skills/system-spec-kit`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook`, `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict`, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` and `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py` each exit 0, or fail only as the baseline in `PHASE/scratch/baseline.txt` did.
- [ ] T013 Run the runtime mirror check after the handoff edit (`.skilled/commands`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS` and exits 0.
- [ ] T014 Validate children 004 and 013 after the citation edits (`PKT`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PKT/004-wrapper-change-notice --strict` and the same for `PKT/013-conformance-stamp-pin` each print `RESULT: PASSED`.
- [ ] T015 Check the commit touches documents only (`FIX`). Verify: `git show --stat FIX` lists Markdown files only and `git show FIX | rg -c '^new file'` prints nothing with exit 1.
- [ ] T016 Validate the phase folder (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/019-relaunch-doc-coverage --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: every new sentence was read against the line or test it names (T011)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The behavior documented here**: `../015-wrapper-start-checksum/`, `../016-ended-goal-mark-match/` and `../017-missing-transcript-notice/`
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

A blocked task is marked `[B]` with its reason in `goal.md`. A `[B]` on T001 blocks every implementation task, because this phase documents what phases 15 to 17 ship.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 7.
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^## 3. ARCHITECTURE' plan.md` prints 1.
- [ ] CHK-003 [P1] The validator baselines are saved before the first edit (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No code file changes: `git show --stat FIX` lists Markdown files only (T015).
- [ ] CHK-011 [P0] Each new sentence names a source line or a test (T011).
- [ ] CHK-012 [P1] No sentence in the playbook or the catalog repeats another in the same document.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 to AC-003 pass with their searches.
- [ ] CHK-021 [P0] sk-doc's four checks pass or match the baseline (T012).
- [ ] CHK-022 [P1] The mirror check prints `PASS` (T013).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug` for documents: every document that explains the goal field is checked for `goal_ended`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'goal_packet'` over the catalog, the playbooks and the speckit commands is saved and each hit is named in `goal.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory: N/A, documents only.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md: behavior crossed with document.
- [ ] CHK-FIX-006 [P1] Each citation edit keeps its line number and adds its commit.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the fix commit, named in `goal.md` section 4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets: no document gains a credential, path to a credential or environment value.
- [ ] CHK-031 [P0] No dotenv file is named or read.
- [ ] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the six findings this phase closes.
- [ ] CHK-041 [P1] The trigger phrase decision is recorded with its evidence (T010).
- [ ] CHK-042 [P2] The Pi and OpenCode playbook decision is recorded in `spec.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines and the citation list live under `scratch/` only.
- [ ] CHK-051 [P1] No temporary file is left outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. The build fills this in.
<!-- /ANCHOR:summary -->

---
