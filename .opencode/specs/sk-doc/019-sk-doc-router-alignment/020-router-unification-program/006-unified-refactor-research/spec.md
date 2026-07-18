---
title: "Feature Specification: Unified Router Refactor — Fuse the 8 Ideas into 1"
description: "20-iteration, 3-model, non-converge deep-research lineage (10 GPT-5.6-SOL xhigh + 5 Terra xhigh + 5 Luna max, all fast, concurrency >=3) designing ONE coherent router refactor that takes the best of all eight routing ideas (compiled policy, correction overlay, typed no-destination, no-wrong-door handoff, calibrated negotiation, minimal typed contract, proof-carrying commit, and the T-R-P decomposition) and makes them work together perfectly — optimized for BOTH parent skills with modes AND simple singular skills like mcp-code-mode, where a singular skill must be the degenerate N=1 case of the same contract. A fresh OPUS 4.8 xhigh ai-council synthesizes when all iterations finish."
trigger_phrases:
  - "unified router refactor research"
  - "fuse eight routing ideas into one"
  - "parent hub and singular skill routing contract"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Unified Router Refactor — Fuse the 8 Ideas into 1

## EXECUTIVE SUMMARY

Design ONE router refactor that fuses all eight ideas in packet `024` into a single coherent architecture — taking the best of each, resolving their overlaps, and proving they work together. The refactor must be **optimized for parent skills with modes AND simple singular skills like `mcp-code-mode`**: a singular (mode-less) skill must be the **degenerate N=1 case of the exact same contract**, with near-zero overhead and no special-casing. Non-converge: 20 iterations across 3 models; diverge and stress-test, do not settle early. A fresh OPUS 4.8 xhigh ai-council synthesizes the final design.

## 3. RESEARCH CONTEXT

Source (do NOT re-derive the individual ideas): the eight sibling presentations + their dives in `../001..008/`, and `../GLM-cross-lineage-notes.md`. The likely spine (validate/revise, don't assume): compiled content-addressed policy (1) expressed as a typed contract (6) with a PREPARE/VERIFY/COMMIT lifecycle (7); the "no clear route" branch is a typed outcome (3) that can escalate to bounded handoff (4) or a calibrated one-turn clarification (5); a replayable learning overlay (2) improves it offline; the whole policy is parameterized by the (T,R,P) knob-space (8) so each skill picks its corner.

### Idea-specific agenda (deepen + diverge, do not survey)
1. **The fused architecture.** One end-to-end design: which layer owns what, the data flow, the one typed contract, and where each of the 8 ideas lives inside it.
2. **Resolve the overlaps + conflicts.** 3 vs 6 (both type outcomes) → one outcome algebra; 4 vs 5 (both handle uncertainty) → one ordered ladder; 8's (T,R,P) vs 6's decision contract → knobs vs shape; 2's overlay vs 1's compiled base → base+overlay identity. Name every seam and how it closes.
3. **Singular-skill degeneracy (the load-bearing test).** Prove `mcp-code-mode` (no modes) instantiates the SAME contract as its degenerate case: tiny compiled policy, decision collapses to route/defer, no bundles, (T,R,P) trivial, single-leg commit, no learning needed. Show the complexity dial from singular → multi-mode parent hub with zero special-casing.
4. **The migration.** A phased, gated, reversible path (one hub at a time, route-gold green each step); what ships first; what stays a compiler-adapter shim.
5. **Falsify.** Stress the fused design against real hubs (sk-code bundles, system-deep-loop same-packet modes, mcp-tooling transports) AND singular skills; name what breaks.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)
1. **System skill advisor integration** — what Layer-0 (`system-skill-advisor`) must carry/consume; what degrades if it is absent or stale.
2. **Benchmark integration** — deterministic route-gold replay preserved; new fixtures/contracts; never edits the shared scorer (`router-replay.cjs`).
3. **Standalone effectiveness on documents alone** — can an AI route off the `SKILL.md` + compiled-policy card + typed contract ALONE, no advisor and no scorer, for both a parent hub and `mcp-code-mode`.

### Hard constraints (non-negotiable)
- Deterministic offline route-gold replay preserved. Never touch the shared benchmark scorer.
- Authority stays destination-local; a recommendation/proof is never a capability.
- Reversible + gated; no over-emission (never union the full registry into scored routes).
- Graceful degradation to singular skills is a requirement, not a nice-to-have.

### Deliverable
Per-iteration narrative in `research/`; the fresh OPUS 4.8 xhigh ai-council synthesizes the unified design when all 20 iterations finish.

## 4. SCOPE
- In: 20-iteration non-converge research (10 SOL xhigh + 5 Terra xhigh + 5 Luna max, fast, concurrency >=3) on the fused architecture, overlap resolution, singular-skill degeneracy, migration, and falsification; then an OPUS 4.8 xhigh ai-council synthesis.
- Out: implementation; editing live routing config or the scorer; re-deriving the eight individual ideas.
