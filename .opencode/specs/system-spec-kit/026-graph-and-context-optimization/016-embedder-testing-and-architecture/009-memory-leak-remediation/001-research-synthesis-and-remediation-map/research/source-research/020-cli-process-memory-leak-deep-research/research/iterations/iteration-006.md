# Iteration 006: process owners, command patterns, cleanup gaps, and helper lifecycle responsibilities

## Focus
This iteration independently mapped process ownership across `/spec_kit:deep-research`, adjacent deep-loop command assets, system-spec-kit subprocess helpers, embedder sidecars, daemon probes, and cli-X skill contracts. Prior Claude iterations were used only as context; findings below cite source lines from the current tree.

## Findings
1. `/spec_kit:deep-research` defines the canonical state, prompt, iteration, delta, and lock paths under the resolved research artifact directory, so the workflow owns artifact placement before any executor runs. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:100-115]
2. The workflow explicitly resolves a local research owner directory and local archive directory before initialization; child phases keep local research packets rather than sharing a parent-level output surface. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:126-134]
3. The deep-research advisory lock contract is declarative: the YAML says runtimes must release the lock on halt, cancel, and workflow exit, then emits a final `lock_released` event after save/skip-save/cancel cleanup. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-195] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:1055-1058]
4. The deep-research skill makes the command workflow the process owner: it forbids custom shell loops, direct cli-X loop simulation, manual `/tmp` prompts, Task-dispatched loop agents, skipped state files, and state outside `{spec_folder}/research/`. [SOURCE: .opencode/skills/deep-research/SKILL.md:46-63]
5. Executor selection is also workflow-owned; the skill says native and CLI executors route through YAML, every executor must produce the iteration file and JSONL delta, and the LEAF constraint forbids sub-dispatch or nested loops. [SOURCE: .opencode/skills/deep-research/SKILL.md:65-97]
6. The `@deep-research` agent narrows per-iteration ownership further: it is leaf-only, cannot use Task, must keep writes inside the resolved packet, and treats reducer-owned state/strategy/dashboard files as read-only. [SOURCE: .opencode/agents/deep-research.md:36-57]
7. The executor config schema recognizes six executor kinds and encodes per-kind flag support; `cli-opencode` explicitly has no sandbox support in the schema, while `cli-devin` accepts model, sandbox mode, and timeout only. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:7-49]
8. There is a real ownership-name drift: the config schema stores `kind`, the deep-research YAML branches on `config.executor.type`, the branch-local executor objects use `type`, and executor audit records read `executor.kind`. That can make branch selection and provenance depend on a non-schema field. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21-27] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:577-599] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:10-16]
9. Deep-research wraps `cli-codex`, `cli-gemini`, and `cli-claude-code` through `runAuditedExecutorCommand`, passing command, args, cwd, timeout, state-log path, executor metadata, iteration number, and prompt input where needed. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:584-724]
10. `runAuditedExecutorCommand` owns the direct child process with `spawnSync`, a bounded timeout, stdout/stderr forwarding, and `dispatch_failure` event emission on timeout, error, non-zero status, or signal. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:169-226]
11. The audited wrapper does not set `detached`, create a process group, or run a post-dispatch orphan sweep; if a CLI spawns grandchildren that survive the direct process, cleanup responsibility remains outside this wrapper. [INFERENCE: verified from the complete `spawnSync` options and failure paths in .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:173-223]
12. Deep-research `cli-opencode` and `cli-devin` branches are raw shell command blocks rather than audited-wrapper calls: OpenCode runs with `--dangerously-skip-permissions` and `</dev/null`, while Devin uses `gtimeout 900`, temp stdout/stderr logs, and `ITER_OUTCOME` classification. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:733-815]
13. Deep-review has a different process map from deep-research: its `cli-codex`, `cli-gemini`, `cli-claude-code`, and `cli-opencode` branches are raw shell snippets, `cli-copilot` uses a local `spawnSync('copilot', ...)`, and `cli-devin` uses the same `gtimeout 900` temp-log pattern. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:688-880]
14. Post-dispatch validation checks artifacts, canonical JSONL type, required fields, delta presence, and executor provenance for non-native executors; it detects logged dispatch failures but does not inspect OS process cleanup. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:307-455]
15. The cli-X family assigns kill-between-dispatch responsibility to the calling AI/operator: each skill says to launch one cli-* dispatch at a time, verify outputs, SIGKILL the dispatcher and orphan children, and wait for RSS to drop before the next dispatch. [SOURCE: .opencode/skills/cli-codex/SKILL.md:345-357] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:281-296] [SOURCE: .opencode/skills/cli-devin/SKILL.md:360-372] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:345-350] [SOURCE: .opencode/skills/cli-gemini/SKILL.md:300-309]
16. Self-invocation prevention is documented per cli-X skill using environment, process ancestry, and lock-file probes; no shared deep-loop wrapper enforces those guards before running a branch. [SOURCE: .opencode/skills/cli-codex/SKILL.md:12-16] [SOURCE: .opencode/skills/cli-codex/SKILL.md:56-85] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:63-96] [SOURCE: .opencode/skills/cli-devin/SKILL.md:63-97] [INFERENCE: deep-research branch snippets cite skill self-invocation contracts but do not call guard code before execution in .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:753-809]
17. OpenCode is the only cli-X path with a documented parallel-detached exception; it is also the path with a known non-interactive stdin hang unless `</dev/null` is appended. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:12-18] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:34-36] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:281-287]
18. Devin is the only cli-X path with a documented cloud-handoff exception and a deep-loop `--agent-config` contract; the research recipe permits read/search shell utilities but denies mutating shell commands, while synthesis is the only recipe with narrow write scope. [SOURCE: .opencode/skills/cli-devin/SKILL.md:12-18] [SOURCE: .opencode/skills/cli-devin/SKILL.md:370-372] [SOURCE: .opencode/skills/cli-devin/references/deep-loop-iter-contract.md:16-32] [SOURCE: .opencode/skills/cli-devin/references/deep-loop-iter-contract.md:110-119] [SOURCE: .opencode/skills/cli-devin/references/deep-loop-iter-contract.md:174-183]
19. The embedder sidecar owner is `execution-router` plus `SidecarClient`: local providers default to sidecar mode, shutdown hooks run on `beforeExit`, `SIGINT`, and `SIGTERM`, and `shutdownAllSidecars()` fans out to all clients. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:29-32] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:69-78] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:204-245]
20. The embedder sidecar child is a forked Node worker that inherits the parent environment plus sidecar-specific variables; shutdown first sends a `shutdown` request, falls back to `SIGTERM`, and idle eviction kills the worker after the configured idle window. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:217-233] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:257-265] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:419-428]
21. The sidecar worker itself exits only on a `shutdown` request or stdin close, so parent death by `SIGKILL` can bypass the graceful shutdown hook and leave cleanup dependent on pipe closure and OS behavior. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:149-157] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:166-195] [INFERENCE: `process.once` hooks in .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124 cannot run after `SIGKILL`]
22. The CocoIndex daemon path is classification-only in system-spec-kit: the probe reads pid/socket/log/lock evidence, checks liveness with `process.kill(pid, 0)`, reports reachable/degraded/unreachable, and caches the probe for a TTL. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:52-61] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:98-153]
23. Codex/Claude/Gemini/Devin hook shims are thin process-boundary wrappers that `spawnSync` a downstream advisor target with inherited environment and no timeout at the shim layer; on error or non-zero status they write `{}` and exit 0. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1-21] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1-21]
24. The Codex hook-policy probe is bounded separately: it runs `codex --version` via `spawnSync` with a default 500 ms timeout, scrubs selected Codex env vars, and caches the result per process. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:67-97] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:256-317]
25. The Claude Stop hook autosave path is bounded: it spawns `generate-context.js --json ...` with ignored stdin, pipe output, a 4 s timeout, and 1 MiB max buffer. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:35-36] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:129-139]
26. Matrix runners own direct CLI children with `spawn`, pipe stdin/stdout/stderr, kill only the direct child with `SIGKILL` on timeout, and close stdin after optional input. Grandchild cleanup remains outside the adapter. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:103-148] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:150-184]
27. Git/session extraction subprocesses are bounded short helpers, not long-lived owners: branch and git context helpers use `execSync`/`execFileSync` with 5 s timeouts. [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts:97-104] [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/git-context-extractor.ts:91-97]
28. Several in-process periodic helpers correctly avoid keeping Node alive by calling `unref()` on cleanup intervals; these are memory/lifecycle responsibilities but not process-orphan sources. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:225-289] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:371-380]

