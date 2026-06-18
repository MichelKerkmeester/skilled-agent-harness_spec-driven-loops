# Deep Research Strategy — `minimax` lineage

> Lane-specific strategy file for the **minimax** fan-out lineage (cli-opencode, model `minimax-coding-plan/MiniMax-M3`).
> Owned by the workflow reducer for machine-managed sections; the human-authored overview/known-context stays analyst-owned.

## 1. TOPIC

Can the system-spec-kit memory MCP (mk-spec-memory, 37 tools) be replaced by a CLI with ZERO feature loss? Evaluate three architectures — (a) pure per-invocation CLI, (b) CLI front-end over the existing daemon/IPC socket (kill only the MCP protocol layer), (c) hybrid CLI that auto-spawns the daemon on demand — scoring each against the zero-feature-loss bar across 5 key questions.

## 2. KEY QUESTIONS (remaining)

- [ ] KQ1: 37-tool parity matrix — what is the CLI equivalent for each MCP tool?
- [ ] KQ2: Daemon-dependency audit — what dies per architecture?
- [ ] KQ3: MCP-only affordances — discovery, permissioning, Zod, retry/session-proxy, and the concrete CLI replacement for each
- [ ] KQ4: Integration-surface migration — runtime hooks, agent allowed-tools, doctor flows, deep-loop
- [ ] KQ5: Architecture comparison (a/b/c) with effort, risk, go/no-go

## 3. NON-GOALS

- No code is built, no MCP server is modified, no migration is executed.
- No latency/RSS benchmarks are run; proposals of what to measure are acceptable.
- This lane is read-only investigator only; spec.md, plan.md, tasks.md, implementation-summary.md are reconciled by the orchestrator after the fan-out completes.

## 4. STOP CONDITIONS

- All 5 KQs have evidence-backed answers (one iteration per KQ is the baseline).
- Forced full iteration budget per spec; convergence threshold is 0.
- Legal early stop only via all-questions-answered.

## 5. ANSWERED QUESTIONS

- KQ1 — 37-tool parity matrix: 5 tools already ported (generate-context, cli.ts stats/bulk-delete, reindex-embeddings, validate-memory-quality); 32 are 1:1 handler ports with a CLI argv layer. 0 truly lost in the handler sense.
- KQ2 — daemon-dependency audit: 6 services catalogued (S1..S6); 24/37 tools are daemon-free, 13/37 are soft-dependent, 0 are hard-required. Per-architecture loss table: (a) loses 3 services (S1, S2, S4); (b) keeps all 6; (c) keeps all 6 + auto-spawn.
- KQ3 — MCP-only affordances: 5 affordances catalogued (A1..A5); only A5 (auto-surface hooks) is architecture-dependent and **lost** in (a); A1, A2, A3, A4 are all replaced (never "lost") via per-runtime surfaces. 4x5 cross-runtime migration matrix built.
- KQ4 — integration-surface migration: 5 surfaces (S1..S5); 28 files / ~125 references. S1+S2+S4+S5 = 1-3 days mechanical; S3 (OpenCode `tools:` block) = 1-3 weeks gate. Migration critical path: S3.
- KQ5 — architecture comparison: 5-dimension scoring (D1..D5); per-architecture scores (a)=0.45, (b)=0.92, (c)=0.97. Risk register (9 risks). **Verdict: GO with architecture (c) — hybrid CLI that auto-spawns the daemon on demand.**

<!-- MACHINE-OWNED: START -->

## 6. WHAT WORKED

- Reading `TOOL_NAMES` sets as the source of truth is fast and produces a verifiable 37-row matrix (iteration 1).
- Tracing `startFileWatcher` and its only call site in `dist/context-server.js:1740` is the cleanest way to determine daemon-only services (iteration 2).
- Reading `spec-folder-mutex.ts:14-86` and `working-memory.ts:171-623` to verify "interprocess" / "per-session" claims (iteration 2).
- Mapping each MCP affordance to a 4-runtime replacement matrix (iteration 3) — surfaces that A1 is per-runtime, not uniform.
- `grep -c` per file turns "many references" into a concrete effort estimate (iteration 4); 106/19 = 5.6 refs-per-file average gives a reasonable migration cost.
- Framing the verdict as a 3-dimensional Pareto problem (feature retention × robustness × migration cost) — (c) is the unique strict-superset point (iteration 5).

