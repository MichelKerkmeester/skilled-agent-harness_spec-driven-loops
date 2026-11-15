---
title: "Implementation Plan: Phase 3: lifecycle-lock-and-limits"
description: "Fix restart, lock lifetime, lock release and the duration limit in the four deep-research and deep-review workflow files. Research copies review's restart surface and all four files keep the restart lineage values. Static vitest files parse the workflows and fail on the start commit."
trigger_phrases:
  - "lifecycle lock and limits plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: lifecycle-lock-and-limits

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets, Markdown command docs, TypeScript and CommonJS runtime on Node |
| **Framework** | Deep-loop runtime under `.skilled/skills/system-deep-loop/runtime/` |
| **Storage** | Packet folders on disk, the JSONL state log and the append-gateway ledger |
| **Testing** | Vitest 4.1.12 through `npm --prefix .skilled/skills/system-deep-loop/runtime test` |

### Overview
Change the four workflow files under `.skilled/commands/deep/assets/`, the research command surface and one ledger type file. Add restart, lock and duration steps with the same ids in all four files. Prove each change with a static vitest file that parses the workflows and fails on the start commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `git rev-parse --short HEAD` is recorded in `goal.md` section 4 as the start commit.
- [ ] Phase 001 `spec.md` adds `maxDurationReached` to `stop_reasons_enum`. `rg -n 'maxDurationReached' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/001-deterministic-stop-decision/spec.md` prints a line.
- [ ] Phase 002 is merged. `rg -c 'YOUR_VALUE_HERE' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/002-persisted-loop-state-and-failure-policy/spec.md` prints 0.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/workflow-restart-lifecycle.vitest.ts tests/unit/workflow-lock-lifetime.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/workflow-max-duration.vitest.ts` exits 0.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative workflow steps.

### Key Components
- **`step_apply_lifecycle_request`**: archives the packet before any directory or lock exists. Without it, research auto has no reachable restart and a restart moves the held lock.
- **`step_release_lock`**: the one release every terminal path names. Without it, every research auto halt outside the three `applies_to` branches relies on the `on_workflow_exit` prose.
- **`step_check_max_duration`**: reads `maxDurationMinutes`. Without it, the field has no reader.

### Data Flow
Restart reads `sessionId` and `generation` from the old config, binds `prior_session_id` and `prior_generation`, moves the packet to `{state_paths.archive_root}/{timestamp_slug}`, then initialization creates directories, takes the lock and writes a config with generation `prior_generation + 1`. The run opens through `run_initialized` and then records `run_restarted`. Each iteration refreshes the lock before and after dispatch and checks the duration limit before dispatch.

### D3 Lock Lifetime Decision
Derive the TTL from the longest allowed dispatch: `--ttl-ms` is the larger of 1800000 and `timeoutSeconds` times 1000, and the lock is refreshed right before and right after each dispatch. The gap between two refreshes is then one dispatch, at most 3600 seconds, and the stale window is twice the TTL. A heartbeat during dispatch is rejected. `startHeartbeat` in `runtime/lib/deep-loop/loop-lock.ts` is an in-process `setInterval`, and `loop-lock.cjs` exits after each command, so a heartbeat needs a detached process that every exit path must kill. An orphaned heartbeat keeps a dead run's lock alive forever, because the acquire passes no `--owner-pid` and a `transient` lock is never reclaimed on pid liveness. A TTL derived from the four-hour lineage ceiling is rejected because a crash would block the packet for eight hours. The trade-off of the chosen design is that a crashed run blocks its packet for twice the TTL, 120 minutes at the 3600-second cap, against 60 minutes today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-research-auto.yaml` and `deep-research-confirm.yaml` | Producers of the research restart, lock and config | update | `workflow-restart-lifecycle.vitest.ts` and `workflow-lock-lifetime.vitest.ts` pass |
| `deep-review-auto.yaml` and `deep-review-confirm.yaml` | Producers of the review restart, lock and config | update | The same two tests pass for the review files |
| `research.md` and `deep-research-presentation.txt` | Bind research setup values | update | `rg -c -- '--restart\|--lineage-mode'` prints a count above 0 for each |
| `runtime/scripts/loop-lock.cjs` and `runtime/lib/deep-loop/loop-lock.ts` | Own acquire, refresh, stale rule and release | unchanged | `loop-lock-cli.vitest.ts` and `loop-lock.vitest.ts` pass |
| `deep-research-ledger-types.ts` | Declares `deep_research.run_restarted` as reserved | update | `check-ledger-stem-producers.vitest.ts` passes |
| `deep-research/scripts/reduce-state.cjs` | Reads `resumed` and `restarted` events for lineage | not a consumer of the step changes, consumer of the event | T022 asserts the projected restart row |
| `assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` | Generated from the workflows with source digests | update | `compile-command-contracts.cjs --command deep/research` reports no digest drift |
| `deep-ai-council-*.yaml` | Take the same lock. Sibling phase `006-ai-council-mode-deprecation` retires the council mode | unchanged | `deep-research-lock-release.vitest.ts` nonce test still passes |

