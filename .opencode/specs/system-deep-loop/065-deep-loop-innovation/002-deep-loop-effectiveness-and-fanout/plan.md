---
title: "Implementation Plan: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)"
description: "Method for the 20-iteration targeted, non-converging follow-on to 001: single lineage SOL gpt-5.6-sol at xhigh (fast) via cli-codex codex --search exec, seeded from 001's 216-repo registry to force divergence, run across three threads (fan-out automation 1-5, recommendation deep-dive 6-15, general effectiveness + AI-council 16-20) on the proven Shape-B driver, plus a throwaway scratch/ multi-model + --search fanout prototype; research/ state layout and the orchestrator check-in cadence. Research + scratch-prototype only; zero shipped-runtime changes."
trigger_phrases:
  - "deep loop effectiveness plan"
  - "fan-out automation method"
  - "sol xhigh single lineage run"
  - "20 iteration deepening plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout"
    last_updated_at: "2026-07-15T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Run-2 method added: 8 modes x 5 angles, single-lineage SOL xhigh, seeded from 290"
    next_safe_action: "Phase 002 ranking from research-modes.md; fan-out fix stays a gated follow-on"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "scratch/fanout-prototype.cjs"
      - "scratch/deep-loop-driver-modes.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-005-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Targeted deep-research follow-on (deep-research mode of system-deep-loop); realized via the 001 Shape-B driver `scratch/deep-loop-driver.cjs` |
| **Framework** | cli-codex `codex --search exec` transport (single lineage); a throwaway multi-model + `--search` fanout prototype in `scratch/` |
| **Storage** | Loop state INSIDE this folder at `research/` (config, state JSONL, findings-registry, dashboard, iterations/, research.md) |
| **Testing** | Config-flag verification at init; state-JSONL iteration accounting; deliverable gates in `checklist.md`; `validate.sh --strict --recursive` on the parent |

### Overview

One 20-iteration TARGETED, non-converging run, seeded from 001's 216-repo registry so a single SOL lineage deepens instead of re-surveying. Launched with `max_iterations=20 --stop-policy=max-iterations --convergence-mode=divergent`; `stop-policy=max-iterations` forces full depth; `divergent` pivots into adjacent/contradiction/missing-source questions at would-be-stop points. Three threads run in sequence — fan-out automation (1-5), recommendation deep-dive of R1-R8 + the two 001 open gaps (6-15), general effectiveness + AI-council depth (16-20) — with orchestrator gates between threads. A parallel deliverable is a throwaway `scratch/` prototype demonstrating an automated multi-model + live-`--search` fanout, proving the operator's underlying wish without touching the shipped runtime. Output: `research/research.md` (12-section synthesis incl. Eliminated Alternatives) + a catalogue of NEW repos + a mechanism-level recommendations set.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Single-lineage SOL xhigh directive captured in ADR-001 (no LUNA/GLM in the research iters)
- [x] New-child-005 decision recorded in ADR-002 (reserved 002-004 map slots untouched)
- [x] Research + scratch-prototype-only guardrail recorded in ADR-003 (shipped `fanout-run.cjs` NOT modified)
- [x] cli-codex ChatGPT-OAuth pre-flight passed; 001 findings-registry present as the divergence seed

### Definition of Done
- [x] 20/20 iterations in `research/deep-research-state.jsonl`; non-converging flags in `research/deep-research-config.json`
- [x] `research/research.md` synthesis incl. Eliminated Alternatives (§10) + a Sources & Provenance appendix (§12)
- [x] 10+ NEW repos (beyond 001) catalogued with links + mechanisms; insights mapped to named subsystems
- [x] `scratch/` prototype dispatches ≥2 models with `--search` and reduces their outputs
- [x] `checklist.md` P0 items checked with evidence; `validate.sh --strict --recursive` Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sequential, findings-seeded deepening loop (the proven 001 Shape-B realization), dispatched one iteration at a time via `codex --search exec` for a single SOL lineage, accumulating a deduplicated `findings-registry.json` that seeds each subsequent iteration to broaden. This phase does not hand-roll new loop mechanics beyond the already-authorized 001 driver; the driver owns state emission (config, state JSONL, iterations/, dashboard).

