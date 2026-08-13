---
title: "Implementation Plan: graph-arch (GraphARC) → Graph-Based Deep-Loop (Repo Study 3)"
description: "Level 1 plan for a research-only packet extracting GraphARC governance contracts to extend the studies-1+2 graph-based deep-loop design."
trigger_phrases:
  - "grapharc governance plan"
  - "graph-based deep loop plan 3"
  - "repo study 3 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/003-graph-arch"
    last_updated_at: "2026-08-14T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter research; SOL-xhigh synthesis, DeepSeek REWORK fixes applied"
    next_safe_action: "Proceed to repo study 4 (graph-engineering-master) or plan a shadow-prototype packet"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-graph-arch-sol-high-1786656633113-zhqpv7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "GraphARC contributes a governance layer but proves admission is a precondition, not authorization; 036 must independently re-validate."
---
# Implementation Plan: graph-arch (GraphARC) → Graph-Based Deep-Loop (Repo Study 3)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research target: Python graph-arch (GraphARC); Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage) + SOL-xhigh synthesis + DeepSeek V4 Pro verification |
| **Storage** | Packet-local `research/` state, lineage iterations, deltas, synthesis, verification, resource map |
| **Testing** | Artifact validation, iteration-state inspection, independent model verification, strict spec validation |

### Overview

This packet runs a bounded 20-iteration research loop over GraphARC and the 12 graph-engineering blog posts, building on studies 1+2. A gpt-5.6-sol xhigh pass synthesizes the authoritative `research.md`, which DeepSeek V4 Pro then verifies (REWORK; fixes applied). The output stays research-only and hands its governance design decisions to a later implementation packet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Studies-1+2 designs and the 8 governance angles are documented in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.
- [x] Corpus (graph-arch + blogs + prior research + 036) is available and grounded in the orientation seed.

### Definition of Done

- [x] Deep-research loop reached the forced max-iterations depth (20/20).
- [x] SOL-xhigh synthesis authored; DeepSeek V4 Pro verification returned REWORK; all flagged fixes applied.
- [x] All 8 angles resolved with cited evidence, plus gaps, unexamined-assumptions, and when-not-to-use sections.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only packet with externalized fan-out loop state, an upgraded synthesis pass, and independent cross-model verification.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/graph-arch-sol-high/iterations/iteration-NNN.md`**: Per-iteration findings.
- **`research/research.md`**: SOL-xhigh synthesis (DeepSeek-verified, REWORK fixes applied).
- **`research/verification-deepseek-v4-pro.md`**: Independent verification verdict + applied fixes.

### Data Flow

1. Orientation dispatch (gpt-5.6-sol) produces the seed and 8 governance angles.
2. The fan-out driver runs 20 focused iterations over R1–R8 plus integration and cross-check passes.
3. A gpt-5.6-sol xhigh pass synthesizes `research.md` from all 20 iterations.
4. DeepSeek V4 Pro verifies the synthesis; flagged fixes are applied.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol orientation pass (build-on studies 1+2).
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 20-iteration deep-research loop (cli-codex gpt-5.6-sol high/fast).
- [x] Synthesize `research.md` with gpt-5.6-sol xhigh.
- [x] Verify the synthesis with DeepSeek V4 Pro (cli-pi) and apply the REWORK fixes.

### Phase 3: Verification

- [x] Confirm 20 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the synthesis resolves all 8 angles and the flagged fixes are applied.
- [x] Run strict spec validation and record the outcome.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact existence | Iterations, deltas, state, synthesis, verification | Direct file reads |
| State integrity | Iteration count and route-proof fields | `deep-research-state.jsonl` inspection |
| Independent verification | Synthesis soundness | DeepSeek V4 Pro (cli-pi) adversarial review |
| Spec validation | Level 1 documentation structure | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + gpt-5.6-sol | External | Green | Cannot run the research leaves or synthesis |
| cli-pi + deepseek-v4-pro | External | Green | Cannot run independent verification |
| graph-arch corpus | Internal (context) | Green | Reference-implementation evidence would be weaker |
| studies-1+2 research + 036 specs | Internal | Green | Build-on framing and authority mapping would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out research loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
