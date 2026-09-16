---
title: "Tasks: Phase 9: reference-rewrite"
description: "Ordered tasks for the reference rewrite: setup and census proof, 62 manifest-bound batches, the 39 manual rows, generator closeout and the final rescan, each with its executor."
trigger_phrases:
  - "reference rewrite tasks"
  - "rewrite batch task order"
  - "reference rewrite verification checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: reference-rewrite

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

**Task Format**: `T### [P?] Description (file path) [executor]`

**Executors**: `[DeepSeek]` is DeepSeek V4.1 Flash at `--thinking max` on cli-pi through the LLM Gateway. `[GPT-5.6]` is GPT-5.6 on cli-codex in a read-only sandbox. `[Orchestrator]` is the Opus session that verifies every return. Batch IDs and sizes are defined in `plan.md` under Batch Plan.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm entry: phases 003 to 008 validate PASSED, the worktree is clean apart from known untracked lineage directories, every generator check in `plan.md` passes and the phase base SHA is recorded (repository root) [Orchestrator]
- [ ] T002 Read 004's frozen layout into the rule table: the moved list from ADR-001, the keep-list positions from ADR-003 and the `.opencode/specs` target. Halt with LOGIC-SYNC when either ADR is not Accepted or any of the three is open (`../004-migration-design/decision-record.md`) [Orchestrator]
- [ ] T003 Write `build-batch-manifests.py`, `rewrite-batch.py` and `rescan-references.py` from the rule table: dry run by default, keep-list lines set aside as class K before any other class, `--self-test` covering the nine boundary cases in `plan.md` and no comment naming a spec path, batch id or task id (`scratch/`) [DeepSeek]
- [ ] T004 Review the three scripts for boundary errors and write-scope leaks (`scratch/`) [GPT-5.6]
- [ ] T005 Prove the census: `rewrite-batch.py --census` on `728c4f3efc` reports 14,905 automatic, 790 specs, 646 review and 78 never occurrences over the 2,963 files, then recompute on the post-move tree with T002's lists (`scratch/census-baseline.json`) [Orchestrator]
- [ ] T006 Writer check on the 11 generated-looking data files among the mechanical rows. Move the two confirmed ones (`baseline-readme-verdicts.json`, `command-bridges.generated.json`) and any new finding to the regenerate list (`scratch/regenerate-list.txt`) [Orchestrator]
- [ ] T007 Reconcile the 59 routed manual rows with 005, 006 and 010. Drop every rewrite-set row whose file no longer names `.opencode`, such as the seven rows under `scripts/git-hooks/tests/` if 005 carried them with the hooks they test (`scratch/routing-reconciliation.md`) [Orchestrator]
- [ ] T008 Build the manifests at post-move paths with F1 to F3, the regenerate list and routed rows excluded. Confirm the batch files sum to the rewrite set minus the T006 and T007 drops (`scratch/batch-manifests/`) [Orchestrator]
- [ ] T009 [P] Try `reference_checker.py` with a root-prefix semantic map on B19 as a second lens and record whether it scales (`.opencode/skills/sk-doc/shared/scripts/reference_checker.py`) [Orchestrator]
- [ ] T010 [P] Capture the freeze baseline: `git ls-files -s` over the 968 freeze paths (`scratch/freeze-baseline.tsv`) [Orchestrator]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Every batch task means: brief, rule run, V1 to V8 from `plan.md`, then one commit staged by explicit path.

