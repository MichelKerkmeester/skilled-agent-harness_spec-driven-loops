---
title: "Implementation Plan: Phase 4: workflow-single-source-and-drift-guard"
description: "Merge each deep-loop command's auto and confirm workflows into one file with an execution mode and confirm-only checkpoints, move the inline Node heredocs into runtime scripts and guard the result with a vitest drift check. The approach copies the single-workflow pattern of speckit-plan.yaml."
trigger_phrases:
  - "workflow single source and drift guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: workflow-single-source-and-drift-guard

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Node.js CommonJS runtime scripts, TypeScript tests |
| **Framework** | Deep-loop command workflows run by the command orchestrator |
| **Storage** | None. Workflows write JSONL state under the bound artifact directory, unchanged by this phase |
| **Testing** | Vitest 4.1.12 through `npm test` in `.skilled/skills/system-deep-loop/runtime` and `npx vitest run --config ../../vitest.config.ts --project cli` in `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
Each of `/deep:research` and `/deep:review` gets one authored workflow that declares `execution_mode` and marks its checkpoints `applies_to: confirm`, the pattern `.skilled/commands/speckit/assets/speckit-plan.yaml` lines 16 to 21 and 589 already use. The inline Node heredocs move into four runtime scripts and the three pivot seat pairs collapse into one parameterized pair. A drift guard in `compile-command-contracts.vitest.ts` is written first, fails on today's tree and passes once the merge lands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -n '^\| \*\*Status\*\*' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/spec.md specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy/spec.md specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/003-lifecycle-lock-and-limits/spec.md` prints `Complete` three times.
- [ ] The census script in `scratch/measure-workflows.sh` exits 0 and its output is saved as `scratch/census-before.txt`.
- [ ] The drift guard test fails on the unmerged tree with a message naming `deep-research-confirm.yaml`.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npm test` exits 0, and `node scripts/check-contract-drift.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One workflow per command with mode-gated checkpoints. The workflow file owns steps and branches. The execution mode owns only approval checkpoints and wording.

### Key Components
- **`deep-research.yaml` and `deep-review.yaml`**: the single authored workflows. Without them every fix lands twice and the twins drift, as the census shows with 1623 and 1145 differing lines.
- **Runtime scripts `loop-heartbeat.cjs`, `run-now-sentinel.cjs`, `iteration-graph-upsert.cjs` and `dispatch-iteration.cjs`**: hold the heredoc bodies that today sit inline at 48240 and 39800 bytes. Without them the size target is out of reach and the two commands keep separate copies of the same code. `dispatch-iteration.cjs` wraps `buildLineageCommand` from `runtime/scripts/fanout-run.cjs:3115`, which the inline cursor, devin and pi branches already call.
- **Drift guard in `compile-command-contracts.vitest.ts`**: reads the command definitions the compiler already holds and fails on a second per-mode file or a flag mismatch. Without it the drift returns on the next hand edit.

### Data Flow
The command doc resolves setup and the execution mode, then loads the one workflow path. The workflow runs every step in both modes and stops at a checkpoint only when `execution_mode` is `confirm`. When `dry_run` is true, any step tagged `dry_run_boundary` emits `dry_run_halt` to the terminal and halts. The compiler reads the single `workflowPath` into each compiled contract and the renderer emits it unchanged.

