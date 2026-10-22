---
title: "Tasks: Phase 52: v1-default-llmgateway"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v1 default llmgateway tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 52: v1-default-llmgateway

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

- [x] T001 Read 043's recorded evidence and the retry on 2026-10-21, and name what the opencode-go quota now blocks: the OpenCode 1 unpinned dispatch hangs on `Go usage limit exceeded`, and the retry exits 142 after the alarm (`../043-v2-default-model-and-follow-ups/scratch/live/`)
- [x] T002 Write the briefs and dispatch them through `cli-pi` on `llmgateway`: the runtime and the tests to DeepSeek v4.1 flash max, the docs to DeepSeek v4.1 flash high, and a separate read-only DeepSeek review at max (`scratch/briefs/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Make `OPENCODE_DEFAULT_MODEL` `llmgateway/deepseek-v4.1-flash` and drop the per-version pick and `OPENCODE_V2_DEFAULT_MODEL` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T004 Hold the OpenCode 1 unpinned test to llmgateway and remove the drift-table row for the deleted constant (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`, `fanout-run.vitest.ts`)
- [x] T005 Mark no default in the opencode-go table, one in the llmgateway table, and pin llmgateway in each version's syntax in `SKILL.md` (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`)
- [x] T006 State the one default in the skill and the README, in each version's syntax (`.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md`)
- [x] T007 Update the eight reference files that named `opencode-go` as the OpenCode 1 default (`.skilled/skills/cli-external-orchestration/cli-opencode/references/`)
- [x] T008 Update the dispatch templates and the 22 playbook scenarios, leaving their dated records as written (`.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md`, `manual-testing-playbook/`)
- [x] T009 Regenerate the Hermes copy from the edited skill (`.hermes/skills/cli-opencode/SKILL.md`)
- [x] T010 Read-only DeepSeek review at max of the whole diff: PASS, no P0 or P1, and two P2s (`scratch/briefs/r1-review.task`)
- [x] T011 Reword the nine playbook notes that still called llmgateway "the OpenCode 2 default", so no note implies a difference that no longer exists (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/`)
- [x] T012 Fill this phase's four docs, close 043's status, REQ-001, T017 and OpenCode 1 row, note the change in 006 and 036, and add the parent map and handoff rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../043-v2-default-model-and-follow-ups/`, `../006-cli-opencode-dual-dispatch/implementation-summary.md`, `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md`, `../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Prove the test catches the old default: restoring `opencode-go/deepseek-v4.1-flash` fails the OpenCode 1 unpinned test, and restoring it fails again after the value goes back (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`)
- [x] T014 Run one unpinned live dispatch on OpenCode 1: `"opencode" "run" "--model" "llmgateway/deepseek-v4.1-flash" ... "--variant" "max"`, exit 0, replied OK (`scratch/live/v1-unpinned.txt`)
- [x] T015 Run one unpinned live dispatch on OpenCode 2: `"opencode2" "run" "--standalone" "-m" "llmgateway/deepseek-v4.1-flash#max" ...`, exit 0, replied OK (`scratch/live/v2-unpinned.txt`)
- [x] T016 Rerun the plugin, hook node:test and deep-loop vitest suites: 516/516, 872/872 over 29 files, and 299/299 (`scratch/after/plugins.tap`, `hooks-node.tap`, `deep-loop-vitest.txt`)
- [x] T017 Rerun the cli-opencode script tests at 22/22, the playbook validator at 72 scenarios with 0 violations and 0 warnings, and the Hermes sync check at 68 in sync (`scratch/after/`)
- [x] T018 Run strict validation of this folder: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/052-v1-default-llmgateway --strict` - `RESULT: PASSED`
- [x] T019 Push to main and record CI: pushed `af1a18709f`, 18/18 workflows success, run ids in implementation-summary.md (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task is marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T019 closed: pushed `af1a18709f`, 18/18 workflows success, run ids in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
