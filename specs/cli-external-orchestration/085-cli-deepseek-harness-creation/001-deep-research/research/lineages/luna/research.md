---
title: "DeepSeek Harness Runtime Mode — Research Synthesis"
trigger_phrases: []
---

# DeepSeek Harness Runtime Mode — Research Synthesis

## 1. Executive Summary

DeepSeek Harness (DSH) can support a new `cli-dsh` external-orchestration mode as a one-shot headless executor, but it needs its own adapter and repository-local integration layer. It is not a Pi-compatible command surface. DSH accepts one task through positional text or stdin, emits plain final text by default or structured JSON events with `--json`, and reports completed turns with exit code 0. It has no per-dispatch provider/model or timeout flags, so profiles select the route and the shared runner must supervise timeouts. [SOURCE: `dsh-src/packages/bundle/headless/src/startup.ts:53-75,117-155`; `dsh-src/packages/bundle/headless/src/json-stream.ts:230-327`; `dsh-src/packages/bundle/headless/src/index.ts:400-443`; iteration 1]

The implementation should pin and verify the prerelease package first, then create an explicit `.dsh/` project convention with `SYNC.md`, route-specific profile patches, and generated or linked runtime mirrors. DSH does not automatically load a project `.dsh` profile or extension directory; the launcher must pass the patch. Keep credentials in approved environment references or the operator’s DSH home, never in the repository. [SOURCE: `dsh-src/apps/cli/reference/README.md:11-17,83-87`; `dsh-src/docs/user/guide/providers.md:27-39,49-56,67-80`; `.pi/SYNC.md:8-45`; `.hermes/SYNC.md:1-45`; iterations 3 and 10]

Keep the initial mode small: two distinct custom pi-ai routes, the headless contract, core repository guards, bounded skill/agent mirrors, and opt-in MCP. Defer optional Pi parity. The OpenCode Go endpoint is unresolved, the installed package’s native sandbox dependencies may be unavailable because install scripts were skipped, and neither provider route was authenticated in a DSH process. These are explicit phase-002 gates, not assumptions to encode into the first implementation. [SOURCE: iteration 2; iteration 8; iteration 10; `resource-map.md`]

The fan-out adapter should invoke DSH with its native headless flags, close stdin after the task, set a lineage cwd and native `DSH_HOME`, apply an explicit repo patch, enforce an external timeout, and require both exit code 0 and a successful JSON final event. DSH’s workspace permission mode is a candidate preventive boundary, not proven OS confinement. Preserve the shared post-dispatch write-containment check and recursion guard. [SOURCE: `dsh-src/packages/bundle/headless/src/startup.ts:53-75`; `dsh-src/packages/sandbox/README.md:10-32`; `executor-audit.ts:93-127,151-224`; `fanout-run.cjs:1815-1829,3579-3689,4038-4057`; iteration 9]

## 2. Research Question and Scope

This synthesis combines ten research angles: headless dispatch; provider/model routing; profiles and DSH_HOME; skills; agents, subagents, commands, and goals; plugins, hooks, and guards; third-party Pi plugin migration; MCP; fan-out fitness and repository touch points; and implementation constraints and phase ordering. The question is how to add DSH as a governed runtime mode alongside cli-pi, while identifying what can be reused and what must remain DSH-specific.

