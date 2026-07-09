# Focus

RQ2: design a credible hint-free dispatch harness for Lane C (`skill-benchmark`). The target is a realistic scenario runner that sends only task-facing instructions to an AI, captures which skill references/assets it actually loaded plus the tool trace, keeps the expected-resource key out of the prompt and run workspace, and produces remediable evidence for routing/discovery failures.

# Actions Taken

- Read the target `deep-agent-improvement` skill contract, especially the smart router, resource maps, Lane B mode pattern, mode-aware records, and runtime truth contracts. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:81] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:113] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:273]
- Rechecked `sk-doc` and `system-skill-advisor` to keep Lane C distinct from doc-shape validation, manual testing playbooks, and advisor-only routing. [SOURCE: .opencode/skills/sk-doc/SKILL.md:117] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:59] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:257]
- Read the 122 parent and child specs for the Lane C fixture/dispatcher/scorer frame, hint-free trace capture requirement, diagnostic non-goal, and rename dependency. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:120] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:39] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37]
- Checked current GPT-5.5 iteration-001 results so this iteration extends, rather than repeats, the earlier scoring-dimension work. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:82]
- Used external tracing/eval prior art for implementation shape: trace spans around tool calls, custom trace processors, span attributes/events, and schema-backed eval records. [SOURCE: https://openai.github.io/openai-agents-python/tracing/] [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/] [SOURCE: https://developers.openai.com/api/reference/resources/evals]

# Findings

## f-gpt55-i2-01 - The fixture must have a public scenario and a private scorer key.

Lane C fixtures should be split into two payloads: `public`, used to render the executor prompt, and `private`, consumed only after the run by the scorer. The public payload contains a realistic user task, target runtime, allowed mutation/read boundary, and output contract. The private payload contains `expectedSkill`, `expectedAdvisorLane`, `expectedIntentKeys`, `expectedResources[]`, `expectedAssets[]`, `negativeActivation`, and the outcome rubric. This directly satisfies the parent spec's requirement that fixtures include realistic prompts plus expected activation/resources/rubric while the dispatcher captures traces hint-free. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:133] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:134] OpenAI's eval API supports schema-shaped eval data sources and JSONL-style run content, which is the right prior-art shape for keeping structured per-item metadata while deciding exactly what gets rendered into the model input. [SOURCE: https://developers.openai.com/api/reference/resources/evals]

Remediation handle: if a target skill misses a resource, the report can name both the hidden key (`expectedResources`) and the observed miss without ever having leaked that path into the scenario prompt.

## f-gpt55-i2-02 - Resource-load capture should be out-of-band trace instrumentation, not self-report.

The harness should not ask the AI "which files did you load?" because that turns a trace into an unverifiable narrative. Capture file/resource loads from the runner's tool-event stream: every read/search/open event gets a structured row with `scenarioId`, `runId`, `stepIndex`, `tool`, `path`, `normalizedResourceId`, `bytesOrTokenEstimate`, and timestamp. Existing local logs already expose tool-use records with tool name and input file path, proving the raw material exists in the runtime trace. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/minimax/logs/iter-002.out:3] OpenAI Agents tracing also treats tool calls as traced spans and allows custom trace processors, which maps cleanly to a resource-load exporter. [SOURCE: https://openai.github.io/openai-agents-python/tracing/] OpenTelemetry's trace model supports span attributes/events, so resource identity and scenario ids should be attributes/events on a trace span, not hidden in free-text logs. [SOURCE: https://opentelemetry.io/docs/specs/otel/trace/api/]

Remediation handle: a missed resource can be traced to "never searched", "searched but wrong keyword", "opened wrong sibling", or "opened correct file after final answer", which are different fixes.

## f-gpt55-i2-03 - Score both intended router output and actual agent behavior.

There are two different observables. First, the skill's router function returns selected intents plus loaded resource/runtime-asset paths. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:183] [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:213] Second, the executor's tool trace shows what the AI actually opened and used. Lane C should persist both: `routerTrace.json` for advisor/smart-router decisions and `toolTrace.jsonl` for runtime behavior. This avoids a false pass where the router would have selected the right resource, but the AI ignored it, and a false fail where the AI found a resource manually despite a weak router.

Remediation handle: classify each miss as advisor-selection, in-skill routing, resource-discovery, or post-load-usefulness. That maps failures to the right follow-up edit: advisor metadata, `INTENT_SIGNALS`, `RESOURCE_MAP`, reference naming, or task guidance.

## f-gpt55-i2-04 - Prompt contamination needs a hard linter before dispatch.

The public prompt must not contain the expected path, resource basename, asset basename, target intent label, or a direct trigger phrase being tested unless the scenario explicitly marks that field as allowed. The parent spec's core question is whether the AI finds the right reference "without being told which file to open." [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:71] The research spec makes RQ2 explicitly about avoiding expected-answer leakage. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/spec.md:43] The target skill already warns that merely reading `SKILL.md` or naming the skill is not enough evidence that the real protocol executed, which supports contamination checks over superficial activation proof. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:248]

Remediation handle: make contamination failures first-class benchmark failures with exact offending token and source field, so bad scenario fixtures are fixed before they poison score data.

## f-gpt55-i2-05 - The dispatcher should reuse Lane B executor routing but run in a sealed scenario workspace.

Lane B already defines a model-agnostic dispatcher across cli-opencode, cli-claude-code, cli-codex, cli-gemini, and cli-devin. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md:278] Phase 003 expects the Lane C dispatcher to reuse that executor-routing map while capturing resource-load and tool traces. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-benchmark-mode/spec.md:41] The sealed workspace rule is the new RQ2 requirement: the executor sees the repo and public scenario, but not the private expected-resource key. Store the private key outside the executor-visible run directory, or pass it only to the scorer after the process exits.

Remediation handle: if an executor succeeds only when private keys are reachable, the harness can flag that as contamination rather than skill quality.

## f-gpt55-i2-06 - Actual file opens matter more than routing-trace claims because agents hallucinate paths.

The sk-doc skill records prior stress-test evidence that external CLI routing traces can cite paths literally and still be wrong; it even notes different resource-accuracy rates by executor and warns that some models hallucinate plausible non-existent paths. [SOURCE: .opencode/skills/sk-doc/SKILL.md:189] Therefore Lane C should not score "the agent mentioned reference X" as discovery. Discovery credit requires a normalized resource-load event whose path exists in the target skill inventory. system-skill-advisor's anti-pattern list reinforces this: stale inventories, compatibility stubs, unguarded raw loads, and hardcoded tool ids are known router failure modes. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:264] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:270]

Remediation handle: report hallucinated path, nearest existing resource, and the router/resource-map edge that could have made the real path easier to find.

## f-gpt55-i2-07 - The scorer should join traces after the run and emit path-to-remediation rows.

Scoring should be a post-run join: `scenario.private.expectedResources` x `resource-loads.jsonl` x `routerTrace.json` x final output verdict. The first-level metrics are expected-resource recall, irrelevant-load precision, first-useful-resource rank, calls/tokens before first expected resource, negative activation correctness, and final task outcome delta. This extends the iteration-001 scorecard rather than replacing it. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:20] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/001-skill-benchmark-deep-research/research/gpt55/iterations/iteration-001.md:46] The parent spec requires the final report to rank bottlenecks with concrete remediation recommendations. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/spec.md:129]

