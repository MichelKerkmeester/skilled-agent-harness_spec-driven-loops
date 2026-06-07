---
title: "Implementation Plan: deep-loop-runtime utilization hardening"
description: "Three targeted fixes across the deep skill family: deep-improvement atomic state safety, deep-review loop-lock, deep-context executor-audit env code enforcement — each reusing existing runtime primitives with minimal diff."
trigger_phrases:
  - "deep-loop-runtime utilization plan"
  - "runtime hardening plan"
  - "deep-improvement atomic writes plan"
  - "deep-review loop-lock plan"
  - "fanout-run executor-audit"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/003-runtime-feature-utilization"
    last_updated_at: "2026-06-06T23:59:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 plan for completed cross-skill optimization"
    next_safe_action: "Memory save; packet status Complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:21f084a2955d99a9dfb62e715e4564513164ec612ad6122518ce1ba3ac9e1663"
      session_id: "dlr-135-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "multi-seat-dispatch.cjs is a no-spawn model-agnostic primitive; fanout-run.cjs is the real spawn site"
      - "loop-lock YAML pattern confirmed from deep-research auto/confirm YAMLs"
---
# Implementation Plan: deep-loop-runtime utilization hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS (reduce-state, fanout-run), YAML (review command assets), TypeScript (vitest tests) |
| **Framework** | deep-loop-runtime (shared `jsonl-repair`, `atomic-state`, `executor-audit` libs) |
| **Storage** | JSONL state files (reduce-state output), lock files (deep-review loop-lock) |
| **Testing** | vitest (fanout-run +4 tests), node --check, fixture smoke |

### Overview

A cross-skill audit found three runtime-feature gaps in the deep skill family. This plan records the implementation of three targeted fixes — each consuming a runtime primitive that already existed but was not wired at the right call site — plus five deliberate non-fix ADRs validated by an architect consult and two independent confidence-gate audits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit research complete; three actionable gaps identified
- [x] cli-opencode architect consult completed (deepseek-v4-pro prioritization)
- [x] Two parallel opus confidence-gate audits completed
- [x] Non-fix decisions validated before implementation

### Definition of Done
- [x] All three fixes implemented and verified
- [x] Tests passing (runtime 291/291, council 23/23)
- [x] `node --check` on all edited .cjs files
- [x] Fixture smoke confirms `repaired=true, source=runtime`, no temp leak
- [x] Five non-fix ADRs documented in `decision-record.md`
- [x] Spec packet `validate.sh --strict` PASSED (0/0)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Each fix is a targeted call-site wire-up of an existing runtime primitive — no new abstractions, no new MCP tools, no shared-state changes.

### Key Components

- **`repairJsonlTail`** (`deep-loop-runtime/lib/jsonl-repair`): truncates and repairs a JSONL file whose tail was corrupted by a mid-write interrupt. deep-improvement's `reduce-state.cjs` calls this before reading the state log.
- **`writeStateAtomic`** (`deep-loop-runtime/lib/atomic-state`): writes to a temp file then renames atomically. deep-improvement's `reduce-state.cjs` calls this for all output writes.
- **Loop-lock fields** (`step_acquire_lock`, `step_release_lock`, `lock_file`): YAML fields consumed by the deep-loop-runtime command executor. Added to deep-review's auto/confirm YAMLs, mirroring the pattern deep-research already uses.
- **`buildExecutorDispatchEnv`** (`deep-loop-runtime/lib/executor-audit` or adjacent): assembles the spawn-env map including the recursion-guard env var. Called by `fanout-run.cjs` at the CLI-seat spawn site.

### Data Flow

