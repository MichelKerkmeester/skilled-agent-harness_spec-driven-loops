---
title: "Implementation Plan: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi"
description: "Plan to add deterministic per-kind branches for cli-cursor/devin/pi to the single-executor path of the three auto loop YAMLs, reusing the fan-out command builder."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-executor-kind-routing"
    last_updated_at: "2026-08-27T09:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan; branches inserted and proven"
    next_safe_action: "Run whole-suite gates; commit"
---
# Implementation Plan: Deterministic Single-Executor Dispatch for cli-cursor/devin/pi

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | A single `--executor=cli-cursor/devin/pi` on an auto loop silently runs native |
| **Root cause** | `phase_main_loop`'s executor `branch_on` has no branch for those three kinds |
| **Change kind** | Add deterministic `if_cli_*` branches that dispatch per-iteration via `buildLineageCommand`, fail-loud |
| **Verification** | Stubbed end-to-end dispatch per kind; fail-loud negative control; both whole-suite gates |

### Overview
`fanout-run.cjs`'s `buildLineageCommand` already encapsulates each CLI's binary preflight, model allowlist, and headless write flags, and fails closed. The fix adds three explicit branches to the single-executor `branch_on` of the three auto loop YAMLs, each importing that builder (via `createRequire`), calling it with the iteration prompt, and dispatching through `runAuditedExecutorCommand` + write-containment — mirroring the existing `cli-codex` branch. Deterministic (the engine branches on the resolved kind), one source of truth for the CLI contract, and never native on a requested CLI.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed `buildLineageCommand` is exported and `require`-safe (main is guarded)
- [x] Confirmed the cursor/devin/pi adapters read only `options.env`/`options.cwd` (safe standalone reuse)

### Definition of Done
- [x] Three branches present in each of the three auto YAMLs; all parse
- [x] Stubbed dispatch prints the right `command` per kind; disallowed model fails loud
- [ ] Both whole-suite gates show no new failures vs baseline

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic per-kind dispatch reusing a shared command factory. The single-executor `branch_on` is the deterministic decision point (the engine matches the resolved kind); the branch body defers all CLI-specific knowledge to `buildLineageCommand`, so the enforced allowlist and headless flags are never re-derived and never drift from the fan-out path.

### Key Components
- **`phase_main_loop` executor `branch_on`** — gains `if_cli_cursor/devin/pi`.
- **`buildLineageCommand` (fanout-run.cjs)** — the reused per-kind command factory; fails closed.
- **`runAuditedExecutorCommand` + `enforceWriteContainment`** — the shared dispatch + containment used by the `cli-codex` branch.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm
- [x] Prove `buildLineageCommand` reuse yields the right binary per kind and fails loud on a bad model
- [x] Map each YAML's executor field (`.kind`/`.type`), dispatchId prefix, and insertion boundary

### Phase 2: Implement
- [x] Insert the three branches into `deep-review-auto` (field `.kind`, prefix `review`)
- [x] Insert into `deep-research-auto` (field `.type`, prefix `research`) and `deep-alignment-auto` (field `.kind`, prefix `alignment`)

### Phase 3: Verify
- [x] All three YAMLs parse; stubbed end-to-end dispatch per kind; fail-loud negative control
- [x] Targeted auto-YAML vitest tests pass
- [ ] Both whole-suite gates: no new code-caused failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| End-to-end (stubbed) | Each inserted branch builds + dispatches the right CLI command | node `--input-type=module` |
| Negative control | Disallowed model throws before dispatch | node |
| Structure | YAML parses; targeted auto-YAML tests | python yaml + vitest |
| Regression | Both whole-suite gates vs baseline | vitest + `run-node-tests.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `buildLineageCommand` export | Internal | Green | The reused command factory |
| The three auto loop YAMLs | Internal | Green | The dispatch surface |
| Both whole-suite gates | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A branch mis-dispatches or a whole-suite regression appears.
- **Procedure**: `git revert` the commit — the change is additive YAML branches only; reverting restores the prior (silent-native) behavior. No data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm) ──> Phase 2 (Implement) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | None | Implement |
| Implement | Confirm | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm | Medium | ~1.5 hours (dispatch-model investigation) |
| Implement | Medium | ~1 hour (parameterized insertion across 3 YAMLs) |
| Verify | Low | ~40 min (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirmed the change is additive (no existing branch touched)
- [x] Both-gate baselines recorded

### Rollback Procedure
1. `git revert` the commit.
2. Re-parse the three YAMLs to confirm the prior structure.

### Data Reversal
- **Has data migrations?** No — additive YAML branches only.

<!-- /ANCHOR:enhanced-rollback -->
