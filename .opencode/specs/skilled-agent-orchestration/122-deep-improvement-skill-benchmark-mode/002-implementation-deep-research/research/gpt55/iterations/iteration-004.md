# Focus

IQ6: scorer plus report-builder. This iteration turns the converged Lane C design into a concrete scoring/reporting playbook: exact D1-D5 computation, report.json as the only source of report.md, funnel-based bottleneck ranking, and a remediation taxonomy that points every finding at a file, locus, one-line fix, and handoff lane.

# Actions Taken

- Re-read the authoritative Phase 001 synthesis for D1-D5 weights, five-stage funnel, hard-gate behavior, report shape, remediation taxonomy, and rename ordering.
- Inspected the current `deep-agent-improvement` smart router, especially `INTENT_SIGNALS`, `RESOURCE_MAP`, `RUNTIME_ASSETS`, and the substring-based route function that Lane C must replay for intra-skill scoring.
- Inspected `scripts/shared/loop-host.cjs`, Lane B `run-benchmark.cjs`, the 5-dimension model scorer, grader harness, fixture materializer, integration scanner, and append-only journal patterns.
- Inspected `system-skill-advisor` scorer docs and handlers to ground D1 inter-skill scoring in `advisor_recommend` / `advisor_validate`, not in a local keyword clone.
- Checked the Phase 003 rename and Phase 004 Lane C specs for the fixed narrow rename and the required `--mode=skill-benchmark` wiring.
- Web-checked external prior art only where it sharpens implementation details: IR ranking metrics for D2, trajectory/tool-call evaluation for D2/D3/D4, OpenTelemetry span/event vocabulary for trace shape, and SARIF-style result locations/fixes for remediation records.

# Findings

1. The Lane C scorer must be Lane-C-specific, but it should reuse the existing Lane B report shell and grader/cache machinery. Lane B's runner already emits `status`, `scoringMethod`, `grader`, `aggregateScore`, `totals`, `rows`, `fixtures`, `failureModes`, provenance, a stable `report.json`, a timestamped report snapshot, and a state-log record; those are the right machine-report primitives for Lane C. The existing 5-dim model scorer itself is not reusable wholesale because its D1-D5 are acceptance, bundle gate, cwd/path correctness, hallucination grader, and preplanning, while Lane C's D1-D5 are routing, discovery, efficiency, usefulness, and connectivity. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:462] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:500] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:512] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:249]

2. D1 should compute exactly 25 points as `interSkill=12` plus `intraSkill=13`. Inter-skill must call `advisor_recommend` with `topK>=5` and attribution enabled, then score whether the expected skill is top-1, in top-k, ambiguous, or correctly absent for negative fixtures. The advisor is a five-lane scorer with explicit_author, lexical, graph_causal, derived_generated, and semantic_shadow weights, and the handler already returns score, confidence, uncertainty, dominant lane, lane breakdown, ambiguity, and shadow recommendations. Intra-skill should replay the target skill's own router over the public prompt and compare returned intents/resources to the private expected intent/resource set. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:42] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:159] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:267] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:213]

3. D1 inter-skill should also record `advisor_validate` slices as run-level calibration, not per-scenario scoring. `advisor_validate` already computes full-corpus, holdout, parity, ambiguity, safety, latency, regression-suite, and `perSkill[]` results; the validation baseline doc treats corpus top-1 below 80.5% or holdout top-1 below 77.5% as a hard regression. Lane C should store those fields under `runQuality.advisorBaseline`, while per-scenario D1 uses `advisor_recommend`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:485] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:527] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:43] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:57]

