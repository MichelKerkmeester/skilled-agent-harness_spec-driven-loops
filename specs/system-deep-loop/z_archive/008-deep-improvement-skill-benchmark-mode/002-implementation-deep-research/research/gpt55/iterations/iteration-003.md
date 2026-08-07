# Focus

IQ4 and IQ5 for the implementation playbook: Mode A router-replay, Mode B live dispatch, out-of-band advisor capture for D1 inter-skill routing, A/B divergence classification, contamination linting, and the three-tier fixture pipeline for Lane C `skill-benchmark`.

# Actions Taken

- Read the converged Lane C design in `001-skill-benchmark-deep-research/research/research.md` as the authoritative design baseline.
- Inspected `deep-agent-improvement/SKILL.md` for the in-skill smart-router contract, especially `INTENT_SIGNALS`, `RESOURCE_MAP`, `RUNTIME_ASSETS`, and `route_recursive_agent_resources`.
- Inspected `scripts/shared/loop-host.cjs`, Lane B dispatcher/scorer/materializer/reporting, and relevant `deep-loop-runtime` executor audit code to identify reusable seams and missing trace capture.
- Inspected `system-skill-advisor` architecture, handler, fusion scorer, alias groups, explicit lane, and validation baseline docs to identify the correct D1 inter-skill signal source.
- Inspected Phase 003 and Phase 004 specs to keep the rename/runbook scope narrow and to keep Lane C build dependencies ordered.
- Fetched external prior art where it strengthens the implementation choices: OpenTelemetry trace spans/events/attributes, LangSmith trajectory tracing, and Ragas agent/tool-use metrics.

# Findings

1. **Mode A does not yet have an executable pure route function; it exists as SKILL.md pseudocode only.** The target skill documents `route_recursive_agent_resources(task)` with deterministic substring scoring and resource loading, but this is inside a fenced Python block, not a CJS/TS module CI can import. `loop-host.cjs` currently recognizes only `agent-improvement` and `model-benchmark`, and `planInvocation()` only dispatches those two paths. Lane C therefore needs a new executable router-replay module plus `--mode=skill-benchmark`; do not treat the SKILL.md pseudocode as directly callable. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:97] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:31] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:130] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:44]

2. **Router-replay can be exact enough for CI because the in-skill router logic is intentionally simple.** The smart router lowercases task text, scores intents by checking whether each keyword is a substring, selects at most two near-tied intents, loads the default resource, then loads `RESOURCE_MAP[intent]` plus runtime assets. The implementation should preserve this exact substring behavior, ambiguity rule, inventory guard, and loaded-set semantics; adding embeddings or fuzzy matching to Mode A would measure a different router. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:124] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:135] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:165] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:174] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183]

3. **The D1 inter-skill signal should be captured from `advisor_recommend` out-of-band, not from the dispatched subject.** `system-skill-advisor` is the standalone routing runtime, and its public recommendation surface is `advisor_recommend`. The handler calls `scoreAdvisorPrompt()`, can expose `laneBreakdown` when attribution is requested, and returns recommendations plus ambiguity/freshness/trust state. The subject run must have advisor hooks disabled so the answer does not leak into context; the handler already supports `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` as a fail-open empty output. [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:21] [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:29] [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:111] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:267] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:277] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:330]

4. **Reimplementing advisor routing as keyword matching would be wrong; the scorer is five-lane and calibrated.** Advisor fusion combines explicit author signals, lexical overlap, graph causal propagation, derived metadata, and semantic shadow. The documented live weights are `explicit_author=0.42`, `lexical=0.28`, `graph_causal=0.13`, `derived_generated=0.12`, and `semantic_shadow=0.05`; fusion then applies confidence/uncertainty thresholds, derived-dominant caps, ambiguity handling, and primary-intent bonuses. Lane C should call the advisor surface and persist top-k, confidence, uncertainty, dominant lane, and lane breakdown. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:46] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:334] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:382] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:425] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:515] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:47]

