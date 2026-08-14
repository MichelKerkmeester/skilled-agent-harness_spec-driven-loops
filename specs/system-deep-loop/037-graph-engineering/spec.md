---
title: "Feature Specification: Graph-Engineering-Based Deep Loops"
description: "Research packet 037: assess the current system-deep-loop status and the 036-deep-loop-innovation changes, then define how to evolve our deep-loop workflows into graph-engineering-based loops aligned with the GraphARC, graph-engineering-master, and LangChain reference corpus. This spec was seeded by the deep-research workflow (DR-SEED) and is completed by the research synthesis."
trigger_phrases:
  - "graph engineering deep loops"
  - "graph-based deep loop"
  - "deep loop graph architecture"
  - "graph engineering research"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering"
    last_updated_at: "2026-08-08T12:02:10Z"
    last_updated_by: "deep-research-init"
    recent_action: "Seeded Level 1 spec from deep-research topic (DR-SEED markers on Requirements and Scope)"
    next_safe_action: "Complete this spec from research/research.md synthesis"
    blockers: []
    key_files:
      - "research/research.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Graph-Engineering-Based Deep Loops

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-08 |
| **Branch** | `graph-engineering-deep-loops` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-deep-loop workflows are iteration-based loops with linear dispatch, externalized JSONL state, and convergence detection. The 036-deep-loop-innovation program is mid-flight (evidence-ledger spine landed, authority cutover blocked). The graph-engineering corpus (GraphARC, graph-engineering-master, LangChain, article set) proposes graph-structured agent workflows. This packet researches the current deep-loop status and what 036 changes, then maps graph-engineering patterns onto our architecture to define a transformation path.

### Purpose
Produce the research foundation (research/research.md) that answers what the deep loop is today, what deep-loop innovation is changing, and how to turn our loops into graph-engineering-based loops aligned with the reference corpus and our own architecture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- <!-- DR-SEED:SCOPE --> Current status assessment of system-deep-loop (modes, runtime, convergence, state machinery).
- What the 036-deep-loop-innovation program changes and its landing status.
- Graph-engineering concepts and patterns from the 037 context corpus (GraphARC-main, graph-engineering-master, LangChain, 5 articles).
- A mapping of graph-engineering primitives onto our deep-loop architecture and a transformation path aligned with our constraints.

### Out of Scope
- Implementation of any graph-based loop changes (follow-up planning packet).
- Code changes to system-deep-loop or the 036 packet (research subjects are read-only).
- General survey of all agent-graph frameworks beyond the supplied corpus.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Canonical synthesis of the 20-iteration deep research |
| `research/iterations/iteration-NNN.md` | Create | Per-iteration evidence |
| `research/deep-research-state.jsonl` | Append | Iteration records |
| `research/deltas/iter-NNN.jsonl` | Create | Structured per-iteration deltas |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | <!-- DR-SEED:REQUIREMENTS --> Run 20 deep-research iterations over the 036 packet and 037 context corpus | research/research.md exists with findings from all 20 iterations; state log has 20 iteration records |
| REQ-002 | Answer: current deep-loop status, what 036 changes, and a graph-engineering-based loop design aligned with our system | All three questions answered with cited sources in research/research.md |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Produce a transformation path (graph loop design mapped to our modes/convergence/evidence-ledger concepts) | Section in research/research.md with concrete mapping and phased path |
| REQ-004 | Flag when NOT to use graphs, grounded in the corpus | Documented in research/research.md Eliminated Alternatives / when-not-to-use analysis |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research/research.md compiled from 20 iterations with convergence report.
- **SC-002**: All 5 key questions answered or explicitly carried forward with evidence.
- **SC-003**: A concrete graph-engineering-based loop architecture proposal aligned with our runtime constraints (additive/dark, per-mode cutover, operator gates).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 036 deep-loop-innovation status (014 cutover operator-gated) | Direction may shift if cutover proceeds mid-research | Status snapshot at research start; changes flagged in findings |
| Risk | Graph corpus is third-party code with unknown maintenance | High | Verify claims against multiple sources (source diversity gate) |
| Risk | Memory MCP unavailable | Low | Daemon CLI fallback or skip (non-fatal per workflow) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the deepest alignment point between our evidence-ledger spine and graph state semantics?
- Which of our seven modes (research/review/ai-council/alignment/improvement lanes) benefits most from graph structure first?
- Does the corpus support partial (hybrid loop+graph) adoption, or full graph replacement?
<!-- BEGIN GENERATED: deep-research/spec-findings -->
## DEEP-RESEARCH FINDINGS (generated 2026-08-08)

Research summary (20 iterations; canonical source: `research/research.md`):

- **Status**: system-deep-loop is live; 014 authority cutover remains blocked (F001/F002/F005, 022/024 fencing unbuilt).
- **Innovation (036)**: evidence-ledger spine landed additive/dark; per-mode cutover operator-gated; 034/036-046 ownership undocumented.
- **Graph engineering**: typed state/edges, admission-checked routing, subgraphs, checkpointing, work/control graph separation; use for complex/high-concurrency, not simple/linear work.
- **Target**: hybrid architecture — stable governed control graph + per-run work graphs; evidence ledger stays authoritative; four-phase path: additive-dark research adapter → shadow parity → per-mode cutover → convergence-graph enrichment.
- **Open**: fixture/parity execution, 024 fencing verification, 034/036-046 accounting, coverage-graph DB restoration.

<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## PHASE DOCUMENTATION MAP

This is a phase parent. For the program map and reading order see [context-index.md](context-index.md); for program state and the next step see [handover.md](handover.md).

| Phase | Focus | Layer | State |
|-------|-------|-------|-------|
| [001-agent-swarms](001-agent-swarms/spec.md) | Graph runtime as a projection over 036 | Graph | Complete |
| [002-graphene-main](002-graphene-main/spec.md) | Event-derived truth and belief settlement | Graph | Complete |
| [003-graph-arch](003-graph-arch/spec.md) | Governance: admission ≠ authorization | Graph | Complete |
| [004-graph-engineering-master](004-graph-engineering-master/spec.md) | Knowledge / evidence production doctrine | Graph | Complete |
| [005-noaa-paper-and-blog-theory](005-noaa-paper-and-blog-theory/spec.md) | Loop / harness layer (NOOA + blog theory) | Loop | Complete |
| [006-cross-study-integration](006-cross-study-integration/spec.md) | Integration capstone (S1–S5 → one design) | Capstone | Complete |

---
