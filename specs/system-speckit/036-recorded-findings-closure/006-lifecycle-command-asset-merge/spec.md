---
title: "Feature Specification: Phase 6: lifecycle-command-asset-merge"
description: "The /speckit:plan, implement and complete workflow assets keep six duplicated save_context copies, an unexplained 4/3/7 validate.sh cadence, and auto/confirm twins that differ only in checkpoint insertion points."
trigger_phrases:
  - "lifecycle command asset merge"
  - "auto confirm twin merge"
  - "save context tail duplication"
  - "validate sh cadence comment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: lifecycle-command-asset-merge

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/006-lifecycle-command-asset-merge` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 16 |
| **Predecessor** | 005-provenance-title-sweep |
| **Successor** | 007-links-scan-registry-rule |
| **Handoff Criteria** | Each lifecycle command resolves to one workflow asset with a mode branch, the save_context tail exists once, every validate.sh call carries a cadence reason, and the command-tree-parity workflow plus the runtime-mirror check both pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Recorded findings closure specification.

**Scope Boundary**: the six `.opencode/commands/speckit/assets/speckit-{plan,implement,complete}-{auto,confirm}.yaml` workflow assets, the three command router documents that select between them (`plan.md`, `implement.md`, `complete.md`), and the tests and CI checks that assert the two runtimes' command trees stay identical.

**Dependencies**:
- `035-spec-kit-simplification-research/005-overengineering-simplification/research/lineages/deepseek-v4-flash-overengineering-r3/research.md` (`F3-10` through `F3-13`), the findings this phase closes
- `035-spec-kit-simplification-research/011-command-surface-contract-realignment`, the prior contract change to the same asset files, whose commit rewrote the retired-checklist and template-path residue this phase must not reintroduce
- `035-spec-kit-simplification-research/020-rule-headers-registry-coverage-and-playbook-paths`, which recorded this exact merge as a command-surface redesign rather than folding it into a remediation child

**Deliverables**:
- One workflow asset per lifecycle command, replacing the six-file auto/confirm split, with an execution-mode branch and a declared checkpoint list
- One shared `save_context` tail asset referenced by all three commands under one placeholder convention
- A one-line cadence comment on every `validate.sh [SPEC_FOLDER] --strict` call site
- A green `command-tree-parity` CI run and a clean `sync-runtime-mirrors.cjs --check`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three `/speckit:*` lifecycle commands each ship as an auto/confirm pair, six YAML assets between 780 and 1,388 lines (verified 2026-09-07: `speckit-plan-auto.yaml` 780 lines, `speckit-plan-confirm.yaml` 849 lines). A direct diff of the two plan twins shows every step name and every step body is identical between them. The confirm file adds only a `use: present_options_to_user` line after each step and rewords `step_completion_rule` to mention approval (`F3-13`, confirmed by diff at `speckit-plan-{auto,confirm}.yaml`). `save_context` is the one step every one of the three commands carries, but each command owns its own copy under a different placeholder: `plan.md`'s tail reads `{spec_path}` while `implement` and `complete` read `[spec-folder-path]`, six copies total across the auto/confirm pairs (`F3-11`). `complete`'s 16 steps repeat 12 of `plan`'s and `implement`'s step names in the same order (`F3-10`, confirmed at `complete-auto.yaml` step keys `step_1_request_analysis` through `step_9_implementation_check`, which match `plan-auto.yaml` and `implement-auto.yaml`'s own step names). `validate.sh [SPEC_FOLDER] --strict` is invoked 2 times in `plan-auto.yaml`, 2 in `implement-auto.yaml` and 5 in `complete-auto.yaml` beyond the one shared variable definition each file also carries, for a live total of 4, 3 and 7 occurrences of the string per file (re-measured 2026-09-07 with `grep -c 'validate.sh' <file>`, matching `F3-12`'s original count exactly), and no comment at any call site says why that run happens there.

### Purpose
Each lifecycle command's contract lives in one file with one execution-mode branch, its closing save happens through one shared asset, and every strict-validation call states why it runs where it runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merging `speckit-{plan,implement,complete}-auto.yaml` and their `-confirm.yaml` twins into one asset per command with an execution-mode branch and a declared checkpoint list
- Extracting the six `save_context` copies into one shared tail asset under one placeholder convention
- Adding a one-line cadence comment to every `validate.sh [SPEC_FOLDER] --strict` call site across the three merged assets
- Updating `plan.md`, `implement.md` and `complete.md`'s "Auto workflow" / "Confirm workflow" asset-path tables to point at the merged single asset per command
- Re-running the `command-tree-parity` checker and `sync-runtime-mirrors.cjs --check` against the merged assets

### Out of Scope
- Changing what any step does, its order, or its content beyond the auto/confirm and save_context consolidation - this phase is a structural merge, not a workflow redesign
- The presentation assets (`speckit-{plan,implement,complete}-presentation.txt`) - untouched by the auto/confirm merge since they are not duplicated per mode
- Collapsing `complete`'s 12 shared step names into literal references to `plan`'s and `implement`'s phases as sub-workflows - `F3-10`'s recommended follow-on, noted as a larger structural change this phase does not attempt
- `resume.md`'s workflow assets - confirmed genuinely distinct from the auto/confirm pattern (`035-.../005-.../research.md`: "resume is genuinely distinct. Autopilot steps are activation-gated")

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/assets/speckit-plan-auto.yaml`, `speckit-plan-confirm.yaml` | Modify/Merge | Combined into one `speckit-plan.yaml` with an execution-mode branch |
| `.opencode/commands/speckit/assets/speckit-implement-auto.yaml`, `speckit-implement-confirm.yaml` | Modify/Merge | Combined into one `speckit-implement.yaml` |
| `.opencode/commands/speckit/assets/speckit-complete-auto.yaml`, `speckit-complete-confirm.yaml` | Modify/Merge | Combined into one `speckit-complete.yaml` |
| `.opencode/commands/speckit/assets/_save-context-tail.yaml` (new shared asset, exact name decided during implementation) | Create | The one `save_context` step body all three commands reference |
| `.opencode/commands/speckit/plan.md`, `implement.md`, `complete.md` | Modify | Asset-path tables updated from two files per command to one |
| `.github/workflows/command-tree-parity.yml`, `.opencode/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` | Verify only | Re-run against the merged tree. Not expected to need a content change |
| `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Verify only | `--check` re-run against the merged assets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/speckit:plan`, `/speckit:implement` and `/speckit:complete` each resolve to exactly one workflow asset with a declared execution-mode branch and a declared checkpoint list, replacing the six-file auto/confirm split |
| REQ-002 | The six `save_context` step copies collapse to one shared tail asset referenced by all three commands under one placeholder convention |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every `validate.sh [SPEC_FOLDER] --strict` call site in the three merged assets carries a one-line comment stating why it runs at that point |
| REQ-004 | The `command-tree-parity` CI workflow and `sync-runtime-mirrors.cjs --check` both pass against the merged assets |
| REQ-005 | A step-name extraction across the three merged assets shows no command copying another's step name and body verbatim in the same order, beyond `complete`'s documented reuse of `plan`'s and `implement`'s phases |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .opencode/commands/speckit/assets/speckit-{plan,implement,complete}*.yaml` lists three lifecycle workflow files, not six
- **SC-002**: `grep -c 'save_context' .opencode/commands/speckit/assets/*.yaml` shows the step body defined once and referenced, not repeated per command
- **SC-003**: `bash .opencode/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` and `node .../sync-runtime-mirrors.cjs --check` both exit 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An agent executing the merged asset misreads the execution-mode branch and skips a checkpoint `:confirm` expects | A confirm-mode run proceeds without the user-facing pause it is supposed to have | The checkpoint list is declared explicitly in the merged asset rather than left implicit in a `use:` line the agent might miss. The presentation asset's checkpoint contract is checked against it |
| Risk | The merge changes byte content the `command-tree-parity` checker or the OpenCode/Claude mirror symlinks depend on | CI fails or a mirrored runtime silently stops tracking the merged file | Both checks are re-run as part of this phase's own verification, not deferred to a later CI run |
| Dependency | `011-command-surface-contract-realignment`'s prior rewrite of these same six files | A merge based on a stale copy of the assets would reintroduce the retired-checklist residue that phase removed | This phase re-reads the current committed assets, not the pre-011 versions, before merging |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. The assets are read by an agent at command time, not executed as compiled code
- **NFR-P02**: A merged asset should not exceed roughly the sum of its two former twins' unique content. The confirm-only checkpoint lines are the only expected net addition to the auto file's line count

### Security
- **NFR-S01**: No new command surface. The merge changes structure, not capability
- **NFR-S02**: Not applicable

### Reliability
- **NFR-R01**: A future step added to a lifecycle command is added once, not once per mode
- **NFR-R02**: The command-tree-parity and runtime-mirror checks catch a merge that desyncs the OpenCode and Claude command trees before it ships
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable. The assets are fixed workflow definitions, not runtime input
- Maximum length: a merged asset approaching double its former auto-file length is a signal the mode branch was implemented as two copies of every step rather than one step with a conditional checkpoint, and should be treated as a defect, not accepted
- Invalid format: a merged asset that fails YAML parse blocks the merge from landing, the same gate `011`'s rewrite used

### Error Scenarios
- External service failure: not applicable
- Network timeout: not applicable
- Concurrent access: another session's edits to these same six files between planning and execution are checked for before the merge starts, since this asset tree is a shared, actively used surface

### State Transitions
- Partial completion: the three commands are merged together in one change, since a mixed state where `plan` is merged but `implement` still ships an auto/confirm pair leaves the router documents and the mirror checks inconsistent
- Session expiry: not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Six large YAML assets merged to three, one new shared tail, three router documents, two CI/mirror checks re-run |
| Risk | 12/25 | A widely used command surface. A broken checkpoint branch changes user-facing behavior on every `/speckit:*` invocation |
| Research | 5/20 | Findings arrived censused from the 035 lane's overengineering round three. This phase re-verified the live line counts and the validate.sh cadence numbers |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The merge shape (one asset, an execution-mode branch, a declared checkpoint list) is the literal recommendation recorded in `F3-13`.
<!-- /ANCHOR:questions -->

---
