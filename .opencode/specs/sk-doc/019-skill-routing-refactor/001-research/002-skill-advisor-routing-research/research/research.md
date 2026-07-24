---
title: "Deep Research: system-skill-advisor Usefulness and Routing Integration"
description: "Synthesized findings from a 10-iteration deep-research loop on the skill advisor's advisor_recommend pipeline, 5-lane RRF fusion confidence calibration, hook/MCP threshold parity, CLI transport fallback, and drift-guard vocabulary coverage, with a prioritized implementable improvement plan."
trigger_phrases:
  - "skill advisor routing research findings"
  - "advisor confidence calibration"
  - "task intent floor saturation"
  - "executor delegation ambiguity mismatch"
  - "advisor transport fallback budget"
importance_tier: "important"
contextType: "research"
---
# Deep Research: system-skill-advisor Usefulness and Routing Integration

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | dr-20260716-054704-skill-advisor-routing (generation 1) |
| Iterations | 10 of 10 (stop: maxIterationsReached, stop_policy=max-iterations) |
| Executor | cli-codex / gpt-5.6-sol / reasoning=high / service_tier=fast |
| Spec folder | `.opencode/specs/sk-doc/019-sk-doc-router-alignment/011-skill-advisor-routing-research` |
| Grounding | Tier-2 gpt-5.6-luna skill-benchmark finding: routing quality is strongly skill-specific; the advisor is the front-line router |
| Key questions | 5/5 answered (Q1 i1+i8, Q4 i2, Q2 i3, Q3 i4+i5, Q5 i6; hardened i7-i10) |

## 2. Investigation Report

The charter asked how system-skill-advisor works today, how genuinely useful it is, and how it integrates into skill routing — then required concrete, implementable improvements toward "perfect routing" (the correct skill found easily and confidently, at the right moment). Four investigation lanes were specified: (1) the advisor_recommend MCP path and its 5-lane RRF fusion confidence pipeline, ambiguity margin, and compat-contract thresholds; (2) the Claude-side user-prompt-submit hook brief and its CLI fallback; (3) provable sync between the hook's shouldFireAdvisor gate and MCP threshold resolution; (4) routing-registry-drift-guard parity against sk-doc's hub vocabulary. All were answered with file:line evidence, plus a current-source empirical calibration run (iteration 8) and a scorer output-coherence defect quantified across frozen fixtures (iterations 9-10).

## 3. Executive Overview

**The advisor is genuinely useful, but its confidence is policy-quantized at the 0.8 boundary.** Current-source holdout accuracy is 73.08% (57/78) with 85.25% selective precision — the advisor routes correctly far more often than not, and its abstention behavior (coverage 78.21%) is meaningful. But the confidence number that CLAUDE.md Gate 2 treats as a >=0.8 must-invoke signal is dominated by categorical policy floors: exactly `0.82` was the leading confidence on 31% of the full corpus and 48% of the frozen ambiguity slice, with plateau correctness of only ~58-65%. Confidence >= 0.8 does not mean 80% correct.

**Three confirmed correctness defects lead the fix list:**
1. The Claude hook's no-brief output contract has drifted — 4 of 11 targeted hook tests are red because the implementation now emits a governance directive where tests expect `{}`.
2. The CLI fallback can be starved to 1 ms — the primary producer receives the whole 2500 ms hook budget and the fallback only gets the remainder, defeating the recovery path exactly when the primary times out.
3. Result-level `ambiguous: true` coexists with an unattributed leader — the executor-delegation override mutates rankings after `ambiguousWith` attribution but before the final ambiguity boolean; 7 of 8 frozen positive executor routes reproduce the incoherence, and a stale Codex fixture makes the parity suite red (revived `cli-codex` now routes where the fixture expects abstention).

**One architectural boundary is unguarded:** the named routing-registry-drift-guard covers only system-deep-loop's projection; metadata-routed hubs like sk-doc have zero advisor-discovery coverage — hub-internal vocabulary can stay perfectly aligned while advisor-level discoverability silently degrades.

