---
title: "Tasks: Remove the Deep AI-System Improvement Lane"
description: "Task sequence for deleting the dedicated runtime files, scrubbing both runtime manifests, and proving that remaining deep-loop lanes are intact."
trigger_phrases:
  - "removal tasks"
  - "runtime deletion"
  - "shared scrub"
  - "verification tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/067-ai-system-improvement-removal"
    last_updated_at: "2026-07-15T10:14:02Z"
    last_updated_by: "codex"
    recent_action: "Completed the Wave 1b runtime removal; final gates are being recorded"
    next_safe_action: "Orchestrator review and one commit; rollback with git revert <sha>"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/plugins/tests/mk-deep-loop-guard.test.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Remove the Deep AI-System Improvement Lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

<!-- ANCHOR:wave-1b-manifest -->
## Wave 1b Runtime Manifest

### Dedicated Files to Delete (11)

1. `.opencode/commands/deep/assets/deep_ai-system-improvement_auto.yaml`
2. `.opencode/commands/deep/assets/deep_ai-system-improvement_confirm.yaml`
3. `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json`
4. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/non_dev_ai_system/guarded_refine_loop.md`
5. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/non_dev_ai_system.md`
6. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/non_dev_ai_system/synthetic_deficit_and_gauntlet.md`
7. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md`
8. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md`
9. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md`
10. `.opencode/skills/system-deep-loop/deep-improvement/scripts/non-dev-ai-system/init_packaging.py`
11. `.opencode/skills/system-deep-loop/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`

### Shared Files to Scrub (20)

