---
title: "Implementation Plan: graph-engineering-master → Graph-Based Deep-Loop (Repo Study 4, Final)"
description: "Level 1 plan for a research-only DOCUMENTARY completeness study of graph-engineering-master, closing the 4-repo graph-engineering program at doctrine level."
trigger_phrases:
  - "graph engineering master plan"
  - "graph-based deep loop plan 4"
  - "repo study 4 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/004-graph-engineering-master"
    last_updated_at: "2026-08-14T01:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter research; SOL-xhigh synthesis, DeepSeek fixes applied (final study)"
    next_safe_action: "Program complete at doctrine level; plan a shadow-prototype implementation packet"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-gem-sol-high-1786664046140-prtxh9"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "GEM (documentary) adds no new contradiction and fills the knowledge/evidence-production gap; 036 authority and plane separation are unchanged."
---
# Implementation Plan: graph-engineering-master → Graph-Based Deep-Loop (Repo Study 4, Final)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research target: documentary graph-engineering-master (no code); Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage) + SOL-xhigh synthesis + DeepSeek V4 Pro verification |
| **Storage** | Packet-local `research/` state, lineage iterations, deltas, synthesis, verification, resource map |
| **Testing** | Artifact validation, iteration-state inspection, independent model verification, strict spec validation |

### Overview

This packet runs a bounded 20-iteration completeness study over the documentary graph-engineering-master package and the 12 blog posts, building on studies 1–3. A gpt-5.6-sol xhigh pass synthesizes `research.md`, which DeepSeek V4 Pro verifies (PASS-WITH-FIXES; fixes applied). The output stays research-only and states an honest program completeness verdict.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Studies-1–3 designs and the doctrine angles are documented in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.
- [x] Corpus (graph-engineering-master + blogs + prior research) is available and grounded in the orientation seed.

### Definition of Done

- [x] Deep-research loop reached the forced max-iterations depth (20/20).
- [x] SOL-xhigh synthesis authored; DeepSeek V4 Pro verification returned PASS-WITH-FIXES; all flagged fixes applied.
- [x] Completeness verdict per design area; program-level open items carried forward honestly.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only documentary completeness study with externalized fan-out loop state, an upgraded synthesis pass, and independent cross-model verification.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/gem-sol-high/iterations/iteration-NNN.md`**: Per-iteration findings.
- **`research/research.md`**: SOL-xhigh synthesis (DeepSeek-verified, fixes applied).
- **`research/verification-deepseek-v4-pro.md`**: Independent verification verdict + applied fixes.

### Data Flow

1. Orientation dispatch (gpt-5.6-sol) produces the doctrine seed and completeness angles.
2. The fan-out driver runs 20 focused iterations over the KG pipeline, task-graph audit, and program completeness.
3. A gpt-5.6-sol xhigh pass synthesizes `research.md` from all 20 iterations.
4. DeepSeek V4 Pro verifies the synthesis; flagged fixes are applied.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol orientation pass (build-on studies 1–3).
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 20-iteration deep-research loop (cli-codex gpt-5.6-sol high/fast).
- [x] Synthesize `research.md` with gpt-5.6-sol xhigh.
- [x] Verify the synthesis with DeepSeek V4 Pro (cli-pi) and apply the flagged fixes.

### Phase 3: Verification

- [x] Confirm 20 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the completeness verdict per design area and the honest program-level status.
- [x] Run strict spec validation and record the outcome.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact existence | Iterations, deltas, state, synthesis, verification | Direct file reads |
| State integrity | Iteration count and route-proof fields | `deep-research-state.jsonl` inspection |
| Independent verification | Synthesis soundness, overclaim detection | DeepSeek V4 Pro (cli-pi) adversarial review |
| Spec validation | Level 1 documentation structure | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + gpt-5.6-sol | External | Green | Cannot run the research leaves or synthesis |
| cli-pi + deepseek-v4-pro | External | Green | Cannot run independent verification |
| graph-engineering-master corpus | Internal (context) | Green | Doctrine evidence would be weaker |
| studies-1–3 research | Internal | Green | Completeness framing would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out research loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