**Threshold tuning cannot fix any of this:** a 12-cell grid over confidence {0.78, 0.80, 0.82} x uncertainty {0.30, 0.35, 0.40} produced identical holdout outcomes; raising confidence to 0.84 destroys 24 points of coverage for 2.85 points of precision.

## 4. Core Architecture (as diagnosed)

- **Four-layer MCP path:** `advisor-server.ts` (CallToolRequestSchema handler) -> `tools/index.ts::dispatchTool` -> `handlers/advisor-recommend.ts::handleAdvisorRecommend` -> `lib/scorer/fusion.ts::scoreAdvisorPrompt`. The handler resolves thresholds, checks freshness + artifact integrity (SQLite quick_check, cached per generation), keys an HMAC prompt cache, and sanitizes output. Freshness failure is fail-open: `absent`/`unavailable` return empty recommendations with warnings; `stale` degrades only the `graph_causal` lane (advisor-recommend.ts:87,146,369).
- **Five live lanes**, weights summing to 1.00: `explicit_author` 0.42, `lexical` 0.28, `graph_causal` 0.13, `derived_generated` 0.12, `semantic_shadow` 0.05 (lane-registry.ts:8-48). Despite its name, `semantic_shadow` is live; a separate BM25 lane is the real shadow-only lane. `graph_causal` derives from the union of explicit/lexical/derived matches.
- **RRF is rank fusion, not confidence:** `fuseAdvisorLaneRanks` uses the shared `fuseResultsMulti` with `k=8`, zero overlap bonuses, graduated query-local min-max normalization (fusion.ts:299-326; shared rrf-fusion.ts:445-555). Public confidence is a separate policy function over `liveNormalized = fusedScore / liveWeightTotal`.
- **Confidence is quantized policy:** base `0.52 + min(1, liveNormalized*1.25)*0.43`, then floors — read-only-allowed/task-intent/direct-evidence floor at `0.82`, derived-dominant pins `0.72`, hard ceiling `0.95`, plus a token-stuffing dispersion guard (fusion.ts:381-429; scoring-constants.ts:169).
- **Uncertainty is evidence-count banding:** starts 0.42; drops to 0.30/0.22/0.18 at 1/3/5 evidence strings; -0.06 for direct >=0.75; +0.08 when confidence <0.8; +0.04 near-tie pressure; clamped [0.08, 0.95] (fusion.ts:431-445). Counts evidence strings, not independence — correlated matches lower uncertainty as readily as diverse evidence.
- **Ambiguity (`0.05` margins) unions score-nearness and confidence-nearness** among threshold-passing candidates (ambiguity.ts:7-57). Because confidence floors collide at 0.82, confidence-clustering can flag candidates whose score gap exceeds 0.05 — the flag measures a mixture of rank proximity and policy collision.
- **Two-stage hub routing by design:** the advisor discovers a hub (e.g. sk-doc) from `graph-metadata.json` discovery fields via the metadata routing class; the hub's own `hub-router.json` then selects the workflow mode from its richer 113-alias vocabulary. Full alias mirroring into graph metadata would be the wrong invariant.
- **Claude hook path is native-local first, warm-daemon CLI second:** `user-prompt-submit.ts` truncates at 64 KiB, applies `shouldFireAdvisor`, calls `buildSkillAdvisorBrief` (Python subprocess), and only on `fail_open` or `degraded+unavailable` calls `buildSkillAdvisorBriefFromCli` — which is `--warm-only`, deep-probes the socket, never cold-spawns, and returns retryable exit 75 (user-prompt-submit.ts:187-218; skill-advisor-cli-fallback.ts:224-262,499).

## 5. Technical Specifications (settled findings)

