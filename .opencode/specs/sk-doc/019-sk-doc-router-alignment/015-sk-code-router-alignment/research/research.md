---
title: "Deep Research: sk-code Typed-Pair Routing and Leaf Recall"
description: "Synthesized findings from an eight-iteration deep-research loop on sk-code router inputs, benchmark scoring, universal-preamble identity, live leaf-read evidence, leaf-recall optimizations, and anti-gaming validation."
trigger_phrases:
  - "sk-code leaf recall research"
  - "sk-code typed-pair routing findings"
  - "universal preamble ownership"
  - "two-tier resource map"
  - "ordered live leaf reads"
importance_tier: "important"
contextType: "research"
---
# Deep Research: sk-code Typed-Pair Routing and Leaf Recall

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | `rsr-2026-07-17T03-38-47Z` (generation 1) |
| Iterations | 8 of 8 |
| Stop | `maxIterationsReached`; convergence mode `off` |
| Executor | Native `deep-research` LEAF agent |
| Spec folder | `.opencode/specs/sk-doc/019-sk-doc-router-alignment/015-sk-code-router-alignment` |
| Starting evidence | 18/18 surface routing; about 50% leaf recall; typedPairRecall 0.729 pilot; untyped preamble contract error |
| Charter | Five questions answered narratively; implementation outcomes remain experimental |

## 2. Investigation Report

The loop traced sk-code routing through four different surfaces that must not be conflated: hub packet selection, deterministic leaf-router replay, typed identity conversion, and live executor evidence. It then compared three universal-preamble ownership designs, ranked recall improvements, and defined a preregistered validation matrix. The research was read-only outside this packet; no router, scorer, manifest, fixture, or report implementation was changed.

## 3. Executive Overview

**The primary routing fault is monolithic leaf selection, not surface selection.** The hub's workflow/surface route is already correct. Weak leaf recall and excess routed candidates arise later: unit-weight keyword matches select all intents within one point of the leader, then entire broad `RESOURCE_MAP` rows are unioned. The highest-value router change is a two-tier map with small required sets and predicate-gated supplements; specificity-aware intent weighting should follow only after that structural split. [SOURCE: research/iterations/iteration-006.md:9-17]

**The untyped `DEFAULT_RESOURCE` preamble is a separate identity defect.** Prefixing paths with `shared/` is insufficient. An ordinary declared `shared` mode would clear identity only through coordinated registry, router-topology, and manifest changes, so it cannot be called identity-only or assumed to preserve 18/18 surface routing. Prefer one truthful authored alias when a file has one logical mode owner; genuinely universal files need an explicit validated non-routable shared owner in the typed contract. [SOURCE: research/iterations/iteration-005.md:9-13] [SOURCE: research/iterations/iteration-008.md:11-17]

**Current live evidence does not measure actual ordered leaf use.** Mode B scores model-stated resources. `raw.observedReads` is diagnostic, deduplicated extraction from tool inputs without reliable order, success, canonical typed identity, or router-origin provenance. Actual Hit@k, Recall@k, MRR, and time/calls-to-first-expected require ordered successful-read events plus a separate route-decision provenance stream. [SOURCE: research/iterations/iteration-004.md:7-10] [SOURCE: research/iterations/iteration-008.md:15]

**The benchmark needs measurement repair before optimization claims.** The current corpus has no holdouts, D3 assumes exhaustive resource gold even where scenarios specify minimum pass sets, and committed routed counts do not reproduce against current source. Freeze a same-revision baseline, declare gold completeness, seal independent holdouts, and instrument live reads before evaluating router candidates. [SOURCE: research/iterations/iteration-006.md:9-17] [SOURCE: research/iterations/iteration-007.md:15-34]

## 4. Diagnosed Architecture

