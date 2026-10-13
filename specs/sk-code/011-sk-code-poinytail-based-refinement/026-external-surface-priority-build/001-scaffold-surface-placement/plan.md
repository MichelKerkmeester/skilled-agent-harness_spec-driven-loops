---
title: "Implementation Plan: Scaffold surface placement"
description: "Add one insertion-rule phrase to the scaffold's tieBreak activity and its two contract references, add two follow-up lines to the completion report, and prove both in a throwaway full-tree copy with a stand-in surface."
trigger_phrases:
  - "scaffold surface placement plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Scaffold surface placement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML command assets and Markdown references |
| **Framework** | The `/create:skill-parent` agent-followed workflow |
| **Storage** | None |
| **Testing** | Copy runs of the workflow, `parent-skill-check.cjs`, the compiled-route guard, sync `--check` and the front door |

### Overview
The edit is prose inside the scaffold contract: one rule phrase at the step_4 `hub-router.json` activity of each twin and in two references, and two lines in each twin's step_6 report. The proof is behavioral: in a full-tree copy, the builder follows the twin's update workflow for a stand-in surface and checks the order it writes, the doctor legs, the tied route and the effect of the two follow-ups.
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
Contract text in an agent-followed workflow, proven by a copy run

### Key Components
- **step_4 `hub-router.json` activity** (`create-skill-parent-confirm.yaml:462`, `create-skill-parent-auto.yaml:423`): the only writer of a new mode's `tieBreak` position
- **step_6_completion** (confirm about line 542, auto about line 495): the report the user reads after the run
- **`routerPolicy.tieBreak`** in a hub's `hub-router.json`: the deterministic final sorter, read at mint by `registry-compiler.cjs`

### Data Flow
The workflow writes `tieBreak`; `compiled-route-manifest.cjs refresh` mints it into the runtime manifest; the front door `compiled-route.cjs` sorts tied candidates by it. The pre-commit gate `gate:route-remint` re-mints and copies the manifest to its authored twin at commit; nothing copies the canary fixture, which is why R8 names it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Both create-skill-parent YAML twins | Write `tieBreak` and the report | Update, identically | Criterion 1 and P8-1 |
| `parent-hub-router-schema.md` tie-break paragraph | States what `tieBreak` encodes | Update | `validate_document.py` |
| `parent-skills-nested-packets.md` row 3 | New-mode checklist | Update | `validate_document.py` |
| `.skilled/skills/sk-code/hub-router.json` | Shipped order | Unchanged | `git diff` shows no change |

Required inventories:
- Same-class producers: `grep -rn 'tieBreak' .skilled/commands/create/assets/` lists every activity that writes the order; each one either gains the rule or is shown not to place a new surface.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Copy recipe, from research run V0. Under the session scratchpad: copy `.skilled` without `node_modules` and symlink each `node_modules` read-only to the worktree's; copy `specs/sk-doc/z_archive/019-skill-routing-refactor/` to the same path; copy `README.md`, `PUBLIC-RELEASE.md`, `.github` and `.opencode` with symlinks kept (`cp -RP`), since `.opencode/skills` must exist for compiled routing (F90). Confirm the control first: the doctor, guard and sync `--check` exit 0 in the copy.

Stand-in: a surface named `sk-code-acme` whose vocabulary class holds `acme`. Tie prompt: one that matches `acme` and an OpenCode runtime keyword such as `typescript`, for example "update the typescript config in the acme service". Record its route with the stand-in appended last before applying the new rule, so P8-4 shows the change.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Stand-in surface added by the workflow in a copy | `parent-skill-check.cjs`, `compiled-route-manifest.cjs refresh`, `compiled-route.cjs`, guard, sync `--check` |
| Static | Rule phrase on identical lines in both twins | `grep -F` and a string compare |
| Doc | The two references | `python3 .skilled/skills/sk-doc/scripts/validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026 planning commit on origin/main | Internal | Waits on the operator's merge | The worktree from origin/main lacks this spec folder |
| DeepSeek executor (cli-devin or cli-pi) | External | Available | Fall back from Devin to cli-pi when the daily quota runs out |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rule wording breaks a doctor leg or the twins drift.
- **Procedure**: Revert this phase's commits; the shipped order never changed, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Worktree, copy and control run |
| Core Implementation | Low | Four prose edits and a release |
| Verification | Med | The stand-in copy run and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Control run in the copy recorded before any edit

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the sk-code and sk-doc doctors and confirm exit 0.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
