---
title: "Feature Specification: Deep-Loop Market Research (Loop-Engineering Landscape)"
description: "45-iteration non-converging (broadening) /deep:research run over the state of the art in loop engineering for agentic/iterative systems: loop control and termination, state externalization, fan-out/fan-in, evaluator loops, reflection, deliberation, dedup/novelty, budget control, observability, and research-loop technique. Mines 10+ GitHub repos for transferable lessons and maps every insight to a specific system-deep-loop subsystem, child, or mode. Research only; no code or skill changes in this phase."
trigger_phrases:
  - "deep loop market research"
  - "loop engineering landscape"
  - "45 iteration deep research"
  - "non-converging research run"
  - "loop engineering github repos"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research"
    last_updated_at: "2026-07-15T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase COMPLETE: 45/45 iters via manual Shape-B driver; research.md synthesized (216 repos)"
    next_safe_action: "Operator review; phase 002 (ranking + improvement mapping) from research.md §17"
    blockers: []
    key_files:
      - "plan.md"
      - "decision-record.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-001-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "research/ state directory is created AT EXECUTION by the /deep:research loop -- never pre-scaffolded."
      - "GPT lineages ONLY via cli-codex; GLM via cli-opencode (operator mandate)."
---
# Feature Specification: Deep-Loop Market Research (Loop-Engineering Landscape)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 001 of the deep-loop innovation program runs a 45-iteration NON-CONVERGING (broadening) `/deep:research` investigation of the loop-engineering state of the art, split across three executor lineages (LUNA 25 / SOL 10 / GLM 10), catalogues 10+ GitHub repos with the transferable lesson each teaches, and maps every insight to a specific `system-deep-loop` subsystem, child, or mode. The output feeds phase 002 (ranking + improvement mapping) and phase 003 (spec-ready proposals).

**Key Decisions**: Non-convergence via `--stop-policy=max-iterations --convergence-mode=divergent` (ADR-001); execution shape A (parallel fan-out) vs B (sequential batches) decided at execution start (ADR-002); transport split GPT via cli-codex, GLM via cli-opencode (ADR-003).

