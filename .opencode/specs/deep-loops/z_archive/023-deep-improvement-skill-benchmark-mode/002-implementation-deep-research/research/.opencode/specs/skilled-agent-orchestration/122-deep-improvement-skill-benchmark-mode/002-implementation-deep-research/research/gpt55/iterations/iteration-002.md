# Focus

IQ2 and IQ3 for iteration 2 of 5: loop-host wiring for `--mode=skill-benchmark`, non-regression proof for Lane A/B when the new flag is absent, and the first trace-capture implementation tier. This pass treats the Phase 001 design as settled and turns it into a build-ready playbook for Phase 003 rename plus Phase 004 Lane C implementation.

# Actions Taken

- Read the converged Phase 001 research synthesis, especially RQ2 capture, RQ5 report shape, and RQ6 rename ordering.
- Inspected the target skill router, `scripts/shared/loop-host.cjs`, existing Lane B materialize/run flow, Lane B dispatcher/scorer, and the current `loop-host.vitest.ts` non-regression suite.
- Inspected Phase 003 and Phase 004 specs to keep the playbook aligned with the fixed narrow rename and the required Lane C resources.
- Inspected system-skill-advisor alias, explicit phrase, fusion, and graph surfaces affected by the rename.
- Checked deep-loop runtime executor/prompt primitives and external trace/eval prior art for the trace schema shape.

# Findings

1. **Lane C should be an additive third mode in `loop-host.cjs`, with the default route left structurally untouched.** The current router has only `agent-improvement` and `model-benchmark` in `VALID_MODES`, defaults missing `--mode` to `agent-improvement`, and exports the pure `planInvocation()` seam explicitly for non-spawning tests. That is the right insertion point: add `skill-benchmark` to the mode set and path resolver, but do not change the `agent-improvement` branch or the `parseArgs()` key=value behavior. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:31] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:87] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:115] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:130] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:203]

2. **The build should make Lane C ordering explicit in `planInvocation()`: materialize -> dispatch/capture -> score -> report.** Lane B already encodes materialize-first because scoring all-zero missing outputs was a known failure mode, and `runPlan()` aborts subsequent steps on the first failing script. Phase 004 requires the same three-seam architecture but adds trace capture and a dual report, so hiding dispatch inside scoring would collapse the evidence boundary that Lane C needs. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:135] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:153] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:180] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:41] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:46]

3. **TST-1 should be upgraded from semantic equality to byte-level plan snapshots.** Existing tests already assert default-vs-explicit Lane A equality, unknown-mode fallback equality, Lane B materialize-first ordering, and option forwarding for `--scorer`, `--grader`, `--profiles-dir`, and `--integration-report`. For this phase, freeze `JSON.stringify(plan)` outputs for the no-mode Lane A path and the existing Lane B path before adding Lane C; then assert the strings remain exactly equal after the new mode exists. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:62] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:69] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:90] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:109] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:128] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:163]

4. **Trace capture should start with Tier 1 CLI `.out` parsing, while preserving a later proxy/intercept seam.** The converged design already ranks CLI output parsing as the least invasive default and requires parsing the runtime tool-call log. The repo has proof of usable raw material: OpenCode logs emit JSON `tool_use` events with tool name and structured input, while Lane B's dispatcher already captures stdout/stderr for all five executors. OpenAI Agents tracing, OpenTelemetry, and LangSmith all support the same architectural shape: trace spans/events for tool calls and intermediate steps, with evaluators reading those traces post-run. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:67] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/logs/iter-001.opencode.out:3] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:105] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:263] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:276] [SOURCE: https://openai.github.io/openai-agents-python/tracing/] [SOURCE: https://opentelemetry.io/docs/specs/otel/overview/] [SOURCE: https://docs.langchain.com/langsmith/evaluate-on-intermediate-steps]

