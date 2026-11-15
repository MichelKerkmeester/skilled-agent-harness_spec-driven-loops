---
title: "Feature Specification: Phase 4: workflow-single-source-and-drift-guard"
description: "The deep-research and deep-review commands each keep two hand-maintained workflow twins that drift apart in steps, executor branches, flags and dry-run wiring. This phase merges each pair into one workflow that serves both modes, moves inline scripts into shared runtime scripts and adds a test that fails when the drift returns."
trigger_phrases:
  - "workflow single source and drift guard"
  - "phase 4 workflow single source and drift guard"
  - "deep research auto confirm drift"
  - "deep review workflow twin merge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: workflow-single-source-and-drift-guard

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-lifecycle-lock-and-limits |
| **Successor** | 005-command-and-skill-doc-alignment |
| **Handoff Criteria** | Phase 005 receives the two new workflow paths, the list of doc surfaces that still name the four old file names and a green drift guard test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Fix every deep-research and deep-review workflow logic, drift and doc finding from the 2026-11-14 analysis specification.

**Scope Boundary**: This phase changes the `/deep:research` and `/deep:review` workflow assets under `.skilled/commands/deep/`, the runtime scripts and tests that read them and the few callers that execute them. It owns findings F14, F15 and F16. It does not touch `/deep:ai-council`, which sibling phase `006-ai-council-mode-deprecation` retires. It does not rewrite mode skills, references, feature catalogs, playbooks, agent definitions, the `sk-doc` and `sk-code` checklists or the speckit README, which phase 005 owns.

**Dependencies**:
- Phase 001 (deterministic stop decision), phase 002 (persisted loop state and failure policy) and phase 003 (lifecycle lock and limits) are complete, so the twins this phase merges already carry their logic fixes.
- The single-workflow pattern of `/speckit:plan` in `.skilled/commands/speckit/assets/speckit-plan.yaml` and `.skilled/commands/speckit/plan.md` stays as it is today.

**Deliverables**:
- `.skilled/commands/deep/assets/deep-research.yaml` and `.skilled/commands/deep/assets/deep-review.yaml`, each serving both execution modes.
- New runtime scripts under `.skilled/skills/system-deep-loop/runtime/scripts/` that hold the former inline Node heredocs.
- A drift guard inside `runtime/tests/unit/compile-command-contracts.vitest.ts`.
- Updated command docs, presentation files, compiled contracts, legacy bodies, readers and tests that named the four old files.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each deep-loop command ships an auto workflow and a confirm workflow that are edited by hand and have drifted. The confirm files lack five of the eight executor branches, never read `--no-resource-map` and diverge from auto in their failure branches, while dry run is wired only into the confirm files. The four files run from 148491 to 181686 bytes and the orchestrator loads one whole on every run, so every fix has to land twice and the copies keep diverging.

### Purpose
Each of `/deep:research` and `/deep:review` runs from one smaller workflow file whose steps, branches and flags are identical in both modes, and a test keeps it that way.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The census script below is read-only and sits in this packet's `scratch/` folder. Its output was captured on 2026-11-14 from `main`, before phases 001 to 003 change the files.

