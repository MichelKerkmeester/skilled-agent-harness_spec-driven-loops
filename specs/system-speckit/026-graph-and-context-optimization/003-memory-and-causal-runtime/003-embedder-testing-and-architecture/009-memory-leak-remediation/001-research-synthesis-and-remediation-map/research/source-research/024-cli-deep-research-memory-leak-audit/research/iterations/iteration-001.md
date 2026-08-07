# Iteration 001 — Process spawn & cleanup inventory (mcp-coco-index + system-code-graph)

## Focus

Inventory every code path in `.opencode/skills/mcp-coco-index/` (with cross-link
into `.opencode/skills/system-rerank-sidecar/` and `.opencode/skills/system-code-graph/`)
that:

1. Spawns a subprocess, daemon, sidecar, or local-model runtime.
2. Loads a long-lived heavy object (sentence-transformers / transformers / MPS / sqlite-vec).
3. Holds a network or IPC client cached at module scope.
4. Documents cleanup but does not enforce it on parent-CLI exit or shutdown timeout.

This first pass is broad surface coverage; severity is provisional and will be
challenged by lane A iterations 2–5 and lane B iterations 6–10.

## Actions Taken

- Read `mcp_server/cocoindex_code/{daemon.py, server.py, cli.py}` and the
  `core/`, `rerankers/`, `indexer/`, `embedders/`, `retrieval/`, `observability/`
  subpackages.
- Read `.opencode/skills/mcp-coco-index/scripts/{ensure_ready.sh, install.sh, doctor.sh, update.sh, common.sh}`.
- Read `.opencode/skills/system-rerank-sidecar/scripts/{ensure_rerank_sidecar.py, start.sh}`.
- Read `.opencode/skills/system-code-graph/mcp_server/lib/{ensure-ready.ts, ccc-readiness-probe.ts, ipc/socket-server.ts}`
  and `mcp_server/handlers/{ccc-reindex.ts, scan.ts}`.
- Cross-checked the `register_handler` / `signal.SIGTERM` paths and ran a
  module-global `_ADAPTERS` / `httpx.Client` cleanup-search.

## Findings

Severity prefix is provisional. Owner + cleanup boundary + observed risk listed
for each. File paths are repo-relative.

### F-001 [P0] — Heavy local rerank models loaded with no cleanup hook

- Owner: `mcp-coco-index`
- Process kind: in-process MPS / CUDA / CPU model (sentence-transformers
  CrossEncoder or `transformers.AutoModel`)
- Evidence:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:130-169`
    — `CrossEncoderRerankerAdapter._load_model` lazy-loads
    `sentence_transformers.CrossEncoder(self.model_name, trust_remote_code=True)`
    and pins it to `self._model`. No `_unload` / `__del__` / `close()`.
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/rerankers_jina_v3.py:74-117`
    — loads `jinaai/jina-reranker-v3` via `AutoModel.from_pretrained(...).to(device)`
    where `device` resolves to `mps` on Darwin (line 85). Held in `self._model`,
    set `eval()`, never released.
- Cleanup boundary: missing. `daemon.py:_async_daemon_main` (line 1283-1300)
  closes the IPC listener, cancels handler tasks (10 s timeout, line 1292),
  and calls `registry.close_all()` (line 1300) — but `close_all` operates on
  `Project` instances; it never iterates `rerankers/reranker.py::_ADAPTERS` to
  release model weights or MPS contexts.
- Observed risk: on Apple Silicon, MPS / Metal / IOSurface allocations made by
  `torch.to('mps')` typically outlive the Python object and are only released
  at process exit; if the daemon is restarted across deep-flow iterations the
  swap/wired pressure recorded in spec.md §8 lines up with this profile.
- Candidate remediation packet: `.../013-embedder-testing-and-architecture/004-code-index-stack/<NNN>-reranker-cleanup-hook`
  with a daemon-side `close_all_adapters()` that walks `_ADAPTERS`, calls
  `httpx.Client.close()`, `model.to('cpu'); del model; gc.collect(); torch.mps.empty_cache()`.

### F-002 [P0] — Module-global `_ADAPTERS` cache never cleared