5. **The parser must normalize all load channels, not just `Read`.** Phase 001 explicitly calls out `Read`, `Bash(cat ...)`, `Bash(rg ...)`, `Grep`, and `Glob`, and warns that a Read-only parser under-counts discovery. The target skill also allows all of those tool families, and the in-skill router returns resource paths as a set of loaded references/assets. Therefore the scorer should compare expected resource keys against observed set membership, retaining order only for D3 efficiency metrics. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:67] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:4] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:207] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:248]

6. **Executor diversity requires per-executor adapters behind one trace event schema.** Lane B's dispatcher supports `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-devin`, but each executor is invoked differently: OpenCode gets prompt text as an argument, Codex reads stdin, Devin reads a prompt file, and Claude/Gemini have their own flag shapes. One regex over raw output will be brittle; the build should expose `parseTrace(executorKind, text)` adapters that all emit the same `RawToolEvent[]`. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:105] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:185] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:190] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:206] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:222] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:7]

7. **The golden trace fixture should assert resource-key sets and efficiency metadata separately.** Existing logs prove that at least one executor can produce structured JSON tool events, and Phase 001 says order must not decide D2 correctness. The fixture should include five executor-specific `.out` snippets that all represent the same intended resource loads through different verbs/syntax, plus an expected `resourceKeys` set and ordered `events` list. D2 asserts set equality/recall; D3 asserts first-hit index, call count, and wasted-load count. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/logs/iter-001.opencode.out:3] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:65] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:67] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:42]

8. **The rename must land before Lane C, and it should stay narrow.** Phase 003 already fixes the rename scope as skill + agent id + advisor + cross-refs while keeping command verbs and the `agent-improvement` token family. Phase 004 depends on Phase 003, and Phase 001 warns that building Lane C against the old skill root breaks trace-normalization roots. Current advisor surfaces still carry `deep-agent-improvement` in aliases, phrase boosts/penalties, fusion disambiguation, and the skill graph, so those must move atomically and generated indexes rebuild last. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:152] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:99] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:326] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:27]

# Recommendations (build-ready)

1. **Patch `loop-host.cjs` in the renamed skill with one new mode branch.** After the Phase 003 `git mv`, edit `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs`:

   - `VALID_MODES = new Set(['agent-improvement', 'model-benchmark', 'skill-benchmark'])`.
   - Add `LANE_SKILL_BENCHMARK = new Set(['materialize-skill-benchmark-fixtures.cjs', 'dispatch-skill-benchmark.cjs', 'score-skill-benchmark.cjs', 'render-skill-benchmark-report.cjs'])`.
   - Extend `resolveScriptPath()` so those bare names resolve to `scripts/skill-benchmark/`.
   - Add a `mode === 'skill-benchmark'` branch before the default Lane A branch.
   - Required args: `--skill=<skill-id-or-path> --profile=<path-or-id> --outputs-dir=<path>`.
   - Optional pass-throughs: `--profiles-dir`, `--executor`, `--model`, `--agent`, `--variant`, `--runs`, `--trace-tier=cli-out`, `--scorer=5dim`, `--grader=noop|mock|llm`, `--output`, `--report-md`, `--state-log`, `--label`.

   The planned steps should be exactly:

   ```js
   [
     { script: 'materialize-skill-benchmark-fixtures.cjs', args: materializeArgs },
     { script: 'dispatch-skill-benchmark.cjs', args: dispatchArgs },
     { script: 'score-skill-benchmark.cjs', args: scoreArgs },
     { script: 'render-skill-benchmark-report.cjs', args: reportArgs },
   ]
   ```

   This mirrors Lane B's materialize-first contract while preserving the separate dispatch trace artifact required by Phase 004. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:153] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs:185] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:44]