### Flag parity rule
Both guard checks iterate the research and review definitions only, so the council twins and the council doc never enter them. Phase `006-ai-council-mode-deprecation` owns council. The guard collects flags from the `| \`--flag\` |` rows of each command doc's Workflow Flag Surface table and the required inputs from its YAML START CONDITION. It turns each flag into an input key by dropping `--` and replacing `-` with `_`, then applies an alias table kept in the test, for example `--no-resource-map` to `resource_map.emit` and `--max-iterations` to `maxIterations`. A flag passes when its key appears in the workflow outside comments. A workflow input passes when it is declared under `user_inputs` and maps back to a documented flag or required input.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Owner: `.skilled/skills/system-deep-loop` owns the workflow assets under `.skilled/commands/deep/assets/` and the compiler definitions that name them. Frozen contract: the command doc resolves `execution_mode` and setup, then loads exactly one workflow path from the compiled contract. The compiled contract keeps every schema block that `compile-command-contracts.vitest.ts` lists, including `renderBlocks.auto` and `renderBlocks.confirm`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml` and `deep-research-confirm.yaml` | Producer of the research loop | Replace with `deep-research.yaml` | `ls .skilled/commands/deep/assets/deep-research*.yaml` lists one yaml |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` and `deep-review-confirm.yaml` | Producer of the review loop | Replace with `deep-review.yaml` | `ls .skilled/commands/deep/assets/deep-review*.yaml` lists one yaml |
| `runtime/scripts/compile-command-contracts.cjs:178-179`, `:187-188`, `:280-281`, `:289-290`, `:576-577` | Names both twins in the review and research definitions and emits `autoWorkflow:` and `confirmWorkflow:` | Update to one `workflowPath` for research and review. Keep `:54-55` and `:65-66` for council | `npx vitest run tests/unit/compile-command-contracts.vitest.ts` passes |
| `runtime/scripts/render-command-contract.cjs` | Consumer of the compiled contract lines, names no workflow file | Unchanged unless the emitted key changes | `rg -c 'Workflow' scripts/render-command-contract.cjs` before and after, plus `tests/unit/render-command-contract.vitest.ts` |
| `runtime/scripts/check-contract-drift.cjs:271-272`, `:306-307` | Reads `definition.autoWorkflowPath` and `definition.confirmWorkflowPath` as authority sources | Update to read `workflowPath` when present | `node scripts/check-contract-drift.cjs` exits 0 |
| `runtime/scripts/check-ledger-stem-producers.cjs:57-60` | Lists the four files as ledger stem producers | Update to the two files | `npx vitest run tests/unit/check-ledger-stem-producers.vitest.ts` passes |
| `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:689`, `:712-715` | Producer paths per ledger stem | Update to `deep-research.yaml` | `npm run typecheck` exits 0 |
| `runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts:605-607`, `:621-624`, `:631-632`, `:635-636` | Producer paths per ledger stem | Update to `deep-review.yaml` | `npm run typecheck` exits 0 |
| `deep-research/scripts/verify-yaml-script-paths.sh:7-12` | `YAML_FILES` array of the four files | Update to the two files | Script prints `PASS ... across 2 workflow YAMLs` |
| `deep-review/assets/review-mode-contract.yaml:413`, `:423` | Names the review twins, and is a compiler source | Update to `deep-review.yaml` | `rg -c 'deep-review-(auto\|confirm)' deep-review/assets/review-mode-contract.yaml` prints nothing |
| `.skilled/commands/speckit/assets/speckit-complete.yaml:126`, `:764` | Executes `deep-research-auto.yaml` for the research handoff | Update to `deep-research.yaml` with `execution_mode: auto` | `rg -n 'deep-research' .skilled/commands/speckit/assets/speckit-complete.yaml` shows the new path |
| `.skilled/commands/deep/research.md:41-42`, `:89-90`, `:156-157` and `review.md:62-63`, `:123-124` | Command docs route each mode to a twin | Point both modes at one file and document `--dry-run` | Drift guard passes |
| `.skilled/commands/deep/assets/deep-review-presentation.txt:355-356` and `deep-research-presentation.txt:19` | Presentation routes per mode | Update paths and add the dry-run contract | `rg -c 'dry[-_]run'` prints at least 1 per file |
| `.skilled/commands/deep/assets/legacy/deep-research.body.markdown:24-25`, `:55-56`, `:93-94` and `legacy/deep-review.body.markdown:28-29`, `:58-59` | Legacy fallback bodies | Update paths | `rg -l` over `.skilled/commands/deep/assets` prints nothing |
| `.skilled/commands/deep/assets/legacy/README.markdown:81-82` | Says `:auto` loads "the auto workflow" and `:confirm` "the confirm workflow" | Reword to one workflow per command with a mode | `rg -n 'auto workflow\|confirm workflow' legacy/README.markdown` prints nothing |
| `.skilled/commands/deep/assets/compiled/README.markdown` | Names no workflow file or mode workflow | Not a consumer. Unchanged | `rg -c 'yaml\|auto workflow' compiled/README.markdown` prints nothing |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Generated contracts | Regenerate with the compiler | `node scripts/check-contract-drift.cjs` exits 0 |
| `.skilled/skills/system-deep-loop/command-metadata.json` | Names no workflow file | Not a consumer. Unchanged | `rg -c` over the file prints nothing |
| 23 test files under `runtime/tests/unit/` that read a twin, listed in `tasks.md` | Assert workflow content | Repoint to the single file. The four parity tests drop their auto against confirm comparison and keep their content assertions | `npm test` exits 0 |
| `system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts:45-46`, `:88`, `deep-review-contract-parity.vitest.ts:48-49`, `deep-review-auto-restart-contract.vitest.ts:22`, `:74`, `deep-review-reducer-schema.vitest.ts:86-87` | Cross-skill contract tests | Repoint to the single file | `npx vitest run --config ../../vitest.config.ts --project cli` on those four files passes |
| `.skilled/agents/deep-review.md:310-311` and its mirrors in `.claude/agents/`, `.codex/agents/`, `.pi/agents/` and `.dsh/agents/` | Agent docs naming the twins | Not changed here. Phase 005 owns them by operator decision of 2026-11-14. `deep-review-contract-parity.vitest.ts:42-45` reads two of them for lifecycle terms only, not for a workflow file name, so the exception does not apply | Listed in the phase 005 handoff |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md`, `.skilled/commands/speckit/README.txt:157-160` | Docs quoting the old names | Not changed here. Phase 005 owns them by operator decision of 2026-11-14. No phase 004 test reads them | Listed in the phase 005 handoff |
| `error_recovery.consecutive_failures` in `deep-research-confirm.yaml:1943` and `deep-review-confirm.yaml:2155` | Confirm Retry, Skip or Cancel gate after three consecutive failures, as phase 002 leaves it | Keep as an `applies_to: confirm` checkpoint in each single workflow | `rg -n 'Retry' $A/deep-research.yaml $A/deep-review.yaml` prints the gate in each file |
| `runtime/scripts/divergent-pivot.cjs` | Added during implementation: a fifth script that carries the pivot prepare, seat record and finalize bodies | Create, with `tests/unit/divergent-pivot-cli.vitest.ts` | `node scripts/divergent-pivot.cjs` exits 64 with a usage line |
| `runtime/scripts/check-ledger-stem-producers.cjs` producer list | Amended during implementation: `run-now-sentinel.cjs` and `dispatch-iteration.cjs` now emit stems the workflows emitted inline | Add both scripts to the list | `node scripts/check-ledger-stem-producers.cjs` prints `"violations":[]` |
| `deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml` | Council twins | Unchanged here. Sibling phase `006-ai-council-mode-deprecation` owns their retirement | Guard passes whether the files exist or not |

Required inventories:
- Same-class producers: `rg -l 'deep-(research|review)-(auto|confirm)\.yaml' .skilled .claude .codex .pi .dsh` gives the full list. Implementation reruns it after phases 001 to 003 and saves it as `scratch/inventory-before.txt`.
- Consumers of changed symbols: `rg -n 'autoWorkflowPath|confirmWorkflowPath|autoWorkflow:|confirmWorkflow:' .skilled --glob '*.cjs' --glob '*.ts' --glob '*.md' --glob '*.markdown'`.
- Matrix axes: command (research, review) by execution mode (auto, confirm) by dry run (true, false) by executor (eight branches). The guard checks branch presence for all eight. Behavior tests cover the four command and mode rows with dry run on and off.
- Algorithm invariant: for every command, the set of steps and branches is identical in both modes. Mode changes only blocks marked `applies_to: confirm` and the `mode_overrides.confirm` wording.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 001 to 003 are complete, reruns `scratch/measure-workflows.sh` and the old-name inventory, and adds the drift guard to `compile-command-contracts.vitest.ts` so it fails on today's tree. Implementation writes `deep-research.yaml` and `deep-review.yaml` from a per-step reconciliation of each twin pair that keeps the confirm Retry, Skip or Cancel gate as a checkpoint, extracts the heredocs into four runtime scripts, collapses the pivot seats and repoints every reader in Affected Surfaces. Verification runs both vitest suites, `check-contract-drift.cjs`, `verify-yaml-script-paths.sh`, the census script with `--single` and a dry-run run per command and mode. The ordered work and each verify command live in `tasks.md`.

Size target derivation from the census: research auto 165890 bytes less 48240 heredoc bytes less two thirds of the 7902 pivot seat bytes leaves about 112000 bytes before confirm checkpoints, dry-run boundaries and script calls are added. The cap of 140000 bytes leaves 28000 bytes for them and sits below 148491, the smaller research twin. Review auto 181686 less 39800 less two thirds of 7920 leaves about 136600 bytes. The cap of 155000 bytes leaves 18400 bytes and sits below 163571, the smaller review twin. Setup remeasures after phases 001 to 003 and records any change to these inputs in `goal.md` before Implementation starts. Measured result: 144394 and 158517 bytes. The operator amended the requirement on 2026-11-14 to "smaller than both twins it replaces", which holds.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Drift guard, the four rewritten parity tests, the four new runtime scripts and the repointed workflow content tests | Vitest via `npm test` in `.skilled/skills/system-deep-loop/runtime` |
| Integration | Compiled contract freshness, script path existence and cross-skill contract tests | `node scripts/check-contract-drift.cjs`, `bash deep-research/scripts/verify-yaml-script-paths.sh`, Vitest `--project cli` in `system-spec-kit/runtime/cli` |
| Manual | `/deep:research:auto --dry-run` and `/deep:review:confirm --dry-run` against a scratch spec folder | Terminal transcript saved under `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001, 002 and 003 of this parent | Internal | Yellow | Merging first would drop their fixes from the twin they edited last |
| `buildLineageCommand` in `runtime/scripts/fanout-run.cjs:3115` | Internal | Green | `dispatch-iteration.cjs` has no shared builder to call |
| Vitest 4.1.12 and tsx 4.22.4 from `runtime/package.json` | External | Green | Tests and the extracted TypeScript-loading scripts cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `npm test` or `check-contract-drift.cjs` fails after the merge and the cause cannot be fixed within three attempts, or a `/deep:research` or `/deep:review` run in either mode loses a step that ran before.
- **Procedure**: Revert the phase commit with `git revert <phase-sha>`, which restores the four twins, the readers and the compiled contracts together. Then rerun `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` and confirm it exits 0.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 003 complete | Implementation |
| Implementation | A failing drift guard and the saved census | Verification |
| Verification | Two single workflows and every repointed reader | Phase 005 and packet close |
<!-- /ANCHOR:phase-deps -->

---
