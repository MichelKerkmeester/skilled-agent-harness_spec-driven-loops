---
title: "Implementation Plan: B2 Guarded data-quality Route on /doctor [template:level_2/plan.md]"
description: "Add a diagnostic-default data-quality route to /doctor that applies safe-class fixes only behind --confirm, reusing the B1 dq-engine and the frozen fixClass registry."
trigger_phrases:
  - "doctor data quality route plan"
  - "guarded dq route implementation"
  - "doctor confirm dry-run plan"
  - "dq-engine consumer route"
  - "route validate manifest plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/002-retroactive-automation/012-doctor-dq-route"
    last_updated_at: "2026-07-04T17:12:09.850Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored plan.md for the B2 doctor dq route scaffold"
    next_safe_action: "Build the route asset once the B1 dq-engine seam lands"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/doctor_code-graph.yaml"
      - ".opencode/commands/doctor/assets/doctor_memory.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-phase-author"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the route declares mutates from the first commit or add-only until the apply path is wired"
    answered_questions:
      - "The route consumes the B1 dq-engine and never implements a second detector"
---
# Implementation Plan: B2 Guarded data-quality Route on /doctor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML route assets plus the TypeScript B1 dq-engine, Python route-validate |
| **Framework** | The `/doctor` argv router defined under `.opencode/commands/doctor/` |
| **Storage** | None for this route, it reads the authored docs and the two JSONs and forbids the databases |
| **Testing** | `route-validate.py` plus a default run and a confirm run on a scratch packet |

### Overview
This route adds a `data-quality` front door to `/doctor` that runs report-only by default and applies safe-class fixes only behind `--confirm`. It calls the same B1 `dq-engine.runDetectors(target, opts)` with `opts.allowFixClass` pinned to `['safe']` so the interactive door and the scheduled sweep can never diverge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Consumer route over a shared engine. The route is a thin YAML workflow that delegates detection and safe-apply to the B1 dq-engine, it owns no scoring logic of its own.

### Key Components
- **`doctor_data-quality.yaml`**: The route asset, modeled on `doctor_code-graph.yaml`, with a diagnostic-default Phase A, a pre-apply approval gate and the `--dry-run` and `--confirm` flags.
- **`_routes.yaml` row**: The manifest row that registers the route with target, yaml, setup_vars, allowed_flags, mutating, gate3_location, mcp_tools and trigger_phrases.
- **`validate_targets` block**: The inverted form of `doctor_memory.yaml`, it allows the authored docs and the two JSONs and forbids the databases.

### Data Flow
The operator runs `/doctor data-quality [target]`. The router loads the route asset, resolves the target against `validate_targets`, then calls `dq-engine.runDetectors` in report mode. With `--confirm` the route halts at the approval gate, then calls the engine in safe-apply mode bounded to `['safe']`. With `--dry-run` it prints the would-apply set and applies nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/doctor/_routes.yaml` | Owns the route manifest, nine routes today | update | `route-validate.py` exits 0 with the data-quality row present |
| `.opencode/commands/doctor/assets/doctor_data-quality.yaml` | Does not exist yet, will own the route workflow | create | grep finds no parallel scoring logic, only a dq-engine call |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Owns the validate_targets shape this route inverts | not a consumer | the route mirrors its allow and forbid shape, never edits it |
| B1 `dq-engine` | Owns detectors and the frozen fixClass registry | not a consumer | the route calls runDetectors, grep finds no duplicate detector |

Required inventories:
- Same-class producers: `rg -n 'mutating|validate_targets|allowed_flags' .opencode/commands/doctor/_routes.yaml .opencode/commands/doctor/assets`.
- Consumers of changed symbols: `rg -n 'data-quality|dq-engine|runDetectors' .opencode/commands/doctor --glob '*.yaml' --glob '*.py' --glob '*.md'`.
- Matrix axes: the three flag states are neither-flag, confirm-only and dry-run-with-confirm, each needs a row before completion.
- Algorithm invariant: INV-1 holds, an authored-body fix is never `safe`, so this route never applies one regardless of flags.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the B1 dq-engine seam exposes `runDetectors(target, opts)` with an `allowFixClass` option
- [ ] Read `doctor_code-graph.yaml` and `doctor_memory.yaml` as the precedent shapes
- [ ] Read `route-validate.py` to capture the manifest assertions before authoring

### Phase 2: Core Implementation
- [ ] Author `doctor_data-quality.yaml` with a diagnostic-default Phase A and an approval gate before any apply phase
- [ ] Define `validate_targets` as the inverted `doctor_memory.yaml`, allow the docs and the two JSONs, forbid the databases
- [ ] Wire the route to call `dq-engine.runDetectors` with `allowFixClass` pinned to `['safe']`
- [ ] Append the `data-quality` row to `_routes.yaml` and register it in `speckit.md` if the router enumerates targets

### Phase 3: Verification
- [ ] Run `route-validate.py` and confirm exit 0 with the data-quality row
- [ ] Run a default run and a confirm run on a scratch packet, confirm report-only versus gated safe-apply
- [ ] Confirm an apply against a DB path halts with the mutation-violation error
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The dq-engine runDetectors safe-apply path | The B1 engine test suite |
| Integration | The route manifest row and the three flag states | `route-validate.py`, scratch-packet runs |
| Manual | The approval gate abort and the DB-path halt | Browser-free terminal runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| B1 dq-engine and the frozen fixClass registry | Internal | Red | No engine to call, the route cannot apply a safe fix |
| `route-validate.py` manifest assertions | Internal | Green | A malformed route row fails CI |
| `doctor_code-graph.yaml` and `doctor_memory.yaml` precedents | Internal | Green | Without the shapes the route asset has no model to mirror |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The route applies a fix the engine should have classed unsafe, or `route-validate.py` fails after the manifest append.
- **Procedure**: Remove the `data-quality` row from `_routes.yaml`, delete `doctor_data-quality.yaml`, revert the `speckit.md` registration, then re-run `route-validate.py` to confirm the nine-route baseline.
<!-- /ANCHOR:rollback -->

---


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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Remove the `data-quality` row from `_routes.yaml`
2. Delete `doctor_data-quality.yaml` and revert the `speckit.md` registration
3. Re-run `route-validate.py` and confirm the nine-route baseline passes
4. No stakeholder notice needed, the route is operator-facing and was never user-default

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the route writes nothing outside packet-local scratch in report mode and applies only safe-class fixes under confirm
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
