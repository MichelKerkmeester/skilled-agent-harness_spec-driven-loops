# Focus

Iteration 1 focused on IQ1 and IQ8: turn the converged Lane C design into a build-ready module architecture, decide what is genuinely shared versus Lane-C-specific, preserve the candidate-source / dispatcher / scorer seams, and define the first dogfood/calibration/test strategy for `skill-benchmark`. I treated the directory layout as fixed: Lane C adds only `skill-benchmark/` under `assets/`, `references/`, and `scripts/`, while truly cross-lane code belongs under `scripts/shared/`.

# Actions Taken

- Read the authoritative Phase 001 research synthesis for Lane C dimensions, weights, fixture design, trace/report requirements, and rename impact map.
- Inspected `deep-agent-improvement` skill routing, existing Lane A/B seam language, `loop-host.cjs`, Lane B `run-benchmark.cjs`, `dispatch-model.cjs`, the 5-dim scorer/grader/cache tree, and existing Vitest patterns.
- Inspected `system-skill-advisor` alias, fusion, lane-weight, Python fallback, and regression harness surfaces that Lane C must use for D1 inter-skill measurement.
- Inspected `deep-loop-runtime` executor/audit/state primitives to determine whether Lane C should reuse runtime provenance patterns.
- Web-checked external harness prior art for trace shape, deterministic harnessing, and location/fix result reporting: OpenTelemetry, SWE-bench, SARIF/GitHub code scanning, and the new Harness-Bench paper.

# Findings

1. Lane C should extend the existing mode host, but its implementation should be a third lane, not a Lane B fork. The current skill explicitly defines Lane A and Lane B as co-equal lanes sharing candidate, dispatcher, and scorer seams, and Lane B is wired through `scripts/shared/loop-host.cjs --mode=model-benchmark`; Phase 004 already fixes Lane C as `--mode=skill-benchmark` with Lane A/B byte-identical when absent. The build should add `skill-benchmark` to `VALID_MODES`, add a new lane script set, and add a `planInvocation()` branch without changing the default branch. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:27] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:275] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:31] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:130] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:44]

2. The Lane C candidate-source seam is Lane-C-specific. Lane B candidates are model variants plus benchmark profiles, while Lane C candidates are the skill-under-test, its `SKILL.md`, routed references/assets, advisor metadata, and a public/private fixture corpus. The Phase 001 design makes the public/private split and contamination linter a hard admission gate, so fixture loading, skill-root resolution, router metadata parsing, and contamination linting belong under `scripts/skill-benchmark/`, not `scripts/shared/`. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:65] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:69] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:231] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:261]

3. Lane C should reuse Lane B dispatch behavior through a shared executor core, not by importing `dispatch-model.cjs` directly. `dispatch-model.cjs` contains generic, valuable pieces: executor map, read-only defaults, rate-limit backoff, timeout handling, pause sentinel, and stdout/stderr capture. But it also bakes in model-benchmark names, a model-variant contract, a resume hint hardcoded to `--mode=model-benchmark`, and old skill-root path strings. Importing it directly would couple Lane C to Lane B semantics and the rename. Extract `scripts/shared/executor-dispatch.cjs` and leave `scripts/model-benchmark/dispatch-model.cjs` as a compatibility adapter. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:13] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:23] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:105] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:148] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:185]

4. Lane C should not reuse Lane B's 5-dim scorer wholesale. Lane B's scorer dimensions are acceptance, bundle gate, cwd/path correctness, hallucination grader, and pre-planning; Lane C's dimensions are routing/activation, unprompted discovery, efficiency, usefulness ablation, and structural connectivity. The reusable part is the pluggable grader/cache machinery for D4 usefulness, especially `noop|mock|llm`, prompt-injection hardening, score clamping, and run-scoped cache. Deterministic checks like bundle gate, cwd check, preplanning regex, and hallucination flag are Lane-B-specific. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:228] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:41] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:69] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:25] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:213]

5. D1 inter-skill scoring must call the advisor surfaces, not reimplement keyword matching. The TypeScript advisor has a 5-lane fusion model with explicit-author, lexical, graph-causal, derived-generated, and semantic-shadow lanes; the Python fallback has alias groups, native bridge routing, and dual-threshold confidence/uncertainty behavior. The regression harness is already alias-aware for renamed skills, so Lane C should wrap `advisor_recommend`/Python fallback and record the full recommendation list, confidence, uncertainty, ambiguity cluster, and dominant lane. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts:7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:191] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:7] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:477] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py:148]