```
deep-improvement reduce-state run
  → repairJsonlTail(stateLog) → repaired JSONL → reduce → writeStateAtomic(output)

deep-review loop (concurrent attempt)
  → step_acquire_lock → (blocked until released) → safe single-writer run
  → step_release_lock

fanout-run.cjs CLI-seat spawn
  → buildExecutorDispatchEnv() → env map → spawnSync(cmd, args, { env: mergedEnv })
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs` | deep-improvement state reducer | import + call runtime repair/atomic | node --check; fixture smoke `repaired=true` |
| `deep_start-review-loop_auto.yaml` | deep-review auto workflow | add loop-lock fields | YAML parse; matches deep-research pattern |
| `deep_start-review-loop_confirm.yaml` | deep-review confirm workflow | add loop-lock fields | YAML parse; matches deep-research pattern |
| `fanout-run.cjs` | CLI-seat spawn orchestrator | call `buildExecutorDispatchEnv` | node --check; 4 new vitest tests |
| `fanout-run.vitest.ts` | fanout-run unit tests | +4 env assertion tests | 291/291 (or +4) |

Required inventories:
- Same-class producers of JSONL state: `rg -n "writeFileSync|appendFileSync" .opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs`.
- Consumers of `step_acquire_lock`: `rg -n "step_acquire_lock" .opencode/commands/deep/assets/` (confirm only deep-research has it pre-fix).
- `buildExecutorDispatchEnv` call sites: `rg -n "buildExecutorDispatchEnv" .opencode/skills/deep-loop-runtime/` (confirm fanout-run was missing pre-fix).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and Triage

- [x] Sweep each skill for runtime feature utilization (code-enforced vs prose vs unused)
- [x] Identify the three actionable gaps
- [x] cli-opencode architect consult (deepseek-v4-pro) for prioritization
- [x] Two parallel opus confidence-gate audits to validate non-fix decisions

### Phase 2: Fix Implementation

- [x] Fix 1: deep-improvement `reduce-state.cjs` — import `repairJsonlTail` + `writeStateAtomic`
- [x] Fix 2: deep-review loop-lock — add fields to both auto/confirm YAMLs
- [x] Fix 3: deep-context executor-audit — wire `buildExecutorDispatchEnv` in `fanout-run.cjs`

### Phase 3: Verification

