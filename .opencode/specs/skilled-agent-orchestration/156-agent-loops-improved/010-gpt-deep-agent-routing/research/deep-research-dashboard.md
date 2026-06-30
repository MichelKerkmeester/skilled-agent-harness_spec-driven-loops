---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: GPT-backed OpenCode deep skills (deep-research, deep-review, deep-context, deep-ai-council, deep-improvement) mis-route to the general/build agent instead of dedicated deep LEAF agents, run slower than under Claude, and drift from the workflow YAML contracts. Reproduces via @orchestrate dispatch and from the build primary agent.
- Started: 2026-06-30T06:30:11Z
- Status: INITIALIZED
- Iteration: 10 of 20
- Session ID: dr-010-gpt-routing-1782801010
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | KQ1+KQ2: OpenCode agent/command resolution path and deep-loop YAML dispatch-vs-orchestrate boundary | architecture | 0.90 | 5 | complete |
| 1 | KQ2 close-out (prompt-pack template + rendered prompt + leak-source grep) + KQ3 bridge (native-vs-CLI latency components) | architecture | 0.92 | 6 | complete |
| 1 | KQ4: workflow-contract drift steps a GPT-backed run skips/mutates when mis-routed to @general (per-step YAML checklist + post_dispatch_validate failure_reason mapping + empirical packet scan) | architecture | 0.90 | 5 | complete |
| 1 | KQ5: two reproduction surfaces (@orchestrate dispatch vs build/@general primary) vs Mode A/B taxonomy and F5 conflation cues; surface-agnostic vs surface-specific root cause; interleaved KQ4 executor/model attribution close-out | architecture | 0.93 | 6 | complete |
| 1 | KQ6: ranked, evidence-backed fixes to close GPT-vs-Claude fidelity gap (5 fix families, each tied to root-cause F-number + repo file:line, with effort + blast-radius; repo-resident subset distinguished from host-runtime escalation) | architecture | 0.60 | 5 | insight |
| 1 | KQ7 Claude baseline characterization (why Claude does not mis-route) + KQ6 close-out single-pass verification of FIX-list load-bearing anchors | architecture | 0.80 | 6 | complete |
| 1 | KQ3 close-out (deep-loop latency architecture: fixed vs scaling cost split, Mode-A ~20x structural multiplier) + KQ12 (cross-skill Phase-0 gate + dispatch-mechanics parity across 8 deep commands) | architecture | 0.90 | 6 | complete |
| 1 | KQ8 (FIX×packet prevention matrix for 2 smoking-gun drift packets) + KQ9 (cheapest reliable real-leaf-vs-Mode-A detector + plug-in site) | architecture | 0.88 | 6 | complete |
| 9 | FIX-4a + status-enum implementation de-risk | implementation-readiness | 0.90 | 5 | complete |
| 10 | Final implementation-planning close-out: status enum/FIX-4a first scope | implementation-readiness | 0.83 | 7 | complete |

