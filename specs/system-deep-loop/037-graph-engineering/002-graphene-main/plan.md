---
title: "Implementation Plan: graphene-main → Graph-Based Deep-Loop (Repo Study 2)"
description: "Level 1 plan for a research-only packet extracting executable graph-engineering contracts from graphene-main to extend the repo-1 graph-based deep-loop design."
trigger_phrases:
  - "graphene graph plan"
  - "graph-based deep loop plan 2"
  - "repo study 2 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/002-graphene-main"
    last_updated_at: "2026-08-13T21:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter research; SOL-xhigh synthesis verified by DeepSeek V4 Pro"
    next_safe_action: "Proceed to repo study 3 (graph-arch) or plan a shadow-prototype implementation packet"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-graphene-main-sol-high-1786648621541-lzda3r"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Graphene supplies executable contracts (belief projection, ledger fold, causal-prefix parity, claim-fence) that extend repo 1 without replacing the 036 authority plane."
---
# Implementation Plan: graphene-main → Graph-Based Deep-Loop (Repo Study 2)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research target: Rust graphene-main; Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage) + SOL-xhigh synthesis + DeepSeek V4 Pro verification |
| **Storage** | Packet-local `research/` state, lineage iterations, deltas, synthesis, verification, resource map |
| **Testing** | Artifact validation, iteration-state inspection, independent model verification, strict spec validation |

### Overview

This packet runs a bounded 20-iteration research loop over graphene-main and the 12 graph-engineering blog posts, building on repo study 1. A gpt-5.6-sol xhigh pass synthesizes the authoritative `research.md`, which DeepSeek V4 Pro then verifies. The output stays research-only and hands its extended design decisions to a later implementation packet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Repo-1 design and the 7 research angles are documented in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.
- [x] Corpus (graphene-main + blogs + repo-1 research + 036) is available and grounded in the orientation seed.

### Definition of Done

- [x] Deep-research loop reached the forced max-iterations depth (20/20).
- [x] SOL-xhigh synthesis authored; DeepSeek V4 Pro verification returned PASS-WITH-FIXES; fixes applied.
- [x] All 7 angles resolved with cited evidence, plus a "graphene's own gaps" and when-not-to-use section.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only packet with externalized fan-out loop state, an upgraded synthesis pass, and independent cross-model verification.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/graphene-main-sol-high/iterations/iteration-NNN.md`**: Per-iteration findings.
- **`research/research.md`**: SOL-xhigh synthesis (DeepSeek-verified).
- **`research/verification-deepseek-v4-pro.md`**: Independent verification verdict + applied fixes.

### Data Flow

1. Orientation dispatch (gpt-5.6-sol) produces the seed and 7 prioritized angles.
2. The fan-out driver runs 20 focused iterations over P1–P7 plus integration and adversarial coverage.
3. A gpt-5.6-sol xhigh pass synthesizes `research.md` from all 20 iterations.
4. DeepSeek V4 Pro verifies the synthesis; flagged fixes are applied.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol orientation pass (build-on-repo-1).
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 20-iteration deep-research loop (cli-codex gpt-5.6-sol high/fast).
- [x] Synthesize `research.md` with gpt-5.6-sol xhigh.
- [x] Verify the synthesis with DeepSeek V4 Pro (cli-pi) and apply flagged fixes.

### Phase 3: Verification

- [x] Confirm 20 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the synthesis resolves all 7 angles and passed independent verification.
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
| graphene-main corpus | Internal (context) | Green | Reference-implementation evidence would be weaker |
| repo-1 research + 036 specs | Internal | Green | Build-on framing and authority mapping would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out research loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
