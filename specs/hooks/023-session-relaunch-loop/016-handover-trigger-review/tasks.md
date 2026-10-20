---
title: "Tasks: Phase 16: handover-trigger-review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "handover trigger review tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: handover-trigger-review

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

- [x] T001 Read the sk-create-command template and contract (`.skilled/skills/sk-doc/sk-create-command/`)
- [x] T002 Read the cli-codex skill before composing the review dispatch (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`)
- [x] T003 Read the `/deep:review` contract and the `fanout-run.cjs` single-executor options (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Part A: REFERENCE section with "Receiving A Handoff", title-case steps, Outputs column with the three STATUS lines (`.skilled/commands/speckit/handoff.md`)
- [x] T005 Part A: coverage note says 34 of 40 and names `/speckit:handoff` and `/doctor:setup` (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`)
- [x] T006 Part B: run the ten-iteration `/deep:review` with cli-codex `gpt-6-luna`, reasoning max, fast tier, steered to whether the automatic handover fires every time on the five automatic runtimes
- [x] T007 Part B: verify each P0, P1 and P2 finding with a read or a run
- [x] T008 Part B: fix every confirmed P0 and P1 finding
- [x] T009 Part B: fix the confirmed P2 findings
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Part A checks: kebab name PASS, `validate_document.py --type command` VALID, `extract_structure.py` 0 failed, `hvr_scan.py` 0 hard blockers, routers 34 of 34 clean, mirror check PASS, contract test 12 of 12
- [x] T011 Part B: rerun the session-relaunch tests after the fixes
- [x] T012 Part B: live hops on Claude, Pi, OpenCode, Codex and Hermes, including a repository that symlinks `.skilled`
- [x] T013 Strict validation of this folder and the parent packet at closure
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live hops on all five automatic runtimes)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (cli-codex lineage ran 10 of 10)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: drift guards 4 of 4 PASS, `node --test` loads every changed module]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: suite 589 of 589 with 0 fail, 0 cancelled]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: tail read errors still return no usage, and the timeout fence keeps refusing on a mismatch]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: edits follow the existing `unarm` expected-field guards and the tail reader's shape]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: AC-001 to AC-006 Met in `acceptance-criteria.md`]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: live hops on five runtimes from AI Systems, all notes done]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: oversized final row for Claude and Codex, same-path re-arm]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: re-prepared pending record still times out and notifies (existing test passes)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: tail: class-of-bug across both tail readers; timeout fence: instance-only; Cursor name and linked-repo claim: matrix/evidence docs]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: `readTail` has two consumers, `readClaudeFill` and `readCodexUsage`, and both now use the widening helper]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: `unarm` callers in `killer.cjs` grepped. Only the timeout path gains `expectedArmedAt`, and the hop-cap and stale paths read a fresh record]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not a security, path or redaction fix. The parser edge cases are a missing match, a read from the file start and the 16 MiB bound]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: runtimes: 5 automatic live rows, plus 2 command-only rows covered in docs]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: tests run in sandboxes with an isolated `XDG_RUNTIME_DIR` and `HOME`]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: fix SHA `17cfea3629`, review SHA `d68b78eec3`, merge `92ffcbd25c`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets in the diff]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: note validation unchanged. The CLI refused the OpenCode receiver's stray `prepare`]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: no auth surface in this change]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, tasks, acceptance criteria and summary all say Complete]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: new comments state the durable why and carry no ephemeral ids]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: session-relaunch README, root README, feature catalog and v4.0.0.13 updated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: live-hop scripts kept in the session scratchpad, outside the repo]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: tmux sessions killed and the watcher stopped]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->

---