```text
$ bash specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard/scratch/measure-workflows.sh
== bytes
  165890 .skilled/commands/deep/assets/deep-research-auto.yaml
  148491 .skilled/commands/deep/assets/deep-research-confirm.yaml
  181686 .skilled/commands/deep/assets/deep-review-auto.yaml
  163571 .skilled/commands/deep/assets/deep-review-confirm.yaml
  659638 total
== research
differing lines auto vs confirm: 1623
keyed step names anywhere: auto=73 confirm=74
step keys inside workflow block: auto=73 confirm=63
auto-only workflow steps: step_apply_divergent_pivot_result step_ideas_backlog_lifecycle step_init_complete step_refresh_lineage_context step_rejected_pattern_cache step_run_now_check step_run_now_restore_check step_telemetry_heartbeat_progress step_telemetry_heartbeat_started step_telemetry_heartbeat_terminal 
confirm-only workflow steps: 
executor branches auto: if_cli_claude_code if_cli_codex if_cli_cursor if_cli_deepseek_harness if_cli_devin if_cli_opencode if_cli_pi if_native 
executor branches confirm: if_cli_claude_code if_cli_opencode if_native 
failure branches auto: if_failed 
failure branches confirm: if_failed_recoverable if_failed_unrecoverable 
dry_run mentions: auto=0 confirm=79
--no-resource-map mentions: auto=1 confirm=0
inline heredocs auto: 18 heredocs, 48240 bytes
pivot seat block bytes auto: 7902
dry-run mentions in research.md: 8 presentation: 0
== review
differing lines auto vs confirm: 1145
keyed step names anywhere: auto=72 confirm=73
step keys inside workflow block: auto=72 confirm=68
auto-only workflow steps: step_apply_divergent_pivot_result step_apply_lifecycle_request step_generate_state_summary step_init_complete 
confirm-only workflow steps: 
executor branches auto: if_cli_claude_code if_cli_codex if_cli_cursor if_cli_deepseek_harness if_cli_devin if_cli_opencode if_cli_pi if_native 
executor branches confirm: if_cli_claude_code if_cli_opencode if_native 
failure branches auto: if_failed 
failure branches confirm: if_failed_recoverable if_failed_unrecoverable 
dry_run mentions: auto=0 confirm=7
--no-resource-map mentions: auto=1 confirm=0
inline heredocs auto: 15 heredocs, 39800 bytes
pivot seat block bytes auto: 7920
dry-run mentions in review.md: 0 presentation: 0
== shared
workflow step keys shared by research auto and review auto: 54
```

How each finding holds against this output:

- **F14 holds with a correction.** The line differences (1623 and 1145) and the `--no-resource-map` split hold. The claim that both twins have the same steps holds only for keyed names anywhere in the file (73 and 74, 72 and 73). Inside the `workflow:` block the confirm files have 63 and 68 steps against 73 and 72. The missing names appear in the confirm file only as keys of `confirm_parity.omitted_steps`, which records a reason for each omission. The claim that confirm never names `cli-claude-code` holds for the hyphenated string only. Confirm does carry `if_cli_claude_code`, `if_cli_opencode` and `if_native`. The real gap is the five branches for codex, cursor, devin, pi and deepseek harness. The twins also differ in the other direction: confirm splits `if_failed` into a recoverable and an unrecoverable branch.
- **F15 holds.** Research auto has 0 `dry_run` mentions against 79 in confirm. `research.md` lists `dry_run` as a required input but its Dry-Run Flag section scopes the flag to the confirm flow. Review confirm has 7 mentions while `review.md` and both presentation files have 0.
- **F16 holds.** Auto files are the larger twin at 165890 and 181686 bytes. Research and review auto share 54 workflow step keys. Inline heredocs hold 48240 and 39800 bytes, and the three pivot seat blocks hold 7902 and 7920 bytes.
- **D6 correction.** `rg -c 'deep-(research|review)-(auto|confirm)\.yaml'` over `.skilled/skills/system-deep-loop/command-metadata.json` and `runtime/scripts/render-command-contract.cjs` prints nothing and exits 1. Neither file names a workflow file. The renderer reads the `autoWorkflow:` and `confirmWorkflow:` lines that the compiler writes into each compiled contract, so it changes only through the compiler.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merge each command's auto and confirm workflows into one file that carries an `execution_mode` and confirm-only checkpoints, after the pattern of `speckit-plan.yaml`.
- Wire dry run into both modes of both commands and document it in both command docs and both presentation files.
- Move the inline Node heredocs into runtime scripts both commands call, and collapse the three pivot seat dispatch and record pairs into one parameterized step.
- Extend `compile-command-contracts.vitest.ts` with a drift guard for a second per-mode file and for flag parity between command doc and workflow.
- Update every functional reader and test of the four old file names, then regenerate the compiled contracts.

