---
title: "Feature Specification: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)"
description: "A 20-iteration targeted, non-converging follow-on to 001: SOL gpt-5.6-sol at xhigh (fast) via cli-codex, seeded from 001's 216-repo registry so it deepens rather than re-surveys. Three threads: (1) fan-out automation -- can the automated fanout scripts reproduce the manual multi-model live-search run, delivered as a design + a scratch prototype without touching the shipped runtime; (2) deepen the 8 recommendations from 001 worth pursuing; (3) general 'make current deep loops more effective' with extra depth on AI-council. Research + scratch-prototype only; no changes to the shipped system-deep-loop runtime."
trigger_phrases:
  - "deep loop effectiveness research"
  - "fan-out automation research"
  - "deep loop recommendations deep dive"
  - "ai council effectiveness"
  - "automated multi-model search fanout"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout"
    last_updated_at: "2026-07-15T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Run-2 added: 40/40 per-mode deepening; 163 new repos, 111 recs, 84 contradictions"
    next_safe_action: "Operator review both runs; phase 002 ranking from 001 + run-1 + run-2"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/findings-registry.json"
      - "scratch/fanout-prototype.cjs"
      - "research/research-modes.md"
      - "research/findings-registry-modes.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-005-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Build upon 065 as a new child (005), seeded from 001; reserved 002-004 map slots untouched to avoid rippling stale cross-refs into 001's completed docs."
      - "Fan-out thread = research + a scratch prototype only; the shipped fanout-run.cjs is NOT modified this phase."
      - "Single lineage: SOL gpt-5.6-sol at xhigh (fast) via cli-codex; no LUNA/GLM this run."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)

> Sibling phase adjacency (sorted order under the 065 parent): predecessor `001-deep-loop-market-research`; successor `003-baseline-taxonomy-and-state-census`.

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 005 is a 20-iteration TARGETED, non-converging follow-on to 001-deep-loop-market-research. Where 001 was a broad 45-iteration survey (216 repos, 8 ranked recommendations), this run goes deeper on three operator-chosen threads using a single lineage — GPT-5.6 SOL at xhigh reasoning on the fast tier, via cli-codex `codex --search exec`. It is seeded with 001's 216-repo registry so SOL broadens (deeper, adjacent, newer) instead of re-listing.

**Threads**: (1) **fan-out automation** — can the automated fanout scripts reproduce the manual multi-model live-search run (iters 1-5), delivered as a design + a throwaway `scratch/` prototype; (2) **recommendation deep-dive** — mechanisms + reference implementations for the 8 recommendations from 001 (iters 6-15); (3) **general effectiveness + AI-council depth** — newest techniques for more-effective loops, with extra depth on AI-council (iters 16-20).

**Key Decisions**: single-lineage SOL xhigh (operator directive); research + scratch-prototype only — the shipped `runtime/scripts/fanout-*.cjs` are NOT modified this phase (any runtime change is a gated follow-on); seeded from 001 to force divergence.

**Critical Dependencies**: cli-codex ChatGPT-OAuth (shared with a concurrent packet-138 session — serial dispatch, backoff, never blanket-kill); 001's findings-registry as the divergence seed.

**Run-2 extension (per-mode deepening)** — a later 40-iteration, non-converging run inside this same packet takes each deep-loop MODE in turn (8 modes × 5 angles: deep-research, deep-review, deep-ai-council, deep-improvement, deep-alignment, agent-improvement, model-benchmark, skill-benchmark; `ai-system-improvement` deliberately excluded per operator) and asks how each mode improves and what makes it *uniquely valuable*. Single lineage — GPT-5.6 SOL (`gpt-5.6-sol`) at xhigh (fast) via cli-codex — seeded from BOTH 001 (216 repos) and run-1 (74 repos) as a do-not-re-list set. Outcome: 40/40 iterations, 0 parse failures, all 8 modes 5/5 — **163 new repos**, **168 insights**, **111 mode-specific recommendations**, **84 contradictions**, 16 targets mapped. Deliverable `research/research-modes.md` (machine index `research/findings-registry-modes.json`); run-1's effectiveness+fan-out synthesis in `research/research.md` is unchanged, with a Run-2 addendum pointer linking the two. Same guardrail: research + `scratch/` only; zero shipped-runtime changes; all writes inside 005.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `036-deep-loop-innovation` |
| **Predecessor** | `../001-deep-loop-market-research/` (Complete) |
| **Successor** | `../002-synthesis-and-improvement-mapping/` (Planned; consumes 001 + 005 findings) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