4. D2 should score unprompted discovery as ranked retrieval over canonicalized resource-load events: `Hit@1`, `Hit@3`, `Recall@5`, and MRR. The Phase 001 design already requires canonicalizing every file-touch verb and scoring set membership rather than ordered paths; IR prior art supports Hit@k as "did any relevant item appear in top k", Recall@k as relevant items recovered within k, and MRR as the reciprocal rank of the first relevant result. The concrete D2 formula should be `100 * (0.25*Hit@1 + 0.20*Hit@3 + 0.35*Recall@5 + 0.20*MRR)`, computed per scenario and averaged. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:239] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:250] [SOURCE: https://doc.lucidworks.com/docs/managed-fusion/06-metrics-and-analytics/evaluation-metrics] [SOURCE: https://en.wikipedia.org/wiki/Mean_reciprocal_rank]

5. D3 should be a trace-derived cost score, not another quality grader. `dispatch-model.cjs` already captures executor stdout/stderr, attempts, exit status, pause state, and read-only executor defaults across five executor types; Lane C should extend the dispatch/capture layer to emit structured `tool_trace.jsonl` and `resource-loads.jsonl` with `toolCallIndex`, `normalizedResourceId`, `bytes`, `inputTokens`, `outputTokens`, and `sourceVerb`. The D3 formula should use observable fields only: `callsToFirstExpected`, `totalToolCalls`, `fileTouchCount`, `wastedLoadCount`, `fallbackCount`, and token totals when the executor reports them; if tokens are unavailable, set `tokenObserved=false` and exclude token subscore from the weighted average rather than guessing. OpenTelemetry's span/event model is a good fit for these attributes because span events are timestamped, named records with attributes. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:185] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:236] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:385] [SOURCE: https://opentelemetry.io/docs/reference/specification/overview/] [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/]

6. D4 should be a pluggable-grader ablation: run each positive fixture twice, once with the target skill available and once in skill-off control mode, then grade both outputs with the existing `noop|mock|llm` grader seam. The current model scorer already exposes `buildGraderFn(graderKind)` with `noop`, `mock`, and real LLM modes, and the grader harness clamps scores to `[0,1]`, uses run-scoped cache resolution, wraps untrusted output in random sentinels, and parses JSON grader output. Lane C should reuse that machinery but replace the rubric with skill-usefulness criteria. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:165] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:41] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:53] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:69] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:252] [SOURCE: https://docs.langchain.com/langsmith/trajectory-evals]

7. D5 must run before dispatch and hard-gate the report. The static scan should parse `SKILL.md` frontmatter plus router metadata, then validate: each `RESOURCE_MAP` key exists in `INTENT_SIGNALS`; each routed reference exists under the skill root; each runtime asset exists; each expected lane directory obeys the fixed `skill-benchmark/` layout; no routed path escapes the skill root; no public fixture contains skill names, paths, basenames, trigger words, or command names. The current skill router discovers markdown under `references/` and `assets/`, guards paths inside the skill root, and returns loaded resources/assets; the existing integration scanner shows the local pattern for static surface scans that return structured JSON. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:81] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:151] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:196] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/agent-improvement/scan-integration.cjs:100] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/agent-improvement/scan-integration.cjs:218] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:253]

8. `report.md` must be rendered from `report.json`, never hand-authored. The design explicitly requires the dual artifact and anti-drift rule; Lane B already writes canonical `report.json` and immutable history snapshots, while Phase 004 requires Lane C to emit per-dimension scores, ranked bottlenecks, and concrete remediations. The implementation should make `scripts/skill-benchmark/build-report.cjs --report report.json --output report.md` the only report-md writer, and tests should fail if report.md contains values not present in report.json. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:124] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:257] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:500] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:507] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:46]

9. Bottleneck ranking should be driven first by funnel attrition. The converged funnel is `Reachable -> Activated-inter -> Routed-intra -> Discovered-behavioral -> Useful-causal`, and Phase 001 says the largest single-stage drop-off is the headline bottleneck. The scorer should compute `stagePassCount`, `stageDropCount`, and `stageDropRate` for each stage; the headline is the max `stageDropCount`, with hard gates promoted above weighted findings. Secondary sorting should be `severityWeight * stageDropRate * affectedScenarioCount * confidence * remediationReadiness`. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:96] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:134] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:226]

10. The remediation taxonomy should be stage-keyed but owner-aware. Phase 001 requires every finding to resolve to `(file, locus, one-line edit)` and a direct Lane A or speckit handoff, and Phase 004 says Lane C is diagnostic by default with optional handoff to Lane A. SARIF's result model strengthens the shape: findings should carry locations with physical artifact/region and optional fixes, which maps cleanly to `targetFile`, `locus`, and `oneLineFix`. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:140] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:142] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:46] [SOURCE: https://docs.github.com/en/code-security/reference/code-scanning/sarif-files/sarif-support-for-code-scanning]