6. Trace capture needs a first-class Lane C contract. Phase 001 says actual file opens beat self-reported routing claims; current Lane B dispatch captures stdout/stderr but not structured resource-load events. The implementation should define `resource-loads.jsonl` and `router-trace.json` as Lane C artifacts, with router-replay as deterministic CI mode and live-dispatch trace as periodic/optional mode. OpenTelemetry supports span attributes/events and parent-child traces, SWE-bench's harness separates Docker/build/grading/log-parser/test-spec modules, and deep-loop-runtime already records executor provenance and dispatch failures in JSONL. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:72] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:77] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:491] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:554] [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/] [SOURCE: https://www.swebench.com/SWE-bench/api/harness/]

7. `scripts/shared/` should stay narrow: mode host, executor dispatch core, grader/cache core, atomic/report helpers. Lane C-specific logic should not be promoted to shared until another lane actually needs it. The existing `loop-host.cjs` already uses lane sets and resolves bare script names at spawn time, while `deep-loop-runtime` draws a clear boundary between shared runtime primitives and downstream workflow semantics. That pattern argues for extracting only stable mechanical contracts, not the Lane C scorer or fixture semantics. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:33] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:75] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:144] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:196]

8. The first dogfood targets should be `deep-improvement`, `system-skill-advisor`, and `deep-loop-runtime`. `deep-improvement` validates the rename and the new lane on the target skill itself; Phase 001 explicitly calls for dogfooding across the rename. `system-skill-advisor` stress-tests D1 with its own alias/fusion/regression infrastructure. `deep-loop-runtime` gives a contrasting library-style skill with strong executor/state primitives and less lane-specific coupling. Avoid starting with `system-spec-kit`; it is too broad and gate-heavy for first calibration. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:338] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py:80] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:63] [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:123]

9. Weight and verdict-band calibration should be pilot-based, not tuned from first principles. Start from the converged weights D1=25, D2=20, D4=25, D3=15, D5=15, keep D5 as a hard gate, and use the 2-3-skill pilot to label whether findings would lead to a concrete fix packet. The initial verdict bands should be treated as provisional until the pilot shows stable first-failing-stage distribution and acceptable k-run variance. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:15] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:55] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:213] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:226]

10. Lane C reports should follow the repo's report conventions but expose SARIF-shaped location/fix data. Phase 001 asks for ranked bottlenecks with `file:locus`, evidence trace, likely cause, one-line remediation, and handoff lane. SARIF and GitHub code scanning provide the right external pattern: each result has locations with physical artifact/region, rule/severity metadata, fingerprints, and optional fixes/artifact changes. Lane C should emit native `report.json` plus a `sarif` sidecar or embedded `sarifResults[]` section so remediation can point to exact router keys, reference files, or advisor aliases. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:257] [SOURCE: https://docs.github.com/en/enterprise-server@3.21/code-security/reference/code-scanning/sarif-files/sarif-support-for-code-scanning] [SOURCE: https://github.com/oasis-tcs/sarif-spec/blob/main/sarif-2.1/schema/sarif-schema-2.1.0.json]

# Recommendations (build-ready)

1. Rename first, narrowly, then build Lane C.

   Execute Phase 003 before Phase 004. Rename the skill directory/id/advisor references/mirrors from `deep-agent-improvement` to `deep-improvement`, keep command verbs and the `agent-improvement` lane token family unchanged, and avoid immutable research/history paths. Phase 003 already fixes command verbs as non-renamed unless the old design showed a reason, and Phase 001 warns that Lane C trace normalization breaks if built against the old path then renamed. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:20] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:273]