### Executor Config (locked; operator directive — single lineage)

| Lineage | Kind | Model | reasoningEffort | serviceTier | Iterations |
|---------|------|-------|-----------------|-------------|------------|
| SOL | `cli-codex` | `gpt-5.6-sol` | `xhigh` | `fast` | 20 |

No LUNA/GLM in the research iterations. Those two models appear ONLY inside the throwaway fan-out prototype, which demonstrates heterogeneous dispatch but does not run the 20 deepening iterations.

### Non-Converging Flags

```
max_iterations=20  stop_policy=max-iterations  convergence_mode=divergent
```

### Thread Allocation (seeded from 001 to force divergence)

| Thread | Iterations | Focus |
|--------|------------|-------|
| Fan-out automation | 1-5 | Can the automated fanout reproduce the manual multi-model live-search run; delivered as a design + a `scratch/` prototype |
| Recommendation deep-dive | 6-15 | Mechanisms + reference implementations for R1-R8 + the two 001 open gaps (RL-convergence↔termination; durable-execution under LLM nondeterminism) |
| General effectiveness + AI-council | 16-20 | 2025-2026 techniques not in 001; extra depth on AI-council adjudication/independence/calibration |

### Fan-out Prototype (throwaway, `scratch/` only)

`scratch/fanout-prototype.cjs` implements, in miniature, the four pieces the shipped fanout lacks for automated multi-model live-search: a live-tool capability matrix, per-kind executor adapters returning an invocation fingerprint, a manifest compiler, and a provenance-preserving reducer. It dispatched a 3-model fleet live (SOL xhigh + LUNA max via `codex --search exec`; GLM max via `opencode`) at exit 0 and merged the outputs. It is a design reference for the gated production change, NOT a runtime edit.

### State Layout (loop-owned, under `research/`)

`deep-research-config.json`, `deep-research-state.jsonl` (20 lines), `findings-registry.json`, `deep-research-dashboard.md`, `iterations/iteration-NNN.md`, `research.md`.

### Data Flow

001 registry seed (216 repos as do-not-re-list) → run INIT (config) → per-iteration SOL research cycles (live `--search`) → findings-registry dedup + novelty vs 001 AND self → divergent pivots at would-be-stop points → synthesis → `research/research.md` + NEW-repo catalogue + subsystem map → phase 002 input.

### Run-2 Extension: Per-Mode Deepening (method)

Run-1 (above) deepened the shared runtime; Run-2 is a second pass under the SAME packet that pivots the question from the runtime to the **modes** — for each deep-loop mode, *how does it improve* and *what makes it uniquely valuable* versus a generic single-shot alternative.

| Aspect | Value (Run-2) |
|--------|---------------|
| **Structure** | 8 deep-loop MODES × 5 angles = 40 iterations (`deep-research-state-modes.jsonl` = 40 lines) |
| **Modes** | deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, agent-improvement, model-benchmark, skill-benchmark — `ai-system-improvement` excluded per operator (`modesCovered` = 8) |
| **Angles per mode** | A1 state-of-the-art → A2 unique-value/moat → A3 mechanisms → A4 failure-modes → A5 synthesis |
| **Executor** | Single lineage SOL `gpt-5.6-sol` xhigh (fast) via cli-codex `codex --search exec` — GPT via cli-codex only |
| **Seed** | BOTH 001 (216 repos) and run-1 (74 repos) as a do-not-re-list set; all 163 catalogued repos new |
| **Flags** | `max_iterations` / `stop_policy=max-iterations` / `convergence_mode=divergent` (divergent within each mode) |
| **Namespace** | All Run-2 state carries a `-modes` suffix so it never collides with Run-1's files |

