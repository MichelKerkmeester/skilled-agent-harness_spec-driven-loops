---
title: "Feature Specification: Phase 11: prerequisites-bound-folder-override"
description: "The speckit plan, implement and complete workflows run check-prerequisites.sh without naming the bound spec folder, so the script derives the folder from the git branch. On a worktree branch or for a nested track packet it exits 1, and the implement pre-implementation gate can never pass."
trigger_phrases:
  - "prerequisites bound folder override"
  - "phase 11 prerequisites bound folder override"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: prerequisites-bound-folder-override

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-fix-alignment-report-findings-for-speckit-command-surfaces |
| **Successor** | None |
| **Handoff Criteria** | Each speckit workflow call to `check-prerequisites.sh` sets `SPECIFY_FEATURE` from the bound folder, and the four workflow tests match the baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of `007-speckit-command-gates-step-order-drift`. Phase 2 made `/speckit:implement` step 1 run `check-prerequisites.sh --json` as its prerequisites gate. This phase makes that call name the packet it checks.

**Scope Boundary**: the five workflow lines that run the script, and the setup README that documents its override. The script itself does not change.

**Dependencies**:
- `check-prerequisites.sh:76-84`, which already skips the branch check when `SPECIFY_FEATURE` is set.

**Deliverables**:
- Five workflow lines that set `SPECIFY_FEATURE`.
- One README paragraph naming the override.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The plan, implement and complete workflows run `check-prerequisites.sh` and never name the bound spec folder. With no `SPECIFY_FEATURE`, the script takes the git branch as the folder and requires an `NNN-` branch. On the worktree branch it exits 1. The `prerequisites_complete` check at `speckit-implement.yaml:299` needs exit 0, so it can never pass for this packet layout. The script already accepts the folder through `SPECIFY_FEATURE`, including a nested track packet, and resolves it with exit 0.

### Purpose
Every speckit workflow call to `check-prerequisites.sh` checks the bound packet, so the prerequisites gate passes or fails on that packet's files, not on the branch name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the worktree root on branch `worktrees/384-agent-alignment-follow-ups`.

```text
be3d037066c
$ bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json
ERROR: Not on a feature branch. Current: worktrees/384-agent-alignment-follow-ups
Feature branches should be: 001-feature-name (or main/master/trunk for trunk-based operators)
exit=1
$ SPECIFY_FEATURE=agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json
{"FEATURE_DIR":"/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups/specs/agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule","AVAILABLE_DOCS":[]}
exit=0
$ rg -n 'check-prerequisites.sh' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/assets/speckit-implement.yaml:299:      - { id: prerequisites_complete, from: step_1_review_plan_and_spec, criteria: ".skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh exited 0 and spec.md and plan.md exist." }
.skilled/commands/speckit/assets/speckit-implement.yaml:375:    - Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json
.skilled/commands/speckit/assets/speckit-plan.yaml:602:    activities: [Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --paths-only, Load plan.md, Fill Technical Context, Fill Constitution Check, "Phase 0: Record each unknown in the plan.md Technical Context and name /deep:research for an unknown that needs investigation. Read an existing research/research.md as input and never write it", "Phase 1: Define component structure/interfaces", Generate Testing Strategy, Generate Success Metrics, Import Risk Matrix from spec, Generate Dependencies Tables, "Import Planning Packet fields into the Affected Surfaces table for fix_bug/remediation packets", Generate Phase 2-4 outlines, "Run the restraint pass on the planned components and files before the plan is final: name what fails today without each new file, module, option, layer or dependency"]
.skilled/commands/speckit/assets/speckit-complete.yaml:748:    - Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --paths-only to get feature paths
.skilled/commands/speckit/assets/speckit-complete.yaml:808:    - Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json to get FEATURE_DIR
.skilled/commands/speckit/assets/speckit-complete.yaml:879:    - Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh --json --require-tasks
exit=0
$ rg -c 'SPECIFY_FEATURE' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/skills/system-spec-kit/runtime/cli/setup/README.md
exit=1
$ node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js 2>&1 | tail -3
PASS: T-EM7: shared save-context tail carries the writer call and the post-save rule

Result: passed=143 failed=0
exit=0
$ node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs 2>&1 | grep -E 'ℹ (pass|fail)'
ℹ pass 17
ℹ fail 0
exit=0
$ (cd .skilled/skills/system-deep-loop/runtime && node_modules/.bin/vitest run --config vitest.config.ts tests/unit/speckit-autopilot-contract.vitest.ts 2>&1 | grep -E 'Tests ')
      Tests  5 passed (5)
exit=0
$ (cd .skilled/skills/system-spec-kit/runtime/cli && npx --no-install vitest run --config ../../vitest.config.ts --project cli tests/yaml-intake-event-payloads.vitest.ts 2>&1 | grep -E 'Tests ')
      Tests  7 passed (7)
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prefix each of the five workflow calls with `SPECIFY_FEATURE=<bound folder without its leading specs/>`.
- Restate the implement gate check at `speckit-implement.yaml:299` so it names the bound folder.
- Add one paragraph to the setup README naming `SPECIFY_FEATURE` and its nested-packet form.

### Out of Scope
- `check-prerequisites.sh` and `common.sh` - the override already works, as the measured output shows.
- `create.sh`'s own `SPECIFY_FEATURE` export - it sets the branch name for a new folder, a different case.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Step 1 call at `:375` and the gate criterion at `:299` |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | Step 5 call at `:602` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Calls at `:748`, `:808` and `:879` |
| `.skilled/skills/system-spec-kit/runtime/cli/setup/README.md` | Modify | Name the `SPECIFY_FEATURE` override |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the five workflow calls sets `SPECIFY_FEATURE` from the bound folder | `rg -c 'SPECIFY_FEATURE=' ` prints 1 for `speckit-plan.yaml`, 1 for `speckit-implement.yaml` and 3 for `speckit-complete.yaml`, and `rg -n 'Run bash .skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites' ` on the three files exits 1 |
| REQ-002 | The workflow tests match the baseline | `test-phase-command-workflows.js` prints `passed=143 failed=0`, `gate-3-menu-parity` 17 pass, `speckit-autopilot-contract` 5 passed and `yaml-intake-event-payloads` 7 passed, with all three YAMLs still parsing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The implement gate criterion names the bound folder | `sed -n 299p .skilled/commands/speckit/assets/speckit-implement.yaml` contains `SPECIFY_FEATURE` |
| REQ-004 | The setup README documents the override | `rg -n 'SPECIFY_FEATURE' .skilled/skills/system-spec-kit/runtime/cli/setup/README.md` prints one line or more |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The command the implement step 1 line now states, run for `agents/007-agent-alignment-follow-ups/015-review-verdict-gate-rule`, exits 0 on branch `worktrees/384-agent-alignment-follow-ups`.
- **SC-002**: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The override path at `check-prerequisites.sh:76-84` | If it changes, the workflow lines name a variable nothing reads | The README paragraph names the script lines that read it |
| Risk | A workflow run with no bound folder | Low: the prefix would be empty, and the script falls back to the branch as it does today | Each line says the prefix applies when a spec folder is bound |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose this workflow fix on 2026-11-15 after the script was found to support the override already.
<!-- /ANCHOR:questions -->