11. The narrow rename affects scorer/report integrity even though IQ6 does not reopen rename scope. Phase 003 fixes the narrow scope: rename skill + agent id + advisor + cross-refs, keep command verbs and the `agent-improvement` token family. Lane C reports must stamp `resolvedSkillRoot`, `resolvedSkillId`, `metadataHash`, and `advisorSourceSignature`; otherwise a report generated before the rename can be mistaken for a valid post-rename benchmark. The advisor alias and explicit phrase surfaces still contain old `deep-agent-improvement` keys today, so Phase 003 must complete before using Lane C results as baselines. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:39] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:116] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:152]

# Recommendations (build-ready)

1. Add the scorer/report files under the fixed Lane C layout.

   Lane-C-specific:
   - `scripts/skill-benchmark/run-skill-benchmark.cjs`: orchestration entrypoint called by loop-host.
   - `scripts/skill-benchmark/load-scenarios.cjs`: reads public/private fixtures and enforces fixture id safety.
   - `scripts/skill-benchmark/contamination-lint.cjs`: hard pre-dispatch gate.
   - `scripts/skill-benchmark/router-replay.cjs`: extracts router metadata and replays intra-skill routing.
   - `scripts/skill-benchmark/trace-normalize.cjs`: parses live logs into `tool_trace.jsonl` and `resource-loads.jsonl`.
   - `scripts/skill-benchmark/scorer.cjs`: computes D1-D5 and funnel rows.
   - `scripts/skill-benchmark/d5-connectivity.cjs`: static connectivity scanner.
   - `scripts/skill-benchmark/build-report.cjs`: renders `report.md` from `report.json`.
   - `assets/skill-benchmark/report_schema.json`, `report_template.md`, `remediation_taxonomy.json`, `scenario_schema.json`, `default_profile.json`.
   - `references/skill-benchmark/scoring_contract.md`, `operator_guide.md`, `scenario_authoring.md`.

   Shared only if another lane consumes it immediately:
   - `scripts/shared/executor-dispatch.cjs`: extracted executor spawn/read-only/rate-limit core from Lane B.
   - `scripts/shared/report-history.cjs`: write canonical JSON plus timestamped snapshot.

2. Wire `loop-host.cjs` as a third mode without touching Lane A defaults.

   Concrete branch:

   ```js
   const VALID_MODES = new Set(['agent-improvement', 'model-benchmark', 'skill-benchmark']);
   const LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs']);

   if (mode === 'skill-benchmark') {
     if (!args.skill || !args.profile || !args['outputs-dir']) {
       return { ok: false, error: 'skill-benchmark: missing --skill, --profile, --outputs-dir' };
     }
     return {
       ok: true,
       steps: [{
         script: 'run-skill-benchmark.cjs',
         args: ['--skill', args.skill, '--profile', args.profile, '--outputs-dir', args['outputs-dir'], ...(args.output ? ['--output', args.output] : [])],
       }],
     };
   }
   ```

3. Implement D1 as `12 + 13`.

   Inter-skill, max 12:

   ```text
   if expectedSkill == null:
     inter = advisor.recommendations.length == 0 ? 1 : 0
   else:
     rank = first index where aliasMatches(recommendation.skillId, expectedSkill)
     rankScore = rank == 1 ? 1 : rank <= 3 ? 0.75 : rank <= 5 ? 0.5 : 0
     thresholdScore = confidence >= 0.8 && uncertainty <= 0.35 ? 1 : 0.75
     ambiguityPenalty = advisor.ambiguous ? 0.85 : 1
     inter = rankScore * thresholdScore * ambiguityPenalty
   D1_inter_points = 12 * average(inter)
   ```

   Intra-skill, max 13:

   ```text
   router = routerReplay(publicPrompt)
   intentRecall = |expectedIntentKeys intersect router.intents| / |expectedIntentKeys|
   resourceRecall = |expectedResources intersect router.resources| / |expectedResources|
   negativeOk = expectedResources empty ? router.resources excludes target lane refs : true
   intra = negativeOk ? 0.4 * intentRecall + 0.6 * resourceRecall : 0
   D1_intra_points = 13 * average(intra)
   ```

4. Implement D2 as ranked retrieval over resource loads.

   ```text
   loads = first unique normalizedResourceId in resource-load order
   expected = private.expectedResources
   ranks = expected.map(resource => oneBasedIndex(loads, resource) || Infinity)
   Hit@1 = any(rank <= 1)
   Hit@3 = any(rank <= 3)
   Recall@5 = count(rank <= 5) / expected.length
   MRR = ranks.length ? 1 / min(ranks) : 1 for true-negative fixture
   D2 = 100 * (0.25*Hit@1 + 0.20*Hit@3 + 0.35*Recall@5 + 0.20*MRR)
   ```

   Record `hallucinatedResourceIds` separately and never give D2 credit for paths outside the target skill inventory.

