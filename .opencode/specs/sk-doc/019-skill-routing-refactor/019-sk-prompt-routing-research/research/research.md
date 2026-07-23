---
title: "Deep Research: sk-prompt Typed-Pair Routing Alignment"
description: "Synthesized findings from a five-iteration deep-research loop on sk-prompt mode routing, prompt-models resource coverage, benchmark scoring, scenario eligibility, typed-gold authoring, and implementation order."
trigger_phrases:
  - "sk-prompt typed-pair routing findings"
  - "prompt-models resource map research"
  - "sk-prompt benchmark routing score"
  - "sk-prompt typed gold scenarios"
importance_tier: "important"
contextType: "research"
---
# Deep Research: sk-prompt Typed-Pair Routing Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | `rsr-2026-07-17T05-19-12Z` (generation 1) |
| Iterations | 5 of 5 |
| Stop | `maxIterationsReached`; convergence mode `off` |
| Executor | Native `deep-research` LEAF agent |
| Spec folder | `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research` |
| Starting evidence | Two workflow modes; one packet map; hub aggregate 100; child D5-only/null report; 32 authored scenarios; zero typed gold |
| Outcome | All five charter questions answered; implementation is separately gated |

## 2. Investigation Report

The loop mapped both public workflow modes to their child packets and leaves, defined and resolve-checked the missing `prompt-models` route map, traced benchmark loading and scoring, reconciled the two apparently conflicting score artifacts, classified all 32 authored scenarios, and reduced implementation to a dependency-ordered handoff. Research remained read-only outside this packet. No sk-prompt router, resource map, scenario, benchmark baseline, or source configuration was changed.

## 3. Executive Overview

**Keep the existing first-layer workflow router and add a second-layer leaf router.** `prompt-improve` and `prompt-models` are intentionally workflow packets. `hub-router.json` should continue selecting a workflow and packet entrypoint; a separate hub-level map should select packet-qualified disk paths and emit canonical `(workflowMode, leafResourceId)` pairs. Converting `prompt-models` into a registry surface packet would break the documented topology. [SOURCE: research/iterations/iteration-001.md:16-26]

**The complete `prompt-models` route-load map has seven resolving Markdown leaves.** Five leaves are model-selected profiles. `_index.md` is always loaded and `pattern_index.md` is a post-selection bridge. Aliases are signals that normalize to the five profiles, while eight other references/assets are supporting-only under the current router. [SOURCE: research/iterations/iteration-003.md:7-23]

**The hub's aggregate 100 is not a typed-routing score.** It is normalized over four packet-selection scenarios with D1-intra and D2 measured, D1-inter/D3/D4 null, and D5 as a separate structural gate. The D5=16/aggregate-null artifact belongs to the zero-scenario `prompt-improve` child target. Current typed routing remains unmeasurable because the hub has zero typed-gold rows and null expected/observed surfaces. [SOURCE: research/iterations/iteration-004.md:13-23]

**The 32 scenarios split into 7 leaf-routing candidates, 4 command/mode cases, 12 behavior/scoring/contract cases, and 9 guard/failure/recovery cases.** The smallest useful typed-gold seed is two atomic hub rows: generic prompt improvement and a named DeepSeek model request. This covers both modes without deriving gold from router output. [SOURCE: research/iterations/iteration-005.md:7-12]

## 4. Diagnosed Architecture

1. **Mode selection:** `mode-registry.json` preserves two public workflow identities. `hub-router.json` chooses `prompt-improve`, `prompt-models`, an ordered bundle, or defer. [SOURCE: research/iterations/iteration-001.md:16-18]
2. **Child routing:** `prompt-improve` has seven intent keys over six unique Markdown leaves; `RAW` intentionally selects no leaf. [SOURCE: research/iterations/iteration-001.md:20]
3. **Model routing:** `prompt-models` loads its index, normalizes a named model or alias, then loads one profile and the pattern index. [SOURCE: research/iterations/iteration-001.md:22]
4. **Hub leaf selection:** packet-qualified raw paths such as `prompt-models/references/models/glm-5.2.md` provide static disk identity. The canonical emitted pair remains `(prompt-models, references/models/glm-5.2.md)`. [SOURCE: research/iterations/iteration-001.md:24]
5. **Manifest projection:** generate `leaf-manifest.json` after resource declarations and before typed fixture approval. Topology validation must prove mode membership, containment, uniqueness, and resolution. [SOURCE: research/iterations/iteration-002.md:11-17]
6. **Benchmark projection:** typed expectations are opt-in. Valid typed recall feeds D1-intra/D2 and typed precision feeds D3; absent typed expectations are neither typed passes nor typed failures. [SOURCE: research/iterations/iteration-004.md:17-21]

