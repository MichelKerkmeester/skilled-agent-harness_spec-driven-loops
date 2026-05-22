# Iteration 008: ccc search, sidecars, timeouts, browser helpers, and external MCP cleanup

## Focus
This iteration inspected `ccc search`, CocoIndex daemon startup, reranker sidecar auto-ensure behavior, Ollama and embedder backend boundaries, `gtimeout` use in deep workflows, browser/devtools helper cleanup, and external MCP process lifecycle through Code Mode.

## Findings
1. A one-shot `ccc search` can start a detached CocoIndex daemon: the CLI search path calls `ensure_daemon()`, `ensure_daemon()` starts the daemon when the socket connection fails, and `_spawn_daemon_process()` launches `ccc run-daemon` or `python -m cocoindex_code.cli run-daemon` with `start_new_session=True` and stdio redirected to the daemon log. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1083] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:570] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:287] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:307]
2. CocoIndex has a real daemon stop path, but cli-X kill-between docs do not use it. `ccc daemon stop` delegates to `stop_daemon()`, and `stop_daemon()` escalates from socket stop to SIGTERM and SIGKILL; the cli-codex cleanup recipe instead names `pkill -9 -f "ccc search"` plus `gtimeout` and `rerank_sidecar:app`, which misses the detached `ccc run-daemon` process that `ccc search` may have started. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1266] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:400] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:451] [SOURCE: .opencode/skills/cli-codex/SKILL.md:357]
3. The CocoIndex MCP entrypoint can auto-spawn the reranker sidecar even when spec-memory cross-encoder reranking is disabled. `_ensure_rerank_sidecar_for_mcp()` documents that CocoIndex uses `COCOINDEX_RERANK_VIA_SIDECAR`, passes `skip_if_disabled=False`, and `_rerank_via_sidecar_enabled()` defaults to true when the environment variable is unset. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:162] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:32]
4. The Python rerank ensure helper spawns the sidecar detached and returns an `ownerPid`, but it does not persist ownership for later targeted cleanup. It launches `bash start.sh` with `start_new_session=True`, waits for `/health`, and returns the child PID only to the immediate caller. The launcher then `exec`s uvicorn, so later cleanup relies on external process matching or port ownership rather than a sidecar-owned PID file. [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:107] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:109] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:115] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:127] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/start.sh:46]
5. The rerank sidecar can retain multiple model copies until process shutdown. It stores loaded `CrossEncoder` instances in module-global `_models`, adds one lock per model, lazy-loads models on `/warmup` or `/rerank`, and clears `_models` only in FastAPI lifespan shutdown. There is no per-model idle eviction in the inspected service. [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:73] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:112] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:177] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:216] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:239]
6. CocoIndex's HTTP sidecar adapter keeps an `httpx.Client` per adapter and caches those adapters globally; the inspected reranker module exposes no close/dispose path for that client cache. In a long-lived `ccc run-daemon`, sidecar HTTP client state therefore lives for the daemon lifetime. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:20] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:246] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:249] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:396] [INFERENCE: `rg` found no `_client.close`, `aclose`, or `dispose` implementation in the inspected CocoIndex reranker package.]
7. A sidecar outage can cause CocoIndex to load an in-daemon fallback cross-encoder, which undercuts process-isolated memory containment. The HTTP adapter falls back to `CrossEncoderRerankerAdapter` on sidecar errors, and the fallback adapter lazy-loads and retains its own `CrossEncoder` model in `_model`. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:226] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:264] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:308] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:138] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:153]
8. Ollama is a boundary service rather than a child process in the inspected code. Auto-selection probes `http://127.0.0.1:11434/api/tags` with an aborting fetch timeout, and the provider performs HTTP POSTs to `/api/embed` or `/api/embeddings`; no spawn path for `ollama serve` appeared in the inspected embedder code. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:400] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:403] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:13] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:193] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:321]
9. Embedder sidecar requests lack an embedding-call timeout. `SidecarClient.embed()` calls `sendRequest()` without a timeout, while `sendRequest()` only installs a timer when `timeoutMs` is provided; a backend that hangs during `provider.embedQuery()` or `provider.embedDocument()` can therefore leave the parent await and worker process stuck until an external shutdown or kill path intervenes. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:170] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:322] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:338] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:123] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:128]
10. Deep workflow timeout mechanics are heterogeneous. The cli-codex, cli-gemini, and cli-claude-code deep-research branches use `runAuditedExecutorCommand()` and Node `spawnSync(..., { timeout })`; cli-devin uses `gtimeout 900`; cli-opencode relies on the workflow-level timeout. That means cleanup after timeout is only uniform if the outer kill-between recipe catches grandchildren and detached helpers. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:602] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:169] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:765] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:813] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:733]
11. Browser/devtools helpers already document a concrete leak mode: omitting `bdg stop` leaves Chrome processes running. The skill requires stopping sessions and trap-based cleanup, and the destructive playbook expects post-session Chrome process count to increase until `bdg stop` runs. Deep workflow cleanup lists do not currently mention `bdg stop` or `chrome.*--remote-debugging`, so browser work inside a research iteration can add a separate leftover-process class. [SOURCE: .opencode/skills/mcp-chrome-devtools/SKILL.md:254] [SOURCE: .opencode/skills/mcp-chrome-devtools/SKILL.md:268] [SOURCE: .opencode/skills/mcp-chrome-devtools/references/session_management.md:523] [SOURCE: .opencode/skills/mcp-chrome-devtools/manual_testing_playbook/06--recovery-and-failure/004-cleanup-leak.md:16] [SOURCE: .opencode/skills/mcp-chrome-devtools/manual_testing_playbook/06--recovery-and-failure/004-cleanup-leak.md:46]
12. Code Mode creates a singleton UTCP client and exposes `call_tool_chain` timeouts, but the wrapper source has no shutdown hook that calls `utcpClient.close()`. The underlying `@utcp/mcp` package explicitly closes active MCP sessions and subprocesses in `close()`, so leaving the singleton open makes external MCP subprocess lifetime depend on parent process teardown rather than deterministic wrapper cleanup. [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/index.ts:250] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/index.ts:261] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/index.ts:277] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/index.ts:330] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4333]
13. External stdio MCP sessions are persistent and environment-inheriting by design. `@utcp/mcp` reuses sessions from `_mcpSessions`, starts stdio transports with `command`, `args`, `cwd`, and merged `process.env`, and uses `Promise.race` timeouts around operations. It cleans and retries once on timeout-like errors, but the second timeout race is returned without a surrounding cleanup block in the inspected function. [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4173] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4184] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4188] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4220] [SOURCE: .opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4230]