The work was research only. No harness implementation, provider-key inspection, DSH profile mutation, credentialed smoke dispatch, or test run is reported here. The inspected source snapshot is recorded as commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` dated 2026-11-04. The snapshot-to-installed-tarball identity is not proven. Public provider and package pages were checked on 2026-11-05; those references are time-sensitive and should be rechecked before phase 002 pins a runtime. [SOURCE: iteration 10; `resource-map.md`]

The research resource map reports 189 references, of which 153 were missing from the current workspace when it was generated. The local DSH source clone was therefore an evidence input during research but is not a currently self-contained source tree in this packet. The iteration records preserve the cited paths and findings; implementation must obtain and pin the exact source/package inputs again. [SOURCE: `resource-map.md`; iterations 1–10]

## 3. Decision

Proceed with a staged design for `cli-dsh`, subject to these decisions:

1. Use DSH’s own headless CLI contract and structured final event. Do not reuse Pi flags, JSONL RPC assumptions, provider controls, or exit semantics.
2. Represent LLM Gateway and OpenCode Go as distinct pi-ai provider/model entries in separate profile overlays. Use separate defaults or profiles to keep the routes operator-selectable. The exact OpenCode Go endpoint stays UNKNOWN until an authorized request confirms it.
3. Define `.dsh/` as a repository convention, not an upstream discovery mechanism. Pass its patch explicitly. Keep profile/session persistence under an isolated DSH_HOME; keep secrets external.
4. Build generated mirrors for directly discovered skills and preset declarations. Use a repo plugin for selected shared guards and command behaviors. Do not assume Markdown agent or command files load directly in headless DSH.
5. Keep MCP off unless the explicit patch mounts the MCP client and the dispatch allows a closed server/tool set.
6. Integrate DSH into deep-loop through the shared executor builder and audit path. Do not grant the Pi-specific recursion exemption.
7. Make package pinning, provider route proof, and sandbox/dependency preflight gates before a usable release.

The default design is a small, explicit adapter around DSH, with shared policy and lifecycle logic retained in the repository’s common packages. It should not become a copy of the Pi runtime tree.

## 4. System Model and Invariants

### Components

| Component | Owns | Must not own |
|---|---|---|
| `cli-dsh` mode adapter | Headless argv, stdin/JSON contract, supported route IDs, subprocess timeout handoff | Pi-specific flags or implicit provider selection |
| `.dsh/` project layer | Versioned project patch, generated mirrors, sync manifest, non-secret route metadata | Persistent credentials, user sessions, or automatic global profile mutation |
| DSH_HOME | DSH profile files, credentials, and session history | Shared cross-lineage mutable state during fan-out |
| Shared executor runner | Binary preflight, timeout, process supervision, recursion audit, lineage cwd, output parsing, post-run containment | Quiet fallback to another runtime after DSH failure |
| DSH repo plugin | DSH Cordis adapters for selected shared guards and lifecycle hooks | Duplicate policy logic that diverges from shared guard core |
| MCP server registration | Explicit opted-in external tool surface and transport configuration | Ambient inherited secrets or unrestricted tool routing |

### Invariants

- A task is passed either as positional text or through stdin with the sole `-` marker; the wrapper should choose stdin and close it after sending the prompt.
- Treat exit code 0 plus a successful JSON final reason as task success. Parseable partial output alone is insufficient.
- The runner owns a hard timeout because DSH has no per-call timeout flag.
- Select provider/model through a pinned profile or overlay. Never infer that the default profile is the intended route.
- Use a native DSH_HOME override for state isolation. A repository marker such as `SPECKIT_DSH_STATE_DIR` is detection metadata, not a DSH home override.
- Keep repository output containment checks even if DSH’s sandbox is enabled. The sandbox is not yet validated as a host-level boundary.
- Do not send all parent environment variables to the DSH process or MCP child. Add only reviewed variables; DSH’s MCP client deliberately filters sensitive-name patterns and `DSH_*`.
- MCP, web tools, and plugin extensions remain absent unless explicitly mounted by the selected patch.
- Preserve the shared same-runtime recursion guard. DSH can spawn in-process subagents, so Pi’s special no-delegation exemption does not apply.
- Disable telemetry by default for this third-party route and ensure official-DeepSeek session-upload behavior is not accidentally active.

[SOURCE: iterations 1–3, 6, 8–10; `dsh-src/packages/bundle/headless/src/startup.ts`; `dsh-src/packages/mcp/mcp-client/README.md`; `dsh-src/packages/sandbox/README.md`; `executor-audit.ts`]

## 5. Integration Strategy Comparison

| Strategy | Strength | Failure mode | Recommendation |
|---|---|---|---|
| Reuse cli-pi command and flags | Familiar outer orchestration pattern | DSH does not accept Pi’s runtime flags or RPC contract; wrong arguments could fail or select unintended defaults | Reject |
| Direct raw `dsh` call from each workflow | Quick local experiment | Duplicates timeout, state, environment, recursion, audit, and containment behavior across callers | Reject for maintained integration |
| Shared executor builder with DSH branch | Centralizes process and audit policy while preserving DSH-native argv | Requires closed schema additions and a dedicated shim/test matrix | Recommended |
| One shared profile for both providers | Less configuration | Headless has no per-call route selector; existing/default sessions could cross routes | Reject |
| Separate route patches or profiles | Makes provider choice explicit and reviewable | Adds sync files and requires a credential plan | Recommended |
| Automatically discover `.dsh/` from the project | Convenient convention | Reviewed CLI evidence only supports explicit `--patch`; no automatic project profile discovery was found | Reject |
| Always mount MCP in the base profile | Simplifies Code Mode availability | Expands every dispatch’s tool surface and introduces transport/credential/process concerns | Reject; opt in per patch |

The shared builder is the correct place to translate a frozen DSH contract into a subprocess invocation. Existing deep-loop CLI branches show the integration pattern, but DSH needs its own command builder, closed configuration fields, availability check, output validation, environment policy, and tests. [SOURCE: `executor-config.ts:11-15,68-148`; `executor-audit.ts:70-127,129-224`; `fanout-run.cjs:3579-3689`; iteration 9]

## 6. Workspace Model

Use a project layout such as:

```text
.dsh/
  SYNC.md
  patches/
    gateway.patch.yml
    opencode-go.patch.yml
  plugins/
    repo-guards/
  skills/
    <direct skill bundle links or generated bundles>
  agents/
    <generated preset declarations or prompt bundles>