- [x] `node --check` all edited .cjs files
- [x] Fixture smoke: `repaired=true, source=runtime`, no temp leak; 4/4 reduce-state tests
- [x] fanout-run vitest: 291/291; +4 new tests pass
- [x] Council suite: 23/23 (no regression)
- [x] Five non-fix ADRs authored in `decision-record.md`
- [x] Packet `validate.sh --strict` PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | All edited .cjs files | `node --check` |
| Unit | `repairJsonlTail` import, `writeStateAtomic` call, no temp leak, `repaired=true` | fixture smoke + 4/4 reduce-state tests |
| Unit | fanout-run env set on spawn, inline fallback, no leak, `buildExecutorDispatchEnv` path | vitest (fanout-run.vitest.ts +4) |
| Regression | All runtime tests unaffected | vitest 291/291 |
| Regression | Council suite unaffected | vitest 23/23 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-loop-runtime/lib/jsonl-repair` (`repairJsonlTail`) | Internal | Green | reduce-state fallback activates; behavior identical |
| `deep-loop-runtime/lib/atomic-state` (`writeStateAtomic`) | Internal | Green | reduce-state inline fallback activates |
| `deep-loop-runtime/lib/executor-audit` (`buildExecutorDispatchEnv`) | Internal | Green | fanout-run spawns without the recursion-guard env |
| deep-research auto/confirm YAMLs as loop-lock template | Internal | Green | Must read before patching review YAMLs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the three fixes causes a test regression or a runtime behavioral change.
- **Procedure per fix**:
  1. `reduce-state.cjs`: revert the `repairJsonlTail`/`writeStateAtomic` import and call; restore hand-rolled pattern. No state loss (outputs are unchanged).
  2. Review YAMLs: remove `step_acquire_lock`, `step_release_lock`, `lock_file` fields. No state files affected.
  3. `fanout-run.cjs`: remove the `buildExecutorDispatchEnv` call and the env merge. Spawn env reverts to the previous shape; recursion guard is prose-only again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit + triage) ──────────────► Phase 2 (Fixes) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit + triage | None | All fixes |
| Fix 1 (reduce-state) | Audit | Verify |
| Fix 2 (review lock) | Audit | Verify |
| Fix 3 (fanout-run) | Audit | Verify |
| Verify | All fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit + triage + consult | Med | 3-4 hours |
| Fix implementation (3 fixes) | Low | 1-2 hours |
| Verification + ADR authoring | Med | 2-3 hours |
| **Total** | | **6-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Inline fallback paths confirmed in both reduce-state and fanout-run
- [x] Loop-lock fields confirmed present-and-parseable in both review YAMLs
- [x] All .cjs files pass `node --check` before claiming done

### Rollback Procedure
1. Revert `reduce-state.cjs` imports and calls to the pre-fix hand-rolled pattern.
2. Remove `step_acquire_lock`, `step_release_lock`, `lock_file` from both review YAMLs.
3. Remove the `buildExecutorDispatchEnv` call and env merge from `fanout-run.cjs`; remove the 4 new tests.
4. Run `vitest run` to confirm suite returns to the pre-fix count.

### Data Reversal
- **Has data migrations?** No — all changes are code/config only. No schema or persistent state touched.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────────┐     ┌────────────────────────┐
│   Phase 1: Audit       │────►│   Phase 2: 3 Fixes     │
│   (consult + audits)   │     │   (parallel, each       │
└────────────────────────┘     │    independent)         │
                               └────────────┬───────────┘
                                            │
                               ┌────────────▼───────────┐
                               │   Phase 3: Verify      │
                               │   (tests + ADRs +      │
                               │    validate.sh)        │
                               └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Audit research | None | Gap list | All fixes |
| Architect consult | Gap list | Prioritized non-fix list | ADR authoring |
| Fix 1: reduce-state | Audit | Atomic state writes | Fixture smoke |
| Fix 2: review YAMLs | Audit, deep-research template | Loop-lock enforcement | — |
| Fix 3: fanout-run | Audit, `buildExecutorDispatchEnv` path | Code-enforced env guard | +4 vitest tests |
| decision-record.md | Consult + parallel audits | 5 non-fix ADRs + site-choice ADR | Packet complete |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Audit + consult + parallel audits** — 3-4 hours — CRITICAL (gates non-fix triage)
2. **Fix 1: reduce-state atomic safety** — 30-60 min — CRITICAL (P0 safety gap)
3. **Fix 2: deep-review loop-lock** — 15-30 min — CRITICAL (P0 race condition)

**Total Critical Path**: ~5 hours

**Parallel Opportunities**:
- Fix 2 (review YAMLs) and Fix 3 (fanout-run) are independent and can run in parallel after the audit.
- The two confidence-gate audits ran as parallel opus sessions.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit + consult + audits done | Gap list finalized; non-fix decisions validated | Phase 1 |
| M2 | Three fixes implemented | `node --check` passes; YAML parses; 4 new tests written | Phase 2 |
| M3 | Verification complete | 291/291 runtime tests; 23/23 council; fixture smoke green; `validate.sh --strict` PASSED | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-S01: All three fixes reuse existing runtime primitives with no new abstractions

**Status**: Accepted

**Context**: The audit found three gaps, all of which had already-existing runtime primitives that addressed them (`repairJsonlTail`, `writeStateAtomic`, loop-lock fields, `buildExecutorDispatchEnv`). The question was whether to wrap them in new abstractions or call them directly.

**Decision**: Call them directly — no new wrappers, no new helper modules. The runtime primitives are stable and already tested; new wrappers add indirection without benefit.

**Consequences**: Each fix is a minimal diff at the exact call site, easily reviewable and easily reverted.

**Alternatives Rejected**:
- A unified "runtime safety wrapper" module: premature abstraction for three independent call sites.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (full set in decision-record.md)
-->