2. **Keep Lane-C-specific code in `scripts/skill-benchmark/`; extract only truly cross-lane executor code to `scripts/shared/`.** Build these Lane C files:

   - `scripts/skill-benchmark/materialize-skill-benchmark-fixtures.cjs`: reads public/private scenario fixtures, writes public prompts and private scorer metadata under `outputs-dir/scenarios/`.
   - `scripts/skill-benchmark/dispatch-skill-benchmark.cjs`: runs each public prompt, captures raw `.out`, and writes `resource-loads.jsonl`.
   - `scripts/skill-benchmark/trace-capture.cjs`: executor adapters plus canonicalizer.
   - `scripts/skill-benchmark/score-skill-benchmark.cjs`: computes D1-D5, gates, scenario rows, and bottlenecks into `skill-benchmark-report.json`.
   - `scripts/skill-benchmark/render-skill-benchmark-report.cjs`: renders `skill-benchmark-report.md` from the JSON.

   Extract the executor map from `scripts/model-benchmark/dispatch-model.cjs` only if compatibility tests are in the same patch. The safe extraction target is `scripts/shared/executor-dispatch.cjs`; then leave `scripts/model-benchmark/dispatch-model.cjs` as a wrapper exporting the same API and printing the same CLI envelope. The reason to extract is concrete reuse: Lane B already owns all five executor spawn specs and read-only defaults. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:50] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:105] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:350]

3. **Implement trace capture as a deterministic post-run parser first.** Use this v1 event schema:

   ```json
   {
     "type": "resource_load",
     "scenarioId": "string",
     "runId": "string",
     "executor": "cli-opencode|cli-claude-code|cli-codex|cli-gemini|cli-devin",
     "stepIndex": 0,
     "tool": "Read|Bash|Grep|Glob",
     "verb": "read|cat|rg|grep|glob|unknown",
     "raw": "original tool-call text or JSON",
     "path": "absolute-or-relative-path-or-null",
     "resourceKey": "skill:<id>/references/...|skill:<id>/assets/...|skill:<id>/SKILL.md|null",
     "confidence": "exact|derived|query-only|ignored",
     "timestamp": "optional"
   }
   ```

   Parser rules:

   - OpenCode adapter: parse JSONL `type:"tool_use"` rows; map `part.tool` and `state.input.filePath`, `path`, `pattern`, and any `<path>...</path>` output entries.
   - Text adapters for Claude/Codex/Gemini/Devin: parse recognizable tool-call blocks first, then fallback regexes for `Read(...)`, `Grep(...)`, `Glob(...)`, and shell command lines.
   - Bash parser: conservatively tokenize quoted command strings; recognize read/search commands `cat`, `sed -n`, `nl`, `head`, `tail`, `wc`, `rg`, `grep`, `ls`, `find`, and ignore redirection/write verbs.
   - For `rg`/`grep`/`Glob`, count concrete matched paths from output as resource hits; if the log only preserves the query and not matches, emit `confidence:"query-only"` and do not award D2 credit.

   This keeps v1 low-risk while leaving a clean place to add Tier 2 tool-proxy and Tier 3 MCP transport intercept later. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:67] [SOURCE: https://openai.github.io/openai-agents-python/tracing/] [SOURCE: https://opentelemetry.io/docs/specs/otel/overview/]

4. **Canonicalize to resource keys before scoring.** Resolve paths against the benchmark workspace root, normalize separators, collapse `.`/`..`, optionally realpath existing files, and classify only paths under the target skill root:

   - `SKILL.md` -> `skill:<skillId>/SKILL.md`
   - `references/<lane-or-shared>/<file>` -> `skill:<skillId>/references/<...>`
   - `assets/<lane-or-shared>/<file>` -> `skill:<skillId>/assets/<...>`
   - `scripts/<lane-or-shared>/<file>` -> `skill:<skillId>/scripts/<...>`
   - everything else -> `external:<repo-relative-path>` or `ignored`

   Score D2 with sets: `expectedResourceKeys ∩ observedResourceKeys`, not ordered arrays. Store the ordered event list anyway for D3: first expected hit, total tool calls before hit, wasted loads, and repeated loads. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:57] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:67]

