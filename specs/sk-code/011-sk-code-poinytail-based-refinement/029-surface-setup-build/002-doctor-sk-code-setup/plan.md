---
title: "Implementation Plan: Doctor sk-code setup"
description: "Add the read-only /doctor:sk-code command with a setup target by the doctor family's documented route recipe, backed by one read-only check script that runs the battery, asserts the probe routes and prints one repair command per failing leg."
trigger_phrases:
  - "doctor sk-code setup plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctor sk-code setup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, a command markdown file and a YAML command asset |
| **Framework** | The doctor command family |
| **Storage** | None |
| **Testing** | `node --test` on a new test under `.skilled/commands/doctor/scripts/tests/`; `run-all.sh`; `route-validate.sh` |

### Overview
Follow the add recipe in `.skilled/commands/doctor/_routes.yaml`: append the route, write the command and its router and presentation, then rerun `route-validate.sh`. The legs run from one read-only script so the verdict, including the probe's `"action":"route"` assertion, is an exit code rather than JSON an agent reads.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: 001 on origin/main

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only doctor route backed by a script, as `/doctor:skill-advisor parent-skill` runs `parent-skill-check.cjs`

### Key Components
- **`_routes.yaml`**: the route row, `mutating: read-only`, `gate3_location: n/a`, `script_invocations` naming the check script
- **`sk-code.md`**: the command, its router and the one target
- **`sk-code-setup-check.cjs`**: runs each leg as a child process, prints `PASS` or `FAIL` per leg with one repair command, and exits 1 on any failure
- **README references**: the root Verify step, the sk-code README VERIFICATION table and the sk-code SKILL.md surface sentence

### Data Flow
The user types `/doctor:sk-code setup`; the YAML runs the script; the script runs the provisioning precheck, then the battery legs, and prints the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_routes.yaml` and `route-validate.sh` | The doctor route contract | Add a route | Criterion 1 |
| Runtime command mirrors | Generated copies per runtime | Regenerate | Criterion 4 |
| `.skilled/commands/README.txt` | The command index | Add rows | Criterion 4 |

Required inventories:
- Every doctor index that lists commands: `rg -n "/doctor:git" .skilled/commands` names the places a new command must also appear.
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
| Unit | The script's leg verdicts and repair lines, with each leg's command stubbed | `node --test` |
| Contract | The route and read-only declaration | `route-validate.sh` |
| Copy runs | S-1 pristine, S-2 stale, S-3 unprovisioned | The script in throwaway copies |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 on origin/main | Internal | Met: 001 is on origin/main | The repair texts the script prints do not exist yet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `route-validate.sh` or the mirror checks fail after the merge.
- **Procedure**: Revert this phase's commits and rerun the mirror sync.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001 on origin/main | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Worktree and baselines |
| Core Implementation | Med | Command, route, assets, script and test |
| Verification | Med | Copy runs and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines of `route-validate.sh`, `run-all.sh` and the mirror checks recorded

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the runtime mirror sync and `route-validate.sh`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
