# Deep Research: Memory MCP → CLI Feasibility (Merged Synthesis)

- **Date:** 2026-06-06 · **Session:** `dr-20260606T105055-fanout028` · **Mode:** 3-lane heterogeneous fan-out, forced 5 iterations per lane
- **Lanes:** deepseek (deepseek/deepseek-v4-pro, 9.6 min), minimax (minimax-coding-plan/MiniMax-M3, 40.7 min), mimo (xiaomi-token-plan-ams/mimo-v2.5-pro, 6.6 min) — all via cli-opencode, reasoning high
- **Outcome:** 3/3 lanes succeeded, 15/15 iterations, 5/5 KQs answered per lane with file:line evidence
- **Per-lane reports:** `lineages/{deepseek,minimax,mimo}/research.md` · merged registry: `deep-research-findings-registry.json` · attribution: `fanout-attribution.md`

---

## 1. Verdict

**YES — the mk-spec-memory MCP can be replaced by a CLI with zero feature loss, but ONLY if the daemon stays.** All three lanes independently confirmed: the MCP *protocol* layer (stdio transport, tool schemas, negotiation) provides no unique functionality — the daemon already speaks JSON-RPC over `daemon-ipc.sock`, and a CLI can drive the identical handler surface through the identical socket.

**Architecture decision — GO with (b)+auto-spawn (= a thin (c)):**

- All lanes: **(a) pure per-invocation CLI FAILS the zero-feature-loss bar** (loses the watcher, warm embedder, async queues, session state — 5–6 tools degraded, 3–5 services lost).
- All lanes: **(b) CLI over the existing daemon meets the bar exactly** — every tool, service, and affordance preserved; nothing about the daemon changes.
- Lane split on (b) vs (c): DeepSeek + MiMo recommend (b) plain ("the crash-loop guard already restarts crashes"); MiniMax recommends (c) ("auto-spawn is what actually prevents the 2026-06-06 incident class"). **Adjudication: MiniMax is right about the incident mode** — the crash-loop guard restarts a crashed *child*, but when the daemon's owner session exits cleanly the daemon goes away by design and nothing revives it until a new launcher connects. A CLI whose connect path falls back to spawning the launcher (exactly what every MCP client connect already does) closes that gap at ~1 day of marginal effort. (c) here is not a new architecture; it is (b) with the existing launcher used as the spawn path.

**Effort:** ~3 weeks center estimate (MiniMax: 13–16 days · DeepSeek/MiMo: 3–4 weeks). The CLI itself is a thin IPC adapter (~1,000 LOC). **Critical path (unanimous): OpenCode runtime support for registered shell tools with per-subcommand permission gating** — the only dependency outside this repo; mitigable with a 2–3 day CLI shim (MiniMax) or interim bare-shell allowlisting (DeepSeek/MiMo).

---

## 2. KQ1 — 37-Tool Parity Matrix (consolidated)

All 37 tools have CLI equivalents; **zero tools are MCP-only.** Consensus classification (lanes diverged only on `memory_ingest_start`):

| Class | Count (DeepSeek) | Count (MiMo) | Meaning |
|---|---|---|---|
| STATELESS | 22 | 22 | Pure DB read/write — trivially CLI-portable, daemon-free |
| STATE-EMBED | 10 | 9 | Needs embedding generation — portable with cold-embed latency (~100–500 ms) unless daemon keeps the embedder warm |
| STATE-WATCHER | 5 | 6 | Needs daemon-resident state (session context, job-queue process, watcher): `memory_ingest_status`, `memory_ingest_cancel`, `session_health`, `session_resume`, `session_bootstrap` (+ MiMo: `memory_ingest_start` async path) |
| MCP-ONLY | **0** | **0** | — |

MiniMax's complementary lens: **24/37 daemon-free, 13/37 soft-dependent, 0 hard-required in handler terms**, and **5 tools already have CLI ports today** (`generate-context.js` save; `cli.ts` stats/bulk-delete; `reindex-embeddings.js`; `validate-memory-quality.js`). Full 37-row tables: `lineages/deepseek/research.md` §3, `lineages/mimo/research.md` §3, `lineages/minimax/iterations/iteration-001.md`.

