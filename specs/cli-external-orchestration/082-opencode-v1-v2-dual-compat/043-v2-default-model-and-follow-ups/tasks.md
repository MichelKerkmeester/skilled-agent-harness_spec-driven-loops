---
title: "Tasks: Phase 43: v2-default-model-and-follow-ups"
description: "Ordered tasks for the OpenCode 2 default model, the hook node:test CI job and the recorded doc and comment follow-ups."
trigger_phrases:
  - "v2 default model and follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 43: v2-default-model-and-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Scaffold the phase and fill the parent phase-map rows (`../spec.md`)
- [x] T002 Record the suite counts before any edit (`scratch/baseline/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Pick the OpenCode 2 default model by version (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [ ] T004 Cover both defaults in the runner tests (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`)
- [ ] T005 State the per-version default in the cli-opencode docs and regenerate the Hermes copy (`.skilled/skills/cli-external-orchestration/cli-opencode/`)
- [ ] T006 Hold `--model` and `-m` selectors to their version's default (`cli-opencode/scripts/tests/default-model-id.test.cjs`)
- [ ] T007 [P] Time out the session-announcement tests (`.opencode/plugins/tests/v2-bridge.test.cjs`)
- [ ] T008 [P] Ground or reword the probe claim (`.opencode/plugins/README.md`)
- [ ] T009 [P] Clear the two playbook validator warnings (`cli-opencode/manual-testing-playbook/`)
- [ ] T010 [P] Document the spec gate's shell-write limit (`.skilled/hooks/spec-gate/README.md`, `plugin-utilization/system-spec-gate.md`)
- [ ] T011 [P] Correct the trigger-index concurrency comment (`.github/workflows/trigger-index-rebuild.yml`)
- [ ] T012 [P] Correct the three overstated comments (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`)
- [ ] T013 Add the hook node:test workflow and its README rows (`.github/workflows/hooks-node-tests.yml`, `.github/workflows/README.md`)
- [ ] T014 Mark 036 Known Limitation 5 and the 006 and 007 notes resolved (`../036-*/implementation-summary.md`, `../goal.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Prove the v2-bridge timeout with the stream-announcement mutation (`scratch/mutation/`)
- [ ] T016 Rerun the plugin, hook node:test, installer, default-model, models-form and runner suites (`scratch/after/`)
- [ ] T017 Run one unpinned live dispatch on each version (`scratch/live/`)
- [ ] T018 Luna review of every change (`scratch/luna/`)
- [ ] T019 Merge main, push, and record CI on the pushed commit (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