1. **Hub route:** `mode-registry.json` and `hub-router.json` choose workflow and surface packet entrypoints. The parent leaf projection does not directly choose these packets. [SOURCE: research/iterations/iteration-003.md:9]
2. **Deterministic replay:** `INTENT_SIGNALS` scores prompt text, all intents within `AMBIGUITY_DELTA` are selected, `DEFAULT_RESOURCE` seeds every route, and selected `RESOURCE_MAP` rows are unioned before surface/language slicing. [SOURCE: research/iterations/iteration-001.md:16-18]
3. **Typed projection:** raw resources resolve only through a declared packet prefix or authored shared alias, then must exist in `leaf-manifest.json`; unresolved preamble paths fail closed. [SOURCE: research/iterations/iteration-001.md:18]
4. **Scoring:** Mode A renormalizes only available D1-D4 dimensions; typed-pair recall is additive and fail-closed; D5 is a hard structural/verdict gate. Fitted/holdout is a partition summary, not another replay. [SOURCE: research/iterations/iteration-002.md:16-20]
5. **Live route:** Mode B dispatches the model and scores its route declaration. Tool-event reads are corroborative raw evidence, not the current D2/D3 metric source. [SOURCE: research/iterations/iteration-004.md:7-10]

## 5. Settled Findings

| Finding | Status | Evidence |
|---------|--------|----------|
| Surface routing and leaf routing are distinct; the known 18/18 surface result does not imply strong leaf recall | Confirmed | Iterations 1, 3, 6 |
| The four untyped defaults deterministically cause unresolved preamble entries | Confirmed | Iteration 1 |
| Contract errors and missed expected leaves are separate signals | Confirmed | Iteration 1 |
| A `shared/` prefix alone cannot resolve typed identity | Confirmed | Iterations 1, 5 |
| An ordinary declared `shared` mode changes governed hub topology | Confirmed | Iteration 5 |
| A truthful single-owner alias is conformant; duplicate aliases are order-dependent | Confirmed | Iterations 5, 8 |
| Genuinely universal preamble leaves need a new non-routable shared-owner contract | Recommended design; not implemented | Iteration 8 |
| Monolithic map unioning is the strongest evidenced candidate-set expansion mechanism | Confirmed against current source replay | Iteration 6 |
| Two-tier required/supplemental map selection is the highest-value router candidate | Proposed; requires experiments | Iteration 6 |
| Current D3 can over-penalize minimum-set gold as waste | Confirmed contract mismatch | Iteration 6 |
| Current artifacts cannot prove holdout generalization or ordered live-read improvement | Confirmed evidence gap | Iterations 2, 4, 7 |

## 6. Constraints and Limitations

- No implementation candidate was run; projected metric invariants remain falsifiable predictions.
- The committed baseline reports 83/100 and zero holdouts, while carried context cited about 65/100. The older number lacks current artifact provenance and must not be used as the candidate baseline. [SOURCE: research/iterations/iteration-001.md:20]
- Current-source replay produced routed counts different from the committed report, requiring a same-revision baseline before quantitative comparison. [SOURCE: research/iterations/iteration-006.md:44]
- `raw.observedReads` cannot establish read order, success, canonical leaf identity, or causal router origin. [SOURCE: research/iterations/iteration-008.md:15]
- Graph convergence was advisory-unavailable because the local runtime lacked `better-sqlite3`; convergence mode was off and the hard iteration cap remained authoritative.
- The generated resource map contains six false-looking `MISSING` rows caused by relative packet paths or line-range text being treated as paths. Its existing-path inventory remains useful, but missing-path counts are not a quality metric for this run. [SOURCE: research/resource-map.md:11-17,26-31,39-60]

## 7. Integration Patterns

- Keep **identity remediation** and **router optimization** as separate candidates. Identity-only work may change manifest digest, unresolved count, typed eligibility/recall, error class, and verdict, but must preserve raw selected resources, flat hits, D1/D2/D3, and the 18-case surface vector.
- Router-changing work must produce new independently authored leaf hits in both fitted and sealed holdout partitions while preserving negative, route-budget, topology, typed-contract, live, and surface gates.
- Route-decision provenance and successful-read provenance are separate streams. Joining them proves correspondence; causal attribution still needs controlled paired intervention.
- Generated `leaf-manifest.json` and benchmark report JSON are outputs, never optimization surfaces.

## 8. Implementation Guide

**P0-1. Freeze measurement inputs.** Generate a fresh same-revision baseline; record router source, fixture, manifest, model/settings, and 18-case surface-vector digests. Author sealed holdouts before candidate output exists.

**P0-2. Repair gold and D3 semantics.** Add explicit `minimum | exhaustive` resource-gold completeness. Keep precision-style D3 for exhaustive rows; use forbidden-prefix and route-count budgets for minimum rows.

