---
title: "Tasks: Phase 18: outside-loop-handoff"
description: "Tasks for the outside-loop handoff: the note-only nudge, keep, the open-note silence, the Claude compact pointer, the open-notes line, tests, docs and a live run."
trigger_phrases:
  - "outside loop handoff tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: outside-loop-handoff

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Provision worktree 187 and scaffold this phase (`specs/hooks/023-session-relaunch-loop/018-outside-loop-handoff/`)
- [x] T002 Trace the two open figjam notes and the 93% session to sessions started before the shell shim (process tree, transcripts, `relaunch.log`)
- [x] T003 Confirm all five adapters call `nudgeDecision` and `handoffText` without a loop id
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Outside-loop decision, note-only text, `claimCommandFor`, `afterCompaction` seed text, `openNotePathFor` export (`lib/nudge.cjs`)
- [x] T005 `note-kept` event, `openNotes`, `openNotesLine` (`lib/hop-history.cjs`)
- [x] T006 `keep` subcommand, shared `validatedNote`, open-notes line in `history` (`bin/session-relaunch.cjs`)
- [x] T007 Post-compaction pointer and its registry row, settings render and mirror (`claude/compact-pointer.mjs`, `hook-registry.json`)
- [x] T008 Open-note silence outside the loop, added after the live run showed a re-nudge while the note was being written (`lib/nudge.cjs`)
- [x] T009 Open-notes line in `/doctor:setup` (`doctor-setup.yaml`, `doctor-setup-presentation.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Update the nine tests the behaviour change broke and add six (`tests/*.test.cjs`, `pi/session-relaunch.test.ts`, `hook-registration-sync.vitest.ts`)
- [x] T011 Mutation check: removing the prepared-hop guard fails its test
- [x] T012 Live Claude run outside the loop in tmux, then `/compact`
- [x] T013 Docs: concern, tests, hooks, OpenCode plugins, system-spec-kit and root READMEs; `/speckit:handoff`; feature catalog entry and index; Claude and Pi/OpenCode playbooks; `/doctor:setup` scenario
- [x] T014 Release notes: v4.0.0.13 and system-spec-kit v2.8.5.0, version bump and Hermes mirror
- [x] T015 Correct the AI Systems memory that said every session is nudged
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 to REQ-006 in spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md §6]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: drift guards, all 4 PASS, warnings pre-existing]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: suite output clean, 616 pass]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: the pointer logs a state failure and exits 0; `keep` reuses `prepare`'s checks]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: `compact-pointer.mjs` mirrors `context-nudge.mjs`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, all rows Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: live run 2026-10-21 wrote note-kept, claimed and done]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: fresh start, no open note, prepared hop, inside-loop keep]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: guard mutation check]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: cross-consumer, the shared nudge serves five adapters]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: grep for `nudgeDecision` and `handoffText` callers finds the five adapters and no other]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: grep for "outside skilled-loop" and "stays silent" across docs and tests; each hit updated]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not a security fix; `keep` reuses `prepare`'s in-repository path check]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: five adapters by inside and outside the loop in the conformance table; compaction pointer on Claude only]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: new tests sandbox `SESSION_RELAUNCH_REPO_ROOT`, `XDG_RUNTIME_DIR` and `SKILLED_LOOP_ID`]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the commit on `worktrees/187-outside-loop-handoff` and its merge into main]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no credentials in the changed code]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: `keep` validates the note and the runtime; the pointer validates the session id]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: notes stay in the 0700 handoffs directory]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: comments say why the outside-loop nudge never asks for prepare and why the pointer resets the level]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: concern README Outside The Loop section, root README bullet]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-21
<!-- /ANCHOR:summary -->

---