2. Add these Lane C files under the fixed layout.

   - `references/skill-benchmark/operator_guide.md`
   - `references/skill-benchmark/scoring_contract.md`
   - `references/skill-benchmark/scenario_authoring.md`
   - `assets/skill-benchmark/default_profile.json`
   - `assets/skill-benchmark/scenario_schema.json`
   - `assets/skill-benchmark/report_schema.json`
   - `assets/skill-benchmark/report_template.md`
   - `assets/skill-benchmark/remediation_taxonomy.json`
   - `assets/skill-benchmark/fixtures/<id>.prompt.txt`
   - `assets/skill-benchmark/fixtures/<id>.expected.json`
   - `scripts/skill-benchmark/run-skill-benchmark.cjs`
   - `scripts/skill-benchmark/load-skill-under-test.cjs`
   - `scripts/skill-benchmark/load-scenarios.cjs`
   - `scripts/skill-benchmark/contamination-lint.cjs`
   - `scripts/skill-benchmark/router-replay.cjs`
   - `scripts/skill-benchmark/advisor-adapter.cjs`
   - `scripts/skill-benchmark/dispatch-skill.cjs`
   - `scripts/skill-benchmark/parse-resource-loads.cjs`
   - `scripts/skill-benchmark/score-skill-benchmark.cjs`
   - `scripts/skill-benchmark/build-report.cjs`
   - `scripts/skill-benchmark/export-sarif.cjs`
   - `scripts/skill-benchmark/calibrate.cjs`

   Keep these flat enough that ownership is obvious; nested fixture data under `assets/skill-benchmark/fixtures/` is fine because the one top-level lane subdir constraint is still preserved. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:50] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:54]

3. Extract only three shared modules.

   - `scripts/shared/executor-dispatch.cjs`: extracted from the generic parts of `dispatch-model.cjs`; exports `dispatchReadOnly({promptFile, executor, model, agent, cwd, timeoutMs, stateDir, inputMode})` plus rate-limit/pause handling.
   - `scripts/shared/grader-harness.cjs`: extracted from `model-benchmark/scorer/grader/harness.cjs`; keeps `noop|mock|llm`, prompt parsing, score clamping, and prompt-injection defenses.
   - `scripts/shared/scorer-cache.cjs`: extracted from `model-benchmark/scorer/lib/cache.cjs`; supports namespaced cache kinds such as `grader`, `trace`, and `advisor`, with a required run-scoped cache root for Lane C.

   Leave shims at the old Lane B paths so Lane B tests and imports keep passing. Do not extract Lane B's deterministic scorer scripts; they encode Lane B semantics. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:185] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:108] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:71]

4. Wire `loop-host.cjs` with a minimal third branch.

   Add `skill-benchmark` to `VALID_MODES`, add `LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs'])`, route it in `resolveScriptPath()`, and add a `planInvocation('skill-benchmark')` branch requiring `--skill-root` or `--skill-id`, `--fixtures-dir`, and `--outputs-dir`. Forward optional `--trace-mode=router|live|both`, `--grader=noop|mock|llm`, `--k-runs`, `--advisor-mode=mcp|python|auto`, and `--profile`. Keep unknown mode fallback unchanged. Existing tests should assert byte-identical default and explicit `agent-improvement` plans. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:115] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:122] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:1]

5. Implement the Lane C runner as a post-run join.

   `run-skill-benchmark.cjs` should execute this sequence:

   - Resolve skill root and compute `metadataHash` over `SKILL.md`, `description.json`, `graph-metadata.json`, and routed reference inventory.
   - Load fixtures and fail fast on schema or contamination errors.
   - Run D5 static connectivity before behavioral dispatch.
   - Run advisor adapter out-of-band for D1 inter-skill.
   - Run router replay for D1 intra-skill and deterministic D2 proxy.
   - Optionally live-dispatch `k` runs with hook/advisor brief stripped from the subject prompt.
   - Parse `resource-loads.jsonl`, join with private expectations, score D1-D5, build funnel, and emit report artifacts.

   The scorer should never read private fixture data before dispatch; only the post-run join sees it. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:74] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:242]

6. Use this trace schema.

   Write `resource-loads.jsonl`, one event per line:

   ```json
   {"type":"resource_load","runId":"...","fixtureId":"...","source":"router-replay|live-dispatch","resourceKind":"skill|reference|asset|script","normalizedResourceId":"skill:deep-improvement:references/shared/quick_reference.md","path":"...","exists":true,"loadOrdinal":3,"tool":"Read|Grep|router","timestamp":"..."}
   ```

   Write `router-trace.json` with selected intents, score map, loaded resources, and ignored resources. Write `run-quality.json` with contamination status, parser coverage, live-trace availability, k-run variance, and whether the run is actionable. This follows Phase 001's post-run join and OpenTelemetry's span/event model without over-committing to an OTel dependency. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:77] [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/]