- Owner: `mcp-coco-index`
- Process kind: module-level dict + cached `httpx.Client`
- Evidence:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:20`
    — `_ADAPTERS: dict[str, Any] = {}` lives at module scope. Populated by
    `get_reranker_adapter` (lines 385-414) on first use per `model_name`.
  - `HttpSidecarRerankerAdapter._get_client` (line 249-257) lazily constructs
    `httpx.Client(base_url=…, timeout=…)` and stores it on `self._client`. No
    `__del__`, no context-manager use, no shutdown hook.
- Cleanup boundary: missing. The cache is never enumerated by daemon shutdown
  (daemon.py:1283-1300) nor by `Project.close()` (called inside
  `registry.close_all()` per daemon.py:415).
- Observed risk: per-daemon-lifetime accumulation of HTTP keep-alive TCP
  sockets and CrossEncoder model refs. Daemon survives across deep-research
  iterations (intentional, see §F-004), so the leak compounds even without
  a restart.
- Candidate remediation packet: same as F-001 — both fix in one packet.

### F-003 [P0] — Rerank sidecar spawned `start_new_session=True` with no parent-exit cleanup

- Owner: `system-rerank-sidecar` + `mcp-coco-index`
- Process kind: detached uvicorn worker (FastAPI rerank service)
- Evidence:
  - `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:109-116`
    — `subprocess.Popen(["bash", str(start_script)], …, start_new_session=True)`.
  - The only `os.kill(proc.pid, signal.SIGTERM)` is the warmup-timeout branch
    at line 120-123 — once the sidecar passes `/health`, the helper returns
    and no further cleanup contract exists.
  - `.opencode/skills/system-rerank-sidecar/scripts/start.sh:47` — `exec env -i
    … uvicorn scripts.rerank_sidecar:app --workers 1`. uvicorn parent process
    is the child of the bash session leader created by Popen.
  - Caller: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139-170`
    `_ensure_rerank_sidecar_for_mcp` (invoked from `mcp` entrypoint) does not
    register `atexit` or signal hooks that send SIGTERM to the sidecar pid.
