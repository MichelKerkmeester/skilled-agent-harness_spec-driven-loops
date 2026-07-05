---
title: "031 GPT Reliability (Deep-Loop) Before vs After"
description: "Before-and-after narrative for packet 031, reframed around the current 7-track GPT reliability structure, moved-in 037 retention work, and corrected open status."
trigger_phrases:
  - "031 before vs after"
  - "deep loop gpt reliability before after"
importance_tier: "normal"
contextType: "implementation"
---
# What Changed in 031 GPT Reliability (Deep-Loop)

> Packet 031 turned an operator-reported GPT reliability problem into a 7-track program. Five tracks are complete. Track 006 is Planned, and track 007 is In Progress. The packet is not complete.

---

## 1. Research and Diagnosis

**Before**

The operator's symptom report, GPT running slowly and mis-invoking deep skills inside OpenCode, had no ranked mechanism map. The system had many Claude-shaped contracts and no clear answer for which parts GPT was following literally, absorbing, or stalling on.

**After**

The research track now holds two completed research children. The original behavioral-hardening research decomposed the first routing fixes and self-corrected a wrong ai-council route-proof claim. The moved-in GPT reliability research ran 15/15 productive GPT-5.5-fast xhigh iterations, verified 44 findings, and produced a ranked synthesis for reliability fixes and contract compilation.

**Impact**

The packet's later implementation tracks are grounded in verified findings rather than a single plausible story about GPT behavior.

## 2. Routing, Dispatch and Identity

**Before**

Deep-loop dispatch depended on prose, prompt conventions and route-proof fields that could agree with themselves while naming the wrong mode. Orchestrate had missing deep-mode rows, unresolved route fields and no hard boundary against dispatching an intermediary route target.

**After**

Route-proof validation rejects mismatched mode and target combinations. `deep.md` routing and `orchestrate.md` gained registry-backed route identity. Prompt packs gained pre-route headers. Mode-D self-classification was replaced with an evidence-based check. ai-council identity was corrected and reachability narrowed to subagent-only. FIX-5 was closed against benchmark evidence rather than built speculatively.

**Impact**

The routing path has concrete identity data before enforcement or benchmarking tries to evaluate it.

## 3. Guard and Enforcement

**Before**

Identity fixes were not mechanically enforced at dispatch time. The first guard implementation also missed the real orchestrate dispatch shape because `subagent_type` often stayed `general`. Fan-out could false-fail a valid max-iterations lineage over stop-reason spelling. The guard state directory had no retention discipline.

**After**

The guard track now includes five completed children: the route-guard plugin, loop-guard hardening research, loop-repeat implementation, fan-out stop-reason tolerance, and moved-in mk-deep-loop-guard retention. The plugin resolves target identity from prompt text before falling back to `subagent_type`, can flag or reject loop-like repeated handoffs, tolerates max-iterations stop-reason variants after iteration-count proof, and sweeps/archives/prunes its own state.

**Impact**

The system now catches the dispatch mismatch class the packet set out to address, covers the real orchestrate dispatch shape, and keeps the guard's own state from growing without bound.

## 4. Benchmarks and Verification

**Before**

The packet had an inconclusive GPT smoke and no reliable measured answer to whether agent-layer fixes were enough or host-hard identity was required.

**After**

The benchmark track records both truths: the GPT verification smoke was blocked before leaf dispatch and was not reported as a false pass, while the later GPT-vs-Claude benchmark produced measured evidence across 4 modes x 2 models with zero semantic wrong-mode artifacts, zero route-proof mismatches and a 3-10x GPT latency gap.

**Impact**

The packet can distinguish blocked evidence from clean evidence. FIX-5 was closed by the benchmark result, not by optimism.

## 5. Skill-Doc Hygiene

**Before**

Routing and enforcement behavior changed faster than the repo's skill docs and references, risking stale instructions across the exact surfaces GPT depends on.

**After**

The hygiene track completed a 20-iteration dual fan-out audit, confirmed 6 real drift clusters, remediated them, then used an adversarial follow-up to find and fix 2 more residuals while rejecting false findings.

**Impact**

The documentation that models read now matches the completed routing and enforcement behavior from tracks 002-004.

## 6. Reliability Fixes

**Before**

The moved-in reliability-fixes packet defined acute follow-up work from the GPT reliability research, but it is not complete in the current 031 rollup.

**After**

Track 006 is explicitly Planned. Its three child changelogs now exist for acceptance/rollout foundation, Gate-3 precedence and validator, and dispatch receipts/progress records. They state the intended work without converting planned or partial source notes into a false complete status.

**Impact**

Open reliability work is visible instead of hidden behind stale packet-complete language.

## 7. Compiled-Contract Compiler

**Before**

The planned compiler work was mixed into reliability-fix narrative, and the old rollup did not represent its separate status or follow-on probes.

**After**

Track 007 is explicitly In Progress. Its design child remains Planned in the active rollup, while deep-loop router deprecation and generalization probes are represented as complete children. The probes record mixed results rather than overstating generalization: council showed directional signal only, context was lever-null on the natural cell, and leaf reliability improved detectability but did not mechanically rescue the review re-probe.

**Impact**

The compiler path is separated from acute reliability fixes and can continue without pretending the packet has already shipped the full contract-compiler architecture.

## 8. Net State

**Before**

The docs described a flat, complete seventeen-phase program under the old slug.

**After**

The docs describe the current `031-deep-loop-gpt-reliability` packet as a 22-phase historical reorg into 7 tracks, with track-grouped changelogs and explicit open work: 006 Planned and 007 In Progress.

**Impact**

Readers can now answer three questions correctly: what moved where, what is complete, and what still remains open.