## Ruled Out
- Re-running the full spawn inventory from iteration 001; exact-token searches confirmed the same major surfaces, so this iteration focused on ownership and cleanup responsibility rather than callsite counts.
- Inspecting secrets, auth files, token stores, or environment dumps; the contract forbids secrets and the ownership map did not require them.
- Launching nested `claude`, `codex`, `opencode`, `devin`, or `gemini`; the iteration contract forbids nested CLI dispatch.
- Treating `node_modules`, changelogs, manual playbooks, and tests as primary runtime evidence after the first broad search; they produced noise for this focus.

## Dead Ends
- Searching for a single shared cli-X process supervisor did not yield one in the inspected runtime path; the effective policy is split between deep-loop YAML, `executor-audit.ts`, branch-local shell snippets, and cli-X SKILL rules. [INFERENCE: compared cited deep-loop, executor-audit, and cli-X skill sources]
- Searching for a canonical expected-long-lived-helper allowlist inside system-spec-kit found CocoIndex daemon probing and launcher-lease documentation, but no unified map covering cli dispatchers, embedder sidecars, reranker sidecars, Ollama, and hook subprocesses. [INFERENCE: exact searches for daemon/sidecar/launcher/helper ownership in the scoped paths found the cited per-helper docs rather than one central allowlist]