Proposed CLI shape (converged across lanes): `spec-memory <subcommand> --flags` (e.g. `spec-memory search --query "..." --limit 10`, `spec-memory session-bootstrap`, `spec-memory list-tools --format json`).

## 3. KQ2 — Daemon-Dependency Loss Table (consolidated)

| Service | (a) pure CLI | (b) CLI-over-daemon | (c) + auto-spawn |
|---|---|---|---|
| Warm embedder (ollama→hf→OpenAI→Voyage; 15–30 s cold start) | **LOST** | KEPT | KEPT (cold on spawn) |
| Chokidar file-watcher reindex | **LOST** | KEPT | KEPT (gap on restart) |
| Async embedding retry queue + enrichment drain | **LOST** | KEPT | KEPT (backlog on restart) |
| Async ingest job queue (process) | **LOST** | KEPT | KEPT |
| RSS watchdog + crash-loop reap | **LOST/N-A** | KEPT | KEPT |
| Session context (working memory, attention decay, dedup ~50% token savings, constitutional priming) | **LOST/ADAPTED** | KEPT | KEPT (brief loss on recycle) |
| FTS5 auto-heal, transaction recovery, shadow eval logging | **LOST** | KEPT | KEPT |

MiniMax negative-knowledge corrections (verified, adopted): **the single-writer lease is NOT daemon-resident** (interprocess mkdir lock by design) and **warm session briefs are NOT a RAM cache** (per-session SQLite rows) — both survive even architecture (a). This trims the true daemon-hard set to: warm embedder, watcher, queues/watchdog process, and live job/session processes.

**Tool availability:** (a) 31–32/37 → FAIL · (b) 37/37 → PASS · (c) 37/37 → PASS.

## 4. KQ3 — MCP-Only Affordances and Replacements

| Affordance | Replacement | Status |
|---|---|---|
| Tool-schema auto-discovery | `spec-memory list-tools --format json` (static manifest) + per-runtime `tools:`/allowlist registration | Ported |
| Per-tool runtime permissioning | Per-runtime: OpenCode `tools:` block / Claude Bash allowlist patterns / Codex `--approval-policy` / permissions-matrix.json | Ported (runtime-side work) |
| Zod boundary validation | Same Zod schema modules at the argv layer | Ported (reused) |
| `-32001` retryable + session-proxy replay | (b)/(c): existing proxy unchanged; (a): POSIX exit 75 EX_TEMPFAIL + client retry | Ported/Preserved |
| Auto-surface hooks / session priming | (b)/(c): daemon keeps running them; (a): **LOST** — explicit `spec-memory session-bootstrap` call required | Architecture-dependent |
| MCP per-session schema token overhead | Eliminated entirely | **NET GAIN** |

## 5. KQ4 — Integration-Surface Migration Map

Converged inventory: **~28–29 files, ~120–125 references.**