**Harness (throwaway, `scratch/` only):** the proven Shape-B driver adapted as `scratch/deep-loop-driver-modes.cjs` with a 40-slot `scratch/angle-schedule-modes.json`; digest via `scratch/build-digest-modes.cjs` → `scratch/synthesis-digest-modes.md`. Resume is state-JSONL-line-count as in Run-1.

**Output:** `research/research-modes.md` (per-mode moat synthesis) + `research/findings-registry-modes.json` (163 repos, 168 insights, 111 recs, 84 contradictions). Run-1's `research/research.md` is unchanged apart from a one-line Run-2 addendum pointer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug-fix phase (research + scratch-prototype only); recorded for scope discipline — the run observes these surfaces and writes only where stated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `005-.../research/**` | Loop-owned state + synthesis | Create at execution (driver writes) | State files present post-run; `deep-research-state.jsonl` = 20 lines |
| `005-.../scratch/**` | Driver + fan-out prototype | Create (throwaway) | `fanout-prototype.cjs` + `fanout-prototype-result.json` present; live run exit 0 |
| This folder's packet docs | Evidence + decisions | Update at close | checklist evidence rows; ADR-001/002/003 |
| `runtime/scripts/fanout-run.cjs` and all other repo paths | Research SUBJECT | READ-ONLY — zero writes | scoped `git status` at close: no writes outside this spec folder |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Single-lineage SOL xhigh config recorded (ADR-001); new-child-005 + guardrail decisions recorded (ADR-002, ADR-003)
- [x] cli-codex OAuth pre-flight; 001 findings-registry confirmed present as seed
- [x] Run launched with the non-converging flags; config verified in `research/deep-research-config.json`

### Phase 2: Core Implementation
- [x] Thread 1 (iters 1-5): fan-out automation + the `scratch/` prototype (live 3-model dispatch)
- [x] Thread 2 (iters 6-15): mechanisms for R1-R8 + the two open gaps
- [x] Thread 3 (iters 16-20): general effectiveness + AI-council depth
- [x] Divergent pivots + dedup vs 001 observed at thread gates (dashboard + state JSONL)

### Phase 3: Verification
- [x] NEW-repo catalogue 10+ with links + mechanisms; insights mapped to named subsystems
- [x] `research/research.md` synthesis incl. Eliminated Alternatives; prototype documented
- [x] checklist.md evidence complete; strict recursive validation Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Config verification | Non-converging flags present at init | Read `research/deep-research-config.json` |
| Iteration accounting | 20/20, 0 parse failures | `research/deep-research-state.jsonl` (20 lines) |
| Novelty discipline | All catalogued repos NEW vs 001 | `findings-registry.json` dedup vs 001's 216 |
| Prototype gate | ≥2 models dispatched with `--search`, merged output | `scratch/fanout-prototype-result.json` (3/3 parsed) |
| Scope discipline | Zero writes outside this spec folder | scoped `git status` at close |
| Packet integrity | Template/anchor/link conformance | `validate.sh --strict --recursive` on the parent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (ChatGPT-OAuth) | External transport | Green (pre-flight passed) | All 20 SOL iterations cannot dispatch |
| 001 findings-registry (216 repos) | Internal seed | Green | Weak divergence; risk of re-listing 001 |
| codex top-level `--search` | External capability | Green | No live repo mining (the entire point) |
| Public web/GitHub access | External | Green | Source mining degraded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken transport mid-run, runaway cost, or operator abort.
- **Procedure**: Stop the run; state is additive and packet-local — completed iterations persist in `research/` and the run resumes from `deep-research-state.jsonl` (resume = state line count). Full abandon: leave `research/` as-is (evidence), mark the phase paused in the parent map. Nothing outside this spec folder changes, so there is nothing to revert elsewhere. The `scratch/` prototype is throwaway and touches no runtime code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: config + pre-flight + launch)
        └──► Phase 2 (20 iterations across 3 threads + prototype) ──► Phase 3 (Synthesis gates + validation)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | ADR-001/002/003; OAuth pre-flight; 001 seed | Core |