5. **Mode B can reuse Lane B's executor map, but live trace capture is not currently present.** `dispatch-model.cjs` already supports the needed executor families and returns stdout/stderr/attempt metadata, with read-only defaults unless explicitly opted into writes. However, neither `dispatch-model.cjs` nor `deep-loop-runtime` executor audit records structured tool-call/resource-load events; executor audit writes stdout/stderr through and logs dispatch failures, not successful tool traces. Lane C therefore needs a Lane-C-specific trace parser/canonicalizer around the live run, with best-effort support for CLI output and an explicit `traceQuality` field when tool-call fidelity is lossy. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:13] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:23] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:185] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:236] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:605] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:612]

6. **A/B divergence should be a first-class finding, not noise.** Phase 004 requires a hint-free harness that captures resource-load trace/tool trace and scores routing, discovery, efficiency, usefulness, and structure. External agent-observability practice points the same way: LangSmith traces capture every execution step including tool calls and decisions, and OpenTelemetry spans support child operations plus attributes/events. Implement Mode A as deterministic router reachability and Mode B as behavioral discovery; classify `A pass/B fail` as discoverability/signposting failure, `A fail/B pass` as alternate-path or parser over-credit, and `advisor fail/router pass` as inter-skill activation failure. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:42] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:43] [SOURCE: https://docs.langchain.com/oss/python/langchain/observability] [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/]

7. **The contamination linter must reuse the routers' own string rules.** The in-skill router fires on `keyword in text`, while the advisor explicit lane fires phrase boosts with `lower.includes(phrase)` and token boosts from tokenized prompt text. The linter should therefore build its banned vocabulary from the target skill's name/id/aliases, frontmatter triggers, smart-router keywords, intent keys, resource path segments/basenames, command names, and advisor aliases, then run the same lowercased substring/token checks against the public prompt before dispatch. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:168] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:243] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:250] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27]

8. **Lane B's fixture format is not sufficient for anti-circular Lane C fixtures.** Current Lane B fixtures are single JSON objects where prompt/content, required patterns, and forbidden patterns live together, and the materializer writes fixture content directly to output markdown. Lane C needs a public/private split: public prompt material is dispatchable, private gold keys are scorer-only. Without that split, expected skill/resource labels can leak into the task text or into materialized artifacts. [SOURCE: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-fixtures/fixture-baseline.json:1] [SOURCE: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-fixtures/fixture-baseline.json:5] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/materialize-benchmark-fixtures.cjs:53] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/materialize-benchmark-fixtures.cjs:119]

9. **The three-tier fixture pipeline should publish a T1-to-T2 circularity meter.** The advisor already treats corpus and holdout separately, with full-corpus top-1 at 80.5 percent and holdout top-1 at 77.5 percent, and it treats holdout drift as the stronger regression signal. Lane C should mirror that discipline: T1 auto-derived plus paraphrased fixtures provide coverage, T2 hand-authored holdout provides non-circular truth, and T3 adversarial fixtures stress precision/abstention. The T1/T2 score gap is the circularity meter; a large gap is a finding against the benchmark corpus, not evidence that the skill is good. [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:47] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:57] [SOURCE: .opencode/skills/system-skill-advisor/references/scoring/validation_baselines.md:98] [SOURCE: https://docs.ragas.io/en/latest/concepts/metrics/available_metrics/]

10. **Reuse the Lane B scorer/report spine, but do not force Lane C into Lane B's dimensions.** `run-benchmark.cjs` already emits `report.json` with status, scoring method, aggregate score, totals, rows, fixtures, thresholds, provenance, and failure modes. The 5-dim scorer already exposes a pluggable deterministic-plus-grader shape with hard gates and dimension scores. Lane C should keep that spine but replace the dimension set with D1 inter/intra routing, D2 discovery, D3 efficiency, D4 usefulness, and D5 structure/fixture validity. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:462] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:489] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:255] [SOURCE: .opencode/skills/deep-agent-improvement/references/model-benchmark/evaluator_contract.md:74]

11. **The rename must run before Lane C wiring, and the scope is narrow.** Phase 003 explicitly fixes the narrow rename scope: rename skill and agent id plus advisor/cross-refs, while command verbs and the `agent-improvement` token family stay. Phase 004 depends on Phase 003. Existing active surfaces still hardcode `deep-agent-improvement`, including advisor alias groups, explicit-lane penalties/boosts, dispatcher resume hints, and the default model-benchmark profile. Lane C should be built after those active paths resolve to `deep-improvement`, or trace normalization and fixture profile paths will bake the old id into new reports. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:29] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:130] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:151] [SOURCE: .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json:5]