- Cleanup boundary: documented in spec.md §6 ("rerankers or embedding backends
  may retain memory after the CLI process exits") but not enforced. After the
  MCP/CLI process exits, the sidecar's Qwen3-Reranker-0.6B remains resident
  (model load + Python + uvicorn ≈ 1–2 GB RSS each).
- Observed risk: in nested cli-X dispatches, every fresh CLI may probe the
  sidecar, find it dead (e.g., killed by the operator's between-iter sweep)
  and spawn another. Memory growth is N×model not 1×model.
- Candidate remediation packet: `<NNN>-rerank-sidecar-lifecycle` adding an
  ownership PID file + per-iteration kill in the cli-X kill-between rules and
  in `_ensure_rerank_sidecar_for_mcp` (atexit hook).

### F-004 [P1] — CocoIndex daemon detaches via `start_new_session=True`; intentional but outlives every CLI

- Owner: `mcp-coco-index`
- Process kind: detached Python `ccc run-daemon` (or `python -m cocoindex_code.cli run-daemon`)
- Evidence:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:277-313`
    — `_spawn_daemon_process` calls `subprocess.Popen(cmd, start_new_session=True,
    stdout=log_fd, stderr=log_fd, stdin=subprocess.DEVNULL)` on Unix and the
    `DETACHED_PROCESS|CREATE_NEW_PROCESS_GROUP` flags on Windows.
  - `client.py:400-472` (`stop_daemon`) implements the documented
    StopRequest → SIGTERM → SIGKILL escalation; `_pid_alive` polls with 0.1 s.
- Cleanup boundary: intentional. Daemon is *meant* to survive between CLI
  invocations for warm sqlite-vec + embedder state. The risk is that NO CLI
  exit path invokes `stop_daemon()` — operator must run `ccc stop` or
  `kill <pid>` between deep-flow iterations.
- Observed risk: the spec.md "stop after every iteration" rule is enforced by
  user playbook (see `.opencode/skills/cli-claude-code/SKILL.md` kill-between
  rules), not by code. A skipped sweep leaves the daemon plus the F-001/F-002
  / F-003 leaks alive for the whole multi-day session.
- Candidate remediation packet: not necessarily a code fix — could be a
  documentation tightening, or a `--reset-daemon-between-iterations` flag in
  `/deep:start-research-loop`. Severity P1 because the behavior is by design but
  combines with P0 leaks above.

### F-005 [P1] — Daemon shutdown grace omits background indexing tasks

- Owner: `mcp-coco-index`
- Process kind: asyncio tasks holding sqlite + tree-sitter handles
- Evidence:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:378`
    — `ProjectRegistry.get_project` fires `asyncio.create_task(self._run_index(project_root))`
    when `suppress_auto_index` is False. No reference is captured.
  - `daemon.py:1235-1255` — `tasks: set[asyncio.Task[Any]] = set()` collects
    **only** handler tasks scheduled by `_spawn_handler`; the background index
    task above is NOT in this set.
  - `daemon.py:1287-1299` — shutdown gathers `tasks` with a 10 s `wait_for`.
    Background index tasks are not gathered; they receive an event-loop
    cancellation but their `await project.update_index(on_progress=…)` call
    may be mid-sqlite-WAL write.
- Cleanup boundary: documented (the 10 s grace exists) but the wrong set is
  awaited.
- Observed risk: a SIGTERM during an automatic load-time index leaves a
  half-written WAL and an unflushed embedder context. On restart the daemon
  refuses to overwrite (lines 1116-1123) until the operator clears state.
- Candidate remediation packet: `<NNN>-daemon-shutdown-gathers-bg-tasks`.

### F-006 [P1] — Code-graph `ccc_reindex` blocks the MCP event loop for 120 s

- Owner: `system-code-graph`
- Process kind: foreground `ccc index` (which itself starts the detached
  CocoIndex daemon described in F-004)
- Evidence:
  - `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:8`
    — `import { execFileSync } from 'node:child_process'`.
  - `handlers/ccc-reindex.ts:41-46` — `const output = execFileSync(cccBin,
    execArgs, { cwd: projectRoot, timeout: 120_000, encoding: 'utf-8', env: …
    });`
- Cleanup boundary: Node `execFileSync({ timeout })` sends SIGTERM at the
  timeout to the foreground `ccc` process, but the detached CocoIndex daemon
  it triggered (per F-004) survives.
- Observed risk: in deep-research iteration loops where the LEAF agent calls
  `code_graph_*` tools, a stalled CCC index can lock the MCP server's
  single-threaded event loop for up to two minutes. During that window every
  other code-graph tool call (`scan`, `query`, `context`) times out at the
  client, often causing the operator to dispatch a duplicate CLI.
- Candidate remediation packet: `<NNN>-ccc-reindex-async-handler` switching to
  `execFile` (async) with explicit child-kill on cancellation.

### F-007 [P2] — `execSync(git …)` on every code-graph read-path freshness probe

- Owner: `system-code-graph`
- Process kind: short-lived `git` child per call
- Evidence:
  - `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:86-95`
    — `execSync('git rev-parse HEAD', { cwd, timeout: 5_000 })`.
  - `ensure-ready.ts:107-119` — `execSync('git diff --name-only …', timeout: 5_000)`.
  - `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:210` —
    `execSync('git rev-parse HEAD', …, timeout: 5_000)`.
- Cleanup boundary: per-call timeout protects against hangs; not a leak. The
  P2 concern is RSS churn (Node fork + git RSS + descriptor pairs) under high
  iteration rate, which compounds with F-006's blocking behavior.
- Candidate remediation packet: `<NNN>-code-graph-git-head-cache` to cache the
  HEAD sha across read-path queries within a freshness window.

### F-008 [P2] — Module-global `activeSockets` and `activeTransports` in IPC socket server

- Owner: `system-code-graph`
- Process kind: in-Node net.Socket + MCP StdioServerTransport refs
- Evidence:
  - `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:34-37`
    — module-level `activeServer`, `activeSockets: Set<net.Socket>`,
    `activeTransports: Map<net.Socket, StdioServerTransport>`.
  - Removal contract is the `socket.once('close', …)` handler at line 135-138
    which calls `transport.close()` and `activeSockets.delete(socket)`.
- Cleanup boundary: implemented for clean disconnects. The risk is an abrupt
  client process death where TCP/Unix-domain RST may not fire `'close'` for
  several seconds, during which the StdioServerTransport's read buffer keeps
  growing.
- Candidate remediation packet: `<NNN>-ipc-transport-watchdog` adding a
  ping/idle timeout that destroys silent sockets.

### F-009 [P2] — `daemon.py:_run_daemon` adds StreamHandler when stderr is a TTY

- Owner: `mcp-coco-index`
- Evidence: `daemon.py:1146-1147` — `if sys.stderr is not None and sys.stderr.isatty():
  handlers.append(logging.StreamHandler())`.
- Risk: cosmetic; under MCP-stdio invocation stderr is not a TTY so this is
  inert. Only relevant to interactive `ccc run-daemon` runs.

### F-010 [P2] — `_run_index` task fired without reference, shutdown gather misses it

- Same root cause as F-005 but a different symptom: the missing reference
  means even non-shutdown errors are eaten as "Task exception was never
  retrieved" rather than re-raised to the daemon main loop. Promoting to P1
  is a candidate if more iterations confirm operator-observed silent failures.

## Questions Answered

- **Which mcp-coco-index code paths start subprocesses, daemons, local model
  runtimes, sidecars, search helpers, or indexing jobs?** Enumerated above:
  daemon spawn (client.py:277), rerank sidecar spawn
  (system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:109), in-process
  CrossEncoder load (rerankers/reranker.py:153), in-process jina-v3 load
  (rerankers_jina_v3.py:94), background index task (daemon.py:378), tree_sitter
  probe (cli.py:294), code-graph ccc invocations
  (system-code-graph/handlers/ccc-reindex.ts:41 and
  system-code-graph/lib/ccc-readiness-probe.ts:157).
- **Which paths document cleanup but do not enforce it in code?** F-001, F-002,
  F-003, F-005, F-010.
- **Which processes could survive parent CLI exit or timeout?** CocoIndex
  daemon (F-004 — by design), rerank sidecar (F-003 — also detached), in-memory
  MPS allocations held until daemon process exit (F-001).
- **Which findings are P0/P1/P2 and what follow-up remediation packet should
  own each?** Provisional assignment listed inline in each finding above.

## Questions Remaining

- Does `cocoindex.connectors.sqlite` register a sqlite3 `Connection` per
  asyncio task, and is the connection pool released by `Project.close()`? Need
  to read `core/project.py` and the vendored cocoindex package.
- What are the actual RSS deltas per iteration on a real run? Iteration 1 is
  static; need `vm_stat` + `sysctl vm.swapusage` evidence from a real
  deep-research cycle to confirm whether F-001+F-002 dominate or whether
  F-005's mid-write WAL is the worse failure mode.
- Are the MCP launcher JSON lease files (`*-launcher.json` under
  `mcp_server/database/`) tied to any of these processes, or are they
  exclusively for the skill-advisor / spec-memory daemons? (Two `.mk-*-launcher.json`
  files appear in `git status`; one is from system-skill-advisor, one is from
  mcp-code-index, but spec.md scopes only mcp-coco-index + system-code-graph.)
- Does `code_graph_scan` itself accumulate parser-skip-list state that grows
  monotonically across iterations? Hint visible in
  `lib/parser-skip-list.ts` but not yet read.

## Next Focus

Iteration 2 should drill into:

1. `cocoindex_code/core/project.py` and `core/shared.py` to confirm whether
   `Project.close()` actually releases sqlite-vec connections and embedder
   contexts, or merely drops a Python reference.
2. The embedder side of the loop: `embedders/registered_embedders.py` +
   `core/shared.py::create_embedder` to check for `httpx.Client` /
   `litellm` / cohere / voyage HTTP clients cached at module scope (parallel
   risk to F-002).
3. `system-code-graph/mcp_server/lib/code-graph-db.ts` — sqlite-better-sqlite3
   handle lifetime; whether tools like `code_graph_context` open and never
   close per call.
4. Capture an actual `ps aux` + `vm_stat` pair from the operator after a
   single `mcp_server` deep-flow loop to ground the static findings in
   runtime evidence.