## 5. Settled Findings

| Finding | Status | Evidence |
|---------|--------|----------|
| Both public entries remain workflow packets | Confirmed | Iteration 1 |
| `prompt-improve` exposes six unique route leaves | Confirmed | Iteration 1 |
| `prompt-models` needs seven route-load leaves | Confirmed, 7/7 resolve | Iteration 3 |
| Five model profiles are selection leaves; index and pattern index are lifecycle leaves | Confirmed | Iteration 3 |
| Aliases are signals, not duplicate leaves | Confirmed | Iteration 3 |
| Eight additional model resources are supporting-only under current load branches | Confirmed | Iteration 3 |
| Hub aggregate 100 measures four packet-selection rows, not typed leaves | Confirmed | Iteration 4 |
| Child D5=16/null report is a different target with zero scenarios | Confirmed | Iteration 4 |
| Typed routing currently has a zero-row denominator | Confirmed | Iteration 4 |
| The post-typed numeric score cannot be predicted before replay | Confirmed limitation | Iteration 4 |
| Authored corpus count is 4 hub plus 28 child scenarios | Confirmed | Iteration 5 |
| Exactly seven scenarios are positive leaf-routing candidates | Confirmed classification | Iteration 5 |
| Two atomic hub scenarios are sufficient for the first cross-mode typed seed | Confirmed authored-intent proposal | Iteration 5 |
| No further routing research is required before implementation | Confirmed handoff | Iterations 2 and 5 |

## 6. Constraints and Limitations

- The research did not author `shared/references/smart_routing.md`, `prompt-models` map declarations, `leaf-manifest.json`, or typed scenario metadata. Those are implementation work.
- A future typed numeric score is unknown until valid gold is authored, manifest-validated, replayed, and observed. Treating the current 100 as that score would be false. [SOURCE: research/iterations/iteration-004.md:19-21]
- The reducer reports three questions open because its legacy-import strings retained Markdown punctuation while three leaf records used normalized equivalents. The iteration narratives directly answer those questions; this is a reducer text-matching discrepancy, not an evidence gap. [SOURCE: research/iterations/iteration-001.md:28-37] [SOURCE: research/iterations/iteration-003.md:50-53] [SOURCE: research/iterations/iteration-004.md:53-59]
- Graph convergence was unavailable because `better-sqlite3` is missing. Convergence mode was off, so the five-iteration cap remained authoritative.
- Spec Memory was unavailable because the compiled package could not resolve `@spec-kit/shared`. All findings use cited local evidence.
- `research/resource-map.md` is reducer-generated from structured deltas. It is a deterministic evidence inventory, not the proposed production `prompt-models` map.

## 7. Integration Patterns

- Keep workflow selection, packet-qualified disk selection, and canonical pair emission as separate stages.
- Preserve the current default mode, ambiguity delta, explicit-hint precedence, ordered-bundle semantics, and defer behavior before tuning vocabulary.
- Represent hub map values as packet-qualified raw addresses, but emit child-local `leafResourceId` values.
- Keep `_index.md` and `pattern_index.md` role metadata distinct from model-selected profile leaves so lifecycle loads do not masquerade as model choice.
- Generate and check the leaf manifest before fixture topology validation.
- Author gold from scenario intent only. Router output may validate behavior after authoring but may not define the oracle.
- Compare same-corpus before/after reports across D1-intra, D2, D3, D5, route diagnostics, oracle exclusions, and aggregate score.

## 8. Implementation Guide

| Gate | Work | Required result |
|-----:|------|-----------------|
| 0 | Freeze current first-layer behavior and reports | Same revision, corpus counts, dimensions, D5, route-gold count, oracle exclusions, and aggregate recorded |
| 1 | Add the hub-level second-layer router contract | Packet-qualified map values; no change to workflow packet kinds or packet entrypoints |
| 2 | Add/align packet maps | Six `prompt-improve` leaves and seven `prompt-models` route-load leaves; all addresses resolve |
| 3 | Generate `leaf-manifest.json` | Unique `(workflowMode, leafResourceId)` composites; byte-stable `--check` |
| 4 | Author the two-row typed seed | Hub generic improve and named DeepSeek rows carry independent expected pairs |
| 5 | Run topology and fallback gates | Zero oracle faults; unknown/ambiguous/missing-resource behavior unchanged |
| 6 | Capture the first typed baseline | Non-zero route-gold denominator and observed typed diagnostics for both modes |
| 7 | Expand deliberately | Add GLM, then review the four child routing candidates before any lexical tuning |

