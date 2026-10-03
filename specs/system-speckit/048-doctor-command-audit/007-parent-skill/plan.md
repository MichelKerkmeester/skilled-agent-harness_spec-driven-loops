---
title: "Implementation Plan: Phase 7: parent-skill"
description: "Audit `/doctor:speckit parent-skill` against this checkout, then apply the evidence-backed verdict: keep the route and align its workflow invariant, phase-0 order, checker documentation and presentation row with the checks that actually run."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: parent-skill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command assets, YAML workflows, Node.js and Bash doctor scripts |
| **Framework** | The OpenCode `/doctor:speckit parent-skill` route over `.skilled/commands/doctor/` |
| **Storage** | Files only — the workflow asset, the route manifest and the read-only audit scripts; no database |
| **Testing** | `node --check`, `python3 yaml.safe_load`, the two route-declared doctor commands, `route-validate.sh`, the command catalog mirror check and the spec validator |

### Overview
Audit first, then apply. The read-only run and a line-numbered source inventory establish what `/doctor:speckit parent-skill` actually names on this checkout; the verdict that evidence supports is `fix`, and the fix aligns the workflow invariant, the phase-0 activity order, the checker's documentation and the shared presentation row with the checks the checker runs.
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
Other: audit → verdict → apply, over the command's own asset set. The doctor has no runtime of its own, so the change is confined to the workflow YAML, the checker's documentation and the shared presentation row; the checks themselves are read-only.

### Key Components
- **`doctor-parent-skill.yaml`**: the workflow asset the route executes; the invariant, phase-0 activity order, upstream assets and output mapping the verdict updates.
- **`parent-skill-check.cjs`**: the read-only checker that runs the per-hub audit; its usage note, header and runtime label describe the checks and the advisory override.
- **`doctor-speckit-presentation.txt`**: the shared user-facing contract; its `parent-skill` subsystem row states what the audit covers.
- **`_routes.yaml` and `speckit.md`**: the route entry and router that order the fleet metadata gate before the per-hub audit; inspected, not changed here.

### Data Flow
The router resolves the `parent-skill` target and its `--dir` flag, then the workflow runs the route's two script invocations in order: the fleet metadata gate first, then the per-hub checker against the resolved hub directory. The workflow prints both reports and maps their exit codes to one status. The audit read that flow, recorded it in `scratch/reality-check.md` and `scratch/doctor-run.log`, and the verdict changed only the descriptive text around it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/assets/doctor-parent-skill.yaml` (consumer) | Defines the audit sequence, the invariant and the status mapping the operator reads | update — invariant, phase-0 order, upstream assets and output mapping | `python3 yaml.safe_load` → `YAML_OK`; the working-tree diff carries this file's change |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (producer) | Owns the checks, their severities and the runtime report | update — usage note, header and runtime label; check behavior unchanged | `node --check` → `NODE_SYNTAX_OK`; rerun exits 0 with "all hard invariants passed, 0 warnings" |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (consumer) | Renders the menu, help mapping and subsystem row the operator sees | update — the `parent-skill` row names routing manifests, root metadata, the router contract and version consistency | `route-validate.sh` J1 parity PASS, exit 0 |
| `.skilled/commands/doctor/_routes.yaml` (policy) | Declares the target, its `--dir` flag and the script order | unchanged — it already lists the fleet gate before the per-hub audit | `route-validate.sh` I1 PASS; the route block and its explanatory comment are unmodified |
| `.skilled/skills/system-deep-loop` (audited subsystem) | The default hub the audit inspects | unchanged — it is inspected, never edited | Parent audit exit 0, 0 warnings; the findings section records no defect |

Required inventories:
- Same-class producers: `scratch/reality-check.md` inventories every path, script, command, flag and variable the route and workflow name. The two producers are the fleet gate `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` and the per-hub checker `.skilled/commands/doctor/scripts/parent-skill-check.cjs`; both are present and both exit 0 on this checkout.
- Consumers of changed symbols: `doctor-speckit-presentation.txt` (the `parent-skill` row), `_routes.yaml` (the route entry and its script order) and `speckit.md` (the router). `route-validate.sh` passes script resolution (I1) and parity (J1), exit 0; the router table and all three presentation displays stay in parity.
- Matrix axes: check scope (fleet gate / per-hub audit) × exit-code path (0 / 1 / 2) × severity mode (strict default / `PARENT_HUB_CHECK_STRICT=0` advisory). The run exercised the 0 path for both checks; the 1 and 2 paths are the documented mappings in the workflow's output format.
- Algorithm invariant: a missing script, root or target is reported by name and a non-zero exit, never as a pass. The fleet gate ran without `--fix` so it reported `fixed=0`, and the parent audit reported every hard invariant rather than masking a failure behind the advisory override.
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
| Syntax | The checker script | `node --check .skilled/commands/doctor/scripts/parent-skill-check.cjs` → `NODE_SYNTAX_OK` |
| Asset parse | The workflow YAML | `python3 yaml.safe_load` → `YAML_OK` |
| Integration | Both route-declared invocations against the default hub | Fleet gate → `checked=14 passed=14 failed=0 fixed=0`, exit 0; parent audit → all hard invariants passed, 0 warnings, exit 0 |
| Route and presentation | Router manifest, router table and all three presentation displays | `route-validate.sh` → exit 0, "9 routes validated, 2 warnings", J1 parity PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A provisioned worktree | Internal | Green | The doctor scripts cannot run |
| `.skilled/commands/doctor/_routes.yaml` and its validator | Internal | Green | The route order and parity cannot be validated |
| Node.js | External | Green — v26.8.2 | Both route invocations fail |
| Python 3 with PyYAML | External | Green — Python 3.9.6 with PyYAML | `route-validate.sh` cannot parse the manifest |
| The audited hub `.skilled/skills/system-deep-loop` | Internal | Green | The audit cannot resolve its default target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The revised workflow contract, checker label or presentation row proves wrong for the operator.
- **Procedure**: `git restore` `.skilled/commands/doctor/assets/doctor-parent-skill.yaml`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and the `parent-skill` row in `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`, then rerun `route-validate.sh` and confirm exit 0. No runtime state was written, so no data reversal is needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Apply) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory and verdict | None | Apply |
| Apply the verdict | Inventory | Verify |
| Verify | Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory and verdict | Low | Source reads plus one read-only run of both route commands |
| Apply the verdict | Low | Three file edits: the workflow invariant, the phase-0 order, the checker labels and the presentation row |
| Verification | Low | Rerun both doctor commands, the route validator and the parse checks |
| **Total** | | **One focused session, applied in a shared batch** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; every changed file is tracked in git
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `git restore` the three changed files listed in the rollback plan.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and confirm exit 0.
3. Rerun `node .skilled/commands/doctor/scripts/parent-skill-check.cjs ".skilled/skills/system-deep-loop"` and confirm "all hard invariants passed, 0 warnings".

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