## Edge Cases
- Ambiguous input: none. The spec folder, prompt directory, and allowed writes were explicit.
- Contradictory evidence: `executor-config.ts` uses `kind`, while deep-research YAML and branch-local executor objects use `type`; executor audit reads `kind`.
- Missing dependencies: CocoIndex semantic search/code graph were unavailable in this runtime, so this pass used `rg`, `find`, `sed`, and direct source reads.
- Partial success: The process-ownership map is source-cited, but no live process table or memory-pressure measurement was taken because this iteration is research-only and forbids nested CLI execution.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/prompts/iteration-contract.md:1-60`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-config.json:1-32`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-state.jsonl:1-6`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-strategy.md:1-30`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:100-205`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:540-825`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:1055-1058`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:680-910`
- `.opencode/skills/deep-research/SKILL.md:46-103`
- `.opencode/skills/deep-research/SKILL.md:260-329`
- `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl:1-65`
- `.opencode/skills/deep-research/references/loop_protocol.md:212-230`
- `.opencode/agents/deep-research.md:30-57`
- `.opencode/agents/deep-research.md:100-113`
- `.opencode/agents/deep-research.md:318-330`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:1-205`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:1-253`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:307-455`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:1-254`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:1-437`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:1-195`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:1-166`
- `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:1-185`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1-21`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1-21`
- `.opencode/skills/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:1-317`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:1-170`
- `.opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts:1-130`
- `.opencode/skills/system-spec-kit/scripts/extractors/git-context-extractor.ts:1-115`
- `.opencode/skills/system-spec-kit/references/launcher-lease.md:1-83`
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:220-295`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:371-380`
- `.opencode/skills/cli-codex/SKILL.md:1-90`
- `.opencode/skills/cli-codex/SKILL.md:205-235`
- `.opencode/skills/cli-codex/SKILL.md:345-365`
- `.opencode/skills/cli-opencode/SKILL.md:1-100`
- `.opencode/skills/cli-opencode/SKILL.md:225-305`
- `.opencode/skills/cli-devin/SKILL.md:1-100`
- `.opencode/skills/cli-devin/SKILL.md:360-378`
- `.opencode/skills/cli-devin/SKILL.md:468-474`
- `.opencode/skills/cli-devin/references/deep-loop-iter-contract.md:1-220`
- `.opencode/skills/cli-claude-code/SKILL.md:1-90`
- `.opencode/skills/cli-claude-code/SKILL.md:345-355`
- `.opencode/skills/cli-gemini/SKILL.md:1-90`
- `.opencode/skills/cli-gemini/SKILL.md:300-312`

## Assessment
- New information ratio: 0.58
- Questions addressed: process owners; spawned command patterns; cleanup gaps; long-lived helper responsibilities; verification surfaces for process buildup
- Questions answered: deep-loop process ownership is split between YAML, audited wrapper, and branch-local shell; cli-X cleanup is documented as caller/operator responsibility; embedder sidecars and CocoIndex daemon probes have separate owners; several helpers are bounded short subprocesses rather than daemon risks

## Reflection
- What worked and why: Exact-token search for `spawn`, `spawnSync`, `fork`, `gtimeout`, `SIGTERM`, `lock`, `sidecar`, and `daemon` quickly separated real process owners from documentation noise.
- What did not work and why: Broad lifecycle searches across the full tree produced too much test, changelog, manual-playbook, and node_modules noise; scoping to runtime paths and direct source reads was necessary.
- What I would do differently: Start with a branch-by-branch process ownership table for deep-research and deep-review before expanding to helpers, because the wrapper/raw-shell asymmetry is the organizing fact.

## Recommended Next Focus
Design the remediation boundary: choose whether to centralize all deep-loop CLI branches behind `runAuditedExecutorCommand`, add process-group cleanup/orphan sweeps, and introduce one expected-long-lived-helper allowlist that classifies embedder sidecar, CocoIndex daemon, mk-spec-memory launcher, reranker sidecar, Ollama, hook shims, and cli-X dispatchers.