**P0-3. Instrument ordered live evidence.** Record append-order events with scenario/run ID, event index, monotonic time, operation, requested input, canonical resolved path, success, manifest digest, and typed identity. Count only successful exact file reads as leaves; keep glob/grep/Bash hints diagnostic.

**P0-4. Add route-decision provenance.** Record each candidate's origin (`DEFAULT_RESOURCE` or contributing intent/map row), score/tie result, and surface/language retention.

**P1-1. Resolve universal ownership.** Use a truthful single-owner alias where possible. For genuinely mode-neutral files, extend the typed contract with a validated non-routable shared owner; do not add an ordinary routable `shared` mode as an identity-only fix.

**P1-2. Test two-tier map selection.** Split each broad map row into a small `required` set and predicate-gated supplements keyed by specific phrases, target paths, languages, and phase evidence.

**P1-3. Test specificity-aware scoring.** After map tiering, weight exact/narrow phrases above generic verbs and constrain near-tie unions. Keep this in the retained leaf router first; do not perturb hub surface signals.

## 9. Verification Commands

Use the benchmark's checked-in runner and drift guards from the implementation packet. Required checks are behavioral rather than tied here to an unverified command spelling:

```text
1. Capture same-revision baseline and all input digests.
2. Run fitted + sealed holdout + negative router replay.
3. Verify exact 18/18 surface vector equality.
4. Verify D5 and hub/registry conformance.
5. Compare raw selected-resource sets for identity-only candidates.
6. Run fixed live holdouts with ordered successful-read provenance.
7. Reject on any hard-gate failure, regardless of aggregate score.
```

## 10. Acceptance Matrix

| Gate | Acceptance criterion |
|------|---------------------|
| Fitted | At least one new independently authored expected-leaf hit; mean recall non-decreasing; no critical row regression |
| Holdout | Non-empty sealed partition; at least one new hit; recall non-decreasing; generalization gap not wider |
| Negative | Zero forbidden leaks; no broad-intent activation; route budgets preserved |
| D3 | Exhaustive rows non-decreasing; minimum rows use forbidden/budget contracts |
| Typed contract | Zero excluded oracle rows, unresolved entries, cap breaches, or contract errors; typed recall non-decreasing |
| Identity-only | Raw routes, flat hits, D1/D2/D3, and 18/18 surfaces exactly unchanged |
| Topology | D5=100; registry/hub checks green; mutation test aborts on digest drift |
| Live | Route declaration present; surfaces correct; stated recall non-decreasing; ordered-read claims fail closed without provenance |
| Surface | Exact preregistered 18-case vector equality; aggregate compensation forbidden |

## 11. Recommendations

1. Repair measurement before changing routing: baseline freshness, gold completeness, sealed holdouts, and ordered live provenance are prerequisites.
2. Keep universal-preamble ownership separate from recall optimization. Prefer truthful aliases; otherwise add a non-routable shared-owner type.
3. Test two-tier `RESOURCE_MAP` selection first. It can add missing expected leaves while reducing unrelated candidates.
4. Test specificity-aware signals only after map tiering, because broad keyword additions under current union semantics can worsen waste.
5. Treat acceptance as a conjunction of hard gates, never as one weighted aggregate.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Prefix-only `shared/` rewrite | `shared` is not a declared packet or authored alias | leaf-resource-contract + mode registry | 1, 5 |
| Ordinary `shared` mode as identity-only fix | Expands governed hub topology and requires router/tie-break changes | hub schema + registry | 5, 8 |
| Multiple aliases for one shared file | First-match resolution makes ownership order-dependent | leaf-resource-contract | 5, 8 |
| Silent exclusion of preamble | Fail-open behavior absent from typed authority | leaf-resource-contract | 5, 8 |
| Treat contract error as recall cause | Unresolved resources and expected-leaf misses are independent signals | baseline rows | 1 |
| Broad keyword additions before map tiering | Activates more monolithic rows under near-tie union | router replay | 6 |
| Manifest/report JSON edits as recall improvement | Identity/output changes occur after raw selection | loader + replay | 6, 7, 8 |
| Current D3 as exhaustive waste oracle | Scenario gold includes minimum pass sets | playbook + scorer | 6 |
| Fitted-only acceptance | Current holdout partition is empty | baseline | 2, 7 |
| Post-hoc thresholds or holdouts | Candidate-contaminated evidence permits fixture fitting | validation matrix | 7 |
| `raw.observedReads` as ordered/causal proof | Deduplicated tool-input extraction lacks success, order, and origin | live executor | 4, 7, 8 |
| Aggregate-only acceptance | Surface, topology, suppression, and contract regressions can be averaged away | validation matrix | 7 |