```

This is a proposed repository convention. DSH’s CLI uses DSH_HOME for profiles and persistent sessions; no evidence establishes `.dsh/` as an automatic project profile root. Pass a selected patch explicitly using the supported `--patch` option. Keep DSH_HOME outside the checked-in project tree and unique for lineage execution where practical. [SOURCE: `dsh-src/apps/cli/reference/README.md:11-17,83-87`; `dsh-src/packages/util/home-paths/README.md`; iteration 3]

Use `SYNC.md` to identify source-of-truth files, generated mirrors, hand-authored plugin code, route patches, and any links. Pi and Hermes already use runtime-specific sync manifests, but their file formats have different consumers. Avoid linking the entire nested skill tree and assuming DSH will recurse through it.

DSH’s skill provider searches project `.dsh/skills`, then project `.agents/skills`, configured roots, and DSH home roots. It reads direct bundle directories with `SKILL.md` or flat `name.md` files; it does not recursively discover arbitrary nested skill files. It follows symlinked skill entries, warns and skips invalid frontmatter rather than quarantining it, limits catalog descriptions to 500 characters, and does not impose a body-size limit. Existing `allowed-tools` fields do not grant DSH tool permissions. Generate direct skill bundles or one link per selected mode and enforce tool permissions in the runtime configuration. [SOURCE: `dsh-src/packages/skill/skill-filesystem/README.md:28-56,67-85`; `dsh-src/packages/skill/skill-filesystem/src/index.ts:86,811-852,913-930,1014-1055`; `dsh-src/packages/skill/tool-skill/README.md:38-54,261-266`; iteration 4]

## 7. Staying Current Safely

Treat `0.2.2-rc.1` as a literal prerelease pin, not as a stable or guaranteed latest tag. At the research timestamp, the official release page called it a prerelease, while the npm versions page listed `0.2.1-rc.5` as `latest` and `0.2.2-rc.1` as `next`. The resource map’s earlier local-install note conflicts with that registry snapshot. Pin package version and integrity, record the inspected source commit, and recheck the registry state before installation. Do not rely on a mutable dist-tag or assume the inspected clone and package tarball are identical. [SOURCE: `resource-map.md:18-32`; https://github.com/DeepSeek-ai/DeepSeek-Harness/releases (checked 2026-11-05); https://www.npmjs.com/package/%40deepseek-ai/dsh?activeTab=versions (checked 2026-11-05); iteration 10]

The npm install reported skipped scripts for `@deepseek-ai/dsh-subprocess-local`, `koffi`, `node-pty`, `@google/genai`, and `protobufjs`. It is UNKNOWN which of these the headless path imports and whether the native subprocess sandbox is available. Phase 002 must use a disposable profile and harmless local tasks to establish the exact dependency requirements and fail closed if a required backend is missing. Do not “fix” this by installing or changing packages outside the approved phase workflow. [SOURCE: `resource-map.md:27-32`; `dsh-src/packages/sandbox/README.md:10-32`; iteration 10]

The package initialization path can create profile files on first use, including some information/configuration commands. Avoid exploratory commands under the operator’s normal DSH_HOME. Perform version and capability checks in the documented isolated environment. [SOURCE: `dsh-src/apps/cli/reference/README.md:17,55,60`; `dsh-src/apps/cli/src/profile-boot.ts:224-235,271-295`; iteration 1]

## 8. Safety, Recovery, and Rollback

DSH’s headless mode is a one-task process and exposes `--permission-mode` and `--approval-policy`. The latter prevents waiting for human approval; it is not a filesystem or process boundary. DSH documents file-effect sandbox modes, but local effect confinement across native tools, shell subprocesses, MCP, and plugin effects has not been measured. Treat `workspace-write` as a requested preventive layer, not a verified security boundary, until each applicable surface is exercised in a disposable environment. Keep the shared containment scan as a second check. [SOURCE: `dsh-src/packages/bundle/headless/README.md:87-114,128-136`; `dsh-src/packages/sandbox/README.md:10-32`; iteration 9]

The shared runner should:
- create a unique lineage work directory and DSH_HOME;
- pass only the explicitly reviewed DSH and provider environment variables;
- apply the repository patch and exact route selection;
- apply a hard external timeout, close stdin, and collect stdout/stderr separately;
- reject nonzero exit, malformed event stream, absent final record, or unsuccessful final reason;
- preserve raw diagnostics without logging credentials or prompt secrets;
- run the existing containment scan after completion and fail closed on out-of-scope writes;
- record runtime version, patch identity, route/model id, session id, exit result, final reason, and timeout outcome.

Rollback for a future implementation is removal of the `cli-dsh` registration and generated `.dsh` mirrors, while retaining shared core code that has another consumer. Keep changes behind the closed executor kind and avoid changing defaults for existing runtimes. Any installation, published package change, or live provider probe belongs to a later, explicitly authorized phase.

The base composition enables OTLP telemetry in `FEEDBACK_ONLY` mode and includes a DeepSeek session-log extension that appends a session suffix to official DeepSeek API requests. For third-party routes, disable telemetry by default and verify that the official-API upload extension is absent. Cost, cache behavior, network routing, and privacy guarantees have not been measured under either requested provider. [SOURCE: `dsh-src/packages/bundle/base/cordis.patch.yml:218-226`; `dsh-src/packages/session/session-log-deepseek/README.md:10-13`; `dsh-src/packages/bundle/headless/README.md:110,128-136`; iteration 10]

## 9. Automation Surface

### Runtime contract

| Surface | DSH evidence | Adapter behavior |
|---|---|---|
| Input | Positional task or stdin when omitted/sole argument `-`; positional task means stdin is not read | Send one prompt via stdin with `-`; close the stream |
| Output | Final text to stdout by default; structured session/turn/step/thinking/text/tool/final events with `--json` | Require JSON final event and successful terminal reason |
| Exit | Completed turn returns 0; aborted/error returns 1 | Nonzero is failure; do not use Pi’s exit workaround |
| Controls | `--session-id`, `--permission-mode`, `--approval-policy`, repeatable `--add-dir` | Explicit session, permissions, approval policy, and only necessary roots |
| Route/model | No per-dispatch provider/model selector | Select explicit profile/patch and allowlisted model |
| Timeout | No headless timeout flag | Enforce in shared subprocess supervisor |

[SOURCE: `dsh-src/packages/bundle/headless/src/startup.ts:53-92,117-155`; `dsh-src/packages/bundle/headless/src/json-stream.ts:230-327`; `dsh-src/packages/bundle/headless/src/index.ts:400-443`; iteration 1]

### Shared extension mapping

DSH exposes typed Cordis composition and tool/agent lifecycle events rather than Pi’s event names. Keep policy logic shared and write DSH-specific adapters at those seams. The research recommends porting dispatch audit, preflight lint, spec-gate classification/enforcement, completion evidence, goal context, session-start context, prompt advisor, post-edit quality, MCP route guard, task-dispatch guard, and classifier-injection screening. Add Git advisory/message gates, session-start advisories, session stop/compaction bridges, and decision capture later if their interaction contracts are demonstrated. Keep relaunch behavior in the outer runner. [SOURCE: `dsh-src/docs/cordis-primer.md:5-45`; `dsh-src/docs/subsystems/tools.md:458-468,531-563,769-881`; `dsh-src/docs/subsystems/core.md:382-405,874-940,1013-1032,1091-1116`; iteration 6]

DSH’s native guard package is loop hygiene, not a replacement for repository-specific dispatch, spec, or Git policy. Tool pre-execute can allow, deny, cancel, or ask; execute can wrap for timeout/metrics; post-execute can replace or block results; result is observational; monotonic guards can add final denial. Tool arguments cannot be rewritten at the pre-execute stage because they are already logged and presented. [SOURCE: `dsh-src/packages/guard/README.md:8-32`; `dsh-src/docs/subsystems/tools.md:458-468,531-563,769-881`; iteration 6]

### Skills, agents, commands, and goals

The native agent-preset registry accepts declared composition rows rather than scanning `.skilled/agents`. Generate Cordis preset rows or expose selected agent material through explicit skills/prompts. DSH has in-process spawn/fork subagent tools; its SDK child backend runs a full child runtime with an isolated DSH_HOME but does not accept independent child presets, structured output, or numeric depth caps. A preset file alone is not a DSH agent. [SOURCE: `dsh-src/packages/preset/agent-preset-registry/README.md:44-48`; `dsh-src/packages/preset/agent-preset/README.md:28-48,84-85`; `dsh-src/packages/subagent/README.md:25-35`; `dsh-src/packages/subagent/subagent-dsh-sdk/README.md:28-55`; iteration 5]

DSH slash commands are code registrations and the reviewed headless entry point has no slash-command adapter. `.skilled/commands` markdown cannot load as native DSH commands without a wrapper or generated plugin. The workflow tool runs JavaScript with metadata and arguments and offers orchestration helpers; a Markdown command template therefore needs an explicit compiler/wrapper if mapped to workflow scripts. DSH’s native goal service stores one current goal per session, but does not bridge the repository spec’s `goal.md`; add a project bridge if shared packet-goal semantics are required. [SOURCE: `dsh-src/packages/interaction/commands/README.md:28-64`; `dsh-src/packages/workflow/workflow/README.md:28-53`; `dsh-src/packages/goal/goal/README.md:28-56`; `dsh-src/packages/plan/plan-mode/README.md:28-63`; iteration 5]

### Third-party Pi plugin disposition

| Pi package/capability | Disposition for headless DSH | Reason |
|---|---|---|
| ask-user-question | Replace with native `ask_user_question` only after a headless answerer bridge exists | The no-provider path remains unresolved |
| todo | Replace with native session todo | DSH already has session-scoped todo |
| blackhole | Split: native DSH compaction; defer observational memory | Compaction does not equal durable observation memory |
| btw | Drop | Interactive side-conversation UX is not the headless DSH subagent contract |
| cache optimizer | Defer provider cache tuning; use native repeat-tool reminder only | Route-specific cache behavior is not measured |
| Claude Code UI | Drop | Presentation-only terminal UI |
| fast-mode/subagent support | Drop for these DeepSeek routes | Sets priority service tier for other providers |
| plan-build | Replace partly with DSH plan mode; keep clean-session orchestration outside the model process | DSH plan mode is a separate interactive approval flow |
| statusline | Drop | Interactive command-driven status line |
| web-access | Replace core web search/fetch with DSH web tool; defer GitHub/PDF/YouTube/local-video extras | Only implement established headless needs |

These dispositions preserve the useful behavior without copying Pi’s package system wholesale. Optional market packages should be considered only against a named requirement and a verified headless contract. [SOURCE: `.pi/PLUGINS.md`; `.pi/settings.json`; `dsh-src/packages/interaction/user-questions/README.md`; `dsh-src/packages/todo/README.md`; `dsh-src/packages/compaction/compaction/README.md`; `dsh-src/packages/plan/plan-mode/README.md`; `dsh-src/packages/web/tool-web/README.md`; iteration 7]

### MCP

The headless bundle contains the shared resource service but does not mount the MCP client by default. MCP is server-scoped and opt-in, with stdio and Streamable HTTP transports. Translate the current Pi Code Mode JSON into an explicit DSH plugin entry containing transport, command/args/env/cwd. Use the repo patch to enable only approved servers. Tool names use `mcp__<serverName>__<tool>`; apply a closed allowlist. DSH starts a temporary stdio probe before the serving process and supports startup/call timeouts and failure policy. Its MCP child strips inherited names matching `KEY|PASSWORD|SECRET|TOKEN` and all `DSH_*`, then merges configured env. Set required environment explicitly and verify scope behavior with a harmless server before enabling. No live DSH Code Mode handshake occurred. [SOURCE: `dsh-src/packages/mcp/mcp-client/README.md:12,28-32,55-103,161`; `dsh-src/packages/bundle/headless/cordis.patch.yml:1-7`; `dsh-src/packages/core/tools/README.md:88-112`; `.pi/mcp.json:1-12`; `.skilled/bin/mcp-code-mode-launcher.cjs:22-80`; iteration 8]

## 10. Conflict Handling and Avoidance

### Provider endpoint conflict

The LLM Gateway route is a hand-declared OpenAI-compatible provider at `https://api.llmgateway.io/v1`, with model id `deepseek-v4.1-flash-1017`. OpenCode Go is a separate `opencode-go` pi-ai route using `OPENCODE_API_KEY` and model id `deepseek-v4.1-flash`. The current Models.dev route lists `https://opencode.ai/inference/go/openai/v1`, while OpenCode’s Go docs list `https://opencode.ai/zen/go/v1/chat/completions`. These sources may reflect separate routes or a migration. No authorized DSH request resolved which endpoint will authenticate for this harness configuration; keep the effective endpoint UNKNOWN. [SOURCE: `dsh-src/packages/llm/llm-pi-ai/src/provider-data.generated.ts:35-36`; `dsh-src/docs/user/guide/providers.md:27-80`; https://models.opencode.ai/providers/opencode-go/ (checked 2026-11-05); https://docs.opencode.ai/docs/go/ (checked 2026-11-05); iteration 2]