## 7. WHAT FAILED

- (none this iteration)

## 8. EXHAUSTED APPROACHES (do not retry)

- (none yet)

## 9. RULED-OUT DIRECTIONS

- "11 CLIs" framing as broad parity evidence (iteration 1, finding 1.9).
- Treating KQ1 parity matrix as a sufficient zero-loss verdict (iteration 1, finding 1.8).
- "Single-writer = daemon-resident" claim — interprocess by design (iteration 2, ruled-out block).
- "Warm session briefs = daemon hot-cache" claim — per-session SQLite rows, not in-memory daemon cache (iteration 2, finding 2.8).
- A1 tool-schema auto-discovery as a uniform problem — per-runtime, OpenCode is the only case needing runtime support (iteration 3, finding 3.7 + 3.8).
- A5 auto-surface as a single replacement problem — architecture-dependent (iteration 3, finding 3.6).
- S2 as "just search-and-replace" — inline tool calls in prompt bodies require CLI flag-syntax rewriting; cost is ~2x a pure search-and-replace (iteration 4, finding 4.8).
- S3 as "just config edit" — OpenCode `tools:` block is an external runtime dependency; S3 is the migration critical path (iteration 4, finding 4.4 + 4.7).
- "Single-binary CLI form" — multi-process by design; CLI is one entry point, not one process (iteration 5, finding 5.7).
- "Atomic migration" — composable per-tool and per-runtime; only S3 is truly atomic (iteration 5, finding 5.8).
- (a) as the recommended architecture — operational cost (R1, R3, R5, R6) exceeds the migration saving (iteration 5, finding 5.5).

## 10. NEXT FOCUS

All 5 KQs are answered. The next step is the synthesis phase: compile `research.md` from the 5 iteration files into a single verdict-shaped report for the orchestrator's merge step.

<!-- MACHINE-OWNED: END -->

## 11. KNOWN CONTEXT (analyst-owned)

Verified facts available at init (from pre-run exploration of this repo; lanes should re-verify citations independently):

- The MCP server registers **37 tools across 5 registry files** under `.opencode/skills/system-spec-kit/mcp_server/tools/` (memory 16, context 1, causal 4, checkpoint 4, lifecycle 12).
- The launcher/daemon layer (`.opencode/bin/mk-spec-memory-launcher.cjs` + `lib/launcher-ipc-bridge.cjs` + `lib/launcher-session-proxy.cjs`) already speaks JSON-RPC over a unix socket (`daemon-ipc.sock`); the MCP-protocol-specific surface is the stdio transport + tool schemas + session-proxy replay classification.
- Daemon-resident services: local-first embedding cascade (ollama → hf-local → OpenAI → Voyage) with warm model server, chokidar file-watcher, async embedding retry queue, RSS watchdog with in-place recycle, owner-lease single-writer model.
- CLI prior art: `scripts/dist/memory/generate-context.js` (canonical save), plus reindex/cleanup/validate/backfill/rank maintenance CLIs.
- Operational evidence FOR de-MCP-ing: 2026-06-06 mid-session MCP disconnect (owner session closed; bridged secondary rode the ~41s reattach ladder, gave up, and Claude Code never reconnects MCP mid-session — 45 tools lost for the session). A per-call CLI would have re-bridged.
- Evidence AGAINST / costs: MCP gives agents automatic tool discovery + schemas + per-tool permission gating; hooks and agents across 4 runtimes currently call MCP tools directly.

## 12. RESEARCH BOUNDARIES

- Max iterations: 5 (per lane, terminal cap)
- Convergence threshold: 0 (forced full iteration budget; legal early stop only via all-questions-answered)
- Per-iteration budget: 12 tool calls, 10 minutes (default)
- Progressive synthesis: true
- Lane: cli-opencode, model `minimax-coding-plan/MiniMax-M3`, reasoning effort `high`, 1500s per-iteration ceiling
- Session id: `fanout-minimax-1780735927714-4462h3`
- Started: 2026-06-06T08:50:55Z
