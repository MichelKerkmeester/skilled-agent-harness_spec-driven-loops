---
title: "Implementation Plan: Phase 4: deep-loop"
description: "Audit `/doctor:speckit deep-loop` against this checkout, then apply the evidence-backed verdict: keep the route and correct its workflow, route entry and presentation text."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: deep-loop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command assets, a YAML workflow and route manifest, Node.js runtime scripts, SQLite graph databases |
| **Framework** | The `/doctor:speckit` router over `.skilled/commands/doctor/` |
| **Storage** | SQLite deep-loop coverage and council graph databases; the coverage database is absent in this checkout |
| **Testing** | `route-validate.sh`, `yaml.safe_load`, the doctor script tests, retired-name `rg` scans, `validate.sh --strict` |

### Overview

Audit first, then apply. The inventory, the safe probe run and the line-numbered source reads establish what `/doctor:speckit deep-loop` actually names on this checkout; the verdict that evidence supports is `fix`, and the fix corrects the workflow, the route entry and the presentation text without changing the subsystem the doctor inspects.
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

Other: audit → verdict → apply, over the command's own asset set. The doctor has no runtime of its own, so the change is confined to the text (one workflow YAML, the route manifest entry, the presentation) plus the shared router wording.

### Key Components

- **`speckit.md`**: the `/doctor:speckit` router; resolves the `deep-loop` target token.
- **`_routes.yaml` deep-loop entry**: flags, mutation class, gate location and script invocations.
- **`doctor-deep-loop.yaml`**: the workflow asset the verdict corrects.
- **`doctor-speckit-presentation.txt`**: the visible menu, symptom help, manifest row and scope prompt.
- **`status.cjs`, `query.cjs`, `convergence.cjs`**: the live graph checks the workflow calls; inspected and recorded, not changed.

### Data Flow

The router resolves `deep-loop` through the route manifest, binds the workflow and runs its discovery → analysis → recommendation → report phases. The audit read those files with line-numbered reads, probed every named path and script, recorded the safe probes in `scratch/doctor-run.log`, and wrote the verdict and minimal edits in `scratch/proposal.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` (consumer) | Defines the target checks, staleness signals, mutation boundaries and output contract | update — retired `deep_loop_graph_*` call names replaced by `status.cjs`/`query.cjs`/`convergence.cjs`; stale local contract files replaced by the runtime script interface; the `validate_targets` helper name removed; state-log path and command corrected; the write boundary reworded; the forbidden `doctor-*.yaml` glob fixed | `python3 yaml.safe_load` → `YAML_OK`; `route-validate.sh` → exit 0 |
| `.skilled/commands/doctor/_routes.yaml` deep-loop entry (producer) | Declares the route's flags, mutation class, gate location and script invocations | update — gate location now `<active-spec-folder>/scratch/...`; query invocation gains `--limit 50`; convergence invocation gains `--iteration` and `--persist-snapshot false` | `route-validate.sh` → exit 0, `I1` and `J1` PASS |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` (consumer) | Renders the menu, symptom help, manifest row and the Deep-Loop Scope prompt | update — menu, help and manifest wording include the council graph; a Deep-Loop Scope prompt was added | `route-validate.sh` `J1` presentation parity PASS |
| `status.cjs`, `query.cjs`, `convergence.cjs` and the coverage/council database adapters (producer, inspected subsystem) | Supply graph status, query and convergence, and lazily create storage, schema and observability rows | unchanged — recorded finding: no read-only or dry-run flag, and the adapters can initialize or migrate storage | `rg` for `--read-only|--dry-run` → no matches; source reads recorded in `scratch/reality-check.md` |

Required inventories:
- Same-class producers: `rg -n 'deep_loop_graph_status\(|deep_loop_graph_query\(|deep_loop_graph_convergence\(' .skilled/commands/doctor` returns no matches in the edited deep-loop files; the retired names survive only in `doctor-update.yaml`, outside this target. `deep_loop_graph_upsert` remains only as the forbidden legacy name in the deep-loop workflow's invariant, validator step and halt conditions.
- Consumers of changed symbols: the router `speckit.md`, the route manifest and all three presentation displays; `route-validate.sh` `I1` (every script invocation resolves) and `J1` (route, router table and presentations are in parity) confirm they agree.
- Matrix axes: graph scope (`research`, `review`, `council`, `both`, `all`) × artifact state (missing coverage database, present council database, empty packet source folders) × check class (status, query, convergence). The inventory covers each axis row and the safe probes exercise the script argument validation.
- Algorithm invariant: a missing graph database is reported as not built, never as a pass. The coverage database's absence is the adversarial case, and the workflow reports it by name.
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
| Parse | The edited workflow and route manifest | `python3 -c 'import yaml; yaml.safe_load(...)'` → `YAML_OK` |
| Route and presentation | Route manifest, router table, all three presentation displays | `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, 9 routes, 2 informational warnings; `I1` and `J1` PASS |
| Retired-name scan | Edited doctor files | `rg` for `deep_loop_graph_status(`, `deep_loop_graph_query(` and `deep_loop_graph_convergence(` → no matches |
| Shared doctor gates | Command catalog, mutation classes, route contract | catalog mirror → `STATUS=OK`; mutation-class guard → `GUARD PASS`; `skill-advisor-route-contract.test.cjs` passes |
| Packet validation | This phase's docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/004-deep-loop --strict` → `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A provisioned worktree | Internal | Green | The scripts the doctor calls cannot run |
| `.skilled/commands/doctor/_routes.yaml` and `route-validate.sh` | Internal | Green | The route change cannot be validated |
| Runtime scripts `status.cjs`, `query.cjs`, `convergence.cjs` | Internal | Green — all three present and resolved by `I1` | The workflow's graph checks cannot run |
| A read-only or dry-run flag on those scripts | Internal | Red — absent; recorded as a finding | A doctor run cannot promise it leaves no runtime state behind |
| Coverage database `deep-loop-graph.sqlite` | Internal | Red — absent in this checkout | The workflow reports it as not built rather than as missing code |
| Node.js and Python 3 for the gates | External | Green | The parse and route gates cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The corrected workflow, route entry or presentation wording proves wrong for the operator's scope set.
- **Procedure**: Restore the three changed files under `.skilled/commands/doctor/` (`assets/doctor-deep-loop.yaml`, `_routes.yaml`, `assets/doctor-speckit-presentation.txt`) and rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` to confirm exit 0. No runtime state was written by this phase, so no data reversal is needed.
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
| Inventory and verdict | Low | Source reads plus the safe probes |
| Apply the verdict | Med | One batch edit across the workflow, route entry and presentation |
| Verification | Low | Rerun the route, catalog, guard and test gates |
| **Total** | | **One focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; every changed file is tracked in git
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `git restore` the changed workflow, route manifest and presentation files.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and confirm exit 0.
3. Rerun `python3 yaml.safe_load` on the restored workflow and route manifest and confirm `YAML_OK`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
