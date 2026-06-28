# Headroom Utilization Research

Lineage: `gpt55xhigh`  
Session: `fanout-gpt55xhigh-1782630120377-76c6nl`  
Executor: `cli-codex`, model `gpt-5.5`, reasoning effort `xhigh`

## 1. Executive Verdict

Headroom is useful for this stack, but not as a transparent proxy or blanket runtime wrapper. The clean adoption path is selective library-mode compression for copied, non-authoritative context bundles, plus possible detector-only CacheAligner diagnostics. Do not adopt proxy/wrap, output-shaper, `headroom learn`, or Headroom cross-agent memory into the core stack without a separate guarded experiment.

The reason is straightforward: our stack has multiple control planes whose text is executable in practice: Spec Kit Memory metadata and tool envelopes, advisor hook context, code-graph readiness payloads, deep-loop JSONL state, and runtime hook output. Headroom is strongest when it compresses large natural-language or tool-output payloads; it is risky when it mutates provider traffic, system prompts, structured metadata, or memory/instruction files. Headroom's own library gives the knobs needed for a low-blast pilot, including `compress_system_messages=False`, protected recent turns, an inflation guard, and failure passthrough. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:100] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:262] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:336]

## 2. Method

The research followed the charter in `.opencode/specs/system-spec-kit/029-headroom-utilization/001-research/spec.md` and the deep-research loop contract. The deep-research workflow requires externalized state and convergence via `newInfoRatio`, with a default 0.05 threshold. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:27] The YAML state contract requires config, JSONL state, strategy, registry, dashboard, prompts, iterations, deltas, final `research.md`, and `resource-map.md`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:94]

The user restricted writes to this lineage directory. Default workflow steps that would mutate `spec.md`, git staging, graph upsert, or canonical memory save outputs were skipped and recorded in `deep-research-state.jsonl`. The YAML normally validates iteration markdown, state-log appends, canonical JSONL fields, and per-iteration delta records. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756]

## 3. Headroom Surface Inventory

Headroom exposes these relevant surfaces:

| Surface | What It Does | Evidence |
| --- | --- | --- |
| `compress()` library | Inline Python/TypeScript compression with config knobs. | Headroom lists library mode as `compress(messages)`; `compress.py` defines `CompressConfig`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:49] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:77] |
| OpenAI/Anthropic proxy | Routes provider traffic through a local compression proxy. | README lists proxy and broad agent compatibility. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:50] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:191] |
| MCP server | `headroom_compress`, `headroom_retrieve`, `headroom_stats`; optional `headroom_read`. | MCP server module lists tools and optional read flag. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:1] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:511] |
| `headroom wrap` | Starts proxy and launches agent CLIs with provider/env integration. | Wrap usage includes Claude, Codex, and OpenCode. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/wrap.py:1] |
| `headroom learn` | Mines past sessions and writes learned corrections. | README and CLI show learn writes recommendations when `--apply` is used. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:402] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/cli/learn.py:75] |
| Bundled RTK / lean-ctx | Shell-output/context-tool shortening downstream of wrappers. | README says Headroom ships RTK and can use lean-ctx via `HEADROOM_CONTEXT_TOOL`. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:421] |
| CacheAligner | Detects volatile system-prompt content and cache instability. | CacheAligner is detector-only and never rewrites prompts. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:1] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:214] |
| Output-shaper | Appends terse-output instructions and lowers effort on mechanical turns. | Output shaper appends system-prompt steering and routes effort. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:289] |
| Cross-agent memory | Per-project local memory with SQLite/vector storage. | Storage router isolates one DB per project and fails closed when project resolution is missing. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/memory/storage_router.py:1] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/memory/storage_router.py:305] |

## 4. Integration-Fit Matrix

Legend: `fits` = can be used directly under current contracts; `needs-shim` = useful only behind explicit adapter/guardrails; `conflicts` = conflicts with current contract if adopted as-is; `irrelevant` = no meaningful role.