## Ruled Out
Ollama as a process spawned by system-spec-kit was ruled out for this pass; the inspected paths only probe and call an already-running HTTP service. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:400]

Duplicate CocoIndex daemon races are not the main current risk. The daemon has a spawn lock, a lifetime lock, PID-file ownership checks, and bounded handler shutdown. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:251] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1097] [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1287]

The rerank sidecar launcher no longer has the full-parent-env leak at the final uvicorn boundary; `start.sh` uses `env -i` and an explicit allowlist. [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/start.sh:24] [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/start.sh:28]

## Dead Ends
Broad grep across benchmarks and feature catalog files produced too much historical noise; runtime source, skill contracts, and current playbooks gave better evidence.

Inspecting live process tables was deliberately skipped because the iteration contract is research-only and forbids launching nested tools or creating helper processes.

## Edge Cases
- Ambiguous input: "external MCP tooling" spans Code Mode, browser DevTools MCPs, and other configured UTCP servers; this pass focused on Code Mode's generic MCP transport plus Chrome DevTools as the browser-specific example.
- Contradictory evidence: CocoIndex daemon locking is strong for duplicate-daemon prevention, but cli-X cleanup guidance still targets `ccc search` rather than the long-lived daemon it can start.
- Missing dependencies: No live `ccc`, `bdg`, `ollama`, or Code Mode MCP invocation was run, so findings are source-level lifecycle findings rather than runtime process-table proof.
- Partial success: The sidecar/Ollama evidence overlaps iteration 005, but this pass adds CocoIndex-default-on rerank sidecar behavior, Code Mode MCP close gaps, and browser helper cleanup as distinct process-boundary risks.

## Sources Consulted
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/prompts/iteration-contract.md:1-61`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-state.jsonl:1-8`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/deep-research-strategy.md:1-34`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/prompts/iteration-008.md:1-14`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139-170`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1051-1103`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1191-1299`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:245-313`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:400-472`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:539-593`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1079-1300`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:24-35`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:130-223`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:226-430`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:80-128`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh:24-46`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:73-83`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:177-183`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209-243`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:57-78`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts:106-124`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:160-176`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:217-245`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:322-342`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:123-139`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:400-434`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:193-203`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:261-278`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:321-340`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:580-825`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:735-885`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:169-227`
- `.opencode/skills/cli-codex/SKILL.md:345-365`
- `.opencode/skills/cli-devin/SKILL.md:360-378`
- `.opencode/skills/mcp-chrome-devtools/SKILL.md:190-323`
- `.opencode/skills/mcp-chrome-devtools/references/session_management.md:499-545`
- `.opencode/skills/mcp-chrome-devtools/manual_testing_playbook/06--recovery-and-failure/004-cleanup-leak.md:1-80`
- `.opencode/skills/mcp-code-mode/mcp_server/index.ts:250-331`
- `.opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/code-mode/dist/index.js:152-183`
- `.opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/code-mode/dist/index.js:215-260`
- `.opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4054-4068`
- `.opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4160-4235`
- `.opencode/skills/mcp-code-mode/mcp_server/node_modules/@utcp/mcp/dist/index.js:4333-4339`
- `.utcp_config.json:14-68`

## Assessment
- New information ratio: 0.62
- Questions addressed: Which sidecars or helpers are expected daemons versus unexpected leftovers after an iteration? Where are cleanup traps missing or inconsistent? What verification would prove proposed fixes reduce process buildup?
- Questions answered: `ccc search` can leave a detached expected daemon; CocoIndex MCP can auto-spawn rerank sidecar by default; Ollama is external HTTP service rather than a spawned child; Code Mode external MCP subprocess cleanup depends on explicit `close()` that the wrapper does not call; browser helper cleanup requires `bdg stop`.

## Reflection
- What worked and why: Targeted runtime source reads beat broad grep because prior iterations already covered broad spawn inventory and sidecar taxonomy.
- What did not work and why: Searching all benchmarks and feature catalog material created stale/historical noise that was not useful for current lifecycle evidence.
- What I would do differently: Start with the process-owner matrix from iterations 005-007, then inspect only the unclosed boundaries: daemon start/stop, sidecar ownership, browser sessions, and external MCP session close.

## Recommended Next Focus
Map a unified cleanup/allowlist contract for deep workflows: expected daemons (`ccc run-daemon`, Ollama), auto-spawned helpers (`rerank_sidecar:app`, embedder sidecars), browser sessions (`bdg stop` / Chrome remote-debugging), and external MCP stdio subprocesses (`utcpClient.close()`), then define one verification command that proves post-iteration RSS and process counts return to baseline.