| Finding | Evidence |
|---------|----------|
| Holdout accuracy 73.08% (57/78), coverage 78.21%, selective precision 85.25% | Iteration-8 joined current-source run under the ratchet's frozen filesystem projection |
| Full corpus 76.68% (148/193); frozen ambiguity slice 64.00% (16/25), selective precision 55.00% | Same run; contested prompts are where routing is weakest |
| `0.82` floor saturation: 31.09% of corpus, 25.64% of holdout, 48.00% of ambiguity slice; plateau correctness 63%, 65%, 58% | scoring-constants.ts:45 `taskIntentFloor`; fusion.ts:385-443 |
| Threshold grid insensitivity: conf {0.78,0.80,0.82} x unc {0.30,0.35,0.40} -> identical 57/78, 61/78, 85.25% | Iteration-8 grid; conf 0.84 -> 41/78 correct, 42/78 covered |
| shouldFireAdvisor is an eligibility gate, NOT a duplicate threshold path | prompt-policy.ts:46-100 with its own `SPECKIT_ADVISOR_PROMPT_POLICY_*` overrides |
| Hook + MCP share one threshold resolver; no numeric drift found | contract.ts:5-35 -> skill-advisor-brief.ts:112-147 and advisor-recommend.ts:369-424 |
| Env overrides freeze at module load (constants); call overrides stay dynamic | contract.ts:17; test-isolation caveat, not live drift |
| Ambiguity incoherence: attribution pre-override, boolean post-override | fusion.ts:759-770 vs 839-868; executor-delegation.ts:411-498 |
| Frozen executor fixture: 8:0 injection-to-existing split; existing-candidate branch (lines 470-477) has zero e2e coverage; 7/8 routes reproduce the mismatch | executor-delegation-cases.json + iteration-10 source-loaded probe |
| Stale Codex fixture: revived `cli-codex` + `delegate to codex` alias now routes where `suppressed-codex-abstain` expects `none` — 3 test failures | cli-external-orchestration/hub-router.json:26-49; executor-delegation.vitest.ts:165-228 |
| Both committed calibration baselines stale vs clean corpus (193 rows, SHA a270d01a... vs recorded 200/4b50b4ad... and 193/b2c3a869...) | bench/scorer-calibration-baseline.json:3-7; scorer-eval-baseline.json:3-7 |
| Older calibration baseline: ECE 0.138314; 0.8-0.9 bucket at 0.8457 confidence / 0.7059 accuracy | bench/scorer-calibration-baseline.json:6-67 |
| CLI fallback forwards both thresholds and reconstructs `passes_threshold` from daemon-echoed effective thresholds | skill-advisor-cli-fallback.ts:269-373 |
| Fallback budget defect: primary gets full 2500 ms; fallback gets `hookTimeout - elapsed`, floored to 1 ms | user-prompt-submit.ts:204-215; skill-advisor-cli-fallback.ts:152,236,537 |
| Drift guard hard-codes system-deep-loop only; vocabulary-agreement tests only the 4-class enum | routing-registry-drift-guard.vitest.ts:26-57; skill_advisor.py:83,320 |
| sk-doc hub-internal parity is green and strictly checked (12 modes, 113 aliases, 12 router signals) — by parent-skill-check.cjs, not the advisor guard | parent-skill-check.cjs:409-749 |

## 6. Constraints & Limitations

- Empirical numbers come from the ratchet's frozen filesystem projection with fixture semantics (built-in semantic scoring disabled); live daemon-backed numbers may differ modestly.
- The Spec Kit Memory daemon was unhealthy for the whole session (exit 75 warm-only timeouts) — live evidence for the transport lane, but prior packet memory was not auto-loaded.
- A `better-sqlite3` Node ABI mismatch forced the executor-delegation test into filesystem-projection fallback; the red-fixture failure is consistent with checked-in hub metadata, not the fallback path.
- Researched files were read-only for the loop; all improvements below are proposals, not applied changes.
- The stale `@spec-kit/mcp-server` dist warning (visible this session) reinforces the documentation finding that executed-dist vs authored-source paths are underlabeled.

## 7. Integration Patterns

