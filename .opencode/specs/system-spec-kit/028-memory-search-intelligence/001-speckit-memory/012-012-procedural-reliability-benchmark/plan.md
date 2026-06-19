---
title: "Implementation Plan: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)"
description: "Sequencing and shared-infra dependencies for the Memory MCP procedural-reliability cluster. Plan only — the whole unit is benchmark-gated and PENDING. The critical path is: build the outcome/usefulness emitter, build the shared f64 Beta primitive + procedural adapter, run ONE benefit micro-benchmark, and only then promote reliability-recall; bad-pattern (schema migration), skill-induction (write-side risk), and version-reset (already-exists residual) follow with their own gates."
trigger_phrases:
  - "procedural reliability plan"
  - "outcome emitter prerequisite"
  - "beta posterior procedural adapter"
  - "procedural micro benchmark gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/012-012-procedural-reliability-benchmark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Sequence the benchmark-first procedural-reliability plan (emitter then Beta then benchmark)"
    next_safe_action: "Build the outcome/usefulness emitter prereq before any reliability fold"
    blockers:
      - "No execution-success emitter exists (only recommendation-acceptance captured)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server |
| **Subsystem** | `system-spec-kit/mcp_server/` (ranking, reconsolidation, causal-edges, adaptive signals) |
| **Storage** | SQLite (`memory_index`, `causal_edges`, `adaptive_signal_events`) + vector index |
| **Verification** | Vitest unit suites + `validate.sh --strict`; a net-new benefit micro-benchmark is the promotion gate |

### Overview
This plan does NOT authorize implementation — the entire procedural-reliability cluster is **benchmark-first and PENDING** (`research/iterations/iteration-021.md:14`). It records the *order* a future implementer must follow so no candidate is shipped as a free byproduct. The spine is: **(A)** build the missing outcome/usefulness emitter (the recall→task-success `'outcome'` signal that is barely emitted today), **(B)** build the shared bounded-Beta f64 primitive + a procedural adapter (the live integer scorer throws on fractional inputs), **(C)** run ONE benefit micro-benchmark to decide whether reliability-weighting out-earns the existing `access`/confirmation signals, and only **(D)** promote M-procedural-reliability-recall. The other three candidates each carry an independent gate: bad-pattern needs a `HAS_FAILURE` schema migration (or a `'deprecated'`/`contradicts` precedent + a full retrieval-filter-site audit), skill-induction is the heaviest BUILD with write-side corpus risk, and version-reset's mechanism already ships — only the reliability-reset-to-zero residual is net-new.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and PROXY-ONLY gate documented in spec.md
- [x] Each candidate carries a frozen research verdict + file:line citation
- [x] Shared-infra prerequisites identified (outcome emitter, f64 Beta primitive)
- [x] The micro-benchmark is named as the promotion gate
- [ ] An outcome/usefulness emitter exists (REQ-001) — NOT YET; blocks all builds

### Definition of Done (for a FUTURE implementation packet, not this re-plan)
- [ ] Outcome emitter emits `'outcome'` at >2 attributed call sites
- [ ] Shared f64 Beta primitive + procedural adapter unit-tested (cold-start 0.5, count-floor)
- [ ] Benefit micro-benchmark run; result decides reliability-recall promotion
- [ ] Per-candidate gates resolved or candidate kept PENDING with recorded reason
- [ ] `validate.sh --strict` green on this folder

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
GRAFT onto the existing chunk-save / reconsolidation-on-save hook + `adaptive_signal_events` — **do NOT adopt an episode model** [CONFIRMED: `research/iterations/iteration-018.md:16`]. Internal Memory is doc/chunk-granular; aionforge's immutable-episode capture↔consolidation split has no substrate here.

### Key Components
- **Outcome emitter** (`lib/feedback/feedback-ledger.ts` → `recordAdaptiveSignal('outcome', …)`): the missing recall→task-success signal source. Shared prerequisite for reliability-recall and the version-reset residual.
- **Bounded-Beta f64 primitive** (`lib/scoring/bayesian-scorer.ts` new export): `(α₀+s)/(α₀+β₀+s+f)`, cold-start `0.5`, count-floor; a procedural adapter consumes it as a recall multiplier. Shared with Advisor C4 (build once, wire twice — `01-go-candidates.md:65`).
- **Reliability fold** (`lib/ranking/adaptive-ranking.ts:346`): multiplies the procedural match score by the Beta-posterior mean once `'outcome'` data accrues.
- **Negative-memory tier / `HAS_FAILURE` edge** (`lib/storage/causal-edges.ts:21-28` + `lib/search/vector-index-schema.ts:1113-1115`): bad-pattern's host; needs a table-rebuild migration OR the `'deprecated'` tier + `contradicts` 0.8 dampener precedent.
- **Induction pass** (`lib/reconsolidation.ts:38,202-210`): a new reconsolidation action + a non-existent repetition counter + an induction-precision gate.