## Divergence Map

No divergent pivots were run because `convergence_mode=off`. Saturated directions were captured as ruled-out approaches rather than Council pivots. The investigated frontier covered deterministic routing, benchmark composition, live telemetry, ownership semantics, recall optimization, and validation. Remaining frontier is experimental: candidate implementation and same-revision measurement.

## 12. Open Questions

- Can every universal preamble file be assigned one truthful existing-mode owner, avoiding a new non-routable shared-owner category?
- What exact schema should represent non-routable shared ownership without weakening fail-closed typed-pair validation?
- What Recall@k and route-budget thresholds should be preregistered after the fresh same-revision baseline is captured?
- Does a two-tier map improve both sealed holdout recall and ordered successful-read recall under fixed live settings?
- Can Codex provide exact-read provenance, or must actual-read scoring remain OpenCode-only with Codex marked unavailable?

## 13. Sources and References

- Router authority: `.opencode/skills/sk-code/shared/references/smart_routing.md`
- Hub topology: `.opencode/skills/sk-code/SKILL.md`, `mode-registry.json`, `hub-router.json`
- Typed identity: `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`, `generate-leaf-manifest.cjs`
- Benchmark runner/scorer: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`
- Baseline/live reports: `.opencode/skills/sk-code/benchmark/baseline/`, `.opencode/skills/sk-code/benchmark/live_final/`
- Scenario authority: `.opencode/skills/sk-code/manual_testing_playbook/`
- Detailed evidence: `research/iterations/iteration-001.md` through `iteration-008.md`
- Resource inventory: `research/resource-map.md`

## 14. Iteration Trail

| Iter | Focus | Ratio | Status | Key outcome |
|-----:|-------|------:|--------|-------------|
| 1 | Router + manifest contract | 0.80 | complete | Separated contract errors from recall misses |
| 2 | Benchmark pipeline | 0.90 | complete | D1-D5, typed lane, fitted/holdout semantics |
| 3 | Runtime boundaries | 0.88 | complete | Separated hub, replay, and declared defaults |
| 4 | Live telemetry | 0.88 | complete | Stated resources scored; reads diagnostic only |
| 5 | Shared ownership | 0.80 | complete | Ordinary shared mode rejected as identity-only fix |
| 6 | Recall optimizations | 0.90 | complete | Two-tier map ranked first; D3 prerequisite found |
| 7 | Validation matrix | 0.90 | complete | Eight hard gates and anti-gaming sequence |
| 8 | Ownership/provenance synthesis | 0.50 | complete | Closed charter with explicit experimental boundary |

## 15. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 8 of 8
- Questions answered: 5/5 narratively; reducer literal matching formally resolved 3/5
- Remaining charter questions: 0; Section 12 contains implementation experiments
- Last three ratios: 0.90, 0.90, 0.50
- Convergence threshold: 0.05; convergence mode was `off`
- Average newInfoRatio: 0.82
- Graph convergence: unavailable because local runtime lacked `better-sqlite3`; advisory events are recorded in state
- Divergence: no pivots

## 16. Next Steps

1. Plan two isolated implementation experiments: measurement/ownership first, router selection second.
2. Preregister fixtures, holdouts, digests, thresholds, route budgets, and the 18-case surface vector before candidate work.
3. Implement baseline/gold/live-provenance prerequisites and the shared-owner decision with raw-route invariance.
4. Test two-tier map selection, then specificity-aware scoring, each against the full acceptance matrix.

## 17. References

This file is the canonical synthesis. Detailed cited evidence remains in `research/iterations/`. The deterministic inventory is `research/resource-map.md`; loop state is in `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-strategy.md`, and `research/deep-research-dashboard.md`.