5. Implement D3 as cost to reach the needed resource.

   ```text
   callsToFirstExpected = first toolCallIndex whose normalizedResourceId is expected
   wastedLoadCount = fileTouchLoads not in expectedResources and not in allowedSupportResources
   fallbackCount = grep/glob/load attempts after first expected resource, unless fixture marks them allowed
   callScore = clamp01(1 - (totalToolCalls / maxToolCallsBudget))
   firstHitScore = callsToFirstExpected ? clamp01(1 - ((callsToFirstExpected - 1) / maxCallsBeforeFirstExpected)) : 0
   wasteScore = fileTouchCount ? clamp01(1 - wastedLoadCount / fileTouchCount) : 1
   tokenScore = tokenObserved ? clamp01(1 - totalTokens / tokenBudget) : null
   D3 = weightedAverage({callScore:0.25, firstHitScore:0.35, wasteScore:0.25, tokenScore:0.15 when observed})
   ```

6. Implement D4 as skill-on/off ablation.

   ```text
   on = dispatch(publicPrompt, skillEnabled=true)
   off = dispatch(publicPrompt, skillEnabled=false, advisorHookDisabled=true, targetSkillHidden=true)
   onGrade = gradeD4(on.output, usefulnessRubric, graderKind)
   offGrade = gradeD4(off.output, usefulnessRubric, graderKind)
   delta = onGrade.score - offGrade.score
   harm = onGrade.score + 0.05 < offGrade.score
   contextPenalty = clamp01((on.totalTokens - off.totalTokens) / tokenBudget) when tokenObserved else 0
   D4 = harm ? 0 : clamp01((delta / expectedUsefulDelta) - contextPenalty)
   ```

   Default `expectedUsefulDelta` should live in `assets/skill-benchmark/default_profile.json` and be calibrated in the pilot, not hard-coded inside the scorer.

7. Implement D5 as a hard-gate static scan.

   Gate failures:
   - `dead_resource_path`: `RESOURCE_MAP` or `RUNTIME_ASSETS` path missing.
   - `dead_intent_key`: `RESOURCE_MAP` key absent from `INTENT_SIGNALS`.
   - `orphan_reference`: reference under the target lane never reachable from `RESOURCE_MAP`, unless allowlisted.
   - `path_escape`: routed path resolves outside skill root.
   - `contaminated_fixture`: public prompt contains skill id, path, basename, trigger, intent label, command, or expected resource basename.
   - `rename_stale_root`: resolved skill root/id does not match current metadata hash/advisor source signature.

   D5 score can still be reported as `100 - penalties`, but any P0 D5 failure sets `gates.hardGateFailed=true` and caps verdict to `FAIL` or `GATED`.

8. Define `report.json` as the anti-drift source of truth.

   Minimal schema:

   ```json
   {
     "schemaVersion": "skill-benchmark-report.v1",
     "status": "skill-benchmark-complete",
     "mode": "skill-benchmark",
     "scoringMethod": "skill-d1d5-v1",
     "targetSkill": {
       "id": "deep-improvement",
       "root": ".opencode/skills/deep-improvement",
       "metadataHash": "sha256:...",
       "advisorSourceSignature": "..."
     },
     "aggregateScore": 0,
     "dimensionScores": {
       "D1": {"score": 0, "points": 25, "interSkill": {}, "intraSkill": {}},
       "D2": {"score": 0, "points": 20, "hitAt1": 0, "hitAt3": 0, "recallAt5": 0, "mrr": 0},
       "D3": {"score": 0, "points": 15, "tokenObserved": false},
       "D4": {"score": 0, "points": 25, "grader": "noop", "ablation": {}},
       "D5": {"score": 0, "points": 15, "hardGateFailed": false}
     },
     "gates": [],
     "funnel": {"stages": [], "headlineBottleneck": null},
     "bottlenecks": [],
     "scenarioRows": [],
     "runQuality": {
       "harnessHealth": {},
       "advisorBaseline": {},
       "sampleSufficiency": {},
       "warnings": []
     },
     "traceArtifacts": {},
     "provenance": {}
   }
   ```

   `build-report.cjs` should load this JSON, validate it, render the markdown template, and refuse to accept separate score arguments. `report.md` should include only derived sections: summary, D1-D5 table, funnel, ranked bottlenecks, remediation backlog, runQuality, and artifacts.

