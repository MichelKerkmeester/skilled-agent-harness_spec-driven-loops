---
title: "Implementation Plan: Phase 5: resume-detection-and-single-workflow"
description: "Merge the two resume workflow files into one speckit-resume.yaml that selects its mode the way the lifecycle workflows do, and rewrite its session detection and context loading to match the resume library. Prove it with rg checks on the merged file and the two tests that list the workflow files."
trigger_phrases:
  - "resume detection and single workflow plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: resume-detection-and-single-workflow

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow, Markdown router, plain-text presentation contract, JSON metadata and two Node test files |
| **Framework** | SpecKit command assets under `.skilled/commands/speckit/` |
| **Storage** | None written. The workflow reads handoff notes, `_memory.continuity` and `runtime/database/access-telemetry.json` |
| **Testing** | `node` for `test-phase-command-workflows.js`, `node --test` for `speckit-goal-offer-contract.test.cjs` and `rg` checks on the asset text |

### Overview
Replace `speckit-resume-auto.yaml` and `speckit-resume-confirm.yaml` with one `speckit-resume.yaml` that carries both modes through `execution_mode`, `applies_to: confirm` and `mode_overrides.confirm`. Rewrite its detection so the calling session's handoff note and `session_ref` come first and no tier picks a packet by modification time, and correct the redirect, the handover rule and the start-new command to match `resume-ladder.ts`. Prove it with the `rg` checks in `acceptance-criteria.md` and both consumer tests passing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Phase 4 is closed: `rg -c '\| Unmet \|' ../004-code-review-and-dispatch-policy/acceptance-criteria.md` prints nothing
- [x] Baseline tests pass: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` and `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `fail 0`
- [x] The consumer inventory is recorded: `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` lists the files this plan names

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met` with the observed output
- [x] Both tests print `failed=0` and `fail 0` from the final tree
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One file, mode overrides. The same pattern `speckit-plan.yaml` uses.

### Key Components
- **`assets/speckit-resume.yaml`**: the single workflow. It replaces two files, so it adds no file. Without it the auto and confirm copies keep drifting.
- **`resume.md`**: the router. It routes both modes to the one file and documents the flags.

### Data Flow
The router reads `$ARGUMENTS`, binds `execution_mode` and loads `speckit-resume.yaml`. Detection takes the argument, then the session's handoff note, then its `session_ref`, then ends in the No Session result under auto or a labelled candidate list under confirm. Loading reads `handover.md` and `_memory.continuity` under the ladder rule, then the spec docs, and the presentation file renders the brief.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/speckit-resume-auto.yaml`, `assets/speckit-resume-confirm.yaml` | Own resume detection and loading, one file per mode | Delete after the merge | `ls .skilled/commands/speckit/assets/speckit-resume*.yaml` prints one file |
| `assets/speckit-resume.yaml` | New single owner of resume detection and loading | Create | The `rg` checks in `acceptance-criteria.md` |
| `resume.md` | Routes each mode to its file | Update | `rg -n 'speckit-resume.yaml' .skilled/commands/speckit/resume.md` prints the owned-asset and target rows |
| `assets/speckit-resume-presentation.txt` | Renders prompts, brief and No Session result | Update | `rg -n -e 'speckit:complete' -e 'mcp_enrichment' -e 'both resume workflow'` on it prints nothing |
| `README.txt` asset tree and workflow asset line | Name the two files | Update the resume asset names only | `rg -n 'speckit-resume' .skilled/commands/speckit/README.txt` names only the merged file and the presentation file |
| `command-metadata.json`, `command-contract.json`, the session-recovery feature catalog | Name the two files as resources and targets | Update | `rg -l 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` prints nothing |
| `test-phase-command-workflows.js`, `speckit-goal-offer-contract.test.cjs` | List the two files and assert on them | Update the lists and the `speckit-resume-` prefix check | Both tests pass |
| `resume-ladder.ts`, `access-telemetry.ts`, `session-relaunch.cjs`, `generate-context.js` | Own the rules the workflow text describes | Unchanged | `git diff --stat` names none of them |

Required inventories:
- Same-class producers: `rg -n 'speckit-resume-[a-z]+\.yaml' .skilled .opencode` lists every file that names an old workflow file.
- Consumers of changed symbols: the same command, plus `rg -n 'both resume workflow' .skilled` for prose that counts two files.
- Matrix axes: mode (auto, confirm) by detection source (argument, handoff note, `session_ref`, none). Eight rows, each read in the merged file before closing.
- Algorithm invariant: no detection path ends in a packet that neither the operator named nor the calling session's own records name.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup runs both tests for a baseline and records every file that names an old resume workflow file. Implementation creates `speckit-resume.yaml`, rewrites its detection and loading, deletes the two old files and updates the router, presentation, README lines, metadata, catalog and tests. Verification runs each `acceptance-criteria.md` command and both tests from the final tree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Asset lists and the resume `purpose_row` check | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints `failed=0` |
| Integration | The workflow files that may carry `goal_prompt_choice` | `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints `fail 0` |
| Manual | The eight mode and source rows, read in the merged file | `rg` checks from `acceptance-criteria.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 `execution_mode` shape in `speckit-plan.yaml` | Internal | Yellow, phase 3 is not closed | The merged file copies wording that phase 3 may still change |
| `node` and `rg` | External | Green | The tests and checks cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A consumer test fails after the merge, or a resume run opens a packet the session did not own.
- **Procedure**: `git revert <phase commit>` restores both old files and every reference in one step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 4 closed | Implementation |
| Implementation | Setup baseline and inventory | Verification |
| Verification | Implementation | Phase close and the handoff to phase 6 |
<!-- /ANCHOR:phase-deps -->

---

