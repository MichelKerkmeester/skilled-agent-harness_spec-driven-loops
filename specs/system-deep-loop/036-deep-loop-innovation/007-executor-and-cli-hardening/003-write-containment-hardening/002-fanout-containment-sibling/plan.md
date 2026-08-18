---
title: "Implementation Plan: fanout containment sibling lineage scope"
description: "Add an unattributableDirs option to the write-containment guard and wire the fan-out worker to pass sibling lineage dirs, so a leaf tripping containment never reverts a sibling's concurrent artifacts."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/002-fanout-containment-sibling"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Filled plan with the landed sibling-exclusion approach"
    next_safe_action: "Commit the packet doc closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-042-fanout-containment-sibling"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: fanout containment sibling lineage scope

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (deep-loop runtime lib) + Node CJS (fan-out worker) |
| **Framework** | None; plain modules under `runtime/lib/deep-loop` and `runtime/scripts` |
| **Storage** | None; git working-tree state is the only source read |
| **Testing** | Vitest (`runtime/tests/unit/write-containment.vitest.ts`) |

### Overview
Teach the write-containment guard to treat sibling lineage directories as unattributable, so a leaf that trips the guard under a concurrent fan-out no longer reverts a sibling's in-flight artifacts. The containment surface gains an `unattributableDirs` option resolved with the same repo-relative rules as `artifactDir`; the fan-out worker computes its sibling lineage dirs and passes them on both the pre-dispatch snapshot and the post-dispatch enforce call.
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
- [x] Tests passing (`vitest` 22/22)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure functions over git working-tree state; the worker owns orchestration, the lib owns attribution.

### Key Components
- **`resolveArtifactScope` (`write-containment.ts:264`)**: Resolves the leaf's artifact dir and each `unattributableDirs` entry to repo-relative POSIX subpaths, dropping anything outside the worktree.
- **`snapshotOutOfScopeDirtyPaths` / `detectNewOutOfScopeViolations`**: Skip any path under an unattributable dir before comparing against the pre-dispatch baseline.
- **`fanout-run.cjs` worker (`fanout-run.cjs:2605`)**: Computes `siblingLineageDirs` and passes the exclusion set on both containment calls.

### Data Flow
The worker snapshots out-of-scope dirty paths before dispatch, runs the leaf, then enforces containment against the same baseline. Both the snapshot and the enforce receive `unattributableDirs`, so sibling writes never enter detection and are never reverted; genuine repository writes outside every excluded dir are still caught and restored from HEAD.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `write-containment.ts` (helper) | Owns attribution and revert | Update: add `unattributableDirs` scope + exclusion | `write-containment.ts:264-293`; `vitest` 22/22 |
| `fanout-run.cjs` (sole consumer) | Calls snapshot + enforce | Update: compute + pass sibling dirs | `fanout-run.cjs:2605-2669` |
| `write-containment.vitest.ts` (tests) | Regression coverage | Update: concurrent-sibling block | `write-containment.vitest.ts:459` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Attribution bug reproduced from the three-lane fan-out failure
- [x] Sole containment consumer confirmed (`fanout-run.cjs`)
- [x] `unattributableDirs` contract defined

### Phase 2: Core Implementation
- [x] `unattributableDirs` option + repo-relative resolution
- [x] Exclusion applied in snapshot and detect
- [x] Worker computes sibling dirs and passes on both calls

### Phase 3: Verification
- [x] Concurrent-sibling regression block added
- [x] Edge cases handled (outside-root, no-op, genuine-repo)
- [x] Documentation updated (spec/plan/tasks/summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Containment attribution + exclusion resolution | Vitest |
| Regression | Concurrent sibling lineages survive a leaf breach | Vitest (`write-containment.vitest.ts:459`) |
| Manual | Original three-lane fan-out failure observation | Live fan-out run (pre-fix) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| write-containment guard | Internal | Green | None; option is additive and default-off when unset |
| Vitest runner | Internal | Green | Cannot verify regression coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A genuine repository write escapes detection, or a real sibling regression appears.
- **Procedure**: Revert `a3c9f03c51` and `568aa17a40`; the option is additive so removal restores prior behavior.
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
| Setup | Low | ~1 hour |
| Core Implementation | Medium | ~3 hours |
| Verification | Low | ~1 hour |
| **Total** | | **~5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; backup not required
- [x] Option is additive and default-off when unset
- [x] Containment advisories logged to the fan-out status ledger

### Rollback Procedure
1. Stop passing `unattributableDirs` from the worker (removes the exclusion).
2. Revert `a3c9f03c51` and `568aa17a40` if the guard behavior itself must be restored.
3. Re-run `vitest run tests/unit/write-containment.vitest.ts` to confirm state.
4. No user-facing surface; no stakeholder notification needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