| Headroom Surface | system-spec-kit Memory MCP | system-skill-advisor | system-code-graph | deep-loop workflows | cli-* executors | hook system | Claude/Codex/OpenCode runtimes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `compress()` library | needs-shim | needs-shim | needs-shim | needs-shim | needs-shim | conflicts | needs-shim |
| OpenAI/Anthropic proxy | conflicts | conflicts | conflicts | needs-shim | needs-shim | conflicts | fits |
| MCP server | needs-shim | irrelevant | needs-shim | needs-shim | fits | irrelevant | fits |
| `headroom wrap` | conflicts | conflicts | conflicts | needs-shim | needs-shim | conflicts | fits |
| `headroom learn` | conflicts | conflicts | irrelevant | conflicts | conflicts | conflicts | needs-shim |
| Bundled RTK / lean-ctx | needs-shim | irrelevant | needs-shim | fits | fits | irrelevant | fits |
| CacheAligner | fits | fits | fits | fits | fits | fits | fits |
| Output-shaper | conflicts | conflicts | conflicts | conflicts | conflicts | conflicts | needs-shim |
| Cross-agent SQLite/vector memory | conflicts | conflicts | irrelevant | conflicts | conflicts | conflicts | needs-shim |

### Matrix Justification

`compress()` is the best candidate because it is callable in-process and has explicit config. It can be constrained to avoid system prompts and recent active turns. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:106] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/compress.py:111] It still needs a shim because Spec Kit Memory validates tool arguments before dispatch and later injects metadata into JSON envelopes; lossy compression must not touch that control-plane JSON. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1246] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1435]

The proxy and wrap surfaces fit provider runtimes technically. The README lists Claude, Codex, and OpenCode compatibility, and OpenCode has first-class provider/MCP/plugin injection. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:191] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/providers/opencode/runtime.py:17] They conflict with core stack contracts because they are broad transport/environment rewrites. The OpenCode plugin wraps fetch, HTTP, HTTP2, and child-process traffic, routing non-loopback provider requests through Headroom. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/plugins/opencode/src/transport.ts:112]

Headroom MCP fits as an explicit helper, not as a replacement for existing MCPs. Its tools compress content, retrieve by hash, and report stats. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/mcp_server.py:511] Our code graph tool surface remains separately authoritative; its schema array is the runtime authority, and read tools are readiness-gated. [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:38] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:42]

`headroom learn` conflicts with the local memory policy. It can write AGENTS.md and instructions files through the Codex writer. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/learn/writer.py:347] The constitutional memory rule says use only Spec Kit Memory for memories unless the user explicitly asks for native memory. [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24]

CacheAligner fits because it is detector-only. It explicitly never mutates messages, never moves content, and never normalizes whitespace. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:214] Its `apply()` returns an unchanged deep copy plus warnings and cache metrics. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:266]

Output-shaper conflicts with core workflows because it mutates system prompt and effort policy. The module says steering is appended to the system prompt and output effort can be lowered. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:7] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:303] That conflicts with strict hook/advisor contracts and with deep-loop convergence runs where reasoning effort is deliberately selected by executor config. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:650]

Cross-agent memory conflicts with Spec Kit Memory as source of truth. Headroom's per-project routing is well designed, but it is still a second memory system. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/memory/storage_router.py:98] [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24]

## 5. Subsystem Notes

### system-spec-kit Memory MCP

Spec Kit Memory is metadata- and schema-sensitive. Canonical saves route content into packet docs, phase-parent saves update `graph-metadata.json`, and atomic metadata writes prevent torn JSON state. [SOURCE: .opencode/skills/system-spec-kit/references/memory/save_workflow.md:291] The generator hardening flag persists `source_fingerprint`, and strict generated-metadata integrity is enforcing by default. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:133]

Fit: `compress()` can help only outside canonical write/read paths, especially for large copied prose or tool-output chunks in a prompt pack. Guardrails: never compress generated JSON, continuity frontmatter, validator output, MCP request/response envelopes, or source citations.

### system-skill-advisor

The advisor is a control-plane router. Its model is exact user direction first, then live advisor recommendations above threshold. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:55] Prompt-time hook contracts use bounded additional context and threshold semantics. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:149]

