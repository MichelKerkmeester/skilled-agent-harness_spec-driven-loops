---
title: "Implementation Plan: Cross-Study Integration Capstone (Study 6)"
description: "Level 1 plan for a research-only 10-round integration study that welds S1-S5 into one graph-based agent-loop design for system-deep-loop over the dark 036 authority plane."
trigger_phrases:
  - "cross study integration plan"
  - "capstone integration plan"
  - "study 6 plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-graph-engineering/006-cross-study-integration"
    last_updated_at: "2026-08-14T06:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Completed 10-round xhigh integration; SOL-xhigh synthesis, DeepSeek fixes applied"
    next_safe_action: "Plan a mutant-driven shadow vertical-slice packet (freeze corpus + legacy build first)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fanout-cross-integration-sol-xhigh-1786684659997-imywj5"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Studies S1-S5 describe one system: a graph decides eligible work and order, a bounded loop does each unit, typed evidence stacks, and only 036 (currently dark) may authorize a protected mutation."
---
# Implementation Plan: Cross-Study Integration Capstone (Study 6)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Integration target: five completed study syntheses (S1–S5); Markdown + JSONL packet artifacts |
| **Framework** | Deep-research loop (fan-out single lineage, xhigh) + SOL-xhigh synthesis + DeepSeek V4 Pro verification |
| **Storage** | Packet-local `research/` state, lineage iterations, synthesis, verification, plain-language companion |
| **Testing** | Artifact validation, iteration-state inspection, independent model verification, strict spec validation |

### Overview

This packet runs a bounded 10-round integration study that interconnects studies 1–5 into one coherent graph-based agent-loop design. A gpt-5.6-sol xhigh pass synthesizes `research.md`, which DeepSeek V4 Pro verifies (PASS-WITH-FIXES; fixes applied). The output stays research-only and keeps every authority claim accurate to 036's dark/target-state status.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Studies 1–5 syntheses and their plain-language companions are complete and available.
- [x] The integration orientation seed (spine, tensions, eight angles) is authored in `orientation.md`.
- [x] Spec folder and research boundary are bound to this phase child.

### Definition of Done

- [x] Integration loop reached the forced max-iterations depth (10/10).
- [x] SOL-xhigh synthesis authored; DeepSeek V4 Pro verification returned PASS-WITH-FIXES; all flagged fixes applied.
- [x] Spine + eight interconnection artifacts (P1–P8) + six tensions resolved with cited evidence; 036-dark carried end-to-end.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Research-only cross-study integration with externalized fan-out loop state, an upgraded synthesis pass, and independent cross-model verification. Integration, not re-study.

### Key Components

- **`research/deep-research-state.jsonl`**: Append-only config, route-proof, and iteration records.
- **`research/lineages/cross-integration-sol-xhigh/iterations/iteration-NNN.md`**: Per-round integration findings.
- **`research/research.md`**: SOL-xhigh capstone synthesis (DeepSeek-verified, fixes applied).
- **`research/verification-deepseek-v4-pro.md`**: Independent verification verdict + applied fixes.

### Data Flow

1. Integration orientation dispatch (gpt-5.6-sol) produces the spine, tensions, and eight interconnection angles.
2. The fan-out driver runs 10 focused rounds, one per interconnection angle plus a contradiction/no-bypass audit and a settled/open closeout.
3. A gpt-5.6-sol xhigh pass synthesizes `research.md`.
4. DeepSeek V4 Pro verifies the synthesis; flagged fixes are applied (artifact downgrade, convergence reconciliation, citation constraints).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create the phase-child folder and run the gpt-5.6-sol integration orientation pass over S1–S5.
- [x] Validate the fan-out config against the runtime schema.

### Phase 2: Core Implementation

- [x] Run the 10-round integration loop (cli-codex gpt-5.6-sol xhigh/fast).
- [x] Synthesize `research.md` with gpt-5.6-sol xhigh.
- [x] Verify the synthesis with DeepSeek V4 Pro (cli-pi) and apply the flagged fixes (convergence reconciliation, artifact downgrade, citation constraints, honesty items).

### Phase 3: Verification

- [x] Confirm 10 iteration records with route-proof fields in `deep-research-state.jsonl`.
- [x] Confirm the spine + P1–P8 + six tensions resolved and 036-dark carried end-to-end.
- [x] Run strict spec validation and record the outcome.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Artifact existence | Iterations, state, synthesis, verification, plain-language | Direct file reads |
| State integrity | Iteration count and route-proof fields | `deep-research-state.jsonl` inspection |
| Independent verification | Synthesis soundness, artifact-concreteness, citation accuracy, 036-framing | DeepSeek V4 Pro (cli-pi) adversarial review |
| Spec validation | Level 1 documentation structure | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex + gpt-5.6-sol | External | Green | Cannot run the integration rounds or synthesis |
| cli-pi + deepseek-v4-pro | External | Green | Cannot run independent verification |
| studies 1–5 syntheses | Internal (phase children) | Green | No corpus to integrate |
| live runtime + 036 spec | Internal | Green | 036-dark framing and runtime mapping would be weaker |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Capstone artifacts are invalid or the packet must be rerun from scratch.
- **Procedure**: Archive or remove only this child packet folder, then rerun the fan-out integration loop with the same bound spec folder.

<!-- /ANCHOR:rollback -->