### Code batches
- [ ] T011 B01 root config, first of all batches (`.gitignore`, `.utcp_config.json`, `.env.example`, `.github/dependabot.yml`) [DeepSeek, review GPT-5.6]
- [ ] T012 B02 `bin`, then `compiled-route-sync.cjs --check` (`.skilled/bin/`) [DeepSeek, review GPT-5.6]
- [ ] T013 B03 and B04 system-skill-advisor, back to back after B02, with the `bin` and advisor suites both run after B04 [DeepSeek, review GPT-5.6]
- [ ] T014 B05 `scripts` (`.skilled/scripts/`) [DeepSeek, review GPT-5.6]
- [ ] T015 B06 `hooks` code, then the `sync-hook-registrations.cjs` and `sync-runtime-mirrors.cjs` checks (`.skilled/hooks/`) [DeepSeek, review GPT-5.6]
- [ ] T016 B07 to B11 system-spec-kit code, including `hook-registry.json` and the path constants of the mirror generators (`.skilled/skills/system-spec-kit/`) [DeepSeek, review GPT-5.6]
- [ ] T017 B12 `plugins`, after B06 and B11 (`.skilled/plugins/`) [DeepSeek, review GPT-5.6]
- [ ] T018 B13 and B14 system-deep-loop code (`.skilled/skills/system-deep-loop/`) [DeepSeek, review GPT-5.6]
- [ ] T019 B15 to B19 `commands` code, then `compile-command-contracts.cjs --write` for the three deep commands, `derive-command-bridges.cjs`, the prompt generators and `sync-runtime-mirrors.cjs` (`.skilled/commands/`) [DeepSeek, review GPT-5.6 on B15]
- [ ] T020 B20 and B21 sk-doc code (`.skilled/skills/sk-doc/`) [DeepSeek, review GPT-5.6]
- [ ] T021 B22 code of the nine small skills [DeepSeek, review GPT-5.6]

### Mixed batches
- [ ] T022 B23 both agent trees, then `sync-agents.cjs`, `sync-agents-pi.cjs` and `sync-skills-hermes.cjs` (`.skilled/agents/`, `.claude/agents/`) [DeepSeek]
- [ ] T023 B24 authored runtime files: MCP registrations, hook and extension READMEs, Cursor commands, the Hermes plugin [DeepSeek, review GPT-5.6]

### Documentation batches
- [ ] T024 B25 to B27 root and dot-directory, `hooks` and `commands` documents, then the command generators again [DeepSeek]
- [ ] T025 B28 to B32 system-spec-kit documents, then `generate-trigger-index.mjs`, the `regenerate-skill-derived.cjs` dry run and the scaffold snapshot suite [DeepSeek]
- [ ] T026 B33 to B40 system-deep-loop documents [DeepSeek]
- [ ] T027 B41 to B43 system-skill-advisor documents [DeepSeek]
- [ ] T028 B44 to B46 sk-doc documents, then `test_readme_verdict_parity.py --write` [DeepSeek]
- [ ] T029 B47 to B49 sk-code documents [DeepSeek]
- [ ] T030 B50 to B54 cli-external-orchestration documents [DeepSeek]
- [ ] T031 B55 to B62 mcp-tooling, sk-design, sk-git, sk-vision, mcp-code-mode, sk-prompt and sk-communication documents [DeepSeek]