### Out of Scope
- `/deep:ai-council` and its `deep-ai-council-auto.yaml` and `deep-ai-council-confirm.yaml` twins - sibling phase `006-ai-council-mode-deprecation` retires the council mode and owns those files. The guard checks research and review only.
- Docs outside the two mode packets that name the old files, including the agent definitions under `.skilled/agents/` and their runtime mirrors, the `sk-doc` and `sk-code` checklists and `.skilled/commands/speckit/README.txt` - phase 005 owns them by operator decision of 2026-11-14. The one exception is a file a phase 004 test reads for an old file name, which this phase updates so its own test passes. Today no such file exists outside Affected Surfaces.
- Mode skills, references, feature catalogs and playbooks that name the old files - phase 005 owns doc alignment.
- A generator that emits a confirm file from an auto file - rejected in favor of one authored file because a generated twin still doubles what the orchestrator must load and leaves two artifacts to keep in sync.
- A cross-command YAML include system - the shared steps move into runtime scripts instead, which needs no new loader.
- Benchmark reports and changelogs that quote the old names - they record history and stay as written.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research.yaml` | Create | Single research workflow for both modes |
| `.skilled/commands/deep/assets/deep-review.yaml` | Create | Single review workflow for both modes |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Delete | Replaced by the two single files |
| `.skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs` | Create | Started, progress and terminal heartbeat rows |
| `.skilled/skills/system-deep-loop/runtime/scripts/run-now-sentinel.cjs` | Create | Run-now sentinel check and restore |
| `.skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs` | Create | Per-iteration graph delta upsert |
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | Create | One executor dispatch entry over `buildLineageCommand` |
| `.skilled/commands/deep/research.md`, `review.md` | Modify | One workflow path, dry-run flag documented |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt` | Modify | New paths and the dry-run contract |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | One `workflowPath` for research and review |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | Modify | Drift guard |
| Readers and tests listed in `plan.md` Affected Surfaces | Modify | New file names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F14. `.skilled/commands/deep/assets/` holds `deep-research.yaml` and `deep-review.yaml` and no research or review file ending in `-auto.yaml` or `-confirm.yaml`. |
| REQ-002 | F14. Each single workflow declares a top-level `execution_mode` with values `auto` and `confirm`, and every confirm-only block carries `applies_to: confirm`, as `speckit-plan.yaml` does. |
| REQ-003 | F14. Each single workflow contains each of the eight executor branches `if_native`, `if_cli_claude_code`, `if_cli_codex`, `if_cli_cursor`, `if_cli_devin`, `if_cli_pi`, `if_cli_opencode` and `if_cli_deepseek_harness` once, and none of them sits inside a block marked `applies_to`. |
| REQ-004 | F14. Every step the census lists as auto-only (11 for research after phase 003 added `step_apply_lifecycle_request`, 4 for review) exists in the single workflow outside any `applies_to: confirm` or `applies_to: auto` block, so it runs in both modes. |
| REQ-005 | F14. Each single workflow carries one dispatch failure policy for both modes, taken from the policy phase 002 settled, so `if_failed` and the `if_failed_recoverable` and `if_failed_unrecoverable` pair never both appear. |
| REQ-006 | F15. With `dry_run=true`, both modes of both commands emit `dry_run_halt` and stop before any executor dispatch or state write, and the target `research/` or `review/` folder gains no file. |
| REQ-007 | F14 and F15. The drift guard in `compile-command-contracts.vitest.ts` fails when a per-mode workflow file for research or review reappears, when a command doc lists a flag its workflow never reads or when a workflow reads a flag the command doc does not list. Both checks cover the research and review definitions only, so the council twins and doc never fail it. |
| REQ-008 | F14. `rg -l` for the four old file names over the surfaces listed in `plan.md` Affected Surfaces prints nothing. |
| REQ-015 | F14. Each single workflow keeps the confirm-mode Retry, Skip or Cancel gate after three consecutive failed iterations that phase 002 specifies, inside a block marked `applies_to: confirm`, so the merge never removes it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | F15. `research.md` and `review.md` both list `--dry-run` in their Workflow Flag Surface table without a confirm-only restriction, and both presentation files document the dry-run halt. |
| REQ-010 | F16. `deep-research.yaml` and `deep-review.yaml` are each smaller than both files they replace. The first target was 140000 and 155000 bytes. The operator amended it on 2026-11-14 after the merged files measured 144394 and 158517 bytes. |
| REQ-011 | F16. The census script run with `--single` reports at most 2000 inline heredoc bytes in each single workflow, because the bodies now live in runtime scripts that both commands call. |
| REQ-012 | F16. Each single workflow has one parameterized pivot seat step pair, so `step_dispatch_pivot_seat_002` and `step_dispatch_pivot_seat_003` no longer appear. |
| REQ-013 | F14. The compiled contracts are regenerated and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` exits 0. |
| REQ-014 | F14. The auto against confirm parity tests (`stop-policy-yaml-parity`, `lifecycle-taxonomy-yaml-parity`, `workflow-session-id-parity` and `executor-branch-contract`) assert their contract against the single file, and the full runtime suite passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .skilled/commands/deep/assets/*.yaml` lists `deep-research.yaml` and `deep-review.yaml` and no research or review twin.
- **SC-002**: `npm test` in `.skilled/skills/system-deep-loop/runtime` passes, and the drift guard fails on a fixture copy that restores `deep-research-confirm.yaml`.
- **SC-003**: `wc -c` on each single workflow prints less than both twins it replaces.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 003 land first | Merging before them would drop their logic fixes from one twin | Setup checks each predecessor's `spec.md` status and reruns the census on the post-fix files |
| Dependency | `.skilled/commands/speckit/assets/speckit-complete.yaml:764` executes `deep-research-auto.yaml` | `/speckit:complete` research handoff breaks on the rename | Update the path and pass `execution_mode: auto` in the same commit |
| Risk | D2 makes the 10 research and 4 review auto-only steps run under confirm, including run-now polling and telemetry heartbeats | Medium. Confirm sessions start writing heartbeat rows and polling a sentinel | Accepted by D2. Tests assert the steps fire in both modes and the presentation file names the change |
| Risk | Reconciling the differing step bodies drops a branch that only one twin had | High. A silent behavior loss in one mode | Implementation diffs each shared step body and records the chosen body per step in `scratch/merge-ledger.md` before deleting a twin |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The orchestrator loads less for a run than either twin held: 144394 bytes for research and 158517 for review, down from 172747 and 180254 for auto.
- **NFR-P02**: The drift guard adds under 2 seconds to `npx vitest run tests/unit/compile-command-contracts.vitest.ts`.