| Surface | Files | Refs | Effort | Risk |
|---|---|---|---|---|
| Agent allowed-tools (6 agent .md) | 6 | ~6–20 | <1 h | Low |
| Command YAML/markdown (memory/*, doctor/*, deep/*) | 16–19 | ~80–106 | 3–4 days (inline tool calls need CLI flag-syntax rewrite, not bare search-replace — MiniMax) | Low |
| **OpenCode runtime config (`opencode.json` `tools:` block)** | 1 | ~6 | **1–3 weeks (THE gate)** or 2–3 day CLI shim | **HIGH** |
| Runtime hooks / session priming / AGENTS.md | 2 | ~6 | <1 day | Medium |
| Doctor scripts (`mcp-doctor.sh`) | 1 | ~6 | ~1 h | Low |
| Deep-loop allowed-tools | 4 | ~10 | Low | Low |

## 6. KQ5 — Architecture Comparison and Scores

| Criterion | (a) | (b) | (c) |
|---|---|---|---|
| Tools preserved | 31–32/37 | 37/37 | 37/37 |
| Daemon services preserved | ~4/13 | all | all |
| Protocol affordances | loses auto-surface | all | all |
| Effort | ~60 h | ~85 h / 3–4 wk | +~1 day over (b) |
| Operational risk (incident class of 2026-06-06) | HIGH | LOW (daemon-down-until-demand remains) | LOWEST (auto-spawn closes it) |
| MiniMax weighted score | 0.45 | 0.92 | **0.97** |
| Zero feature loss? | **NO** | **YES** | **YES** |

**Merged recommendation: GO — build the CLI over the existing daemon/IPC socket, with connect-falls-back-to-spawn.** Keep launcher, IPC bridge, session proxy, context-server, and all 37 handlers unchanged. Ship behind a feature flag (default OFF), run dual-stack (MCP + CLI) for a deprecation window, then remove the MCP registration. Rollback is a 1–2 day revert (re-add the registration).

## 7. Consolidated Risk Register

| # | Risk | Sev | Arch | Mitigation |
|---|---|---|---|---|
| R1 | OpenCode lacks shell-tool permission gating (the gate) | HIGH | all | Feature request + 2–3 day CLI shim; interim Bash allowlisting |
| R2 | Daemon down until demand (owner exit) | MED | (b) | Auto-spawn fallback (adopting (c) retires this) |
| R3 | Cold-embed latency / timeouts | MED | (a) | N/A under (b)/(c) |
| R4 | Migration regressions (~125 refs incl. inline prompt-body tool calls) | LOW-MED | all | Phased migration, tests, dual-stack window |
| R5 | Stale search from watcher loss | MED | (a) | N/A under (b)/(c) |
| R6 | Concurrent CLI writers | LOW | (a) | WAL + existing interprocess locks (lease survives all archs) |
| R7 | Rollback risk | LOW | (b)/(c) | Feature flag, MCP registration revert |

## 8. Negative Knowledge (ruled out, with attribution)

- Pure CLI (a) as the answer — fails the bar (all lanes).
- Plain (c)-as-separate-architecture and plain (b)-without-spawn — collapsed into (b)+auto-spawn (orchestrator adjudication of the lane split).
- "11 maintenance CLIs ≈ broad parity evidence" — 10/11 are operational utilities, not tool substitutes (MiniMax).
- Single-writer lease / warm briefs as daemon-resident — interprocess mkdir lock / SQLite rows by design (MiniMax).
- Single-binary CLI framing — the system stays multi-process; the CLI is one entry point (MiniMax).
- Atomic migration — composable per-tool/per-runtime; only the OpenCode `tools:` gate is atomic (MiniMax).
- KQ1 parity alone as a zero-loss verdict — affordances (KQ3) had to be evaluated separately (MiniMax).

## 9. Implementation Sequencing (if accepted — MiniMax plan, adjusted)

| Phase | Work | Duration |
|---|---|---|
| 1 | CLI front-end: 37 subcommands + connect/spawn path over `daemon-ipc.sock` | ~5 days |
| 2 | Mechanical migration: agents, command YAMLs, AGENTS.md, doctor scripts (~125 refs) | 3–4 days |
| 3 | OpenCode runtime `tools:` gate (or CLI shim) | 2–3 days (shim) / 1–3 wk (upstream) |
| 4 | Auto-spawn fallback + "MCP"→"IPC" naming hygiene | 1–2 days |
| 5 | Test + verify; ship behind feature flag (default OFF) | 2–3 days |
| 6 | Dual-stack monitoring window → default ON → remove MCP registration | 1–2 weeks elapsed |

## 10. Lineage Attribution and Independence

| Lane | Verdict | Independence | Distinct contributions |
|---|---|---|---|
| deepseek | GO (b) | **Independent** (ran first, concurrent with minimax) | 3-class tool taxonomy; 13-service loss table; affordance ports incl. EX_TEMPFAIL mapping; risk register |
| minimax | GO (c) | **Independent** (concurrent with deepseek) | 5 already-ported tools; lease/briefs debunks; per-runtime affordance matrix; S3 gate + shim; weighted scoring; sequencing plan; incident-mode argument for auto-spawn |
| mimo | GO (b) | **DeepSeek-informed** — its report explicitly compares to "the DeepSeek lane" (it read the sibling lineage dir; no read-exclusion was configured for sibling lanes). Treated as verification + refinement of deepseek, not independent replication | `ingest_start` reclassification (STATE-EMBED→async caveat → 6 STATE-WATCHER); independent citation re-verification |

Methodological note for future fan-outs: sequentially-pooled lanes can read earlier lanes' outputs unless lineage dirs are excluded in the prompt — concurrency ≠ isolation. (Consistent with the 018 fan-out-diversity experiment: heterogeneity's value here was exactly adjudication — the (b)-vs-(c) split and MiniMax's debunks — not raw coverage.)

## 11. Convergence Report (merged)

| Lane | Iterations | Stop reason | KQs | newInfoRatio trend |
|---|---|---|---|---|
| deepseek | 5/5 | maxIterationsReached | 5/5 | flat 1.0 (orthogonal KQ-per-iteration design) |
| minimax | 5/5 | maxIterationsReached + all-questions-answered | 5/5 | 0.95→0.50 (rolling avg 0.66) |
| mimo | 5/5 | maxIterationsReached | 5/5 | flat 1.0 |

Forced-5 design held: no lane stopped early; convergence threshold 0 at root, terminal caps per lane.

## 12. Run 2 — CLI Back-End Design for Dual-Stack (2026-06-06)

Follow-up run per operator direction: 1 lane (cli-codex, `gpt-5.5`, reasoning xhigh, service tier fast), 3 forced iterations, 7.8 min, premise = this document's GO verdict. Full design: `cli-backend/lineages/gpt/research.md`.

**Design verdict:** build `spec-memory` as a daemon-backed dual-stack surface — compiled `mcp_server/spec-memory-cli.ts` behind a stable `.opencode/bin/spec-memory.cjs` shim. The CLI is just another IPC client: it reuses `getIpcSocketPath()` from the bridge, auto-spawns via `mk-spec-memory-launcher.cjs` on ENOENT/dead socket, **generates its 37 subcommands from the canonical `TOOL_DEFINITIONS`** (schema drift impossible by construction) with the existing Zod `validateToolArgs` at the argv boundary, renders `--format json|text|jsonl` (JSON canonical), and maps exits 0/1/64/69/**75 (retryable, incl. `-32001`)**.

**Coexistence (proven, not assumed):** the IPC bridge already serves multiple concurrent clients (existing vitest evidence); the owner lease stays the single-writer boundary; session continuity via `--session-id` forwarded into tool args (server already resolves identity from args/transport/`CODEX_THREAD_ID`). Non-goals locked: MCP registration stays, no migration of the ~125 references, no daemon bypass.

**Delivery:** 8 file-level changes (shim, CLI, generated manifest, package bin, 3 test suites incl. an all-37 parity extension and a dual-client MCP+CLI test, runtime allowlist `Bash(node .opencode/bin/spec-memory.cjs *)`), risk register topped by daemon-bypass and schema-drift (both mitigated structurally). **Effort: 8–12 engineering days.**

## 13. Run 3 — Risk Resolution Matrix (2026-06-06): CLEARED FOR IMPLEMENTATION

Convergence-driven run (cap 20, threshold 0.05): deepseek-risk stopped at **3/20** (`all-questions-answered`, 12/12 incl. discovered RQ4a), mimo-risk at **5/20** (`allQuestionsClassified`, 11/11). **Escalation gate NOT triggered** — zero unresolved items. Full lane reports: `risk-resolution/lineages/{deepseek-risk,mimo-risk}/research.md`.

| RQ | Risk | deepseek | mimo | **Adjudicated** |
|---|---|---|---|---|
| 1 | Daemon-bypass enforcement | RESOLVED | RESOLVED | **RESOLVED** — public CLI is IPC-only (`SPECKIT_BACKEND_ONLY`), socket 0o600 + uid + symlink rejection; admin DB paths separate |
| 2 | Schema round-trip ×37 | RESOLVED | RESOLVED | **RESOLVED** — codegen from `TOOL_DEFINITIONS` feasible for all 37; ~7 complex tools use `--json` escape |
| 3 | Lease/spawn races | MITIGATED | RESOLVED | **MITIGATED** — triple-lock (bootstrap/owner-lease/respawn) + re-read CAS proven; delta: dual-simultaneous-spawn test |
| 4 (+4a) | Retryable taxonomy | RESOLVED | RESOLVED | **RESOLVED** — full exit map (75 = -32001/SQLITE_BUSY/conn-fail; 69 = protocol-mismatch/terminal; 64 usage; 1 runtime); discovered RQ4a protocol-version-drift → fail-closed 69 |
| 5 | Hook latency budget | MITIGATED | RESOLVED | **MITIGATED** — warm path <1ms fits all hook ceilings (Claude ~1.8s, Codex ~3s); cold path 1–60s exceeds prompt-time hooks → warm-only there, cold reserved for SessionStart/cron; deltas: `--timeout-ms`, stale-while-revalidate |
| 6 | Per-call overhead | RESOLVED | RESOLVED | **RESOLVED (measured ×2)** — node start 40–45ms, IPC RTT 0.48ms → ~50ms warm / ~150ms cold; original estimate validated at its low end |
| 7 | Session identity | RESOLVED | RESOLVED | **RESOLVED** — `--session-id` → `args.sessionId` → same 4-layer resolution as MCP; runtime-agnostic |
| 8 | Build/activation drift | RESOLVED | MITIGATED | **MITIGATED** — launcher build-check covers spawn; delta: dist-freshness check in the shim (warn + exit 69) |
| 9 | Dual-client load | RESOLVED | RESOLVED | **RESOLVED** — bridge serves 8 concurrent clients (test-proven); lease = single-writer boundary; delta: dual-client vitest as belt-and-suspenders |
| 10 | Effort estimate | MITIGATED | RESOLVED | **CONSOLIDATED: 10–13 engineering days** (CLI + all deltas); +2–3d if the OpenCode shim is wanted; migration excluded |
| 11 | Platform/socket | MITIGATED | RESOLVED | **MITIGATED** — default socket path ~105 chars is marginally over macOS's 104 sun_path limit; shim must pin a short `SPECKIT_IPC_SOCKET_DIR` (runtime already pins `/tmp/mk-spec-memory`); TCP fallback exists; Windows = explicit non-goal |

**Classification totals:** 7 RESOLVED · 4 MITIGATED · 0 ACCEPTED · **0 UNRESOLVED** · 2 DEFERRED out-of-scope items with named owners: the OpenCode `tools:` permission gate (upstream; only needed post-dual-stack) and the ~125-reference migration (future packet; dual-stack non-goal).

**Design deltas the implementation packet MUST absorb (8, ~2–2.5 days, inside the 10–13d):** D1 dual-simultaneous-spawn vitest · D2 dual-client MCP+CLI vitest · D3 `--session-id` flag wiring · D4 `--timeout-ms` for hook-aware callers · D5 exit-69 recovery documentation · D6 short-socket-dir handling in the shim · D7 heartbeat self-shutdown verification on the CLI-spawn path · DD-001 dist-freshness check in the shim.

**Verdict: cleared for implementation.** Both lanes independently conclude no blockers remain for the dual-stack CLI.

<!-- ANCHOR:sources -->
## Sources

- Per-lane syntheses: `lineages/deepseek/research.md`, `lineages/minimax/research.md`, `lineages/mimo/research.md` (each citing 30+ file:line anchors across `mcp_server/tools/*`, `mcp_server/handlers/*`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/launcher-{ipc-bridge,session-proxy}.cjs`, `opencode.json`, agents/commands/doctor surfaces).
- Per-iteration evidence: `lineages/*/iterations/iteration-00{1..5}.md` (15 files).
- Merged findings registry: `deep-research-findings-registry.json` (18 findings, minimax registry; deepseek/mimo findings carried in their research.md syntheses — registry coverage 1/3 lanes noted in `fanout-attribution.md`).
- Orchestration: `orchestration-summary.json` (3/3 succeeded), `orchestration-status.log`.
- Run 2 (CLI back-end design): `cli-backend/lineages/gpt/research.md` + `cli-backend/lineages/gpt/iterations/iteration-00{1..3}.md` + registry; orchestration: `cli-backend/orchestration-summary.json` (1/1 succeeded).
- Run 3 (risk resolution): `risk-resolution/lineages/{deepseek-risk,mimo-risk}/research.md` + iterations; merged registry (15 findings, deepseek lane; mimo findings carried in research.md) + `risk-resolution/fanout-attribution.md`; orchestration: `risk-resolution/orchestration-summary.json` (2/2 succeeded). Host measurements: node startup 40–45ms, IPC RTT 0.48ms (darwin/arm64, 2026-06-06).
<!-- /ANCHOR:sources -->
