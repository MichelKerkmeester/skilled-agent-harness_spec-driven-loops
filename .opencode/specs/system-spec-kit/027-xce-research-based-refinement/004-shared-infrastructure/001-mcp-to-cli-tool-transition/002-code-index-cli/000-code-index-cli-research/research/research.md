# Deep Research: Code-Index CLI Feasibility (Synthesis)

- **Date:** 2026-06-06 · **Session:** `dr-20260606T135000-code-index-cli` · **Mode:** single cli-codex lane (gpt-5.5, reasoning high, service tier fast), forced 10 iterations
- **Outcome:** 1/1 lane succeeded, 10/10 iterations, 10/10 KQs answered, stopReason maxIterationsReached, newInfoRatio 1.00→0.22
- **Lane report (canonical detail):** `lineages/gpt/research.md` · registry: `lineages/gpt/deep-research-findings-registry.json`

---

## 1. Verdict

**GO — build a daemon-backed dual-stack CLI for `mk_code_index` with auto-spawn.** Same architecture class as the settled spec-memory design: a thin CLI over the existing daemon/IPC surface (launcher, owner lease, IPC bridge, readiness markers all unchanged), MCP registration kept through the dual-stack window.

**NO-GO — pure per-invocation CLI.** It would lose or reimplement the hardest runtime parts: lease ownership, stale-owner reclaim, IPC socket bridge, readiness state, secondary-client accounting, idle shutdown, dead-socket respawn, blocked-read envelopes, scan persistence, apply rollback.

## 2. Parity

**8/8 tools portable, 0 MCP-only** — provided the CLI is daemon-backed. Full matrix with file:line evidence in the lane report §2. Tool classes: state-daemon maintenance (`scan`, `verify`, `apply`), readiness-gated reads (`query`, `context`, `detect_changes`), stateless utility (`classify_query_intent`), status (`status`).

## 3. Prior-art transfer (vs the spec-memory record)

| Spec-memory decision | Transfers? |
|---|---|
| CLI-over-daemon + auto-spawn via existing launcher | YES — verbatim |
| Manifest codegen from canonical registry | YES — from `CODE_GRAPH_TOOL_SCHEMAS` |
| Exit map 0/1/64/69/75 | YES — plus blocked-read must never render as false success |
| **Zod reuse at argv** | **NO — does not transfer.** Code-index validation is hand-coded JSON-schema subset (`validateToolArgs()`) + dispatcher required-field checks; CLI must reuse those, not Zod |
| `--session-id` | PARTIAL — audit/provenance value only |
| Warm-only hook policy | YES — short socket dirs already pinned in all three runtime configs (`/tmp/mk-code-index`) |

## 4. System-specific findings

- **Blocked-read rendering is the top code-index-specific risk class**: `query`/`context`/`detect_changes` return `status: blocked` + `requiredAction` on non-fresh readiness — a CLI text renderer must preserve that, never emit a false empty success.
- **Maintenance-command footgun policy**: `apply` keeps its `--confirm` hard-stale gate; `scan`/`apply`/`verify` are explicit maintenance contexts, never prompt-time hook calls.
- **Integration surface MEASURED: ~51 files / 163 matching lines** (runtime configs, agents, deep commands, doctor routes, OpenCode plugin). Broad doc/history references belong to a future MCP-retirement packet.
- **Naming note**: plugin prefix `mk-code-graph` vs server key `mk_code_index` — document, do not rename in dual-stack.

## 5. Deltas and effort

**D1–D10** fully specified in the lane report §10 (shim, compiled CLI, all-8 manifest parity, validation parity, blocked-read rendering, exit taxonomy, timeout/hook policy, dual-client test, dual-spawn/respawn test, dist-freshness guard). Bottom-up effort: **6–9 engineering days** (8 tools vs spec-memory's 37, but scan/apply/readiness/lease tests are real work). Open implementation choice: command name (`code-index` recommended) and file placement.

<!-- ANCHOR:sources -->
## Sources

- Lane synthesis: `lineages/gpt/research.md` (file:line-cited across `mcp_server/tool-schemas.ts`, `handlers/*`, `lib/ipc/socket-server.ts`, `lib/owner-lease.ts`, `.opencode/bin/mk-code-index-launcher.cjs`, `launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`, runtime configs, doctor routes, plugin).
- Per-iteration evidence: `lineages/gpt/iterations/iteration-0{01..10}.md`.
- Orchestration: `orchestration-summary.json` (1/1 succeeded, 6.7 min), `orchestration-status.log`.
- Premise (settled prior art): `../../001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` §1–14.
<!-- /ANCHOR:sources -->