Required inventories:
- Same-class producers: `rg -n 'mv \{state_paths.packet_dir\}|--ttl-ms|halt: true|fail closed|maxDurationMinutes' .skilled/commands/deep/assets/deep-re*.yaml`.
- Consumers of changed symbols: `rg -n 'lineage_mode|prior_session_id|prior_generation|run_restarted|maxDurationMinutes' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: loop (research, review) by mode (auto, confirm) by lifecycle (fresh, resume, restart with a prior packet, restart without one). That is 16 rows, and the restart test covers each.
- Algorithm invariant: a restart never moves the file at `{state_paths.lock_file}` while it is held, and the new config generation equals the archived config generation plus one. Adversarial cases are a missing old config, a corrupt old config that halts as invalid state, and an archive target that already exists.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the start commit and writes the four test files so they fail on it. Implementation edits the four files in `.skilled/commands/deep/assets/` plus `research.md`, `deep-research-presentation.txt` and `deep-research-ledger-types.ts`. Verification runs the four test files and the full runtime suite with `npm --prefix .skilled/skills/system-deep-loop/runtime test` and compares the result with the start commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Step order, flags, lineage values, TTL formula, release routing and duration stop parsed from the four workflow files | Vitest |
| Integration | `loop-lock.cjs` acquire with the derived TTL, then a status check at the dispatch cap, in a temp folder | Vitest with `spawnSync` |
| Manual | One research auto run with `--restart` against a scratch copy of a packet, then `ls` of the archive root | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 adds `maxDurationReached` to the frozen `stop_reasons_enum` | Internal | Yellow | REQ-010 and REQ-011 wait. The restart and lock work proceeds. |
| Phase 002 halt and failure policy | Internal | Yellow | REQ-008 enumeration may miss a halt it adds. Rerun T005's test after rebase. |
| Vitest and tsx in `runtime/node_modules` | Internal | Green | No test can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a restart archives a folder it should not have, a run halts with `lost the packet lock` during a normal dispatch or the runtime suite shows a failure the start commit did not.
- **Procedure**: revert the phase commit with `git revert <phase-commit>`. A wrong archive is undone by moving it back, never by deleting: `mv {state_paths.archive_root}/{timestamp_slug} {state_paths.packet_dir}` after `node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs status --lock-path {state_paths.lock_file}` prints `exists:false` or `stale:true`. If a new packet folder already exists at the target, move it aside to `{state_paths.archive_root}/{timestamp_slug}-new` first.
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
| Setup | Phases 001 and 002 merged | Implementation |
| Implementation | Failing tests from Setup | Verification |
| Verification | Implementation | Phase 004 handoff |
<!-- /ANCHOR:phase-deps -->

---