### Security
- **NFR-S01**: The new runtime scripts read only paths under the bound artifact directory and the runtime root, as the inline bodies did.
- **NFR-S02**: Dry run writes nothing under the spec folder in either mode.

### Reliability
- **NFR-R01**: Each new runtime script exits non-zero on a missing required argument instead of falling back to a default path.
- **NFR-R02**: `bash .skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh` passes, so every script a workflow calls exists.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `/deep:review` call with no `--dry-run` binds `dry_run=false` and runs as today.
- Maximum input: a fan-out run with eight executors and `--dry-run` halts before the first lineage spawns and emits one `dry_run_halt` row with boundary `child-spawn`.
- Failure path: a workflow that reads a flag the command doc does not list fails the drift guard with the flag name and the workflow path in the message.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Four workflow files become two, four runtime scripts are added and about 40 readers and tests change |
| Risk | 18/25 | Shared command contract consumed by the compiler, the drift checker, `/speckit:complete` and the fan-out runner |
| Research | 10/20 | Per-step reconciliation of 1623 and 1145 differing lines |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Who owns the agent definitions, the `sk-doc` and `sk-code` checklists and the speckit README? **RESOLVED 2026-11-14 by the operator: phase 005, except a file a phase 004 test reads for an old file name.**
- Does the confirm Retry, Skip or Cancel gate survive the merge? **RESOLVED 2026-11-14 by the operator: yes, it is an approval checkpoint under D2.** REQ-015 holds it.
- Who owns `deep-ai-council`? **RESOLVED 2026-11-14 by the operator: sibling phase `006-ai-council-mode-deprecation`.**
- Is the `if_failed` policy or the recoverable and unrecoverable split the one phase 002 settles? Decision: implementation reads phase 002's `implementation-summary.md` and keeps that policy.
<!-- /ANCHOR:questions -->

---
