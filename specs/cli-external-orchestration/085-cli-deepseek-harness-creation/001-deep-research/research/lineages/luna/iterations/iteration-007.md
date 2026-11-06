# Iteration 7 — Third-party Pi plugin migration

- Focus: Angle 7, third-party Pi plugin migration and dropping
- Timestamp: 2026-11-05T22:36:57Z
- Findings count: 6
- Novelty: 0.94

## Focus

Assess every package in .pi/PLUGINS.md and .pi/settings.json for a DSH native replacement, a bounded port, a defer decision, or removal from the headless runtime.

## Actions Taken

- Read the pinned Pi package inventory, local cache optimizer and fast-mode implementations, DSH native capability references, base/headless composition, and plugin-market and memory-MCP guides.
- Cross-checked DSH's current upstream package and user-guide pages on GitHub on 2026-11-05. Local source clone commit fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159 remains the version-specific record.

## Findings

1. Package-by-package recommendation (Replace = use DSH's native feature; Port = build a DSH adapter; Defer = wait for its contract or a need; Drop = omit from the headless mode):
| Pi package | Disposition | DSH decision |
|---|---|---|
| @juicesharp/rpiv-ask-user-question v2.15.0 | Replace, with headless caveat | Use native ask_user_question/userQuestions; require an answerer bridge, otherwise DSH reports NO_PROVIDER. |
| @juicesharp/rpiv-todo v2.15.0 | Replace | Use native session-scoped todo_write. |
| pi-blackhole v0.5.16 | Split | Replace compaction with dsh-compaction-basic; defer observational memory to a separately selected MCP server and policy. |
| pi-btw v0.8.0 | Drop | Interactive side conversations are not a one-shot headless capability; DSH subagents/workflows cover delegated tasks, not this UX. |
| pi-cache-optimizer v2.8.0 | Defer / partial native replacement | Use DSH's repeat-tool-reminder for repeat-call hygiene; defer prompt-order, cache-key, and proxy-compat porting until route behavior is measured. |
| pi-claude-code-ui v1.0.102 | Drop | Terminal presentation only. |
| pi-fast-mode-w-subagent-support v0.3.0 | Drop for these routes | It sets OpenAI/OpenAI-Codex service_tier=priority for configured GPT targets; DSH's requested routes are DeepSeek. Keep DSH's native child execution. |
| pi-plan-build v0.1.120 | Replace in part | Use DSH plan-mode for plan/review; retain clean-session implementation orchestration in the outer runner if required. |
| pi-statusline v0.0.2 | Drop | Command-driven status line is interactive terminal UI. |
| pi-web-access v0.45.0 | Replace in part; defer extras | Use dsh-tool-web for web_search/web_fetch; defer GitHub cloning, PDF, YouTube, and local-video paths until a concrete headless need exists. |

The inventory and versions are the repo's pinned package record. The DSH build composition loads user questions, plan mode, compaction, subagents, todo, and web tools in the base used by headless, so these are native candidates rather than extra package ports. [SOURCE: .pi/PLUGINS.md:16-106; .pi/settings.json:21-32; dsh-src/packages/bundle/headless/cordis.patch.yml:1-7; dsh-src/packages/bundle/base/cordis.patch.yml:79-81,336-364,445-446,499-503]

2. DSH already has a structured question schema and a question-answer service, plus a model-facing ask_user_question tool. The package authenticates the exact calling Agent, stores the question projection through Session events, and returns NO_PROVIDER when no answerer accepts the request. That is a direct capability replacement for the Pi questionnaire, but a headless run cannot assume a human UI; the DSH mode must either wire an answer source or stop cleanly on unanswered questions. DSH todo_write provides a persistent per-session task list, so rpiv-todo does not need a port. [SOURCE: dsh-src/packages/interaction/user-questions/README.md:12-45; dsh-src/packages/interaction/README.md:27-33; dsh-src/packages/todo/README.md:10-35; https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/interaction/user-questions/README.md (fetched 2026-11-05); https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/todo/README.md (fetched 2026-11-05)]

3. Blackhole bundles compaction with durable observations/reflections, so DSH's native compaction only replaces half the feature. DSH base already mounts dsh-compaction-basic, which condenses conversation history. DSH does not ship an observational memory service in that composition; its guide instead documents default-off third-party MCP memory servers, whose persistence, retrieval, model, and installation remain external. The reference graph server is simple substring search and explicitly lacks automatic summarization, conflict resolution, and forgetting, so do not label it a behavioral equivalent to Blackhole. [SOURCE: .pi/PLUGINS.md:30-34; dsh-src/packages/compaction/README.md:10-33; dsh-src/docs/user/guide/mcp-memory.md:5-33,46-55,66-72; https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/compaction/compaction-basic/README.md (fetched 2026-11-05)]

4. Pi's side-conversation package and plan-build workflow do not map one-for-one to DSH's subagent model. DSH subagents and JavaScript workflow scripts support isolated or parallel delegated work; plan-mode provides a native explore, plan, approve flow. Recommend dropping /btw from a one-shot executor, using plan-mode where a human approval answerer exists, and keeping any clean-session execution boundary in the fan-out wrapper instead of imitating a Pi slash command. [SOURCE: .pi/PLUGINS.md:37-41,88-92; dsh-src/packages/subagent/README.md:10-12; dsh-src/packages/workflow/workflow/README.md:28-51; dsh-src/packages/plan/README.md:10-29; dsh-src/packages/bundle/base/cordis.patch.yml:336-350; https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/plan/README.md (fetched 2026-11-05)]

5. Cache optimization is not safe to copy verbatim. Pi's cache extension rearranges prompt content, may add prompt_cache_key, warns about proxy affinity, and explicitly leaves long cache retention disabled until the endpoint supports it. DSH's base includes repeat-tool-reminder, but the inspected DSH references do not establish that either requested route accepts the Pi cache parameters or has an equivalent cache-control hook. Keep those behaviors UNKNOWN until provider-specific requests are pinned; the OpenAI priority service_tier toggle is out of scope for the requested DeepSeek providers, while DSH already supplies child execution. [SOURCE: .pi/extensions/pi-cache-optimizer/README.md:37-50,58-64; .pi/extensions/pi-fast-mode-w-subagent-support/README.md:9-24,59-96; .pi/PLUGINS.md:81-85; dsh-src/packages/guard/README.md:8-32; resource-map.md:18-25]

6. The core search/fetch part of pi-web-access has an in-box counterpart: dsh-tool-web registers web_search/web_fetch with provider-backed readiness and bounded outputs. Pi's listed package also advertises repository cloning, PDF extraction, YouTube understanding, and local-video analysis; the DSH web docs do not claim those tools, so defer them rather than mark full parity. The DSH Plugin Market is a catalog of installable DSH bundles behind user-configured indexes, ships with no index source, and installs only after confirmation; it is not an import path for Pi extensions or a ready-made Pi-compatible marketplace. [SOURCE: .pi/PLUGINS.md:102-106; dsh-src/packages/web/tool-web/README.md:10-55; dsh-src/docs/user/guide/plugin-market.md:5-34; dsh-src/packages/bundle/base/cordis.patch.yml:499-503; https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/web/tool-web/README.md (fetched 2026-11-05); https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.md (fetched 2026-11-05)]

## Questions Answered

- None; this classifies the Pi plugin set, but MCP wiring and the full runtime representation remain open.

## Questions Remaining

- How should the provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP form one sync contract?
- Which optional MCP memory and tool packages are appropriate for this repository?
- What fan-out executor changes and complete cross-repository touch points are required?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 8: MCP configuration and enablement.

## Ruled Out

- Treating DSH conversation compaction as an equivalent for observational memory.
- Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar.
- Importing Pi-specific provider cache parameters before both DSH routes are pinned.

## Uncertainties

- No credentialed DSH headless run was performed, so ask_user_question availability and answer behavior remain unconfirmed for this invocation.
- The requested providers' cache-key, cache-retention, and session-affinity support remains UNKNOWN.
- A DSH plugin-market index can list compatible DSH bundles; the Pi package catalog cannot be assumed to contain ready DSH bundles.

## Sources

- .pi/PLUGINS.md and .pi/settings.json
- .pi/extensions/pi-cache-optimizer/README.md and .pi/extensions/pi-fast-mode-w-subagent-support/README.md
- resource-map.md
- dsh-src/packages/interaction/user-questions/README.md and interaction/README.md
- dsh-src/packages/todo/README.md, compaction/README.md, plan/README.md, subagent/README.md, workflow/workflow/README.md
- dsh-src/packages/web/tool-web/README.md
- dsh-src/docs/user/guide/mcp-memory.md and plugin-market.md
- dsh-src/packages/bundle/base/cordis.patch.yml and bundle/headless/cordis.patch.yml
- Official DSH GitHub package/user-guide references fetched 2026-11-05 (links cited above)

## Scope Violations

- None.
