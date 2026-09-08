---
title: "Implementation Plan: Phase 6: lifecycle-command-asset-merge"
description: "Merge each lifecycle command's auto and confirm YAML twins into one asset with an execution-mode branch and a declared checkpoint list, extract the six save_context copies into one shared tail, and comment every validate.sh cadence site."
trigger_phrases:
  - "lifecycle command merge plan"
  - "execution mode branch technical approach"
  - "save context tail extraction"
  - "command tree parity testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: lifecycle-command-asset-merge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets read by an agent at command time, Markdown command routers |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `validate-command-tree-parity.sh`, `sync-runtime-mirrors.cjs --check`, PyYAML parse of each merged asset |

### Overview
Each command's auto and confirm assets already diff to identical step names and step bodies. The confirm file only adds a `use: present_options_to_user` line and rewords `step_completion_rule`. The merge folds that difference into one field per step (a `checkpoint: true|false` flag or equivalent) read against a top-level `execution_mode` the command router resolves from `$ARGUMENTS`, the same resolution `plan.md`/`implement.md`/`complete.md` already perform before choosing which file to load. The six `save_context` copies move into one shared tail asset under one placeholder convention, referenced (not repeated) by all three commands. Every `validate.sh [SPEC_FOLDER] --strict` call site gains a one-line comment stating its cadence reason.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structural merge with a mode branch, following the same literal-replacement discipline `011-command-surface-contract-realignment` used on these same six files: read the live content first, replace by exact match, assert the checkpoint list and the parity checks before landing.

### Key Components
- **`speckit-{plan,implement,complete}.yaml`**: the three merged assets, each carrying an `execution_mode` field and a per-step `checkpoint` flag in place of the confirm-only `use: present_options_to_user` line
- **Shared `save_context` tail asset**: one file the three merged assets reference for their closing save step
- **Command routers (`plan.md`, `implement.md`, `complete.md`)**: updated to resolve `execution_mode` and load the single merged asset, instead of choosing between two file paths

### Data Flow
`$ARGUMENTS` → command router resolves `execution_mode` → merged asset loaded once → agent reads each step's `checkpoint` flag against `execution_mode` to decide whether to pause → shared tail asset runs the closing save.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `speckit-{plan,implement,complete}-{auto,confirm}.yaml` (six files) | Six independent workflow definitions, three duplicate pairs | update (merge to three) | PyYAML parse of each merged file. Step-name extraction shows no auto/confirm duplication |
| `save_context` step body (six copies, two placeholder conventions) | Closing-save step, owned separately by each command | update (extract to one shared asset) | `grep -c save_context` across the merged assets and the new shared tail |
| `validate.sh [SPEC_FOLDER] --strict` call sites (2 in plan, 2 in implement, 5 in complete, live-counted 2026-09-07) | Full 39-rule gate re-run at several points per workflow | update (add cadence comment) | every call site diffed for a one-line comment before and after |
| `plan.md`, `implement.md`, `complete.md` command routers | Document and select between the auto/confirm asset paths | update | asset-path table in each router names one file per command, not two |
| `.github/workflows/command-tree-parity.yml`, `validate-command-tree-parity.sh` | Asserts the OpenCode and Claude command trees stay byte-identical | verify only | re-run against the merged tree |
| `runtime-mirrors/sync-runtime-mirrors.cjs` | Symlinks command/agent mirrors back to their canonical source | verify only | `--check` re-run against the merged assets |
| `speckit-{plan,implement,complete}-presentation.txt` | Presentation contract, not duplicated per mode today | not a consumer of the auto/confirm merge | confirmed unchanged by grep before and after |
| `resume.md`'s workflow assets | Genuinely distinct per `035-.../005-.../research.md`. Not part of this merge | unchanged | out of scope, confirmed by the same research row |

Required inventories:
- Same-class producers: `diff <(grep -n step_ speckit-plan-auto.yaml) <(grep -n step_ speckit-plan-confirm.yaml)` for each command pair, confirming the only divergence is the checkpoint insertion and the completion-rule wording.
- Consumers of changed symbols: `grep -rn "speckit-plan-auto\|speckit-plan-confirm\|speckit-implement-auto\|speckit-implement-confirm\|speckit-complete-auto\|speckit-complete-confirm"` across `.opencode/commands`, `.claude/commands`, CI workflows and the runtime-mirror script, to find every reference to the six file names before renaming them.
- Matrix axes: command (plan, implement, complete) by execution mode (auto, confirm). Every cell must resolve to the same merged file with a different mode value, not a different file.
- Algorithm invariant: a step's checkpoint fires if and only if `execution_mode == confirm` and the step's `checkpoint` flag is true. No step gains or loses a checkpoint relative to what its former confirm-mode twin already declared.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | PyYAML parse of each merged asset and the shared tail | python |
| Integration | `command-tree-parity` checker, `sync-runtime-mirrors.cjs --check` | bash, node |
| Manual | Step-name extraction diffed against the pre-merge six files to confirm no step's content changed beyond the checkpoint and save_context consolidation | grep, diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `011-command-surface-contract-realignment`'s prior rewrite of these six assets | Internal | Green, shipped | A merge from a stale copy would reintroduce residue that phase already removed |
| `020-rule-headers-registry-coverage-and-playbook-paths`'s recorded decision to defer this exact merge | Internal | Green. This phase is the deferred follow-through | None. This phase exists because that decision named it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `command-tree-parity` fails, `sync-runtime-mirrors.cjs --check` reports drift, or a merged asset's YAML fails to parse
- **Procedure**: `git revert` the single commit. The six pre-merge files return and the router documents revert with them
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Diff each auto/confirm pair, inventory every reference to the six file names |
| Core Implementation | High | Merge three command pairs, extract the shared tail, comment every validate.sh site, update three routers |
| Verification | Med | Parity checker, mirror check, step-name extraction diff |
| **Total** | | Three large YAML merges plus router and CI verification |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed. Tracked in git history
- [x] Feature flag configured - none. The merge changes structure an agent reads at command time
- [x] Monitoring alerts set - the parity checker and the mirror check are the alerts

### Rollback Procedure
1. `git revert` the merge commit
2. Rerun `command-tree-parity` and `sync-runtime-mirrors.cjs --check` to confirm the six-file state is restored
3. Spot-check one `/speckit:plan :confirm` and one `/speckit:plan :auto` invocation against the restored assets

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
