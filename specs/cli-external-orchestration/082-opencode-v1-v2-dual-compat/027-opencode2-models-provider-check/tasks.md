---
title: "Tasks: Phase 27: opencode2-models-provider-check"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "opencode2 models provider check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 27: opencode2-models-provider-check

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

Every task closes follow-up item 4 of the operator's open-work list: the `opencode2 models <provider>` form 2.0.32 rejects, and the bare form that reaches the shared service.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Worktree `167-opencode2-models-provider-check` from `origin/main`, provisioned (11 installed, 5 built, 0 failed)
- [x] T002 Probe both versions: v2 `models --help`, the positional form, a standalone listing with a private database; v1 `models <provider>` for a listed and a missing provider (`scratch/v1-*.txt`, `scratch/v2-*.txt`)
- [x] T003 Baseline: cli-opencode tests 5 of 5 pass (`scratch/baseline-cli-opencode-tests.txt`); 49 `opencode2 models` sites listed (`scratch/baseline-sites.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 The form test (`cli-opencode/scripts/tests/opencode2-models-form.test.cjs`)
- [ ] T005 `--standalone` on every inline `opencode2 models` span (cli-opencode and cli-devin docs)
- [ ] T006 The provider-argument sentences and the pre-flight line (`SKILL.md`, `README.md`, `references/cli-reference.md`, `references/install-and-versions.md`)
- [ ] T007 Regenerate the Hermes copy (`.hermes/skills/cli-opencode/SKILL.md`)
- [ ] T008 Run the test in the battery job (`.github/workflows/opencode-dual-version.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 The new test fails on main's docs and two classifier mutants fail (`scratch/mutation/`)
- [ ] T010 The OpenCode 2 pre-flight block run live: `llmgateway=1`, `default=0` (`scratch/preflight-live.txt`)
- [ ] T011 cli-opencode tests, `sync-skills-hermes.cjs --check`, `check-gate-inputs.sh` and `actionlint` pass
- [ ] T012 Luna review passes; strict validation of this folder and recursive validation of 082 print `RESULT: PASSED`
- [ ] T013 Merged, pushed to main, every CI run on the main commit read
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