9. Make the headline bottleneck mechanical.

   ```text
   stages = [reachable, activatedInter, routedIntra, discoveredBehavioral, usefulCausal]
   passCount[i] = scenarios passing stage i
   dropCount[i] = i == 0 ? total - passCount[0] : passCount[i-1] - passCount[i]
   dropRate[i] = dropCount[i] / total
   headline = stage with max(dropCount)
   ```

   Every scenario row should carry `firstFailingStage`; every bottleneck should carry `affectedScenarioIds`; the report title should name the headline stage rather than the lowest raw dimension score.

10. Ship this remediation taxonomy as `assets/skill-benchmark/remediation_taxonomy.json`.

   | findingClass | targetFile | locus | oneLineFix | handoffLane |
   | --- | --- | --- | --- | --- |
   | `dead_resource_path` | target `SKILL.md` | `RESOURCE_MAP.<intent>[i]` or `RUNTIME_ASSETS.<key>[i]` | Replace the missing path with an existing lane/shared resource or remove the route. | `lane-a-candidate` |
   | `dead_intent_key` | target `SKILL.md` | `RESOURCE_MAP.<intent>` | Add the missing `INTENT_SIGNALS` key or remove the unreachable route. | `lane-a-candidate` |
   | `orphan_reference` | target `references/<lane>/*.md` | file path | Add the reference to the correct `RESOURCE_MAP` intent or mark it intentionally on-demand. | `lane-a-candidate` |
   | `advisor_selection_miss` | `system-skill-advisor` scorer metadata | alias, explicit phrase, graph edge, or regression fixture | Add/update direct advisor evidence and matching regression case for the skill. | `speckit-packet` |
   | `ambiguous_neighbor` | `system-skill-advisor` scorer metadata | explicit phrase or graph edge | Add bounded positive evidence for the target and negative/conflict evidence for the sibling. | `speckit-packet` |
   | `under_loading` | target `SKILL.md` | `RESOURCE_MAP.<intent>` | Add the expected reference to the selected intent. | `lane-a-candidate` |
   | `over_loading` | target `SKILL.md` | `RESOURCE_MAP`, `ON_DEMAND_KEYWORDS`, or `ALWAYS` | Move broad resources behind a narrower intent or on-demand trigger. | `lane-a-candidate` |
   | `discovery_miss` | target `SKILL.md` or reference frontmatter | section text or trigger phrase | Add a domain-language signpost that points the model to the needed reference without leaking benchmark labels. | `lane-a-candidate` |
   | `efficiency_bottleneck` | target `SKILL.md` | resource loading level or route | Remove redundant loads and tighten the route that causes late first-hit. | `lane-a-candidate` |
   | `usefulness_no_delta` | target reference/asset | operator steps, examples, or checklist | Add concrete workflow guidance that changes the output, not just descriptive text. | `lane-a-candidate` |
   | `contaminated_fixture` | `assets/skill-benchmark` fixture | `public.prompt` | Rewrite the public prompt in domain language and keep expected labels private. | `harness-fix` |
   | `trace_capture_gap` | `scripts/skill-benchmark/trace-normalize.cjs` | parser rule | Add parser coverage for the missing file-touch verb or executor log shape. | `harness-fix` |
   | `rename_stale_root` | Phase 003 rename surfaces | skill id, advisor alias, mirror, cross-ref | Complete the narrow rename surface and regenerate advisor/index metadata before benchmarking. | `speckit-packet` |

# Open Questions

1. The exact skill-off control needs an implementation decision in Phase 004. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` disables advisor output, but the harness may also need an executor-level way to hide the target skill's files from the subject to make D4 causal rather than merely comparative.

2. Token counts are executor-dependent. D3 should support token scoring, but the first implementation should degrade cleanly to call/file-touch counts when the executor does not expose reliable token usage.

3. The D4 `expectedUsefulDelta` threshold should be calibrated on the first 2-3 dogfood skills. Hard-coding it before pilot data would make the usefulness lane look more precise than it is.