### Manual rows
- [ ] T032 `AGENTS.md` by the rule, then `sync-gate1-pointers.cjs` and its `--check` (`AGENTS.md`) [Orchestrator]
- [ ] T033 Four git-hook READMEs, rewritten against the contract 005 shipped (`hooks/git-hooks-check/README.md`, `hooks/git/README.md`, `scripts/git-hooks/README.md`, `scripts/git-hooks/lib/README.md`) [Orchestrator]
- [ ] T034 Three spec-root documents, rewritten against the contract 006 shipped (both `canonical-first-spec-root-resolution.md` files, `spec-root-alias-retirement-runbook.md`) [Orchestrator]
- [ ] T035 27 recorded fixtures, each rewritten together with the assertion that reads it and its suite green. First settle whether each assertion compares absolute paths or fragments [Orchestrator]
- [ ] T036 Four captured-once retrieval records: decide freeze under parent D4, add F4 and log the decision in `goal.md` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`) [Orchestrator]
- [ ] T037 Generator closeout: every generator named in `plan.md` passes its check on the final tree [Orchestrator]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T038 Run `rescan-references.py` over tracked files outside `specs/` and require `unclassified=0` (`scratch/rescan-references.py`) [Orchestrator]
- [ ] T039 Recount the unclassified occurrences independently from the same pathspec [GPT-5.6]
- [ ] T040 Compare the freeze paths with the T010 baseline, no hash differing (`scratch/freeze-baseline.tsv`) [Orchestrator]
- [ ] T041 Commit hygiene: `git log --name-status <base>..HEAD` shows no `R` status and no path under `containment/` or `lineages/` [Orchestrator]
- [ ] T042 Run the full suite set once: spec-kit, deep-loop, skill-advisor, hooks, `bin`, node tests and sk-doc pytest [Orchestrator]
- [ ] T043 Fill `implementation-summary.md`, mark `acceptance-criteria.md` with evidence and run `validate.sh --strict` to `RESULT: PASSED` [Orchestrator]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The rescan reports `unclassified=0` and the independent recount agrees
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
- **Directive**: See `goal.md`
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

- [ ] CHK-001 [P0] Phases 003 to 008 validate PASSED and the phase base SHA is recorded
- [ ] CHK-002 [P0] The rule table holds 004's moved list, keep-list and `.opencode/specs` target
- [ ] CHK-003 [P0] The census on `728c4f3efc` matches 14,905, 790, 646 and 78
- [ ] CHK-004 [P1] The writer check and the routed-row reconciliation are recorded before any manifest exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The three phase scripts pass `--self-test` and a second-family review
- [ ] CHK-011 [P0] Every batch diff has equal added and removed lines per file and no rename
- [ ] CHK-012 [P1] No batch adds a code comment and the pre-commit comment-hygiene checker passes on every commit
- [ ] CHK-013 [P1] No comment in the phase scripts names a spec path, batch id or task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Every batch report records its suite command, exit code 0 and output tail
- [ ] CHK-022 [P1] Every generator check passes after the batches that feed it and again at T037
- [ ] CHK-023 [P1] V5 finds no fenced-code path that resolved at a batch base and fails at the tip
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every occurrence left after the batches carries a class: freeze, never, kept by design, generated or routed to 010
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: the census shows 0 remaining R1 segment occurrences, down from 279
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: each generator that reads a rewritten file has run and each test importing a rewritten module ran in the same batch
- [ ] CHK-FIX-004 [P0] The rule's self-test covers `tool.opencode_goal`, `.opencode-local/`, `.opencode-backup-*`, `~/.opencode/state`, `\.opencode\/specs`, `'.opencode', 'logs'`, `specs .opencode"`, `.opencode.json` and an R1 path form on a keep-list line
- [ ] CHK-FIX-005 [P1] Batch reports tabulate the census by area group and occurrence class before completion is claimed
- [ ] CHK-FIX-006 [P1] Generator checks run in a shell with `HERMES_SKILLS_SOURCE_DIR`, `HERMES_SKILLS_OUTPUT_DIR` and `HERMES_AGENTS_SOURCE_DIR` unset, since `sync-skills-hermes.cjs:20-27` lets them redirect its input and output
- [ ] CHK-FIX-007 [P1] Every batch report names its base SHA and its commit SHA
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief, report or review prompt carries a secret or home-level configuration content
- [ ] CHK-031 [P0] Every batch's changed paths stay inside its manifest, its report and named generator outputs
- [ ] CHK-032 [P1] Every second-family review ran in a read-only sandbox
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `goal.md` agree on the batch count T008 recomputed
- [ ] CHK-041 [P1] The 39 manual-row dispositions are logged in `goal.md` with evidence
- [ ] CHK-042 [P2] `implementation-summary.md` lists the batch commits and the rescan result
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Manifests, reports and scripts live in `scratch/` under kebab-case names
- [ ] CHK-051 [P1] No containment snapshot or lineage scratch is committed. Temporary files other than the kept scripts, manifests and reports are removed before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. Execution waits on phases 003 to 008.
<!-- /ANCHOR:summary -->

---