**Critical Dependencies**: cli-codex ChatGPT-OAuth pre-flight; GLM provider prefix + variant availability in cli-opencode.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `036-deep-loop-innovation` |
| **Predecessor** | None (first phase) |
| **Successor** | `../002-deep-loop-effectiveness-and-fanout/` (targeted deepening follow-on, Complete); then `../002-synthesis-and-improvement-mapping/` (Planned; folder scaffolds at phase-002 start) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-deep-loop` improvements are currently sourced only from local incident experience; the repo has no systematic map of what the wider ecosystem has learned about running agentic/iterative loops (termination policy, evaluator loops, reflection, durable state, fan-out determinism, novelty-driven broadening, budget control, observability). Without that map, phases 002/003 would rank and propose improvements from an incomplete option space.

### Purpose

Produce a broad, deduped, subsystem-mapped landscape of loop-engineering techniques (synthesis + 10+ repo catalogue) via a full-depth 45-iteration `/deep:research` run that deliberately broadens instead of converging.

### Key Research Questions (broadening seed — expandable, not a cap)

The run starts from these ten orchestrator-defined angles and is expected to expand beyond them via divergent pivots:

1. **Loop control & termination** — convergence vs divergent/broaden policies, novelty/saturation stopping, diminishing-returns and oscillation detection → our reliability-weighted-convergence, divergent-mode, stop-input-corroboration.
2. **State externalization, checkpointing, resumability** — event-sourced/JSONL state, crash recovery, deterministic replay, idempotent iterations → our deep-research-state.jsonl, locks-state-and-recovery, continuity-threading.
3. **Fan-out / fan-in orchestration** — map-reduce over sub-agents, reducers/aggregators, determinism under concurrency, partial-failure tolerance and retry → our fanout-determinism-observability, fanout-failure-recovery, reducer-anchor.
4. **Evaluator / critic / verifier loops** — evaluator-optimizer, LLM-as-judge, adversarial verification, self-consistency → deep-review + deep-improvement evaluator-first.
5. **Reflection & self-improvement** — Reflexion, Self-Refine, ReAct, Tree/Graph-of-Thoughts, cross-iteration memory.
6. **Multi-agent deliberation / debate** — debate, mixture-of-agents, seat diversity, adjudication → deep-ai-council.
7. **Dedup, novelty & knowledge accumulation** — semantic clustering, coverage tracking, novelty scoring to DRIVE broadening → finding-dedup, gauges-dedup-scale.
8. **Budget / cost / depth control** — token budgeting, adaptive iteration depth, early-exit economics.
9. **Observability & gauges** — progress/delta tracking, convergence curves, reproducible traces → instrumentation, gauges.
10. **Research-loop specific** — agentic RAG, query reformulation, source diversification, breadth-vs-depth scheduling, coverage-driven expansion.

### Repo Seed List (target 10+; research broadens beyond this seed)

LangGraph (persistence/checkpointing), AutoGen/AG2, CrewAI, DSPy, TextGrad, Reflexion, Self-Refine, OpenHands, SWE-agent, smolagents, MetaGPT, AutoGPT/BabyAGI, Voyager, Inspect (AISI evals), promptfoo, durable-execution engines (Temporal/Restate/Inngest).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One `/deep:research` run (deep-research mode of system-deep-loop) at full 45-iteration depth with non-converging flags, state under this folder's `research/` (created at execution by the loop).
- Executor split LUNA 25 / SOL 10 / GLM 10 per the locked configs in `plan.md`.
- Divergent broadening: at would-be-stop points the loop pivots into adjacent/contradiction/missing-source questions.
- Dedup + novelty tracking across iterations (findings-registry) so coverage widens instead of re-affirming early findings.
- Catalogue of 10+ GitHub repos: link + what each teaches that transfers to system-deep-loop.
- Mapping of every retained insight to a specific system-deep-loop subsystem, child, or mode.
- Final synthesis `research/research.md` (17-section, incl. the mandatory "Eliminated Alternatives" section).

### Out of Scope (explicit Non-Goals)

- **NO code or skill changes in this phase** — nothing under `.opencode/skills/system-deep-loop/` (or anywhere else outside this spec folder) is modified. Research only.
- Ranking/prioritization of findings — phase 002.
- Designing concrete changes — phase 003.
- Implementing anything — phase 004 (optional, gated).
- Pre-creating `research/` or any loop state file — the loop owns that directory at execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-deep-loop-market-research/research/**` | Create (at execution, by the loop) | Loop-owned state: config, state JSONL, strategy, findings-registry, dashboard, iterations/, research.md (+ `lineages/{label}/` under Shape A) |
| `001-deep-loop-market-research/*.md` docs | Modify (during/after run) | Task/checklist evidence, decision updates, implementation summary at close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Non-converging run configuration | `/deep:research` launched with `--max-iterations=45 --stop-policy=max-iterations --convergence-mode=divergent`; flags visible in `research/deep-research-config.json` after init |
| REQ-002 | Full depth executed | All 45 iterations ran (LUNA 25 / SOL 10 / GLM 10), verifiable from `research/deep-research-state.jsonl` (and `research/lineages/{label}/` state under Shape A) |
| REQ-003 | Repo catalogue | 10+ GitHub repos catalogued in the synthesis, each with a working link + the transferable lesson it teaches |
| REQ-004 | Subsystem mapping | Insights explicitly mapped to 6+ distinct system-deep-loop subsystems/children/modes (e.g. deep-research, deep-review, deep-ai-council, deep-improvement lanes, deep-alignment, runtime convergence/fan-out/dedup/gauges/state) |
| REQ-005 | Synthesis | `research/research.md` produced with the 17-section structure incl. the mandatory "Eliminated Alternatives" section |
| REQ-006 | Transport mandate | GPT iterations dispatched ONLY via cli-codex (gpt-5.6-luna, gpt-5.6-sol); GLM via cli-opencode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Dedup + novelty discipline | Findings deduped via the loop's findings-registry; duplicate-heavy iterations followed by divergent pivots rather than repetition |
| REQ-008 | Orchestrator check-ins | Active monitoring cadence per `plan.md` (dashboard + state JSONL), with between-generation gates under Shape B |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 45/45 iterations complete under the non-converging flags (state JSONL evidence).
- **SC-002**: Repo catalogue lists 10+ repos, each with link + transferable lesson.
- **SC-003**: Insight-to-subsystem map covers 6+ distinct system-deep-loop subsystems/children/modes.
- **SC-004**: `research/research.md` 17-section synthesis exists, incl. Eliminated Alternatives.
- **SC-005**: Zero writes outside this spec folder (research-only scope held).
- **SC-006**: `validate.sh --strict --recursive` on the parent packet reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex ChatGPT-OAuth session | LUNA + SOL lineages (35/45 iterations) blocked if auth stale | Pre-flight auth check before launch; re-auth and resume from state JSONL if it expires mid-run |
| Dependency | cli-opencode GLM availability | GLM lineage (10/45) blocked | Confirm provider prefix (e.g. `zai-coding-plan/glm-5.2`) and `max` variant via `opencode models` at execution start; record actual values in decision-record |
| Risk | Fan-out lineage independence (Shape A): no mid-run cross-pollination between lineages | Duplicated coverage across lineages | Per-lineage angle allocation at init; end-of-run reducer dedups; or choose Shape B (sequential seeding) |
| Risk | 3-way parallel CLI dispatch resource load (Shape A) | Host contention, degraded iterations | Requires explicit operator OK; fall back to Shape B |
| Risk | Loop quality guards vs divergent mode interaction | Guards could throttle broadening | Anti-convergence floor + quality guards stay active by design; monitor dashboard for guard-triggered stalls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes within the loop's own watchdog/budget policy; a stalled iteration is visible on the dashboard within one check-in interval.

