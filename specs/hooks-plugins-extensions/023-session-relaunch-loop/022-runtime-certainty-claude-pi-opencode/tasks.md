---
title: "Tasks: Phase 22: runtime-certainty-claude-pi-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "runtime certainty claude pi opencode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: runtime-certainty-claude-pi-opencode

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

- [x] T001 Commit and push the fork-guard alignment, then create worktree 199 through sk-git and scaffold this phase (`524ae19fba`)
- [x] T002 Record the suite baseline: relaunch 597, Pi and OpenCode suites, spec-kit hook vitests, drift guards, both sync checks
- [x] T003 [P] Probe OpenCode 1.19.3: a `task` sub-agent is a child session with `info.parentID`; compaction fires `experimental.session.compacting` then `session.compacted`
- [x] T004 [P] Probe Pi 1.3.0: no built-in sub-agent, `session_compact` exists, compaction is off in this repo's settings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Keep nested runs out of the loop: `hostRuntimePid`, `nestedUnderLoop`, `dropNestedLoop` and their call sites (`lib/relaunch-core.cjs`, Claude adapters, CLI, Pi, OpenCode; `57f6b436b2`)
- [x] T006 Skip OpenCode child sessions keyed on `info.parentID` (`.opencode/plugins/session-relaunch.js`; `57f6b436b2`)
- [x] T007 Point Pi and OpenCode at the open note after a compaction and drop the stale nudge (`57f6b436b2`)
- [x] T008 Warn when a relaunched session ends before claiming its note (`.skilled/bin/skilled-loop`; `58449ea2bd`)
- [x] T009 Give the shim helpers plain names so they survive a tool-shell snapshot (`.skilled/bin/skilled-loop-shell.sh`; `79e9a72882`)
- [x] T010 Name new notes by the full session id (`lib/nudge.cjs`; `ecd8873efa`)
- [x] T011 Withdraw the OpenCode arm on a new user message and list `session.updated` in the plugin inventory (`ab21395e74`)
- [x] T012 Withdraw the Pi arm on `agent_start` (`pi/session-relaunch.ts`; `5af08b2f1a`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run S1 to S13 live on Claude, Pi and OpenCode and log each run in `scratch/evidence/LEDGER.md`
- [x] T014 Rerun the rows each fix touched on the fixed commit (Claude S1; OpenCode S6, S9, S12; Pi S6)
- [x] T015 Update the relaunch README and both playbooks with the dated results
- [x] T016 Write this phase's plan, tasks, implementation summary and decision record, and mark the acceptance rows
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
- **Decisions**: See `decision-record.md`
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
- [x] CHK-003 [P1] Dependencies identified and available: Claude Code 2.1.308, Pi 1.3.0, OpenCode 1.19.3
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: shellcheck clean, `tsc -p tsconfig.pi.json --noEmit` exit 0, drift guards 4/4
- [x] CHK-011 [P0] No console errors or warnings in the suites
- [x] CHK-012 [P1] Error handling implemented: every new adapter path is wrapped so a state failure never breaks the host
- [x] CHK-013 [P1] Code follows project patterns: each change came through `sk-code` briefs and matches its sibling handlers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, waived or superseded with a decision record
- [x] CHK-021 [P0] Manual testing complete: the live ledger has a row for every runtime and situation
- [x] CHK-022 [P1] Edge cases tested: shared id prefixes, legacy note names, another session's armed record, a pending record at the new turn
- [x] CHK-023 [P1] Error scenarios validated: stale record, hop cap, live shell child, interrupt before claim
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: note-name collision `class-of-bug` (every runtime plans names), mid-turn kill `cross-consumer` (Pi and OpenCode), shim snapshot `class-of-bug` (every shim function), unclaimed-note silence `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `SESSION_ID_PREFIX_LENGTH` had two uses, both in `lib/nudge.cjs`; `rg "_skilled_loop_"` returns no hits after the rename
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the planned-name tests on Claude, Codex, Hermes, Pi and OpenCode were updated to the full id
- [x] CHK-FIX-004 [P0] Adversarial table tests: not a security, path or parser fix; the note-name change keeps `validSessionId` as the only allowed character set, and the state file already used the full id
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed in plan.md before completion: 3 runtimes by 13 situations
- [x] CHK-FIX-006 [P1] Hostile env variant executed: nested-run tests run a real process chain with the loop variables inherited
- [x] CHK-FIX-007 [P1] Evidence is pinned to commit hashes in the ledger and the implementation summary
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: session ids still pass `validSessionId` before they reach a filename
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: each new branch carries a one-line why and no ephemeral ids
- [x] CHK-042 [P2] README updated: relaunch README, both playbooks
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion: `scratch/evidence/` is kept on purpose as the gitignored evidence store the plan names; no other temp files remain
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-22
<!-- /ANCHOR:summary -->

---