Fit: no proxy or output-shaper on advisor prompt-time paths. Compression is acceptable only for offline advisor-maintenance analysis over copied documents.

### system-code-graph

Code graph answers structural questions and refuses stale read paths. Its read tools are readiness-gated, and `detect_changes` refuses on non-fresh state instead of returning empty affected symbols. [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:57] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:66]

Fit: Headroom can shorten copied graph context after a query if the exact graph payload is already preserved. It must not compress diffs, readiness blocks, graph DB data, or structural identifiers.

### Deep-Loop Workflows

Deep-loop owns state, convergence, reducer output, and synthesis. The YAML requires iteration files, JSONL appends, canonical `type:"iteration"`, and delta files. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:756] The constitutional rule says not to hand-roll deep-loop state. [SOURCE: .opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md:43]

Fit: prompt-pack shim only. Compression must be outside reducer-owned state and must preserve citations and exact source references.

### cli-* Executors

All cli-* skills prohibit self-invocation and are cross-AI delegation tools. [SOURCE: .opencode/skills/cli-codex/SKILL.md:12] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:12] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:12] `cli-codex` pins default `gpt-5.5` invocation flags and warns about non-existent reasoning flags. [SOURCE: .opencode/skills/cli-codex/SKILL.md:204]

Fit: do not wrap executor calls by default. If evaluated, wrap only an isolated leaf dispatch with executor provenance recorded and before/after prompt artifacts preserved.

### Hook System and Runtimes

The hook system maps prompt-time advisor, session priming, compaction, and cleanup across Claude, Codex, Copilot, and OpenCode. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:56] Codex hook output is injected as model-visible developer context. [SOURCE: .opencode/skills/cli-codex/references/hook_contract.md:137]

Fit: CacheAligner detector-only can help diagnose cache instability. Proxy compression/output shaping should not touch hook JSON or hook-produced developer context.

## 6. Risk Register

| Risk | Severity | Evidence | Guardrail |
| --- | --- | --- | --- |
| Prompt-cache busting | High | Output-shaper appends system text; CCR can inject retrieval system instructions. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:253] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/ccr/tool_injection.py:133] | Do not use output-shaper or CCR system instruction injection on core runtime/hook paths. Prefer library compression without system-message compression. |
| Generated metadata determinism | High | Strict generated-metadata integrity is enforcing; save planner refreshes metadata. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:139] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:222] | Exclude `description.json`, `graph-metadata.json`, continuity frontmatter, validator outputs, and generated fences. |
| Structured metadata fidelity | High | MCP tool inputs are strictly schema-validated. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:208] TagProtector can discard lost placeholders and relies on downstream validation. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/tag_protector.py:97] | Compress only copied prose/tool-output blocks. Preserve raw JSON and XML-like workflow tags. |
| Code-graph false confidence | High | Read handlers must prove graph freshness before answering. [SOURCE: .opencode/skills/system-code-graph/references/readiness/code_graph_readiness_check.md:32] | Never compress readiness blocks, blocked payloads, diffs, or graph identifiers. |
| Advisor misrouting | High | Advisor prompt-time routing has thresholds and runtime-visible hook context. [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:149] | Keep Headroom out of prompt-time advisor hooks and hook JSON. |
| Telemetry/privacy drift | Medium | `llms.txt` says telemetry enabled by default, while code says opt-in/off by default. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/llms.txt:67] [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/telemetry/beacon.py:72] | For any experiment set `HEADROOM_TELEMETRY=off`, `HEADROOM_UPDATE_CHECK=off`, and record network posture. |
| Update-check network call | Medium | README says proxy checks PyPI at most once a day unless opted out. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:333] | Disable update checks in deterministic tests and CI. |
| Duplicate memory system | High | Headroom learn/cross-agent memory writes AGENTS/native memory surfaces; Spec Kit says use only Spec Kit Memory. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/learn/writer.py:347] [SOURCE: .opencode/skills/system-spec-kit/constitutional/memory-system-spec-kit-only.md:24] | Do not adopt Headroom memory or learn into core. |
| Constitutional prompt mutation | High | Output-shaper deliberately edits request-side system instructions and effort. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/proxy/output_shaper.py:20] | Treat output-shaper as experimental only; never enable for gate/hook/deep-loop sessions. |
| Licensing/attribution | Low/Medium | README declares Apache 2.0. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:443] | Before productization, review NOTICE/attribution and vendored-source handling. |