001 produced a broad landscape and 8 ranked recommendations, but at survey depth: one-line lessons per repo, not mechanisms or reference implementations. Two gaps remain before phase 002 ranking: (a) the recommendations are not yet backed by concrete, adoptable mechanisms; and (b) the operator's underlying wish — that the *automated* fanout scripts reproduce what 001 did by hand across multiple models — is unproven, because the shipped fanout executor omits codex's top-level `--search` and cannot fan out multiple models with live search.

### Purpose

Deepen the most promising 001 findings into actionable, evidence-backed recommendations, and prove out (by design + a scratch prototype) that an automated multi-model + live-search fanout loop is feasible — without modifying the shipped runtime this phase.

### Key Research Threads (broadening seed — expandable, not a cap)

**Thread 1 — Fan-out automation (iters 1-5):** per-leaf CLI-flag/model/live-tool parametrization; heterogeneous multi-model fan-out; cross-iteration shared state for parallel leaves; resumable fan-out salvage/merge; bias-free reduction of heterogeneous leaves + the prototype design.

**Thread 2 — Recommendation deep-dive (iters 6-15):** mechanisms + reference implementations for R1-R8 (termination, resume-receipts, council independence, conditional fan-in, cheap-checks-before-judges, semantic novelty, stream-fold gauges, typed budgets) + the two 001 open gaps (RL convergence theory ↔ termination; durable-execution under LLM nondeterminism).

**Thread 3 — General effectiveness + AI-council (iters 16-20):** 2025-2026 techniques not in 001; AI-council adjudication/bias/calibration/seat-selection depth (operator flagged council as most valuable); loop failure taxonomy; final synthesis of new recommendations.

### Seed