## 9. Candidate Resource Maps

### prompt-improve

Preserve the six existing packet-local leaves, exposed at hub scope with the `prompt-improve/` prefix. `RAW` stays a no-leaf route. [SOURCE: research/iterations/iteration-001.md:20]

### prompt-models

| Map key | Packet-qualified address | Canonical pair role |
|---------|--------------------------|---------------------|
| `MODEL_INDEX` | `prompt-models/references/models/_index.md` | Lifecycle: always/default |
| `PATTERN_INDEX` | `prompt-models/references/pattern_index.md` | Lifecycle: post-selection bridge |
| `PROFILE_DEEPSEEK_V4_PRO` | `prompt-models/references/models/deepseek-v4-pro.md` | Model-selected |
| `PROFILE_KIMI_K2_7_CODE` | `prompt-models/references/models/kimi-k2.7-code.md` | Model-selected |
| `PROFILE_MINIMAX_M3` | `prompt-models/references/models/minimax-m3.md` | Model-selected |
| `PROFILE_MIMO_V2_5_PRO` | `prompt-models/references/models/mimo-v2.5-pro.md` | Model-selected |
| `PROFILE_GLM_5_2` | `prompt-models/references/models/glm-5.2.md` | Model-selected |

All seven addresses resolved during iteration 3. Aliases map to these canonical profile keys and do not create new entries. [SOURCE: research/iterations/iteration-003.md:11-28]

## 10. Scenario and Gold Matrix

| Class | Count | Treatment |
|-------|------:|-----------|
| Genuine positive leaf routing | 7 | Candidate typed gold after authored-intent review |
| Command/mode detection | 4 | Keep in mode/command lane |
| Behavior/scoring/contract | 12 | Keep untyped unless a separate positive leaf oracle is explicitly authored |
| Guard/failure/recovery | 9 | Keep as negative/fallback fixtures, not positive leaf gold |

First seed:

| Scenario | Expected pair | Reason |
|----------|---------------|--------|
| Hub `hub_routing/generic_prompt_improve.md` / SP-001 | `(prompt-improve, references/depth_framework.md)` | Authored request explicitly enters generic DEPTH/CLEAR improvement |
| Hub `hub_routing/named_model_prompt_models.md` / SP-002 | `(prompt-models, references/models/deepseek-v4-pro.md)` | Authored request explicitly names the DeepSeek profile |

Next expansion: hub SP-004 for GLM, then child SP-005, SP-006, SP-007, and SP-028 only after multi-input, full-inventory, bundle, and conditional-format expectations are made atomic or explicitly represented. [SOURCE: research/iterations/iteration-005.md:8-17]

## 11. Recommendations

1. Preserve the existing first-layer router and add the second-layer router as a separate contract.
2. Author the seven-leaf `prompt-models` map with role metadata; do not add alias or support-only pseudo-leaves.
3. Generate the manifest before typed fixture approval.
4. Start with exactly the two atomic hub rows and capture the first real typed baseline.
5. Keep ambiguous and zero-signal scenarios as fallback fixtures, not positive typed gold.
6. Expand the corpus only after the two-row baseline is valid; tune lexical weights last.
7. Report full dimension and oracle deltas. Never present aggregate 100 alone as routing health.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Convert `prompt-models` to a registry surface packet | Both modes are intentionally workflow packets and `prompt-models` has external consumers | mode registry and hub contract | 1 |
| Use packet `SKILL.md` pointers as leaf gold | `hubLoadAddress` and `leafResourceId` are distinct contracts | parent-hub schema | 1-2, 5 |
| Replace hub packet entrypoints with leaves | Conflates workflow selection with second-layer resource selection | dependency trace | 2 |
| Treat UNKNOWN as the default mode's normal leaves | No-keyword fallback must not fabricate typed pairs | router scaffold | 2 |
| Create one leaf for every model alias | Aliases normalize to five canonical profiles | model router | 3 |
| Promote every discovered Markdown file | Discoverability is not route selection | model load branches | 3 |
| Treat JSON/support assets as typed leaves | Current router guard and load levels exclude them | model router | 3 |
| Treat aggregate 100 as full routing coverage | Typed denominator is zero and three dimensions remain null | benchmark report and scorer | 4 |
| Treat the child D5=16 report as the hub baseline | Different target and zero-scenario denominator | report provenance | 4 |
| Count untyped rows as typed pass/fail | Typed taxonomy is opt-in | loader contract | 4 |
| Type all 32 scenarios | Twenty-five do not assert a positive leaf-selection oracle | deterministic census | 5 |
| Start with ambiguous or bundled cases | Conflates contract enablement with fallback/breadth behavior | authored scenarios | 5 |
| Predict a post-typed numeric score | Gold and observed typed pairs do not exist yet | scorer requirements | 4-5 |