5. **Add the non-regression test bundle before implementing Lane C logic.** Extend `scripts/tests/loop-host.vitest.ts` with:

   - `VALID_MODES` includes `skill-benchmark`.
   - No-mode Lane A `JSON.stringify(planInvocation(...))` equals a checked literal.
   - Explicit `--mode=agent-improvement` equals the no-mode literal.
   - Unknown mode still equals the Lane A literal.
   - Existing `--mode=model-benchmark` plan string equals the pre-change literal for representative args.
   - `--mode=skill-benchmark` produces the four-step order and forwards only the intended args to each step.
   - `resolveScriptPath()` maps Lane C bare script names to `scripts/skill-benchmark/`.

   This gives the byte-identical proof requested by TST-1 instead of relying on a looser object equality check. [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:69] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:109] [SOURCE: .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts:200]

6. **Add a golden trace fixture suite.** Place it under `scripts/tests/fixtures/skill-benchmark/golden-trace/` in the renamed skill. Include:

   - `target-skill/` with a minimal fake `SKILL.md`, `references/shared/quick_reference.md`, `references/skill-benchmark/evaluator_contract.md`, `assets/skill-benchmark/default-profile.json`.
   - `opencode.out`, `codex.out`, `claude.out`, `gemini.out`, `devin.out`; each should express the same resource usage with different syntaxes and at least one Bash `cat`/`rg` path.
   - `expected-resource-loads.json` with an unordered `resourceKeys` array and ordered efficiency facts.
   - Negative fixtures: `query-only-rg.out` (search with no matched path), `external-path.out`, and `write-command.out` to prove ignored/non-credit behavior.

   Test file: `scripts/tests/skill-benchmark-trace-capture.vitest.ts`. The core assertion is that all five executor logs produce the same observed key set while preserving different `stepIndex` values. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/logs/iter-001.opencode.out:3] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode/spec.md:58]

7. **Use this narrow rename runbook before Lane C implementation.** Execute Phase 003 first:

   - Freeze active inventory with denylisted historical paths (`research/`, `iterations/`, archives, raw logs).
   - `git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement`.
   - Update `SKILL.md name:`, triggers, keywords, internal self-refs, command skill-path refs, agent mirrors, runtime config, advisor aliases/explicit/fusion/graph, regression fixtures, cross-skill refs, and root docs.
   - Keep command verbs (`/deep:start-agent-improvement-loop`, `/deep:start-model-benchmark-loop`) and the `agent-improvement/` lane token family.
   - Rebuild generated advisor/index metadata last.
   - Validate with advisor rebuild/validate, skill graph validate, loop-host tests, and a grep census that allows historical mentions only.

   This implements the operator's fixed narrow decision and avoids building trace roots against a soon-to-be-dead skill id. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:48] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/research.md:166]

# Open Questions

1. **Dispatcher extraction timing:** I recommend extracting the executor map to `scripts/shared/executor-dispatch.cjs` in Phase 004 only if the same patch includes Lane B wrapper compatibility tests. If schedule risk is high, Lane C can temporarily import the Lane B dispatcher and defer extraction.

2. **Canonical CLI contract:** The cleanest Lane C CLI is `--skill --profile --outputs-dir`. If the operator wants profile-only runs where the target skill lives inside the profile, `--skill` can become an override instead of required, but that makes invocation less explicit.

3. **Executor log coverage:** OpenCode has a repo-local JSON example. Claude, Codex, Gemini, and Devin need one captured dry-run each before the parser is called complete; until then their adapters should be marked supported-by-fixture, not production-proven.

4. **Tier 2/3 threshold:** Tool-proxy or MCP transport intercept should wait until Tier 1 parser miss-rate is measured. A practical trigger: if golden/live traces show more than one uncredited expected load per 20 scenario runs due to log loss, build the proxy.