### Data Flow
```
recall hit / task signal → feedback-ledger → recordAdaptiveSignal('outcome', skillId, success)
                                                      │
                                                      ▼
                                    adaptive_signal_events ('access' | 'outcome' | 'correction')
                                                      │
                          ┌───────────────────────────┴───────────────────────────┐
                          ▼                                                         ▼
            bounded-Beta f64 primitive  ──(procedural adapter)──>  adaptive-ranking.ts:346
            (α₀+s)/(α₀+β₀+s+f), cold-start 0.5                     reliability × problem-match
                                                                            │
                                                                  (gated by micro-benchmark)
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 3b. AFFECTED SURFACES

| Surface | Candidate(s) | Mutation class | Note |
|---------|--------------|----------------|------|
| `lib/feedback/feedback-ledger.ts` | reliability-recall, version-reset | net-new emitter | Shared prereq (REQ-001) |
| `lib/scoring/bayesian-scorer.ts` | reliability-recall (+ Advisor C4) | additive f64 export | Integer scorer throws on fractional inputs |
| `lib/ranking/adaptive-ranking.ts:346` | reliability-recall | rank-fold | No-op until `'outcome'` data accrues |
| `lib/storage/causal-edges.ts:21-28`; `lib/search/vector-index-schema.ts:1113-1115,1781-1783` | bad-pattern | schema migration | `HAS_FAILURE` rejected at 2 layers |
| `lib/reconsolidation.ts:38,202-210,527-533` | skill-induction, bad-pattern | new action + counter | Write-side corpus risk |
| benchmark harness (net-new) | reliability-recall | add-only | Promotion gate (REQ-002) |

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> These phases are for a FUTURE implementation packet. This re-plan ships none of them.

### Phase A: Outcome/usefulness emitter (shared prerequisite)
- [ ] Confirm `feedback-ledger.ts` `FeedbackEventType` can be the canonical `'outcome'` source (or add a call site)
- [ ] Emit `'outcome'` with skill/memory attribution at >2 sites; verify it lands in `adaptive_signal_events`

### Phase B: Shared bounded-Beta primitive + procedural adapter
- [ ] Add f64 `(α₀+s)/(α₀+β₀+s+f)` export with cold-start `0.5` + count-floor (NOT the integer scorer)
- [ ] Procedural adapter exposes the posterior as a recall multiplier

### Phase C: Benefit micro-benchmark (promotion gate)
- [ ] Design the benchmark: reliability-weighting vs `access`/confirmation on accrued/synthetic outcomes
- [ ] Run it; record the delta; decide reliability-recall promotion (non-result keeps it PENDING)

### Phase D: M-procedural-reliability-recall fold
- [ ] Fold the Beta-posterior mean into `adaptive-ranking.ts:346` (only if Phase C earns it)

### Phase E: M-bad-pattern-negative-memory (independent gate)
- [ ] Decide: `HAS_FAILURE` table-rebuild migration vs `'deprecated'`/`contradicts` precedent
- [ ] If precedent path: audit ALL retrieval-filter sites so anti-patterns never resurface as positive guidance

### Phase F: M-skill-induction-repetition (heaviest; last)
- [ ] New reconsolidation action + repetition counter + induction-precision gate (verbatim, content-addressed, off-by-default, no auto-promotion across trust boundary)

### Phase G: M-procedural-version-reset residual
- [ ] Confirm append-only deprecate-never-delete already covers versioning; add only the explicit reliability-reset-to-zero on a contract-surface change (rides Phase A's counter)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target |
|-----------|-------|-------|--------|
| Unit | f64 Beta primitive (cold-start 0.5, count-floor, fractional inputs) | Vitest | Exact math + boundary cases |
| Unit | Outcome emitter writes `'outcome'` rows with attribution | Vitest | >2 call sites confirmed |
| Benchmark | Reliability-weighting vs `access`/confirmation | net-new harness | A measured delta (promotion gate) |
| Integration | Reliability fold neutral when all priors `r=0.5` | Vitest | Byte-stable order pre-data |
| Strict validation | This spec folder | `validate.sh --strict` | Exit 0 |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Outcome/usefulness emitter | Internal (net-new) | Blocked | Reliability prior stays `r=0.5`; recall fold is a cold-start no-op |
| Shared bounded-Beta f64 primitive | Internal (net-new) | Blocked | Integer scorer throws on fractional inputs |
| `HAS_FAILURE` schema migration | Internal (net-new) | Blocked | Bad-pattern cannot host a failure edge |
| Benefit micro-benchmark harness | Internal (net-new) | Blocked | No promotion gate; reliability-recall stays PENDING |
| 028 research record | Internal | Green | Acceptance criteria frozen from `research/` |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This is a planning-only re-plan; nothing is implemented, so no runtime rollback applies.
- **Procedure**: If a future implementer ships any candidate, each is a self-contained reversible change behind a default-OFF flag (mirroring the 030 per-candidate discipline) — revert the scoped commit. The emitter and Beta primitive are additive and order-neutral when no `'outcome'` data exists.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A (Emitter) ──> Phase B (Beta primitive) ──> Phase C (Benchmark) ──> Phase D (Reliability fold)
                                                                              │
Phase E (Bad-pattern, schema gate) ───────────────────────────────────── independent
Phase F (Skill-induction, heaviest) ──────────────────────────────────── independent, last
Phase G (Version-reset residual) ──> rides Phase A's reliability counter
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A Emitter | None | B, C, D, G |
| B Beta primitive | A (for live data) | C, D |
| C Benchmark | A, B | D |
| D Reliability fold | C (must earn it) | None |
| E Bad-pattern | schema-migration decision | None |
| F Skill-induction | new action + counter | None |
| G Version-reset | A (reliability counter) | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

> Effort/leverage are **structural inference, never benchmarked** [`03-corrections-caveats-and-residuals.md:33`].

| Phase | Candidate | Effort (research) | Note |
|-------|-----------|-------------------|------|
| A | Emitter prereq | M | Net-new write-path; `'outcome'` barely emitted |
| B | f64 Beta primitive | S | Additive export + adapter |
| C | Benchmark | M | The promotion gate |
| D | reliability-recall | M | Fold once earned |
| E | bad-pattern | M | Schema migration OR precedent + audit |
| F | skill-induction | L (heaviest) | New action + counter + precision gate; write-side risk |
| G | version-reset residual | S | Mechanism already ships |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-build Checklist (future packet)
- [ ] Default-OFF flag per candidate (mirror 030's reversibility discipline)
- [ ] Baseline captured before any ranking-order change (regression-baseline rule)
- [ ] Branch-only; nothing pushed to main without explicit go

### Rollback Procedure
1. Revert the scoped per-candidate commit.
2. Confirm the emitter + Beta primitive are order-neutral when no `'outcome'` data exists (additive, default-off).
3. Re-run the Vitest suite + `validate.sh --strict` to confirm green baseline.

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐
│  Phase A         │
│  Outcome emitter │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Phase B         │
│  f64 Beta + adapt│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐      ┌──────────────────┐   ┌──────────────────┐
│  Phase C         │      │  Phase E         │   │  Phase F         │
│  Micro-benchmark │      │  Bad-pattern     │   │  Skill-induction │
└────────┬─────────┘      │  (schema gate)   │   │  (heaviest)      │
         │                └──────────────────┘   └──────────────────┘
         ▼
┌──────────────────┐      ┌──────────────────┐
│  Phase D         │      │  Phase G         │
│  Reliability fold│      │  Version-reset    │
└──────────────────┘      │  residual         │
                          └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Emitter | None | `'outcome'` signal | Beta data, benchmark, fold, version-reset |
| Beta primitive | Emitter (live data) | posterior mean | benchmark, fold |
| Benchmark | Emitter, Beta | measured delta | fold promotion |
| Reliability fold | Benchmark | reliability-weighted recall | None |
| Bad-pattern | schema decision | negative memory | None |
| Skill-induction | new action + counter | induced procedures | None |
| Version-reset | Emitter counter | reset-on-version | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase A — Outcome emitter** — CRITICAL (everything reliability-shaped is `r=0.5` without it)
2. **Phase B — f64 Beta primitive + adapter** — CRITICAL
3. **Phase C — Benefit micro-benchmark** — CRITICAL (the promotion gate)
4. **Phase D — Reliability fold** — CRITICAL (only if C earns it)

**Off the critical path (independent gates)**: Phase E (bad-pattern, schema), Phase F (skill-induction, heaviest), Phase G (version-reset residual).

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Gate |
|-----------|-------------|------------------|------|
| M1 | Emitter live | `'outcome'` at >2 attributed sites | REQ-001 |
| M2 | Beta primitive | f64 export + adapter unit-tested | REQ-003 |
| M3 | Benchmark verdict | Measured delta recorded | REQ-002 |
| M4 | Reliability-recall decision | Promote or keep PENDING | REQ-004 |
| M5 | Sibling gates resolved | Bad-pattern / induction / version-reset each closed or PENDING-with-reason | REQ-005/006/007 |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`; `../../research/synthesis/01-go-candidates.md`

<!-- /ANCHOR:related-docs -->
