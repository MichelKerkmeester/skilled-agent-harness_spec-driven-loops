---
title: "Tasks: Phase 13: goal-chat-send-shape"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: goal-chat-send-shape

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

- [x] T001 Audit every surface that tells an agent what goal text to send, and record each line and its verdict (read-only audit)
- [x] T002 Capture baselines before any edit: goal-slice suite, offer contract, snapshot file, trigger index vitest, Hermes check and the parent's strict validation (`.opencode/hooks/goal/lib/goal-slice.test.cjs`, `scaffold-golden-snapshots.vitest.ts`)
- [x] T003 Generate the trigger index into the session scratchpad to separate existing drift from this phase's changes (`generate-trigger-index.mjs --out`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the chat slice case and update the heading assertions, then watch them fail against the unchanged module (`.opencode/hooks/goal/lib/goal-slice.test.cjs`)
- [x] T005 Drop heading section numbers in `renderChatSlice` and add the chat slice and the cap to the reminder (`.opencode/hooks/goal/lib/goal-slice.cjs`)
- [x] T006 Rewrite the Operator copy paragraph and regenerate the lazy-goal snapshot (`.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl`)
- [x] T007 Rewrite the goal posture row (`AGENTS.md`)
- [x] T008 Rewrite the goal paragraph and the playbook's Section 5 (`.opencode/skills/system-spec-kit/SKILL.md`, `goal-set-string-playbook.md`)
- [x] T009 Rewrite the resend payload, the Claude Code and Codex bind lines and the resume reminders (`.opencode/commands/speckit/assets/`)
- [x] T010 Add binding row 013 and fill phase map row 13 with its handoff row (`../goal.md`, `../spec.md`)
- [x] T011 Render and author this phase's child goal (`goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the goal-slice suite, the goal hook suites and the goal plugin suites (`node --test`)
- [x] T013 Run the snapshot file without `-u` and the trigger index vitest (`scaffold-golden-snapshots.vitest.ts`, `trigger-index.vitest.ts`)
- [x] T014 Read the parent through the goal CLI and check its `chat_slice` (`.opencode/hooks/goal/bin/goal.cjs packet`)
- [x] T015 Regenerate the Hermes skill copy, the trigger index and the metadata, then rerun the Hermes check (`sync-skills-hermes.cjs`, `generate-trigger-index.mjs`)
- [x] T016 Run `validate.sh --strict` on this phase and on the parent (`validate.sh`)
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
- [x] CHK-003 [P1] Baselines captured before edits: goal-slice 15 of 15, offer contract 5 of 5, snapshot file failing only on `lazy-goal.md`, Hermes check drifting on `agent-deep-review`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .opencode/hooks/goal/lib/goal-slice.cjs` reports no syntax error
- [x] CHK-011 [P0] The comment-hygiene checker exits 0 on `goal-slice.cjs` and `goal-slice.test.cjs`
- [x] CHK-012 [P1] `verify_alignment_drift.py --root .opencode/hooks/goal` reports PASS with 0 findings
- [x] CHK-013 [P1] No spec path, phase number or task id sits in a code comment
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The new chat slice case failed before the change at `goal-slice.test.cjs:115` and the suite passes 16 of 16 after it
- [x] CHK-021 [P0] Goal hook suites pass 136 of 136 and goal plugin suites 147 of 147
- [x] CHK-022 [P1] `scaffold-golden-snapshots.vitest.ts` passes 12 of 12 without `-u` after the regeneration
- [x] CHK-023 [P1] `trigger-index.vitest.ts` passes after the index regeneration
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, one send rule restated on many instruction surfaces
- [x] CHK-FIX-002 [P0] Same-class producer inventory: one chat slice renderer and one reminder renderer in `goal-slice.cjs`
- [x] CHK-FIX-003 [P0] Consumer inventory: two packet printers, two reminder callers and the instruction surfaces listed in `plan.md`
- [x] CHK-FIX-004 [P0] Boundary cases tested: a numbered heading loses its number, a heading that only starts with a number keeps it
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: heading level, single and dotted numbers, numeric heading without a prefix
- [x] CHK-FIX-006 [P1] No process-wide state is read by the changed renderer
- [x] CHK-FIX-007 [P1] Evidence is pinned to the observed command output in `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The packet read still refuses paths outside the workspace, since `resolvePacketDir` is unchanged
- [x] CHK-032 [P1] No new write path is added
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Every edited instruction surface names the chat slice and the 4,000-character cap
- [x] CHK-042 [P2] Descriptive goal docs that only restate the rule are recorded as out of scope in `spec.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live only in the session scratchpad outside the repository
- [x] CHK-051 [P1] No scratch files inside the repository
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->

---