7. Score with the converged funnel, not a flat average only.

   Per fixture, compute:

   - D5 first: structural reachability and contamination gate. Any D5 hard failure caps verdict to `blocked-by-structure` or `invalid-run`.
   - D1 inter: advisor top-1 expected skill, confidence >= 0.8, uncertainty <= 0.35, no ambiguity cluster containing a wrong near-neighbor.
   - D1 intra: smart-router replay loads expected intent/resources.
   - D2: live or replay resource discovery Hit@k, Recall@k, MRR, and cost-weighted precision.
   - D3: tool calls/tokens/load ordinal to first expected resource, wasted loads, fallback/dead-end count.
   - D4: skill-on/off output delta via shared grader, defaulting to `noop` in CI and `mock|llm` only when requested.

   Emit `firstFailingStage` and aggregate the largest stage drop-off as the headline bottleneck. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:226] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:249]

8. Start calibration with provisional bands.

   Initial bands:

   - `usable`: score >= 85, D5 pass, runQuality actionable, no P0/P1, variance <= 5 points.
   - `targeted-fix`: score 70-84 or exactly one P1 bottleneck with clear file locus.
   - `poorly-utilized`: score < 70, double-fail in the 2x2 matrix, or largest funnel drop-off >= 25 percentage points.
   - `blocked-by-structure`: D5 hard gate failure.
   - `invalid-run`: contamination, parser failure, missing live trace when live mode was required, or fixture schema failure.

   After the three dogfood runs, tune only verdict bands and `runQuality` thresholds first; leave D1-D5 weights unchanged until at least two pilots disagree with the manual actionability labels. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:55] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:75]

9. Use these Vitest patterns.

   - `loop-host-skill-benchmark.vitest.ts`: mode parsing, required args, unknown-mode fallback, and default Lane A plan identity.
   - `skill-benchmark-fixtures.vitest.ts`: public/private split, contamination linter, alias-safe skill IDs, private data absent from rendered prompt.
   - `skill-benchmark-router-replay.vitest.ts`: deterministic `INTENT_SIGNALS`/`RESOURCE_MAP` replay with gold expected resources.
   - `skill-benchmark-advisor-adapter.vitest.ts`: mocked native advisor and Python fallback, alias-aware renamed IDs, ambiguity cluster handling.
   - `skill-benchmark-trace.vitest.ts`: normalized resource IDs, hallucinated path rejection, first expected load ordinal, wasted loads.
   - `skill-benchmark-scorer.vitest.ts`: D1-D5 scoring, D5 verdict cap, D4 `noop|mock`, k-run variance, firstFailingStage.
   - `skill-benchmark-report.vitest.ts`: JSON schema, markdown render, SARIF-shaped locations/fixes, report history snapshot.
   - Integration smoke: router-only run against `deep-improvement`; mocked live-dispatch run against `system-skill-advisor`; static D5 run against `deep-loop-runtime`.

   Existing tests already cover mode mix, opt-in scorer behavior, report snapshots, and benchmark promotion gates; mirror those patterns instead of inventing a new test style. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/optin-scorer.vitest.ts:25] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/reduce-state-mode-mix.vitest.ts:25] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/promote-candidate-benchmark.vitest.ts:98]

10. Keep CI deterministic.

   The default CI command should be router-replay plus mocked advisor/grader:

   ```bash
   npx vitest run .opencode/skills/deep-improvement/scripts/tests/*skill-benchmark*.vitest.ts
   node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs \
     --mode=skill-benchmark \
     --skill-root .opencode/skills/deep-improvement \
     --fixtures-dir .opencode/skills/deep-improvement/assets/skill-benchmark/fixtures \
     --outputs-dir /tmp/deep-improvement-skill-benchmark \
     --trace-mode=router \
     --advisor-mode=mock \
     --grader=noop
   ```

   Live dispatch should be non-blocking or nightly because it depends on executor output and trace availability. Harness-Bench's framing supports this split: compare harness configurations under shared environments/budgets while preserving native execution behavior. [SOURCE: https://arxiv.org/abs/2605.27922]

# Open Questions

- Live resource-load capture depends on what each CLI executor exposes. If Codex/Claude/Gemini do not emit parseable tool-call logs, Lane C should ship router-replay as the CI gate and mark live D2 as `runQuality.liveTraceUnavailable` rather than guessing from final prose.
- The advisor adapter can prefer MCP/native `advisor_recommend`, but the Python fallback is easier to test hermetically. The build should support `--advisor-mode=auto|mcp|python|mock` and record which one produced D1.
- The first calibration pass needs manual labels for "would this finding become a fix packet?" Without those labels, weights can be reported but should not be treated as absolute quality truth.