001's `findings-registry.json` (216 repos, 222 insights, 134 contradictions) is injected into every prompt as a do-not-re-list set; the 8 ranked recommendations are carried as deepening targets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One 20-iteration targeted, non-converging run (SOL `gpt-5.6-sol` xhigh, fast tier) via cli-codex, state under this folder's `research/` (created at execution by the driver).
- The three threads above (5 / 10 / 5), seeded from 001 to force divergence.
- Dedup + novelty vs 001's catalogue AND this run's own findings.
- A catalogue of NEW repos (beyond 001's 216) with mechanisms + the transferable lesson each teaches.
- A stronger recommendations set (concrete, targeted at named subsystems, with impact×effort).
- A throwaway `scratch/` prototype demonstrating an automated multi-model + `--search` fanout loop.
- Final synthesis `research/research.md` incl. the mandatory "Eliminated Alternatives" section.

### In Scope — Run-2 Extension (per-mode deepening)

- One 40-iteration non-converging run, single lineage SOL `gpt-5.6-sol` xhigh (fast) via cli-codex, state under `research/` in a `-modes` namespace (`deep-research-config-modes.json`, `deep-research-state-modes.jsonl`, `findings-registry-modes.json`, `deep-research-dashboard-modes.md`, `iterations-modes/`, plus `research-modes.md`).
- 8 deep-loop MODES × 5 angles each (state-of-the-art → unique-value/moat → mechanisms → failure-modes → synthesis); `ai-system-improvement` deliberately excluded per operator (`modesCovered` = 8).
- Seeded from BOTH 001 (216 repos) and run-1 (74 repos) as a do-not-re-list set; all 163 catalogued repos are new (dedup enforced at merge).
- A catalogue of NEW repos + 111 mode-specific recommendations that sharpen each mode's unique value, mapped across 16 targets.
- Run-2 harness + digest in `scratch/` (`deep-loop-driver-modes.cjs`, `angle-schedule-modes.json`, `build-digest-modes.cjs`, `synthesis-digest-modes.md`); the run-1 `research/research.md` synthesis stays intact (a Run-2 addendum pointer links the two).

### Out of Scope (explicit Non-Goals)

- **NO changes to the shipped `system-deep-loop` runtime** — `runtime/scripts/fanout-*.cjs` and any other skill/runtime code are NOT modified this phase. The prototype lives only in this folder's `scratch/`.
- Ranking/prioritization of findings across 001+005 — phase 002.
- Designing production changes to the runtime — a gated follow-on.
- Multi-model live dispatch this run — single-lineage SOL only (the prototype *demonstrates* multi-model, it does not run the 20 iters that way).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-deep-loop-effectiveness-and-fanout/research/**` | Create (at execution, by the driver) | Loop-owned state: config, state JSONL, findings-registry, dashboard, iterations/, research.md |
| `002-deep-loop-effectiveness-and-fanout/scratch/**` | Create | Driver, schedule, and the fan-out automation prototype (throwaway) |
| `002-deep-loop-effectiveness-and-fanout/*.md` docs | Modify (during/after run) | Task/checklist evidence, decisions, implementation summary at close |
| `../spec.md` (parent map) | Modify | Add the 005 row to the parent Phase Documentation Map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Non-converging run configuration | Driver launched with `max_iterations=20`, `stop_policy=max-iterations`, `convergence_mode=divergent`; visible in `research/deep-research-config.json` |
| REQ-002 | Full depth executed | All 20 iterations ran (SOL xhigh), verifiable from `research/deep-research-state.jsonl` (20 lines) |
| REQ-003 | New repo catalogue | 10+ NEW repos (beyond 001's 216) catalogued, each with a working link + a concrete transferable mechanism |
| REQ-004 | Stronger recommendations | A recommendations set targeting named subsystems/modes with rationale + impact×effort, deepening R1-R8 and adding new ones |
| REQ-005 | Synthesis | `research/research.md` produced incl. the mandatory "Eliminated Alternatives" section |
| REQ-006 | Transport mandate | All iterations dispatched ONLY via cli-codex (`gpt-5.6-sol` xhigh, fast) |
| REQ-007 | Fan-out prototype | A `scratch/` prototype demonstrates an automated multi-model + `--search` fanout loop (spawn + reduce), without touching the shipped runtime |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Dedup + novelty discipline | Findings deduped vs 001's registry AND this run's; each iteration seeded with the do-not-re-list set; divergent pivots at exhaustion |
| REQ-009 | Orchestrator check-ins | Gate reviews between threads (post-thread-1, post-thread-2) via dashboard + state JSONL |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20/20 iterations complete under the non-converging flags (state JSONL evidence).
- **SC-002**: 10+ NEW repos catalogued (beyond 001), each with link + concrete mechanism.
- **SC-003**: A stronger recommendations set (deepened R1-R8 + new), each mapped to a named subsystem/mode with impact×effort.
- **SC-004**: `research/research.md` synthesis exists, incl. Eliminated Alternatives.
- **SC-005**: Zero changes to the shipped runtime; all writes confined to this spec folder.
- **SC-006**: Fan-out automation prototype runs and is documented (design + demo).
- **SC-007**: `validate.sh --strict --recursive` on the parent packet reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex ChatGPT-OAuth (shared with concurrent 138) | All 20 iterations blocked if auth stale; contention with 138 | Pre-flight auth (done, READY); serial dispatch + backoff; never blanket-kill codex; resume from state JSONL |
| Dependency | 001 findings-registry as seed | Weak divergence if missing | Verified present (216 repos); injected into every prompt |
| Risk | SOL xhigh slower per iteration | Longer wall-clock | 10-min per-iter timeout; background dispatch; batch with gates |
| Risk | Prototype tempts scope creep into the shipped runtime | Guardrail violation | Prototype confined to `scratch/`; runtime edits explicitly out of scope (gated follow-on) |
| Risk | SOL re-lists 001 repos despite seed | Low novelty | Seed lists all 216 names + registry dedup drops any prior/duplicate at merge |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes within the driver's 10-min watchdog; a stalled iteration halts the batch and is resumable from the state JSONL.

### Security
- **NFR-S01**: Public web/GitHub sources only; no secrets, tokens, or private repo content in prompts, findings, or state.

### Reliability
- **NFR-R01**: A crash or quota exhaustion mid-run is recoverable from `research/deep-research-state.jsonl` (resume = state line count) without losing completed iterations.

---

## 8. EDGE CASES

### Data Boundaries
- Iteration yields zero novel findings: divergent mode pivots to adjacent/contradiction/missing-source angles rather than stopping.
- Repo candidate already in 001's catalogue: dropped at merge (prior-set dedup) rather than re-counted.
- Repo candidate with no clear mechanism: recorded in Eliminated Alternatives rather than padding.

### Error Scenarios
- Transient dispatch failure (rate-limit/timeout): bounded retry with backoff; hard failure halts the batch, re-run resumes.
- Malformed model JSON: raw output is still persisted; the iteration is marked `parse_ok:false` and contributes no findings.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | 20 iterations, single lineage, 3 threads, a prototype |
| Risk | 12/25 | Research + scratch-prototype only; execution risk in the shared OAuth transport |
| Research | 20/20 | The phase IS research; deep, unfamiliar mechanisms |
| Multi-Agent | 10/15 | Single-lineage LEAF iteration agents + a multi-model prototype |
| Coordination | 10/15 | Orchestrator gates between threads; prototype build |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Shared cli-codex OAuth contention with concurrent 138 | H | M | Serial dispatch + backoff; never blanket-kill; resume ladder |
| R-002 | SOL xhigh iterations time out | M | M | 10-min timeout; retry; halt-and-resume |
| R-003 | Low novelty vs 001 despite seed | M | L | Full 216-name do-not-list seed; registry dedup at merge |
| R-004 | Prototype scope-creeps into the shipped runtime | H | L | Hard out-of-scope; prototype confined to `scratch/` |
| R-005 | Divergent mode behaves convergently | M | L | Flags in config (REQ-001); per-thread directives; dashboard audit |

---

## 11. USER STORIES

### US-001: Actionable, mechanism-backed recommendations (Priority: P0)

**As a** system-deep-loop maintainer, **I want** the 001 recommendations deepened into concrete mechanisms with reference implementations, **so that** phase 002 ranks and phase 003 designs from adoptable specifics, not one-line survey lessons.

**Acceptance Criteria**:
1. Given the run completed, When I open `research/research.md`, Then each deepened recommendation cites a concrete mechanism/reference implementation mapped to a named subsystem with impact×effort.

### US-002: Proof the automation can do what I did by hand (Priority: P0)

**As the** operator, **I want** evidence that the automated fanout can reproduce the manual multi-model live-search run, **so that** future deep-research runs need no hand-rolled driver.

**Acceptance Criteria**:
1. Given thread 1 completed, When I inspect `scratch/`, Then a documented prototype spawns multiple models with live `--search` and reduces their outputs, plus a design for wiring this into the shipped fanout.

### US-003: More AI-council recommendations (Priority: P1)

**As the** operator, **I want** extra depth on AI-council effectiveness, **so that** deep-ai-council gets concrete adjudication/independence/calibration improvements.

**Acceptance Criteria**:
1. Given thread 3 completed, When I read the council section, Then it lists new, evidence-backed recommendations beyond 001's effective-independence finding.

---

## 12. OPEN QUESTIONS

- The automated fan-out fix (live-tool `--search` policy + capability matrix + executor adapters + manifest compiler) is proven in the `scratch/` prototype but NOT yet wired into the shipped `runtime/scripts/fanout-run.cjs`; that production change is a gated phase-002/003 follow-on.
- The 59 recommendations are mechanism-level but model-proposed — file names and event schemas in `research/research.md` §5-§8 must be validated against the real runtime before any load-bearing design.
- Contradiction citations in `research/research.md` §9 (arXiv/doc URLs) are model-supplied and should be spot-audited before phase 003 relies on them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (single-lineage executor config, threads, flags, state layout, check-in cadence)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (ADR-001 single-lineage SOL xhigh, ADR-002 new child 005, ADR-003 research + scratch-prototype only)
- **Synthesis**: See `research/research.md` (12-section incl. Eliminated Alternatives §10)
- **Parent Spec**: See `../spec.md`
