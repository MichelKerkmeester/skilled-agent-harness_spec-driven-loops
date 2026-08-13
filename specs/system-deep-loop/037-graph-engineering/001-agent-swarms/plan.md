---
title: "Implementation Plan: agent-swarms → Graph-Based Deep-Loop (Repo Study 1)"
description: "Level 1 plan for a research-only packet extracting graph-engineering patterns from agent-swarms and the blog corpus for a graph-based system-deep-loop."
trigger_phrases:
  - "agent-swarms graph plan"
  - "graph-based deep loop plan"
  - "repo study 1 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/001-agent-swarms"
    last_updated_at: "2026-08-13T20:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iteration deep-research loop and synthesized graph-based deep-loop design"
    next_safe_action: "Proceed to repo study 2 (graphene-main) or plan a shadow-prototype implementation packet"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-agent-swarms-sol-high-1786644869562-gvk422"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The graph runtime must be a projection over the 036 authority plane, adopted via a deterministic IR and shadow parity before any per-mode authority cutover."
---
# Implementation Plan: agent-swarms → Graph-Based Deep-Loop (Repo Study 1)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research target: TypeScript/Bun agent-swarms repo; Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage), executor cli-codex gpt-5.6-sol high/fast |
| **Storage** | Packet-local `research/` state, lineage iterations, deltas, synthesis, and resource map |
| **Testing** | Artifact validation, iteration-state inspection, and strict spec validation |

### Overview

This packet runs a bounded 20-iteration research loop over the agent-swarms reference implementation and the 12 graph-engineering blog posts, mapping their mechanisms onto the current system-deep-loop runtime and the 036 authority plane. It stays research-only and hands its design decisions to a later implementation/planning packet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement and eight research angles are documented in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.
- [x] Corpus (agent-swarms + blogs + 036) is available and grounded in the orientation seed.

### Definition of Done

- [x] Deep-research loop reached the forced max-iterations depth (20/20).
- [x] Iteration markdown, delta JSONL, state JSONL, and synthesis artifacts exist.
- [x] Synthesis resolves all eight angles with cited evidence and explicit when-not-to-use boundaries.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only packet with externalized fan-out loop state (single lineage) and a final synthesis deliverable.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/agent-swarms-sol-high/iterations/iteration-NNN.md`**: Per-iteration narrative findings.
- **`research/lineages/agent-swarms-sol-high/deltas/iter-NNN.jsonl`**: Per-iteration structured deltas.
- **`research/research.md`**: Consolidated design synthesis and rationale.

### Data Flow

1. Orientation dispatch (gpt-5.6-sol) produces the seed and eight prioritized angles.
2. The fan-out driver runs 20 focused iterations over the eight angles plus integration and adversarial coverage.
3. Convergence telemetry is recorded but non-terminating (stop-policy=max-iterations).
4. The lineage synthesizes `research/research.md`, promoted to the packet root.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol orientation pass.
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 20-iteration deep-research loop (cli-codex gpt-5.6-sol high/fast).
- [x] Map agent-swarms mechanisms and blog concepts onto the runtime and 036 plane.
- [x] Synthesize `research/research.md` and emit the resource map.

### Phase 3: Verification

- [x] Confirm 20 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the synthesis resolves all eight angles with citations.
- [x] Run strict spec validation and record the outcome.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact existence | Iterations, deltas, state, synthesis | Direct file reads |
| State integrity | Iteration count and route-proof fields | `deep-research-state.jsonl` inspection |
| Spec validation | Level 1 documentation structure | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + gpt-5.6-sol | External | Green | Cannot run the research leaves |
| agent-swarms corpus | Internal (context) | Green | Reference-implementation evidence would be weaker |
| Graph-engineering blog corpus | Internal (context) | Green | Concept grounding would be weaker |
| 036-deep-loop-innovation specs | Internal | Green | Authority-plane mapping would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out research loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
