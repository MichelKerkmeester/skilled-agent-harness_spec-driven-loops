---
title: "Implementation Plan: Registry advisorRouting block + CI drift-guard"
description: "Implementation Plan for phase 002: add the advisorRouting block to mode-registry.json, a --dump-routing-maps flag, export DEEP_MODE_BY_CANONICAL, and a drift-guard vitest; keep the parity fixtures green."
trigger_phrases:
  - "advisorRouting drift guard plan"
  - "phase 002 plan"
  - "C-plus routing implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-parent-nested-skill-pattern/002-advisor-routing-drift-guard"
    last_updated_at: "2026-06-15T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan for the C-plus routing change"
    next_safe_action: "Validate and commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-002-advisor-routing-drift-guard-implementationplan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Registry advisorRouting block + CI drift-guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registry, Python (`skill_advisor.py`), TypeScript (`aliases.ts`), Vitest |
| **Framework** | `deep-loop-workflows` registry + `system-skill-advisor` scorer |
| **Storage** | `.opencode/skills/deep-loop-workflows/mode-registry.json`, advisor `lib/scorer/` + `scripts/` + `tests/` |
| **Testing** | `vitest run` (drift-guard + the two routing-parity suites) |

### Overview
Purely additive C-plus implementation. The registry gains a declarative `advisorRouting` block; the advisor gains a read-only `--dump-routing-maps` flag and one `export`; a new vitest asserts the hardcoded maps equal the registry projection. No routing behavior changes and the advisor never reads the registry at runtime.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase-2 research recommendation available (`../research/research.md`).
- [x] Ground truth verified (the real maps, alias groups, test harness).

### Definition of Done
- [x] All 8 modes carry a valid `advisorRouting` block.
- [x] Registry projection equals the Python + TS maps (drift-guard green).
- [x] Existing parity fixtures stay green.
- [x] One `graph-metadata.json` under `deep-loop-workflows`.
- [x] `validate.sh --strict` green on this phase (close-out).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative-source + CI guard (C-plus). The registry describes routing; a test enforces that the runtime's hardcoded maps match. The advisor runtime is untouched (no import-time registry read).

### Parallel Groups (worker fleet)
- **None.** Implemented directly by the orchestrator with the vitest suite as the gate.

### Read/Write Split
Orchestrator edits the registry/advisor/test and runs `vitest run` + `--dump-routing-maps` to verify.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the real Python/TS maps + alias groups + test harness against source.

### Phase 2: Core Implementation
- [x] T1 Add the per-mode `advisorRouting` block + top-level contract legend. (`mode-registry.json`) — _verify:_ JSON parses; projection equals the real maps.
- [x] T2 Add the `--dump-routing-maps` flag (arg + handler). (`skill_advisor.py`) — _verify:_ flag emits the maps; file parses.
- [x] T3 Export `DEEP_MODE_BY_CANONICAL`. (`aliases.ts`) — _verify:_ importable by the test; no consumer clash.
- [x] T4 Write the drift-guard vitest. (`tests/routing-registry-drift-guard.vitest.ts`) — _verify:_ 5 assertions pass.

### Phase 3: Verification
- [x] `vitest run` over the drift-guard + both parity suites (19 tests).
- [x] One-identity check (1 `graph-metadata.json`).
- [x] `validate.sh --strict` on this phase folder (close-out).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Drift-guard | Registry vs hardcoded maps | `routing-registry-drift-guard.vitest.ts`: projection equality (Python + TS) + alias-set equality + coverage + default-mode |
| Regression | Existing routing | `routing-parity-deep-skills/council.vitest.ts` stay green (14 invariants) |
| Structural | Spec docs | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../research/research.md` | Internal | Complete | Defines the model + the C-plus mechanism |
| Advisor scorer + scripts | Internal | Stable | The maps + alias groups guarded |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: drift-guard or a parity fixture fails, or `validate.sh --strict` errors.
- **Procedure**: `git restore` `mode-registry.json`, `skill_advisor.py`, `aliases.ts`; delete the new test. The change is additive; no data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | research | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Phase 4 formalization |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | verify maps + harness |
| Core Implementation | Medium | 4 files, additive |
| Verification | Low | vitest + strict validate |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Registry projection verified equal to the real maps before writing the test.
- [x] One `graph-metadata.json` confirmed (no new advisor identity).

### Rollback Procedure
1. **Drift-guard fails on legacyAliases.** -> Re-transcribe from `SKILL_ALIAS_GROUPS`; the guard compares order-insensitive sets.
1. **A parity fixture regresses.** -> `git restore` the advisor files; the change is additive so a clean restore returns to baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git restore` the touched files; no data migration.

<!-- /ANCHOR:enhanced-rollback -->
