---
title: "Implementation Plan: NOOA paper + blog theory → loop/harness layer (Repo Study 5)"
description: "Level 1 plan for a research-only loop/harness-layer study of the NVIDIA NOOA paper + the 12 blogs, extracting loop/harness design decisions for system-deep-loop."
trigger_phrases:
  - "noaa loop harness plan"
  - "loop harness deep loop plan"
  - "repo study 5 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory"
    last_updated_at: "2026-08-14T02:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 20-iter loop/harness research; SOL-xhigh synthesis, DeepSeek fixes applied"
    next_safe_action: "Plan a mutant-driven shadow-prototype packet (P7 test corpus first)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-noaa-theory-sol-high-1786680785904-4bkmet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The loop/harness layer (NOOA + blogs) adds validated typed returns, agent-curated memory, and bounded LEAF tactics; all stay subordinate to the 036 authority plane, which currently runs dark."
---
# Implementation Plan: NOOA paper + blog theory → loop/harness layer (Repo Study 5)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research target: NVIDIA NOOA paper (external research) + 12 blogs; Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage) + SOL-xhigh synthesis + DeepSeek V4 Pro verification |
| **Storage** | Packet-local `research/` state, lineage iterations, deltas, synthesis, verification, resource map |
| **Testing** | Artifact validation, iteration-state inspection, independent model verification, strict spec validation |

### Overview

This packet runs a bounded 20-iteration loop/harness-layer study over the NVIDIA NOOA paper and the 12 blogs, building on studies 1–4. A gpt-5.6-sol xhigh pass synthesizes `research.md`, which DeepSeek V4 Pro verifies (PASS-WITH-FIXES; fixes applied). The output stays research-only and keeps every extraction subordinate to the 036 authority plane.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Studies-1–4 designs and the 7 loop/harness angles are documented in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.
- [x] Corpus (NOOA paper + blogs + prior research + live runtime) is available and grounded in the orientation seed.

### Definition of Done

- [x] Deep-research loop reached the forced max-iterations depth (20/20).
- [x] SOL-xhigh synthesis authored; DeepSeek V4 Pro verification returned PASS-WITH-FIXES; all flagged fixes applied.
- [x] Seven angles resolved with cited evidence; six additive deltas defined; 036 subordination stated and corrected.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only loop/harness study with externalized fan-out loop state, an upgraded synthesis pass, and independent cross-model verification.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/noaa-theory-sol-high/iterations/iteration-NNN.md`**: Per-iteration findings.
- **`research/research.md`**: SOL-xhigh synthesis (DeepSeek-verified, fixes applied).
- **`research/verification-deepseek-v4-pro.md`**: Independent verification verdict + applied fixes.

### Data Flow

1. Orientation dispatch (gpt-5.6-sol) produces the loop/harness seed, 7 angles, and 6 deltas.
2. The fan-out driver runs 20 focused iterations over P1–P7 plus live-runtime and 036-subordination audits.
3. A gpt-5.6-sol xhigh pass synthesizes `research.md`.
4. DeepSeek V4 Pro verifies the synthesis; flagged fixes are applied.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol orientation pass (build-on studies 1–4 + live runtime).
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 20-iteration deep-research loop (cli-codex gpt-5.6-sol high/fast).
- [x] Synthesize `research.md` with gpt-5.6-sol xhigh.
- [x] Verify the synthesis with DeepSeek V4 Pro (cli-pi) and apply the flagged fixes (036 correction, novelty caveat, handle disambiguation).

### Phase 3: Verification

- [x] Confirm 20 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the 7 angles resolved, the six deltas defined, and 036 subordination corrected.
- [x] Run strict spec validation and record the outcome.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact existence | Iterations, deltas, state, synthesis, verification | Direct file reads |
| State integrity | Iteration count and route-proof fields | `deep-research-state.jsonl` inspection |
| Independent verification | Synthesis soundness, 036-framing accuracy | DeepSeek V4 Pro (cli-pi) adversarial review |
| Spec validation | Level 1 documentation structure | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + gpt-5.6-sol | External | Green | Cannot run the research leaves or synthesis |
| cli-pi + deepseek-v4-pro | External | Green | Cannot run independent verification |
| NOOA paper + blog corpus | Internal (context) | Green | Loop/harness evidence would be weaker |
| studies-1–4 research + live runtime | Internal | Green | Build-on framing and runtime mapping would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out research loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