### Version/tag conflict

The local installation note called `0.2.2-rc.1` latest, while the npm versions page checked later showed `0.2.1-rc.5` as `latest` and `0.2.2-rc.1` as `next`. Preserve the dated observations; do not silently choose one as stable truth. Resolve by rechecking current tags and pinning a literal version and integrity. [SOURCE: `resource-map.md:27-31`; https://www.npmjs.com/package/%40deepseek-ai/dsh?activeTab=versions (checked 2026-11-05); iteration 10]

### Open implementation conflicts

The plugin native installer surface may differ from the skipped install scripts; the sandbox’s effect boundary may differ across built-in file tools, shell, MCP, and extension effects. Treat both as unresolved until a controlled, credential-free fixture can establish behavior. Do not resolve either by broadening writable roots, passing the entire environment, or assuming `--approval-policy never` is confinement.

## 11. Recommendations

1. **Phase 002 — contract and provider pin:** Record the literal package version, integrity, inspected source revision, CLI help contract, output/final-event schema, terminal reason, permission behavior, telemetry defaults, approved environment names, and route/model entries. Resolve endpoint and credentialed-handshake questions only when credentials are explicitly available and the bounded probe is approved.
2. **Phase 003 — repo-local runtime and sync:** Create the `.dsh/` layout, `SYNC.md`, profile patches, generated skill/preset mirrors, and explicit launcher invocation. Keep secrets and session state out of Git.
3. **Phase 004 — deep-loop executor:** Add the closed `cli-dsh` executor kind, shared builder, DSH_HOME/environment policy, binary/backend preflight, session identity, timeout, JSON/final/exit validation, recursion guard, provenance, and containment behavior.
4. **Phase 005 — guards and MCP:** Port the required shared guards through DSH’s typed Cordis seams. Add optional Code Mode MCP configuration only with server/tool allowlists and validated child environment/lifecycle.
5. **Phase 006 — routing and release gates:** Update dispatch classification, skill-advisor routing, manifests, workflow contracts, generated contracts, tests, documentation, and cross-runtime coverage; run credential-free lifecycle tests and a provider pilot only after the route has been pinned.
6. **Phase 007 — optional Pi capability parity:** Add observational memory, cache tuning, specialty web/media tools, or market integrations only for a specific reviewed capability need.

The phase order is dependency-driven: route and package contracts precede profile mirrors; those precede fan-out; policy and MCP depend on a stable DSH plugin contract; global routing and release checks depend on the implementation. The plugin-parity phase is optional. [SOURCE: iteration 10]

## Eliminated Alternatives

- Reusing Pi’s event names or assuming its CLI flags fit DSH. DSH has its own typed Cordis/Session seams and headless parser. [SOURCE: iterations 1 and 6]
- Treating the loop-hygiene guard as repository dispatch/spec/Git policy. [SOURCE: iteration 6]
- Treating DSH’s profile plugin manager or catalog as project-local extension discovery. [SOURCE: iteration 6]
- Assuming `.skilled/agents/*.md` and `.skilled/commands/*.md` are native DSH source formats. [SOURCE: iterations 4 and 5]
- Treating DSH compaction as equivalent to observational memory, or in-process child agents as equivalent to Pi’s interactive `/btw`. [SOURCE: iteration 7]
- Importing provider cache settings before routes are pinned and measured. [SOURCE: iteration 7]
- Treating `.pi/mcp.json` as directly loadable by DSH, enabling MCP by default, or forwarding all inherited environment variables to the MCP child. [SOURCE: iteration 8]
- Treating `--approval-policy never` as confinement or `SPECKIT_DSH_STATE_DIR` as the DSH home override. [SOURCE: iteration 9]
- Treating DSH’s nonzero error exit as Pi’s nondeterministic exit behavior. [SOURCE: iterations 1 and 9]
- Claiming a successful OpenCode Go route, Code Mode handshake, or native sandbox backend without a confirming probe. [SOURCE: iterations 2, 8, and 10]

## Divergence Map

- Saturated directions: none recorded.
- Completed pivots: 0.
- Failed pivots: 0.
- Audited overrides: 0.
- Council artifact references: none.
- Remaining frontier in registry: none formally recorded.
- Unresolved key questions: four of five remain unchecked in the registry; provider/profile integration, plugin disposition, fan-out touch points, and phase constraints are substantively researched but not marked as resolved by the reducer. Open implementation uncertainties are listed below.

The reducer’s registry has no divergent pivot lineage. This does not mean every implementation question converged; it records that no formal divergence event was created during the ten-angle research run. [SOURCE: `findings-registry.json`; `deep-research-dashboard.md`]

## 12. Open Questions

1. Which OpenCode Go endpoint works with the DSH pi-ai provider shape: Models.dev’s `/inference/go/openai/v1` or the official Go docs’ `/zen/go/v1/chat/completions`?
2. Can both provider routes load in separate headless patches/profiles without default-model or persisted-session crossover?
3. Does the exact installed headless dependency graph require any skipped native install scripts, and is the subprocess sandbox backend present?
4. Does DSH’s sandbox confine built-in file tools, shell subprocesses, MCP and plugin-created effects under `workspace-write` and `read-only`?
5. What are measured cold/warm startup times and per-run provider costs?
6. Does the Code Mode server pass DSH’s stdio probe and service lifecycle with an explicit `UTCP_CONFIG_FILE`, working directory, timeouts and clean shutdown?
7. What exact scopes does `ctx.tools.restrict()` cover across caller, nested Agent, MCP and extension tools?
8. What answerer bridge should replace ask-user-question for headless runs, or should that capability remain unavailable?
9. Which optional memory/tool packages, if any, meet a concrete repository requirement?
10. What telemetry payloads remain under `FEEDBACK_ONLY`, and is `DISABLED` sufficient for this third-party provider mode?

## 13. Existing Art Comparison

| Existing art | Reuse | Boundary |
|---|---|---|
| cli-pi mode and `.pi/SYNC.md` | Pattern for a repo-local runtime folder, generated/hand-authored surfaces, and adapter-specific documentation | DSH has different CLI flags, provider setup, skill/agent/command discovery, event hooks, and MCP schema |
| Hermes mode and `.hermes/SYNC.md` | Pattern for generated prompt/skill mirrors and a project plugin | Hermes’ runtime contract and security scanning do not transfer automatically |
| DSH headless profile | Native stdin, JSON events, one-shot runtime, skills, tools, and agent composition | Does not select the requested providers per call, enforce runner timeout, or load the repository’s policy surface automatically |
| DSH Cordis/tool lifecycle | Typed extension and policy adapter points | Requires DSH-specific adapters; Pi event names are not portable |
| Deep-loop shared executor builder | Common timeout, audit, recursion and containment mechanics | Requires new closed kind/configuration and DSH-specific argv/final parsing |

Pi and Hermes are design precedents for synchronization, not compatibility layers. [SOURCE: `.pi/SYNC.md`; `.hermes/SYNC.md`; `dsh-src/packages/bundle/headless/cordis.patch.yml`; `dsh-src/docs/cordis-primer.md`; iteration 9]

## 14. Testable Acceptance Conditions

A later implementation can be accepted when evidence demonstrates all of the following:

1. The package is pinned by literal version and integrity, and the recorded source revision/package identity is explained.
2. The DSH invocation accepts one stdin task and produces a valid JSON final record for a harmless local task.
3. Completed, aborted, error, missing-final, malformed-JSON, timeout and nonzero outcomes all map to the documented runner result; success requires both exit 0 and completed final reason.
4. Route selection is explicit and each model id maps to only its approved provider/profile. The OpenCode Go endpoint has a successful authorized handshake before being marked supported.
5. A per-lineage DSH_HOME is actually selected; the environment contains only the reviewed DSH/provider variables and no secrets appear in logs.
6. `workspace-write` and `read-only` behavior is checked for built-in filesystem, shell, MCP and plugin-created effects. Missing native backend fails closed.
7. The post-run containment scan catches a deliberately out-of-lineage write in a disposable test fixture.
8. Same-runtime nested dispatch is blocked and there is no DSH recursion exemption.
9. Skills load from the intended direct project bundles, invalid frontmatter and symlinks behave as expected, and permission controls are independent of `allowed-tools`.
10. Repo agent presets, commands and goal context are supplied through an explicit supported plugin/preset/bridge path rather than assumed Markdown discovery.
11. MCP is absent by default, present only under the explicit patch, restricted to the approved server/tool allowlist, and passes a harmless stdio startup/shutdown check.
12. Telemetry is disabled by default and the official-DeepSeek session-upload extension is absent from third-party provider routes.
13. Dispatch audit, advisor routing, manifests, compiled workflow contracts and CLI adapter matrices recognize `cli-dsh`, while existing modes retain their current behavior.
14. The `.dsh/SYNC.md` accurately distinguishes source files, generated mirrors, links, hand-authored plugin code, profile patches and external secrets.

These are proposed acceptance checks; they have not been run in this research lineage.

## 15. Implementation Boundaries

### Required repository touch points

| Area | Files or surfaces to update | Change |
|---|---|---|
| Runtime contract | New `.skilled/skills/cli-external-orchestration/cli-dsh/` skill packet, references, examples and `.dsh/SYNC.md` | Document invocation, routes, state, permissions, sync ownership and safety |
| Shared executor schema | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Add closed `cli-dsh` fields and route/model/reasoning validation |
| Executor audit | `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | DSH_HOME and approved environment contract, provenance, recursion guard; no Pi exemption |
| Runner | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Binary probe, native DSH argv/stdin, timeout, JSON final validation and containment |
| Workflow routes | `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml`, and optionally `deep-ai-council-auto.yaml` | Route through shared builder; council support is a separate decision |
| Council integration | `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` and its CLI tests, only if DSH becomes a council seat | Add kind validation and builder mapping |
| Dispatch audit | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and adjacent tests | Recognize DSH task invocations, not profile-management commands |
| Executor tests | Unit config/audit/runner suites and new stress adapter shim/suite | Exercise argv, stdin, environment, timeout, final parsing, confinement and recursion |
| Stress matrix | `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts`, fixtures, shims, README | Add DSH as an adapter subject |
| Contracts | `loop-protocol.md`, fanout feature catalog, compiled research/review contracts and council contract if selected | Register behavior and regenerate derived artifacts |
| Routing and manifests | `cli-external-orchestration/leaf-manifest.json`, advisor graph/scorer/fixtures, trigger index | Make the new mode discoverable and deterministic |
| Repository guidance | `README.md`, `AGENTS.md`, doctor agents manifest | Update runtime/agent inventory, bridge count and guardrails |

The exact current line references and proposed test counterparts are inventoried in iteration 9. Each implementation phase should confirm the listed consumer still owns the behavior before editing generated or adjacent artifacts. [SOURCE: iteration 9]

### Out of scope for the minimum mode

- Rewriting shared policy/guard cores in a DSH-specific dialect.
- Importing all Pi third-party packages or interactive terminal UI.
- Making DSH’s profile catalog an automatic project sync mechanism.
- Enabling MCP or optional web/media tools by default.
- Persisting credentials, provider keys, or user session logs in `.dsh/`.
- Broadening the shared executor’s writable roots without measured need.
- Promoting the OpenCode Go route or DSH sandbox to “verified” without evidence.

## 16. Trade-offs, Risks, and Convergence Report

The design uses explicit patches and generated mirrors, which cost maintenance but make project behavior reviewable and separate from operator DSH_HOME. The shared executor branch costs implementation and test coverage but avoids duplicated timeout, environment, recursion and containment policies. Separate provider profiles reduce cross-route ambiguity at the cost of two configuration entries. Opt-in MCP narrows the default tool surface but requires a translation layer from the existing Pi configuration.

The largest release risks are prerelease drift, endpoint mismatch, skipped native installer scripts, unmeasured sandbox boundaries, and no provider-authenticated headless run. Startup latency, request cost, and route cache behavior remain unmeasured. Release readiness should therefore depend on phase-002 provider/package evidence and phase-004 process-boundary evidence.

The strategy required ten iterations under `max-iterations`. All ten angle records exist. Their novelty ratios were 1.00, 0.92, 0.90, 0.95, 0.90, 0.95, 0.94, 0.92, 0.94, and 0.90. The last three were 0.92 → 0.94 → 0.90; the configured threshold was 0.05. The cap, not early convergence, determined the stop. The registry records 57 findings, 1 of 5 key questions resolved, and four open key questions. It has no saturated directions, pivots, audited overrides, or formal divergence frontier. [SOURCE: `deep-research-dashboard.md`; `findings-registry.json`; `deep-research-config.json`]

### Execution scope record

Two write-boundary violations occurred during this lineage execution. The iteration-8 gateway was first invoked with the parent packet as its run directory, touching packet-level projection files; the same iteration event was then retried using the authorized lineage directory. During synthesis, the resource-map reducer reported its output path under the parent packet despite the lineage artifact override. Both breaches are recorded in iteration 10. The lineage outputs are being completed inside the authorized directory, but this run cannot be certified as a clean lineage and must not be treated as successfully completed. No further parent-packet writes should be made. [SOURCE: `iterations/iteration-008.md`; `iterations/iteration-010.md`]

## 17. References

### DSH source snapshot and CLI contract

- DSH source snapshot `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`, dated 2026-11-04; see source citations retained in iterations 1–10.
- `dsh-src/packages/bundle/headless/src/startup.ts`, `json-stream.ts`, `index.ts`, and `packages/bundle/headless/README.md`.
- `dsh-src/apps/cli/reference/README.md`, `apps/cli/src/profile-boot.ts`, and `packages/util/home-paths/README.md`.
- `dsh-src/docs/user/guide/providers.md`; `packages/llm/llm-deepseek`; `packages/llm/llm-pi-ai`.
- `dsh-src/packages/skill/skill-filesystem`, `packages/skill/tool-skill`, and `packages/preset/agent-preset-registry`.
- `dsh-src/packages/subagent`, `packages/interaction/commands`, `packages/workflow/workflow`, `packages/goal/goal`, and `packages/plan/plan-mode`.
- `dsh-src/docs/cordis-primer.md`, `docs/subsystems/tools.md`, `docs/subsystems/core.md`, and `packages/guard/README.md`.
- `dsh-src/packages/mcp/mcp-client/README.md`, `packages/sandbox/README.md`, `packages/bundle/base/cordis.patch.yml`, and `packages/bundle/headless/cordis.patch.yml`.

### Repository references

- `resource-map.md` (lineage-local copy; generated 2026-11-05; reports 153 references missing from the workspace).
- `iterations/iteration-001.md` through `iterations/iteration-010.md`.
- `deep-research-config.json`, `deep-research-dashboard.md`, and `findings-registry.json`.
- `.pi/SYNC.md`, `.pi/PLUGINS.md`, `.pi/mcp.json`, `.pi/prompts/goal-pi.md`, and `.hermes/SYNC.md`.
- `.skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` and the corresponding cli-codex, cli-opencode, cli-claude-code, cli-cursor, cli-devin, and cli-hermes references.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts`, `runtime/scripts/fanout-run.cjs`, `deep-ai-council/scripts/orchestrate-session.cjs`, and adapter tests cited in iteration 9.

### Public references checked 2026-11-05

- DSH headless README: https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/headless/README.md
- DSH Cordis primer: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md
- DSH tool subsystem: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/tools.md
- DSH MCP guide: https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/mcp.md
- OpenCode Go model catalog: https://models.opencode.ai/providers/opencode-go/
- OpenCode Go docs: https://docs.opencode.ai/docs/go/
- Pi provider model listing: https://pi.dev/models/opencode-go/deepseek-v4-1-flash?name=pi-open-agents
- DSH release page: https://github.com/DeepSeek-ai/DeepSeek-Harness/releases
- DSH npm package versions: https://www.npmjs.com/package/%40deepseek-ai/dsh?activeTab=versions

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 1 / 5
- Remaining questions: 4
- Last 3 iteration summaries: run 8: Angle 8: MCP configuration and enablement (0.92); run 9: Angle 9: deep-loop fan-out executor fitness and complete cross-repository integration surface (0.94); run 10: Angle 10: constraints, differences, and the phase plan (0.90)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; registry lists no saturated directions, completed pivots, failures, overrides, or formal remaining frontier.