1. `.opencode/commands/create/assets/create_benchmark_presentation.txt`
2. `.opencode/skills/sk-doc/create-benchmark/README.md`
3. `.opencode/skills/sk-doc/create-benchmark/changelog/v1.3.0.0.md`
4. `.opencode/skills/sk-doc/hub-router.json`
5. `.opencode/skills/sk-doc/mode-registry.json`
6. `.opencode/skills/sk-doc/scripts/tests/test_create_benchmark_family_registry.py`
7. `.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md`
8. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json`
9. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json`
10. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md`
11. `.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md`
12. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md`
13. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md`
14. `.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md`
15. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md`
16. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs`
17. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs`
18. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts`
19. `.opencode/skills/system-deep-loop/graph-metadata.json`
20. `.opencode/skills/system-deep-loop/runtime/tests/unit/host-driven-improvement.vitest.ts`
<!-- /ANCHOR:wave-1b-manifest -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the local system-spec-kit and sk-code workflow contracts — receipt in `implementation-summary.md`.
  Evidence: Both checked-in workflow contracts were read before target edits.
- [x] T002 Read all 67 manifest targets and record the preexisting Wave 1 status — receipt in `implementation-summary.md`.
  Evidence: The primary 36 targets and Wave 1b's 31 targets were read; the latter were clean at the captured baseline while the earlier wave was already dirty.
- [x] T003 Record the shared-branch baseline and protect historical specs outside 067 — receipt in `implementation-summary.md`.
  Evidence: Baseline status was captured; the final scope comparison preserved unrelated and historical paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the seven dedicated command, asset, guide, profile, playbook, and test files — receipt in `implementation-summary.md`.
  Evidence: All seven paths are absent; `git rm` was attempted but the sandbox denied `.git/index.lock`, so patch deletion recorded equivalent unstaged deletions.
- [x] T005 Remove the deprecated mode and aliases from `mode-registry.json`, `hub-router.json`, `description.json`, and `command-injection-rollout.json` — receipt in `implementation-summary.md`.
  Evidence: All four JSON files parse successfully and focused guard tests pass.
- [x] T006 Remove deprecated scenario/mode rows from the eight benchmark report files while retaining all other rows and valid JSON — receipt in `implementation-summary.md`.
  Evidence: `IL-004`/`RB-004` records were removed, shared `SC-004` telemetry was rebalanced, and all report JSON parses pass.
- [x] T007 Scrub the remaining agent, command, skill, changelog, catalog, playbook, constitutional, README, and plugin-test references — receipt in `implementation-summary.md`.
  Evidence: Exact residual scan across all 36 targets returned zero matches.
- [x] T008 Remove empty parent directories left by dedicated-file deletion — receipt in `implementation-summary.md`.
  Evidence: The empty authoring-guide parent was removed; non-empty parents were retained.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-2b -->
## Phase 2b: Wave 1b Completeness Expansion

- [x] T014 Delete the eleven dedicated Wave 1b files — receipt in `implementation-summary.md`.
  Evidence: All eleven paths are absent and their empty dedicated-only parent directories were removed.
- [x] T015 Scrub the twenty shared Wave 1b files without changing other lanes — receipt in `implementation-summary.md`.
  Evidence: The dispatcher, parser, tests, registries, reports, documentation, and graph metadata retain the remaining lanes.
- [x] T016 Remove only empty parent directories created by the eleven deletions — receipt in `implementation-summary.md`.
  Evidence: Four dedicated-only parent directories are absent; shared directories containing other files remain.
<!-- /ANCHOR:phase-2b -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the two requested Node test files and record the pass result — receipt in `implementation-summary.md`.
  Evidence: Requested `node --test` command passed 2/2 subtests.
- [x] T010 Parse every edited JSON file with Node and record zero parse errors — receipt in `implementation-summary.md`.
  Evidence: Eight edited JSON targets passed Node `JSON.parse`.
- [x] T011 Run the exact residual scan across the non-spec `.opencode` runtime and record zero hits — receipt in `implementation-summary.md`.
  Evidence: The exact four-pattern `rg` scan returned no matches.
- [x] T012 Validate the 067 packet with `validate.sh --strict` and record Errors: 0 — receipt in `implementation-summary.md`.
  Evidence: Final strict validation reports `Errors: 0`.
- [x] T013 Compare final `git status --short` to the captured baseline and confirm the operator delta stayed within the manifest and 067 — receipt in `implementation-summary.md`.
  Evidence: The final status comparison found the 36 manifest paths and 067 as the operator delta; unrelated shared-branch paths were not touched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-3b -->
## Phase 3b: Wave 1b Verification

- [x] T017 Run both configured deep-improvement Vitest files — receipt in `implementation-summary.md`.
  Evidence: The dispatcher file passed 21 tests and the host-driven runtime file passed 3 tests.
- [x] T018 Run the create-benchmark family registry test — receipt in `implementation-summary.md`.
  Evidence: Python reported six families and six resource keys with a passing parity check.
- [x] T019 Run the two requested plugin guard tests — receipt in `implementation-summary.md`.
  Evidence: Node reported 2/2 passing tests.
- [x] T020 Parse every edited JSON file with Node — receipt in `implementation-summary.md`.
  Evidence: All current runtime and packet JSON targets parse successfully.
- [x] T021 Run the all-runtime residual scan, strict validation, and final scope audit — receipt in `implementation-summary.md`.
  Evidence: The exact residual scan is clean, strict validation reports Errors: 0, and only the manifest plus 067 are in the operator delta.
<!-- /ANCHOR:phase-3b -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — receipt in `implementation-summary.md`.
  Evidence: T001-T021 are checked with receipts above.
- [x] No `[B]` blocked tasks remain — receipt in `implementation-summary.md`.
  Evidence: No task uses the blocked marker.
- [x] Eighteen dedicated files are deleted and 49 shared files are scrubbed across the two manifests — receipt in `implementation-summary.md`.
  Evidence: The primary seven/29 manifest and the Wave 1b eleven/20 manifest are recorded and pass their path and residual checks.
- [x] Focused tests, JSON parsing, residual scan, scope audit, and strict packet validation pass — receipt in `implementation-summary.md`.
  Evidence: Wave 1 and Wave 1b receipts are recorded above.
- [x] Orchestrator commit handoff is uncommitted; rollback remains `git revert <sha>` — receipt in `implementation-summary.md`.
  Evidence: No commit was created; the operator-directed rollback command remains documented.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md`.
- **Implementation record**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