## Divergence Map

No divergent pivots ran because `convergence_mode=off`. Forced depth moved from topology and map completeness to implementation order, benchmark provenance, and corpus authoring. The remaining frontier is implementation and measurement, not additional routing research.

## 12. Open Questions

- What numeric routing score will the two-row typed baseline produce? This is intentionally deferred to implementation because it requires observed replay data.
- Should `_index.md` and `pattern_index.md` be included in any scenario's expected pair set or tracked as lifecycle telemetry only? The recommendation is lifecycle telemetry unless a scenario explicitly tests those loads.
- Which of child SP-005/SP-006/SP-007/SP-028 should be made atomic first after the hub seed?

No routing-research blocker remains.

## 13. Sources and References

- Hub topology: `.opencode/skills/sk-prompt/SKILL.md`, `mode-registry.json`, `hub-router.json`
- Child routers: `.opencode/skills/sk-prompt/prompt-improve/SKILL.md`, `.opencode/skills/sk-prompt/prompt-models/SKILL.md`
- Model inventory: `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md`
- Typed identity and manifests: `.opencode/skills/sk-doc/create-skill/`
- Benchmark pipeline: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`
- Scenario authority: `.opencode/skills/sk-prompt/**/manual_testing_playbook/`
- Detailed evidence: `research/iterations/iteration-001.md` through `iteration-005.md`
- Deterministic evidence inventory: `research/resource-map.md`

## 14. Iteration Trail

| Iter | Focus | Ratio | Status | Key outcome |
|-----:|-------|------:|--------|-------------|
| 1 | Two-mode topology | 1.00 | complete | Preserved workflow topology; mapped 6 + 7 implied leaves |
| 2 | Dependency order | 0.93 | complete | Ordered router, maps, manifest, gold, topology, measurement, tuning |
| 3 | Model resource map | 0.90 | complete | Seven resolving route-load leaves; eight support-only resources |
| 4 | Benchmark provenance | 0.92 | complete | Separated hub 100 from child D5=16/null; typed score remains unknown |
| 5 | Scenario census | 0.92 | complete | Classified 32 rows and defined two-row cross-mode seed |

## 15. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5 of 5
- Questions answered by evidence: 5/5
- Open routing-research blockers: 0
- Last three ratios: 0.90, 0.92, 0.92
- Average newInfoRatio: 0.93
- Convergence threshold: 0.05; convergence mode was `off`
- Route proof: all five iteration records include `target_agent: deep-research`, `agent_definition_loaded: true`, and `mode: research`
- Reducer corruption count: 0
- Reducer question display: 2/5 due exact-text normalization mismatch; iteration evidence answers the remaining three
- Graph convergence: unavailable because `better-sqlite3` was missing; advisory blockers recorded
- Divergence: no pivots

## 16. Next Steps

1. Create or use a sibling implementation packet based on Section 8.
2. Freeze same-revision hub and child reports plus fallback fixtures.
3. Add the second-layer router and aligned packet resource maps.
4. Generate/check the manifest and author the two atomic typed rows.
5. Run topology, fallback, D5, and Lane-C gates; publish the first real typed baseline.
6. Expand to GLM and selected child routing cases before considering lexical tuning.

## 17. References

This file is the canonical synthesis. Detailed cited evidence remains in `research/iterations/`; the generated resource inventory is `research/resource-map.md`; loop state is in `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-strategy.md`, and `research/deep-research-dashboard.md`.
