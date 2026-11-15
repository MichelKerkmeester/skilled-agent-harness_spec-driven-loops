---
title: "Tasks: Phase 1: model-effort-atomic-replay"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "model effort atomic replay tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: model-effort-atomic-replay

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

- [x] T001 Run the baseline test commands from plan.md and record the counts (868 pass, 0 fail)
- [x] T002 [P] Copy `run-claude-effort.sh`, `run-codex-effort.sh` and `run-pi-effort.sh` from phase 031 into `scratch/harness/`
- [x] T003 [P] Investigate whether Claude logs a `/model` or `/effort` switch before the next turn; save the transcript tail under `scratch/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the AC-001 test (red) and the AC-002/AC-003 guards (green before and after), plus the AC-007 empty-launch-model guard and the AC-008 Hermes guard (green before and after). AC-001 is a table across Claude, Codex and Pi (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`)
- [x] T005 Write the failing arm test "arm with a new model and no effort clears the recorded effort" and see it fail (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`)
- [x] T006 Add one wrapper function for the effort rule: unset the launch effort only when the launch model was non-empty before the live override, the accepted live model differs from it, no valid live effort came with it and the runtime is not Hermes (`.skilled/bin/skilled-loop`)
- [x] T007 Remove the recorded effort on an arm with a new model and no effort (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T008 Extend `readClaudeSettings` so a `/model` or `/effort` local command confirmed after the last main-chain assistant entry wins for its field, and a new model drops the old turn's effort (`.skilled/hooks/session-relaunch/lib/context-usage.cjs`, tests in `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:420-480`). Red before: 3 of 4 fail (`scratch/test/reader-red-before.txt`). Green after: 25 of 25 (`scratch/test/reader-green-after.txt`). The `/effort` shape comes from the operator's own transcripts (`scratch/claude-hop/effort-entries.txt`), because the live run could not authenticate
- [x] T012 Treat a Pi launch `provider/model` and a recorded provider plus bare model as the same model in `live_model_voids_launch_effort` (`.skilled/bin/skilled-loop:226`), test at `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1460`. Red before: launch `--thinking low` dropped (`scratch/test/pi-prefix-red-before.txt`). Green after (`scratch/test/pi-prefix-green-after.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full test commands and report the delta against T001
- [x] T010 Run the live hops on Claude, Codex and Pi, plus a control hop whose record had its `effort` field removed and must relaunch with no effort flag; save receiver args and `relaunch.log` hop lines under `scratch/`. The Claude sender kept effort `low`, so the medium-effort part of AC-005 is still open
- [x] T013 Rerun the Claude hop as Sonnet low switched to Opus medium. A throwaway `CLAUDE_CONFIG_DIR` could not authenticate, so on the operator's approval it ran under the real config with `~/.claude/settings.json` backed up and the switched lines put back afterwards; the file ended identical to the backup (shasum `9ffe4047f7516b5691164fd39a54e8e1688b129a`). The harness now answers the `/model` confirm dialog. Receiver `claude --model claude-opus-5-5 --effort medium` (`scratch/claude-hop-medium/processes-receiver.txt:1`)
- [x] T011 Update the replay lines and any switch limit in `.skilled/hooks/session-relaunch/README.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: live hops under `scratch/`, the Opus medium hop in `scratch/claude-hop-medium/`
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

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
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

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