## 7. Ranked Adoption Recommendation

1. **Pilot `compress()` library in offline benchmark mode.** Use copied deep-loop prompt bundles and large natural-language tool outputs. Do not run on live provider traffic. Required guardrails: `compress_system_messages=False`, preserve recent turns, no generated JSON, no hook/advisor context, no diffs, no strict validator outputs, and a citation-preservation check. This is the highest-value/lowest-blast surface.

2. **Adopt CacheAligner only as detector-only diagnostics if needed.** It aligns with our prompt-cache concern because it warns without rewriting. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/transforms/cache_aligner.py:272]

3. **Evaluate Headroom MCP as an explicit helper, not auto-installed.** Use a non-default server name in experiments and do not register it across all runtimes. The tool can compress and retrieve originals by hash, but it should not replace existing MCP tool surfaces. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/headroom/mcp_registry/install.py:24]

4. **Evaluate RTK separately for shell-output shortening.** Headroom bundles RTK and can use lean-ctx, but the shell-output problem can be tested without adopting Headroom proxy/wrap. [SOURCE: .opencode/specs/system-spec-kit/029-headroom-utilization/external/README.md:427]

5. **Do not adopt proxy/wrap/output-shaper/learn/cross-agent memory into core now.** These surfaces are too broad or conflict with memory and hook contracts. They can be reconsidered only through a separate experiment packet with process isolation, network controls, and exact before/after artifacts.

## 8. Minimal Future Experiment Shape

If this becomes implementation work, the first experiment should be:

- Input corpus: copied deep-loop iteration files, long command outputs, and large markdown docs.
- Exclusions: all JSONL state, deltas, generated metadata, validator output, AGENTS.md, hook JSON, diffs.
- Mode: library `compress()` only.
- Config: `compress_system_messages=False`, `compress_user_messages=False` unless the corpus is explicitly tool output, `protect_recent=4`, conservative target ratio, no output-shaper.
- Measurements: token savings, citation survival, exact-source recoverability, deterministic rerun diff, and strict validation of the untouched spec folder before/after.

## 9. Eliminated Alternatives

- **Core transparent proxy now.** Rejected because it observes and mutates broad provider traffic after runtime/hook context assembly.
- **Wrap every cli-* executor.** Rejected because cli-* skills are cross-AI dispatch tools with self-invocation guards and explicit executor provenance.
- **Auto-register Headroom MCP everywhere.** Rejected because it adds a parallel tool surface and retrieval semantics without a usage policy.
- **Adopt `headroom learn`.** Rejected because it writes AGENTS/native memory surfaces and conflicts with Spec Kit Memory as the only memory write system.
- **Adopt Headroom cross-agent memory.** Rejected because it is a second memory store.
- **Enable output-shaper.** Rejected for core because it mutates system prompts and reasoning effort.
- **Compress code-graph diffs or readiness diagnostics.** Rejected because structural and safety semantics depend on exact text.

## 10. Open Questions

No charter question remains unanswered. Productization would require a separate implementation/spec packet for the library-mode benchmark harness and a licensing/NOTICE check.

## 11. Convergence Report

- Stop reason: converged
- Total iterations: 8
- Questions answered: 8 / 8
- Remaining questions: 0
- Last 3 iteration summaries:
  - run 6: deep-loop workflows and artifact determinism (0.55)
  - run 7: risk register and guardrails (0.40)
  - run 8: ranked adoption recommendation and eliminated alternatives (0.18)
- Convergence threshold: 0.05
- Default post-synthesis writeback/save/stage steps were skipped because this fan-out lineage was instructed to write only inside `.opencode/specs/system-spec-kit/029-headroom-utilization/001-research/research/lineages/gpt55xhigh`.