| Core (iterations + prototype) | Setup | Verify |
| Verify (synthesis + gates) | Core | Phase 002 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour (config + pre-flight + init) |
| Core Implementation | High | 20 SOL-xhigh iterations + prototype build; multi-hour autonomous run |
| Verification | Medium | 1-2 hours (gates + synthesis review + validation) |
| **Total** | | **One autonomous session + orchestrator thread gates** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Not a deployment — research + scratch-prototype only; scope lock: writes confined to this spec folder
- [x] Pause/resume path understood (state JSONL resume = line count)

### Rollback Procedure
1. Stop the run (abort the driver batch)
2. Keep `research/` intact as evidence; resume later from state JSONL, or mark the phase paused in the parent map
3. Verify no writes landed outside this spec folder (scoped `git status`)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (packet-local additive state only)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌─────────────────────────────┐     ┌──────────────────────┐
│  Phase 1: Setup  │────►│  Phase 2: 20 iterations     │────►│  Phase 3: Synthesis  │
│  ADR-001..003 +  │     │  SOL xhigh, 3 threads       │     │  gates + validation  │
│  OAuth + seed    │     │  + scratch prototype        │     │                      │
└──────────────────┘     └─────────────────────────────┘     └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| ADR-001/002/003 | Operator directive | Run recipe + guardrails | Launch |
| OAuth pre-flight + 001 seed | None | Verified transport + divergence seed | Launch |
| Loop run (20 iters) | Launch | findings-registry + iterations/ | Synthesis |
| Fan-out prototype | codex `--search` + opencode | Live 3-model demo | Thread-1 close |
| Synthesis + catalogue + map | Loop run | research/research.md | Phase 002 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup (config + pre-flight + init)** - under 1 hour - CRITICAL
2. **Thread 1 (fan-out automation + prototype, iters 1-5)** - CRITICAL (proves the operator's wish)
3. **Thread 2 (recommendation deep-dive, iters 6-15)** - longest single block - CRITICAL
4. **Thread 3 (general effectiveness + council, iters 16-20)** - CRITICAL
5. **Synthesis + gates + validation** - 1-2 hours - CRITICAL

**Total Critical Path**: setup + sum of the three threads + synthesis (single sequential lineage).

**Parallel Opportunities**:
- Repo-catalogue and subsystem-map curation can proceed during late iterations at thread gates.
- The prototype build overlaps thread-1 research.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Run launched non-converging | Flags in `deep-research-config.json`; first iterations landing | Phase 1 exit |
| M2 | Fan-out automation proven | `scratch/fanout-prototype.cjs` runs (3/3 parsed, exit 0) | Thread 1 exit |
| M3 | Full depth complete | 20/20 iterations in state JSONL | Phase 2 exit |
| M4 | Synthesis shipped | research.md incl. Eliminated Alternatives + 74 NEW repos + 59 recs; validation Errors: 0 | Phase 3 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions live in `decision-record.md`: ADR-001 (single-lineage SOL xhigh — operator directive; LUNA/GLM appear only in the prototype demo), ADR-002 (build upon 065 as a NEW child `005`, not the reserved `002` slot, to avoid rippling stale "phase 002 = synthesis" cross-references through 001's completed docs), ADR-003 (research + scratch-prototype only; the shipped `fanout-run.cjs` is NOT modified — the small fan-out fix is a gated follow-on).

### Orchestrator Check-in Cadence

- Review `research/deep-research-dashboard.md` + the state JSONL tail at each thread gate (post-thread-1, post-thread-2).
- Between threads, confirm dedup vs 001 held (every catalogued repo NEW) and seed the next thread at gaps and contradictions.
- Intervene on: transport/auth failures, duplicate-heavy stretches without divergent pivots, or a prototype that tempts scope-creep into the shipped runtime.