Remediation handle: emit rows like `missing_resource`, `overloaded_default`, `dead_intent_key`, `ambiguous_trigger`, `late_useful_resource`, and `negative_false_positive`, each with a concrete suggested edit.

## f-gpt55-i2-08 - The rename surface affects trace normalization.

During the `deep-agent-improvement` -> `deep-improvement` transition, traces may contain old skill names, old agent names, old command paths, and historical spec references. Phase 002 already scopes the rename across the skill dir, `SKILL.md`, commands, agent/runtime mirrors, advisor graph, `descriptions.json`, root docs, cross-skill refs, and internal self-references. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:45] Lane C trace normalization should therefore support an alias map during research/build (`deep-agent-improvement` and `deep-improvement` normalize to one target id), while Phase 002 success still requires operational surfaces to resolve under the new name. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:50]

Remediation handle: separate "historical archive mention" from "live routing surface still uses old name" so the rename report does not produce noisy false positives.

# Recommendations

1. Define a `skill-benchmark` fixture schema with `public` and `private` top-level objects. The dispatcher may read only `public`; the scorer reads both after execution.
2. Add a pre-dispatch contamination linter that blocks any public prompt containing expected resource paths, basenames, expected intent labels, or test-only canary strings.
3. Capture three artifacts per scenario: `routerTrace.json`, `resource-loads.jsonl`, and `tool-trace.raw.jsonl`. The report should cite these artifacts, not model self-report.
4. Normalize resource ids against the target skill inventory before scoring. Give discovery credit only for existing references/assets loaded by a real tool event.
5. Score advisor selection, in-skill routing, resource discovery, efficiency, and outcome usefulness separately. Aggregate later; keep the failure labels remediable.
6. Add a temporary alias map for `deep-agent-improvement` and `deep-improvement` in research traces, but keep Phase 002's operational grep-clean requirement strict.

# Open Questions

- Should the private expected-resource key live outside the executor workspace entirely, or is an executor-inaccessible packet subdir enough for the first implementation?
- How should the harness estimate token cost per loaded resource across runtimes that expose different trace metadata?
- For skill-off ablation, should the skill be removed from advisor metadata, hidden from the available skills list, or made non-routable via a harness-level denylist?
- What variance threshold turns a routing score from pass/fail into inconclusive across repeated AI runs?