# Recommendations (build-ready)

1. **Rename runbook first, then Lane C.**
   - `git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement`.
   - Update `SKILL.md` `name:`, description/triggers/keywords, active self-references, agent id/mirrors, advisor alias groups, explicit-lane phrase boosts/penalties, profile family/paths, dispatcher resume hints, and cross-skill references.
   - Keep `/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop`, `assets/agent-improvement/`, `references/agent-improvement/`, `scripts/agent-improvement/`, and `agent-improvement-state.jsonl` names unless a future wide-scope packet reopens them.
   - Rebuild advisor/index surfaces last: `advisor_rebuild`, `skill_graph_scan`, description/graph metadata regeneration, then `advisor_validate`.
   - Validation gate: alias route check for `deep-improvement`, Lane A default `loop-host` plan unchanged, Lane B `--mode=model-benchmark` still runs, active-path grep clean except intentional historical/research allowlist.

2. **Loop-host wiring.**
   - Add `skill-benchmark` to `VALID_MODES`.
   - Add `LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs', 'router-replay.cjs', 'advisor-probe.cjs', 'lint-contamination.cjs', 'capture-live-trace.cjs', 'score-skill-benchmark.cjs', 'render-skill-report.cjs'])`.
   - Extend `resolveScriptPath()` to map those script names to `scripts/skill-benchmark/`.
   - Add `SKILL_BENCHMARK_RUN_OPTIONS`: `profile`, `target-skill`, `fixtures-dir`, `output`, `state-log`, `label`, `mode-a-only`, `mode-b-live`, `executor`, `model`, `agent`, `variant`, `runs`, `grader`, `trace-log`, `advisor-mode`.
   - `planInvocation('skill-benchmark', args)` should run: lint fixtures -> Mode A router replay -> advisor probe -> optional Mode B live dispatch/capture -> score -> render report.

3. **Mode A router-replay module.**
   - Put Lane-C-specific implementation in `scripts/skill-benchmark/router-replay.cjs`.
   - Export `routeSkillResources({ skillRoot, taskText })`.
   - Read target `SKILL.md`, extract the smart-router data (`INTENT_SIGNALS`, `RESOURCE_MAP`, `RUNTIME_ASSETS`, `DEFAULT_RESOURCE`, `ON_DEMAND_KEYWORDS`) from the fenced router block or a future explicit router manifest.
   - Apply exact router semantics: lowercased text, substring keyword match, weighted intent scores, ambiguity delta 1.0, max two intents, load default first, load existing markdown resources only, dedupe via set, return `{intents, resources, runtime_assets, missingResources, routerWarnings}`.
   - For CI, compare `resources` as a set against private `expectedResources`; record `modeA.recall`, `modeA.hitAtK`, and `modeA.missingExpected`.

4. **Out-of-band advisor probe.**
   - Put implementation in `scripts/skill-benchmark/advisor-probe.cjs`.
   - Primary path: call the native `advisor_recommend` handler or MCP surface with `{ prompt, workspaceRoot, options: { topK: 5, includeAttribution: true, includeAbstainReasons: true } }`.
   - Fallback path: call `skill_advisor.py --force-local` and mark `advisorTrace.lossy = true` if lane attribution is unavailable.
   - Persist the result in the scenario row before live dispatch: `{topSkill, topK, confidence, uncertainty, ambiguous, freshness, trustState, laneBreakdown}`.
   - For the subject live run, set `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` so prompt-submit advisor briefs do not leak the expected skill into context.