- **Gate 2 semantics (CLAUDE.md >=0.8 must-invoke):** operationally this is "the advisor's policy floors fired" rather than "80% posterior." The gate still works because floors fire on genuine signal patterns (task intent + direct evidence), but treat near-0.82 confidences as categorical, not ordinal.
- **Gate 1 dual-threshold (>=0.70 / <=0.35):** uncertainty <=0.35 is passed by any recommendation with >=1 evidence string (0.30 band); the gate's discriminative power lives almost entirely in the confidence half.
- **Two-stage hub discovery:** advisor finds the hub via graph-metadata discovery fields -> hub-router.json picks the mode. Behavioral discovery fixtures (representative prompts per mode) are the correct parity instrument, not alias mirroring.
- **Transport ladder:** MCP client -> warm-daemon CLI (`--warm-only`, exit 75 retryable) -> fail-open with governance directive. The CLI is a faithful alternate client for a warm daemon; it is NOT daemon recovery.

## 8. Implementation Guide — Prioritized Improvement Plan

Dependency-ordered; each item names target files and the failure mode it addresses.

**P0-1. Reconcile the no-brief output contract (correctness, 4 red tests).**
Decide: skipped/fail-open returns `{}` or the governance fallback directive. Align `hooks/claude/user-prompt-submit.ts:228-245`, the 4 stale expectations in `mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:143-178`, and `references/hooks/skill_advisor_hook.md`. Everything later in the hook lane depends on this contract choice.

**P0-2. Reserve fallback budget + live handoff tests (transport resilience).**
Pass `hookBudget - fallbackReserve` as the primary `subprocessTimeoutMs`; spend the reserve only on eligible failures. Add timing tests: primary-timeout -> warm-daemon fallback success; probe-timeout within total budget; `skipped` -> no CLI; daemon absent -> exit 75. Targets: `hooks/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, hook vitest files (none currently inject `buildCliBrief`).

**P0-3. Repair executor-delegation coherence (routing correctness).**
(a) Fix the stale `suppressed-codex-abstain` fixture (replace with a genuinely retired executor alias) so the parity suite is green. (b) Add fixture coverage for the never-exercised existing-candidate branch (`executor-delegation.ts:470-477`), asserting branch provenance. (c) Enforce the selected contract: a singly-resolved executor suppresses public fusion ambiguity — one finalization boundary recomputes `passes_threshold`, clears stale `ambiguousWith`, reapplies ambiguity, and derives `result.ambiguous` from the same final cluster (move the override before finalization, or add an explicit finalizer in `fusion.ts:839-868`). Regression: `result.ambiguous === (top.ambiguousWith.length > 0)`.

**P0-4. Repair calibration measurement freshness (enables all tuning).**
Reconcile the 193-row corpus with both committed baselines (`bench/scorer-calibration-baseline.json`, `scripts/routing-accuracy/scorer-eval-baseline.json`); make one joined evaluator report holdout top-1, ambiguity accuracy, floor frequency, Brier/ECE reliability bins. Measurement repair only — no scorer changes.

**P1-5. Metadata-hub advisor-discovery battery (unguarded boundary).**
New suite under `mcp_server/tests/` enumerating registry-bearing hubs; per workflow mode, one representative public prompt plus hard negatives must route the hub identity at compat thresholds through the real scorer. Extend `parent-skill-check.cjs` to fail when a metadata-routed mode lacks a fixture. Do NOT mirror the 113 aliases into graph-metadata.json.

**P1-6. `advisor-threshold-surface-parity.vitest.ts` (preventive guard).**
Two-layer matrix: default/env rows (after `vi.resetModules()`) across MCP dispatch (`dispatchTool`), shared brief, Claude hook entry, CLI fallback args; call-override rows across MCP + shared brief only (the hook exposes no threshold input — do not encode a nonexistent contract). Absorb or rename the mislabeled `runtime-parity.vitest.ts` (`['claude','opencode','opencode']`).

**P1/P2-7. Transport diagnostic taxonomy + docs.**
Split `mcp_channel_unavailable` / `warm_daemon_unavailable` / `probe_timeout` / `cli_timeout`; state which are CLI-recoverable. Fix stale/mixed ownership paths in `references/hooks/skill_advisor_hook.md` and the manual playbook (authored source vs build owner vs executed dist); add a dist-freshness assertion.

**P2-8 (gated on P0-4). Shadow calibration experiment.**
Keep public thresholds 0.80/0.35 and 0.05 margins unchanged. Single candidate: `SCORING_CALIBRATION.confidence.taskIntentFloor` 0.82 -> 0.80, accepted only if holdout >=57/78 correct, >=61/78 covered, ambiguity slice >=16/25. Longer-term: replace evidence-string counting with independence-aware uncertainty.

## 9. Verification Commands

```bash
# Hook + fallback suites (P0-1/P0-2 acceptance: all green)
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run \
  tests/hooks/claude-user-prompt-submit-hook.vitest.ts \
  tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts

# Executor delegation parity (P0-3 acceptance: all green, incl. both override branches)
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run \
  tests/scorer/executor-delegation.vitest.ts --reporter=verbose

# Baseline freshness (P0-4 acceptance: hash equality restored)
shasum -a 256 .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/*.jsonl
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- --run \
  tests/parity/scorer-eval-baseline-ratchet.vitest.ts

# Warm-only CLI fallback behavior (exit 75 when daemon absent)
node .opencode/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"test"}' --warm-only --format json --timeout-ms 3000
```

## 10. Acceptance Matrix

| Item | Acceptance criterion |
|------|---------------------|
| P0-1 | 11/11 hook tests green; reference text matches chosen contract |
| P0-2 | Primary-timeout -> fallback-success test passes within total hook budget |
| P0-3 | Executor suite green; `result.ambiguous` coherent with top `ambiguousWith` on all fixtures; both branches covered |
| P0-4 | Ratchet hash assertions pass; joined report includes reliability bins |
| P1-5 | Every sk-doc workflow mode has a passing discovery fixture; parent-skill-check fails on missing fixtures |
| P1-6 | Parity suite green across 4 surfaces (env rows) and 2 surfaces (call rows) |
| P2-8 | Shadow floor change accepted/rejected strictly by the three empirical gates |

## 11. Recommendations

1. Treat the three P0 correctness defects (output contract, fallback starvation, ambiguity coherence) as one implementation packet — they are small, evidenced, and unblock trustworthy testing of everything else.
2. Fund the metadata-hub discovery battery before any per-skill routing research phases; it is the only gate on the boundary those phases will depend on.
3. Freeze scorer-policy numbers until the joined calibration report with reliability bins exists; the current grid proves external threshold tuning is a dead end.
4. Read Gate 2's >=0.8 as "policy floors fired," and consider surfacing `dominantLane` + evidence counts alongside confidence in operator-facing briefs so consumers stop over-reading 0.82.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Treating public confidence as the RRF score | Confidence is a separate quantized policy function over liveNormalized | fusion.ts:381-429 | 1 |
| Reading a green routing-registry-drift-guard as sk-doc coverage | Guard hard-codes system-deep-loop's registry only | routing-registry-drift-guard.vitest.ts:26-57 | 2 |
| Mirroring all 113 hub aliases into graph-metadata.json | Duplicates registry-owned vocabulary; inflates lexical evidence; wrong invariant for two-stage routing | mode-registry.json:10-159 | 2 |
| Treating exact metadata-alias coverage (13.3%) as routing recall | Advisor uses weighted multi-field + semantic/derived lanes, not exact-string alias matching | bm25.ts:47-152; graph-metadata.json:33-73 | 2 |
| Treating warm-only CLI fallback as daemon failover | It probes an existing daemon, never cold-spawns, returns exit 75 | skill-advisor-cli-fallback.ts:224-262,499 | 3 |
| Treating current hook tests as CLI-fallback proof | Injected primary builder suppresses the default fallback builder; no `buildCliBrief` coverage exists | claude-user-prompt-submit-hook.vitest.ts:40-74 | 3 |
| Treating shouldFireAdvisor as a drifting duplicate of the 0.80/0.35 gate | It is an earlier eligibility stage with its own config domain | prompt-policy.ts:46-100 | 4 |
| Hook call-specific threshold-override parity tests | The hook exposes no threshold-config input; the test would encode a nonexistent contract | user-prompt-submit.ts:202-218 | 5 |
| Tuning scorer floors/weights/margins from stale baselines | Both committed baselines fail hash equality vs the clean 193-row corpus | scorer-calibration-baseline.json:3-7 | 6 |
| Using the stale dist as current-source calibration evidence | Explicit dist-freshness warning; source-loaded run required | Iteration 7-8 runner attempts | 7-8 |
| Raising the public confidence threshold to 0.84 | Drops holdout coverage 24.36 points for 2.85 points of selective precision | Iteration-8 threshold grid | 8 |
| Moving the public uncertainty threshold within 0.30-0.40 | Holdout behavior identical across the interval | Iteration-8 threshold grid | 8 |
| Treating exact 0.82 confidence as 82% empirical correctness | Plateau correctness is 58-65% across slices | Iteration-8 floor analysis | 8 |
| Changing 0.05 ambiguity margins to fix incoherence | Both ambiguity APIs agree on the same list; defect is post-attribution mutation | ambiguity.ts:22-57; fusion.ts:839-868 | 9 |
| Treating the mismatch as floating-point drift | Deterministic post-attribution mutation reproduces it | executor-delegation.ts:411-498 | 9 |
| Fixing only the serializer/handler for ambiguity | Inconsistent fields coexist in the scorer result before projection | fusion.ts:759-868 | 9 |
| Counting detector branches as override-path coverage | Detector labels do not reveal whether the executor existed in the fused list | executor-delegation-cases.json:2-3 | 10 |

## Divergence Map

No divergent pivots were recorded: convergence_mode was `default` and stop_policy `max-iterations` forced the full 10-iteration frontier without pivot transactions. Saturated directions: none recorded in the registry. Completed pivots: 0; failed pivots: 0; audited overrides: 0. The investigated frontier covered all four charter lanes plus two emergent lanes (calibration-baseline staleness, executor-delegation output coherence); the remaining frontier is listed in Open Questions.

## 12. Open Questions

- Does the shadow `taskIntentFloor` 0.82 -> 0.80 candidate preserve the three empirical gates when run in an authorized implementation packet?
- Can a natural production prompt reach the executor-delegation existing-candidate branch, or must the fixture seed the projection?
- Should a retired-executor alias remain part of the supported metadata contract for the replacement abstain fixture?
- What do reliability bins (Brier/ECE) show once the joined evaluator lands (P0-4)?
- Is env-override freezing at module load acceptable for long-lived daemon processes, or should threshold resolution become read-per-call?

## 13. Sources & References

- Advisor MCP server: `.opencode/skills/system-skill-advisor/mcp_server/` — `advisor-server.ts`, `tools/index.ts`, `tools/advisor-recommend.ts`, `handlers/advisor-recommend.ts`
- Scorer: `lib/scorer/fusion.ts`, `lib/scorer/ambiguity.ts`, `lib/scorer/lane-registry.ts`, `lib/scorer/scoring-constants.ts`, `lib/scorer/executor-delegation.ts`, `lib/scorer/lanes/bm25.ts`
- Policy + contract: `lib/prompt-policy.ts`, `lib/compat/contract.ts`, `lib/skill-advisor-brief.ts`
- Hooks + transport: `hooks/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `.opencode/bin/skill-advisor.cjs`
- Shared RRF: `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts`
- Tests + fixtures: `tests/routing-registry-drift-guard.vitest.ts`, `tests/vocabulary-agreement.vitest.ts`, `tests/hooks/*`, `tests/scorer/executor-delegation.vitest.ts`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts`, `tests/parity/fixtures/executor-delegation-cases.json`
- Baselines + corpora: `bench/scorer-calibration-baseline.json`, `scripts/routing-accuracy/*.jsonl`, `scripts/routing-accuracy/scorer-eval-baseline.json`
- Hub artifacts: `.opencode/skills/sk-doc/hub-router.json`, `.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/graph-metadata.json`, `.opencode/skills/cli-external-orchestration/hub-router.json`
- Structural checker: `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- Resource map: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/011-skill-advisor-routing-research/research/resource-map.md`
- Sibling FOUNDATION packet: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research/research/research.md`

## 14. Iteration Trail

| Iter | Focus | Ratio | Status | Key outcome |
|-----:|-------|------:|--------|-------------|
| 1 | advisor_recommend path + scorer calibration surface | 0.92 | complete | Four-layer path, lane weights, RRF vs policy confidence split |
| 2 | Vocabulary alignment with hub registries | 0.79 | complete | Drift guard covers system-deep-loop only; metadata-hub discovery unguarded |
| 3 | Claude hook + unhealthy-transport fallback | 0.88 | complete | Fallback-starvation defect; 4 red hook tests; warm-only boundary |
| 4 | Threshold + prompt-policy synchronization | 0.85 | complete | shouldFireAdvisor is eligibility, not duplicate gate; shared resolver proven |
| 5 | Named end-to-end threshold parity suite | 0.74 | complete | Suite design + hook capability boundary (no call-override input) |
| 6 | Priority order for improvements | 0.68 | complete | Evidence-ranked plan; both calibration baselines found stale |
| 7 | Joined RRF calibration execution | 0.24 | error | Runners unavailable; RRF constants pinned; no numbers fabricated |
| 8 | Fresh joined calibration + bounded proposal | 0.78 | complete | Holdout 57/78; 0.82 floor saturation quantified; grid insensitivity |
| 9 | Result ambiguity vs executor attribution | 0.66 | complete | Post-attribution mutation isolated; finalization invariant designed |
| 10 | Executor delegation branch coverage | 0.81 | complete | 8:0 injection split; 7/8 incoherence; stale Codex fixture red |

## 15. Convergence Report

- Stop reason: maxIterationsReached (stop_policy=max-iterations; convergence telemetry only)
- Total iterations: 10 of 10
- Questions answered: 5 / 5 charter questions (registry shows 0 formally resolved because the reducer tracks question-record lifecycle, not narrative answers; every charter question carries an explicit "Answered" entry in iterations 1-10)
- Remaining questions: 5 follow-up items (Section 12)
- Last 3 iteration summaries: run 8: joined calibration (0.78) | run 9: ambiguity coherence (0.66) | run 10: branch coverage (0.81)
- Convergence threshold: 0.05 (newInfoRatio never approached it; ratios stayed 0.24-0.92)
- Graph convergence: STOP_BLOCKED throughout (source_diversity_guard, evidence_depth_guard below 1.5) — recorded as synthesis evidence per the terminal-cap rule; the cap bypasses quality-guard overrides
- Divergence summary: no divergent pivots recorded
- Errors: 1 (iteration 7, execution-path unavailability; recovered in iteration 8)

## 16. Next Steps

1. `/speckit:plan` an implementation packet for P0-1..P0-4 (hook contract, fallback budget, executor coherence, baseline freshness).
2. Run the P2-8 shadow floor experiment inside that packet once P0-4's joined evaluator exists.
3. Add the P1-5 metadata-hub discovery battery before starting the remaining per-skill routing research phases.
4. Reconcile this packet's plan with the sibling 010-sk-doc-routing-research fix plan under the 031 parent (shared boundary: hub discoverability fixtures).

## 17. References

See Section 13. Canonical synthesis: this file. Resource map: `research/resource-map.md`. Iteration evidence: `research/iterations/iteration-001.md` through `iteration-010.md`. State: `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-dashboard.md`.