### Security
- **NFR-S01**: Public web/GitHub sources only; no secrets, tokens, or private repo content in prompts, findings, or state files.

### Reliability
- **NFR-R01**: A crash or quota exhaustion mid-run is recoverable from `research/deep-research-state.jsonl` via the loop's resume path without losing completed iterations.

---

## 8. EDGE CASES

### Data Boundaries
- Iteration yields zero novel findings: divergent mode pivots to adjacent/contradiction/missing-source questions instead of stopping (that is the point of `--convergence-mode=divergent`).
- Repo candidate has no clear transferable lesson: record in Eliminated Alternatives rather than padding the catalogue.

### Error Scenarios
- Source fetch failures: source diversification; do not let a single weak source anchor a finding (loop quality guards).
- Executor quota exhaustion mid-lineage: pause, re-auth/re-provision, resume from state JSONL; under Shape B, continue with the next generation and return.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 45 iterations, 3 executor lineages, 10 seed angles, 10+ repo targets |
| Risk | 12/25 | Research-only (no code changes); execution risk lives in transports/auth |
| Research | 20/20 | The phase IS research; broad unfamiliar landscape |
| Multi-Agent | 12/15 | 3 lineages (parallel or batched), LEAF iteration agents |
| Coordination | 10/15 | Orchestrator check-in cadence, shape decision, between-generation gates |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | cli-codex ChatGPT-OAuth expires or is absent at launch | H | M | Pre-flight check; resume ladder from state JSONL |
| R-002 | GLM provider prefix wrong or `max` variant unsupported | M | M | `opencode models` probe at execution start; adjust config; record in ADR-003 notes |
| R-003 | Shape A lineages duplicate coverage (no mid-run cross-pollination) | M | M | Per-lineage angle allocation; reducer dedup; Shape B alternative |
| R-004 | 3-way parallel dispatch overloads the host | M | L | Operator OK required for Shape A; Shape B fallback |
| R-005 | Premature narrowing (loop behaves convergently despite flags) | H | L | Flags verified in config at init (REQ-001); dashboard monitoring; divergent pivots audited in state JSONL |

---

## 11. USER STORIES

### US-001: Landscape map for the improvement pipeline (Priority: P0)

**As a** system-deep-loop maintainer, **I want** a broad, deduped, subsystem-mapped landscape of loop-engineering techniques with 10+ mined repos, **so that** phases 002/003 rank and propose improvements from the full option space instead of local experience only.

**Acceptance Criteria**:
1. Given the run completed, When I open `research/research.md`, Then I find the 17-section synthesis, the 10+ repo catalogue with links and lessons, and insights mapped to 6+ distinct subsystems/children/modes.

### US-002: Broadening, not re-affirming (Priority: P1)

**As the** orchestrator, **I want** non-converging behavior with dedup and novelty tracking, **so that** later iterations widen coverage instead of re-affirming early findings.

**Acceptance Criteria**:
1. Given iteration N would have converged, When the stop point is reached, Then the state JSONL shows a divergent pivot into adjacent/contradiction/missing-source questions rather than a stop.

### US-003: Traceable insights (Priority: P2)

**As a** future implementer (phase 003/004), **I want** each retained insight tied to a named subsystem/child/mode, **so that** proposals trace directly to the surfaces they would change.

**Acceptance Criteria**:
1. Given any retained insight in the synthesis, When I read its entry, Then it names at least one concrete system-deep-loop target (child, mode, or runtime subsystem).

---

## 12. OPEN QUESTIONS

- GLM exact provider prefix (e.g. `zai-coding-plan/glm-5.2`) and whether a `max` variant exists for GLM in cli-opencode — confirm at execution start; record the probe result in decision-record.md.
- Execution shape: A (parallel fan-out) vs B (sequential batches) — execution-start decision (ADR-002); Shape A additionally needs operator OK for 3-way parallelism.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md` (executor configs, flags, both execution shapes + recommendation, state layout, check-in cadence)
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (ADR-001 divergent mode, ADR-002 shape, ADR-003 transport split)
- **Parent Spec**: See `../spec.md`
- **Loop contract**: `.opencode/skills/system-deep-loop/deep-research/SKILL.md`; loop YAML `.opencode/commands/deep/assets/deep_research_auto.yaml`