- iterationsCompleted: 10
- keyFindings: 83
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] KQ1: Where in OpenCode's agent/command resolution path is the "which agent runs this" decision made, and why does GPT-backed execution pick general/build instead of the named deep LEAF agent (@deep-research, @deep-review, etc.)? [legacy-import]
- [ ] KQ2: How does the deep-loop command YAML + agent file contract express "dispatch @deep-research" vs "orchestrate the loop yourself as @general", and where does a GPT-backed model misread that boundary? [legacy-import]
- [ ] KQ3: Why are GPT-backed deep loops slower than Claude's (dispatch latency, per-iteration tool-call overhead, reasoning/token volume, reducer/state churn)? [legacy-import]
- [ ] KQ4: Which specific workflow-contract steps do GPT-backed runs skip or mutate (state files, prompt-pack render, reducer refresh, convergence eval, lock lifecycle) vs Claude? [legacy-import]
- [ ] KQ5: How do the two reproduction surfaces (@orchestrate sub-agent dispatch vs build primary agent) share or differ in root cause? [legacy-import]
- [ ] KQ6: What concrete, evidence-backed fixes would close the GPT-vs-Claude fidelity gap (prompt-packs, agent-file hardening, enforcement gates, state invariants)? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 6
- [ ] KQ1: Where in OpenCode's agent/command resolution path is the "which agent runs this" decision made, and why does GPT-backed execution pick general/build instead of the named deep LEAF agent (@deep-research, @deep-review, etc.)?
- [ ] KQ2: How does the deep-loop command YAML + agent file contract express "dispatch @deep-research" vs "orchestrate the loop yourself as @general", and where does a GPT-backed model misread that boundary?
- [ ] KQ3: Why are GPT-backed deep loops slower than Claude's (dispatch latency, per-iteration tool-call overhead, reasoning/token volume, reducer/state churn)?
- [ ] KQ4: Which specific workflow-contract steps do GPT-backed runs skip or mutate (state files, prompt-pack render, reducer refresh, convergence eval, lock lifecycle) vs Claude?
- [ ] KQ5: How do the two reproduction surfaces (@orchestrate sub-agent dispatch vs build primary agent) share or differ in root cause?
- [ ] KQ6: What concrete, evidence-backed fixes would close the GPT-vs-Claude fidelity gap (prompt-packs, agent-file hardening, enforcement gates, state invariants)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇███▇██▆▂▂▄▆▇▇▇▇▇▇▇▆
- score sparkline: ▇███▇██▆▂▂▄▆▇▇▇▇▇▇▇▆
- Last 3 ratios: 0.88 -> 0.90 -> 0.83
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.83
- coverageBySources: {"code":84,"other":84}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`opencode.json` as the agent-selection source.** It defines no agents/models/agent (iteration 1)
- **AGENTS.md §8 as the command-to-agent router.** It is Task-tool delegation guidance, (iteration 1)
- None definitively eliminated beyond the two ruled-out items above. (No BLOCKED (iteration 1)
- **Any static repo file (config / YAML workflow / agent file / command markdown (iteration 2)
- **Definitive injector attribution (host runtime wrapper vs orchestrator model (iteration 2)
- **Prompt-pack renderer / token substitution as the leak source.** Rendered (iteration 2)
- **Prompt-pack template as the leak source.** Template is clean; ends line 67 (iteration 2)
- **Definitive model attribution of the F16 packets.** Narrowed to "packets (iteration 3)
- **Reading each of the 6 F16 packets' JSONL executor-provenance to definitively (iteration 3)
- **The 156 parent changelog/review folders as a source of captured GPT-run (iteration 3)
- **A config-level (opencode.json) mechanism that would make the surfaces differ** — definitively absent (F1). No further config search warranted. (iteration 4)
- **Definitive injector attribution (host runtime wrapper vs orchestrator model)** — remains unresolved (BLOCKED iteration-2). The live capture in F5 shows the trailing dispatch lines exist in the leaf prompt, but this iteration cannot distinguish whether the host runtime wrapper, the `@orchestrate` model, or the `/deep:research` command renderer injected them. Candidate for reducer promotion to "Exhausted Approaches" only if a future iteration also fails; for now it stays open with a named next evidence step (see Recommended Next Focus). (iteration 4)
- **opencode.json as a model→agent / default-model binding source** — confirmed empty (F1); reinforces iteration-1's BLOCK on opencode.json as the agent-selection source and extends it to model binding. (iteration 4)
- **Per-file JSONL read for definitive F16 attribution** — already BLOCKED in iteration-3; NOT retried. The batch-grep (F6) is a strictly narrower technique (single aggregate grep, no per-file iteration-record parsing) and was explicitly requested by the dispatch as a close-out. Edge-case nuance recorded below. (iteration 4)
- **Fresh file:line re-verification of every anchor this iteration** — budget-exhausted by the dispatch-mandated re-read of iterations 001–004 + state. Captured anchors are cross-iteration-consistent and reused per read-budget-freshness; a single verification pass is deferred to Next Focus #1 (NOT a BLOCKED approach — verifiable in one cheap Read). (iteration 5)
- **Host-runtime leak kill (FIX-2 source) and per-agent `subagent_type` (FIX-1 deep type).** Both require OpenCode host runtime source, which is out of repo (iter-1/iter-2 established boundary). Candidate for reducer promotion to "Exhausted Approaches" if a follow-up iteration also cannot reach the host runtime; for now the repo-resident mitigants (sentinel, manifest-audit) are the actionable subset. (iteration 5)
- **opencode.json as a repo-resident model→dispatch lever** — confirmed empty (RC4/iter-4 F1); no further config search warranted. (iteration 5)
- **156 parent changelog/review for Claude-baseline sourcing** — adjacent to the iter-3 BLOCK ("156 … as GPT-run failure-log source"); treated as partially-blocked and NOT read, per contract §0 "BLOCKED categories must not be retried or varied." Documented as a bounded gap rather than exhausted. (iteration 6)
- **memory as a source of a captured Claude-vs-GPT loop-fidelity comparison** — 8-result scoped search returned nothing topical (F6). (iteration 6)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay) remains the standing out-of-repo dead end (iter-5, strategy §9). The `task: deny` lever (F3) is a repo-resident addition to that landscape, not a dead end. (iteration 6)
- **Empirical latency measurement (run logs):** no captured Claude-vs-GPT timing comparison exists (iter-6 F6 established memory is empty; 156 changelog BLOCKED iter-3/6). KQ3 timings are therefore [INFERENCE] from contract structure + line-count arithmetic, not measured. Bounded gap, not a method gap. (iteration 7)
- **Reading the full 1556-line YAML this iteration:** budget-managed via targeted grep (step names) + fresh read of the post-dispatch block (1061-1150) + reuse of iter-1/3/6 anchors for dispatch (811-857) and convergence (1313). Cross-iteration-consistent per read-budget-freshness. (iteration 7)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, model overlay, measured latency) remains the standing out-of-repo dead end (iter-5/6). (iteration 7)
- Definitive executor-provenance attribution of packets 122/116 to GPT-backed runs (iter-3 BLOCKED "Reading each of the 6 F16 packets' JSONL executor-provenance" — respected, not retried; the FIX×packet matrix is mode-agnostic — it validates against the *drift signature*, which is model-independent). (iteration 8)
- None new. The host-runtime boundary (per-agent `subagent_type`, leak source-kill, measured latency) remains the standing out-of-repo dead end (iter-5/6/7). (iteration 8)
- Reading the full 1436-line `post-dispatch-validate.ts` body (budget-managed to lines 1-120; the `PostDispatchValidateInput` type at 23-31 is sufficient evidence for the KQ9 plug-in claim; `validateIterationOutputs` body not read — a bounded read, not a method gap). (iteration 8)
- No new dead-end category for reducer promotion. The only bounded gap is cross-skill design choice: deep-context/ai-council need separate handling because they do not currently share the research/review post-dispatch validator path. (iteration 9)
- Retrying host-runtime routing, provenance, and model-attribution directions; these are blocked in strategy and not needed for repo-resident FIX-4a validation hardening. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] (iteration 9)
- Treating `computeIntegrityHash` as a drop-in file hash helper; it is JSON-object integrity tooling and explicitly excludes append-only JSONL/file-stream validation use. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:231] (iteration 9)
- All-loop enum hardening in the first patch: ruled out because deep-context currently records `status: "evidence"` and ai-council uses session/topic state rather than leaf iteration file semantics. [SOURCE: .opencode/commands/deep/assets/deep_context_auto.yaml:529] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:120] (iteration 10)
- Deep-research-only enum hardening: ruled out because deep-review explicitly shares the same six status values and the same validator hook. [SOURCE: .opencode/agents/deep-review.md:234] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:964] (iteration 10)
- No new reducer-promotion dead end. The only standing dead end remains out-of-repo host-runtime routing/leak/provenance attribution; this iteration did not retry it. (iteration 10)
- Reopening host-runtime routing/provenance/model attribution: ruled out by the existing exhausted-approach list and not needed for repo-resident FIX-4a planning. [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/010-gpt-deep-agent-routing/research/deep-research-strategy.md:122] (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Whether deep-context should later normalize to the six-status vocabulary or keep `evidence` as a mode-specific status behind a mode-specific validator.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