5. **Contamination linter.**
   - Put implementation in `scripts/skill-benchmark/lint-contamination.cjs`.
   - Inputs: public fixture JSON, private fixture JSON, target skill root, advisor alias table if available.
   - Build banned phrases from:
     - skill id/name/aliases, including old and new ids during rename bridge;
     - frontmatter `triggers`;
     - smart-router `INTENT_SIGNALS[*].keywords`;
     - intent keys such as `MODEL_BENCHMARK`, normalized with underscores/hyphens/spaces;
     - resource paths, basenames, stems, and lane directory names;
     - command names such as `/deep:start-agent-improvement-loop`;
     - private gold labels (`expectedSkill`, `expectedIntentKeys`, `expectedResources`).
   - Checks:
     - substring check for router keywords and explicit phrase boosts;
     - token check for explicit-lane token boosts;
     - path/basename check for resource leaks;
     - optional near-leak warning for edit distance or kebab/space variants.
   - Output `{passed, hardLeaks[], warnings[], vocabularyHash}`. Any hard leak blocks dispatch and sets `runQuality.contamination = failed`.

6. **Fixture schema and storage under `assets/skill-benchmark/`.**
   - Add:
     - `assets/skill-benchmark/fixture-public.schema.json`
     - `assets/skill-benchmark/fixture-private.schema.json`
     - `assets/skill-benchmark/profiles/default.json`
     - `assets/skill-benchmark/fixtures/<skill-id>/public/*.json`
     - `assets/skill-benchmark/fixtures/<skill-id>/private/*.json`
   - Public fixture shape:

```json
{
  "scenarioId": "deep-research-t2-holdout-001",
  "tier": "T2",
  "targetSkill": "deep-research",
  "public": {
    "prompt": "Run one fresh investigation pass and preserve the iteration artifact.",
    "runtime": "codex",
    "mutationBoundary": "read-only-or-packet-local",
    "outputContract": "Return a concise research narrative and write requested iteration files only."
  },
  "provenance": {
    "promptAuthor": "human-holdout-author",
    "goldAuthor": "router-extractor",
    "blindToRouterKeywords": true
  }
}
```

   - Private fixture shape:

```json
{
  "scenarioId": "deep-research-t2-holdout-001",
  "expected": {
    "skillId": "deep-research",
    "advisorAccept": true,
    "intentKeys": ["ITERATION"],
    "resources": ["references/protocol/loop_protocol.md", "references/state/state_outputs.md"],
    "negativeActivation": false
  },
  "rubric": {
    "usefulnessChecks": ["iteration narrative is concrete", "state/delta outputs are mentioned"],
    "harmChecks": ["does not dispatch sub-agents from leaf mode"]
  }
}
```

7. **Three-tier fixture authoring pipeline.**
   - T1 auto-derived plus paraphrased: scorer side derives gold keys from `RESOURCE_MAP`; prompt side paraphrases from `WHEN TO USE` and reference descriptions without seeing raw router keywords; linter must pass before admission. Use T1 for breadth and per-intent coverage, not headline truth by itself.
   - T2 hand-authored holdout: human or separate author writes domain-realistic tasks from the skill's user value, blind to `INTENT_SIGNALS` and `RESOURCE_MAP`; scorer side joins gold privately. Use T2 for headline routing/discovery claims.
   - T3 adversarial: sibling-skill near misses, decoy prompts, and `When NOT to Use` negatives. Use T3 for precision, abstention, and confusion findings.
   - Coverage assertion: after linting, require at least one admitted positive fixture per `INTENT_SIGNALS` key, at least one admitted fixture per `RESOURCE_MAP` target, and at least one negative/near-miss per major exclusion class. Emit uncovered keys as D5/corpus findings.
   - Circularity meter: `circularityGap = mean(T1.D1_D2) - mean(T2.D1_D2)`. Flag `fixture-overfit-high` at gap >= 0.20 or when T1 passes while T2 fails below threshold.

8. **Mode B live dispatch and trace capture.**
   - Put Lane-C live runner in `scripts/skill-benchmark/capture-live-trace.cjs`.
   - Reuse `dispatch-model.cjs` programmatically for executor selection and read-only defaults. Add a backwards-compatible `opts.env` to `dispatchReal()` if needed so Lane C can disable advisor hooks cleanly.
   - Capture raw stdout/stderr and parse resource touches into `resource-loads.jsonl`.
   - Canonicalize file-touch channels into a common event:

```json
{
  "scenarioId": "deep-research-t2-holdout-001",
  "event": "resource_load",
  "channel": "Read|Grep|Glob|BashCat|BashRg|Unknown",
  "path": ".opencode/skills/deep-research/references/state/state_outputs.md",
  "normalizedResourceId": "deep-research:references/state/state_outputs.md",
  "timestamp": "2026-05-30T00:00:00.000Z",
  "confidence": 0.9
}
```

   - Store `traceQuality = full|partial|stdout-only|none`. If trace quality is below `partial`, D2/D3 findings should be `verify-in-rerun`, not definitive remediation.

9. **A/B divergence taxonomy.**
   - `advisor-pass/router-pass/live-pass`: properly utilized.
   - `advisor-pass/router-pass/live-fail`: reachable but not discovered; fix SKILL.md signposting, resource titles, quick reference, or prompt-facing guidance.
   - `advisor-pass/router-fail/live-fail`: in-skill router gap; fix `INTENT_SIGNALS` or `RESOURCE_MAP`.
   - `advisor-fail/router-pass`: inter-skill advisor gap; fix frontmatter triggers, advisor aliases, explicit phrase boosts, graph metadata, or derived metadata.
   - `advisor-fail/router-fail/live-pass`: likely alternate-path discovery or trace parser over-credit; require rerun before skill remediation.
   - `negative fixture advisor-pass/live-pass`: precision failure; fix overbroad triggers or `When NOT to Use` guidance.

10. **Scorer and report.**
   - Put scorer in `scripts/skill-benchmark/score-skill-benchmark.cjs`.
   - Reuse Lane B report fields: `status`, `mode`, `scoringMethod`, `profileId`, `family`, `target`, `label`, `provenance`, `aggregateScore`, `totals`, `thresholds`, `rows`, and `failureModes`.
   - Add Lane C fields:
     - `dimensionScores`: D1 inter/intra, D2 discovery, D3 efficiency, D4 usefulness, D5 structure/corpus validity.
     - `funnel`: reachable -> advisor activated -> router routed -> live discovered -> useful.
     - `runQuality`: contamination, traceQuality, advisorFreshness, fixtureCoverage, circularityGap, sampleVariance.
     - `bottlenecks[]`: sorted by funnel attrition, score impact, prevalence, confidence, and remediation locality.
     - `reports`: write `skill-benchmark-report.json` and render `skill-benchmark-report.md` from the JSON.
   - D5 hard gates should cap verdict even if weighted score is high: contamination failure, dead `RESOURCE_MAP` target, missing expected resource file, or no admitted fixtures for an intent key.

11. **Verification commands for Phase 004.**
   - `node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs --mode=agent-improvement --candidate=<fixture>` should produce the same plan as the pre-rename/default Lane A path.
   - `node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs --mode=model-benchmark --profile=default --outputs-dir=<tmp>` should still materialize and score Lane B.
   - `node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --target-skill=.opencode/skills/deep-research --profile=default --mode-a-only --output=<tmp>/report.json` should run in CI without live executor access.
   - A periodic live job should add `--mode-b-live --executor=cli-codex --model=<pinned>` and require `traceQuality >= partial`.
   - Advisor validation remains a release gate: keep full-corpus and holdout top-1 at or above current baselines, and require parity to pass.

# Open Questions

- **Trace fidelity:** which CLI/runtime exposes the most stable structured tool-call log for Codex/OpenCode/Claude today? If no stable structured log exists, the first implementation should ship with `traceQuality` and conservative D2/D3 actionability.
- **Router manifest source:** should Phase 004 extract router maps from the SKILL.md fenced block, or should Phase 004 add an explicit router manifest/module and then update SKILL.md to mirror it? Extraction is lower-touch; a real module is less drift-prone.
- **Sentinel resource tokens:** should inert resource canaries be added during the first Lane C build, or deferred until after trace parsing works on raw file-load events? Adding them improves consumed-vs-opened evidence but risks changing resource text enough to perturb behavior.
