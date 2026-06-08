---
title: "Freshness Contract"
description: "Formal contract for advisor freshness: trust states, transition rules, consumer obligations, daemon responsibilities plus failure modes."
trigger_phrases:
  - "freshness contract"
  - "advisor freshness"
  - "trust state contract"
  - "daemon contract"
importance_tier: "important"
---

# Freshness Contract

Formal contract for advisor freshness: trust states, transition rules, consumer obligations, daemon responsibilities plus failure modes.

---

## 1. OVERVIEW

### Purpose

Defines advisor freshness trust states, transitions, caller obligations, daemon duties and failure modes.

### When to Use

- Interpreting `live`, `stale`, `absent` or `unavailable` advisor states.
- Deciding whether to use, rebuild or fall back from an advisor result.
- Debugging watcher, cache or rebuild behavior.

### Core Principle

Callers must treat freshness as part of the routing contract, not as diagnostic decoration.

### Key Sources

- `mcp_server/lib/freshness/`
- [`daemon_lease_contract.md`](./daemon_lease_contract.md)
- [`tool_ids_reference.md`](./tool_ids_reference.md)

---

## 2. TRUST STATE VOCABULARY

The advisor reports one of four trust states in every response that touches the skill graph:

| State | Meaning |
|---|---|
| `live` | The index is fresh. Source SKILL.md plus graph-metadata.json files have not changed since the last build. The recommendation reflects current skill state. |
| `stale` | The index is queryable but source files have changed since the last build. The recommendation may be wrong for skills modified after the last generation bump. |
| `absent` | The index is missing. The SQLite database file does not exist or was deleted. No recommendation can be computed. |
| `unavailable` | The advisor subsystem cannot be reached. Either the MCP server is down, the daemon failed or a hard error blocks all reads. |

State source-of-truth: `mcp_server/lib/freshness/trust-state.ts` plus `mcp_server/lib/freshness/freshness-detector.ts`.

---

## 3. STATE TRANSITIONS

Trust states transition based on three signals: a generation counter, a source-file hash check, plus daemon health.

```text
              [build complete]
                    |
                    v
              +---------+
              |  live   |
              +---------+
                | ^
[source        | |  [advisor_rebuild succeeds]
 file change   | |
 detected]     | |
               v |
              +---------+
              | stale   |
              +---------+
                | ^
[db file       | |  [advisor_rebuild succeeds]
 deleted]      | |
               v |
              +---------+
              | absent  |
              +---------+

[any state] --[mcp server down OR daemon crash]--> [unavailable]
```

Trigger details:

- `live → stale`: daemon detects a hash mismatch on any `.opencode/skills/*/SKILL.md` or `graph-metadata.json` file.
- `stale → live`: `advisor_rebuild` completes successfully plus the generation counter advances.
- `live → absent`: SQLite database file is deleted or fails integrity check.
- `absent → live`: `advisor_rebuild` runs from scratch plus succeeds.
- `* → unavailable`: MCP server connection refused, daemon process not running or unrecoverable internal error.
- `unavailable → *`: subsystem recovers, fresh `advisor_status` call returns a real state.

---

## 4. CONSUMER OBLIGATIONS

Every caller that uses an advisor response must inspect `trustState` plus act accordingly:

| Caller Type | live | stale | absent | unavailable |
|---|---|---|---|---|
| Hook adapter (Claude, Codex, OpenCode) | Use recommendation directly | Use with caveat, log staleness | Skip recommendation, defer to keyword matching against `trigger_phrases` | Skip recommendation, fall back to Python shim |
| MCP client (direct call) | Use recommendation directly | Call `advisor_rebuild` first if confidence matters | Call `advisor_rebuild`. Do not act on empty result | Wait for subsystem recovery or use Python shim |
| Python shim (`skill_advisor.py`) | Use native response | Pass through with stale annotation | Compute fallback locally | Compute fallback locally |
| Validation harness (`advisor_validate`) | Run as configured | Trigger rebuild before measurement | Trigger rebuild before measurement | Fail the validate run with clear error |

The caller must NOT:

- Cache the trust state across calls. Always inspect the current response.
- Silently use a `stale` result as if it were `live`.
- Treat `absent` as "no skill matches" and route to default. Always call `advisor_rebuild`.
- Retry `unavailable` aggressively. Wait at least 5 seconds between retries.

---

## 5. DAEMON RESPONSIBILITIES

The freshness daemon (`mcp_server/lib/daemon/`) is responsible for:

- Watching `.opencode/skills/*/SKILL.md` plus `.opencode/skills/*/graph-metadata.json` for mtime changes.
- Recomputing the source-hash signature on any watched-file change.
- Bumping the generation counter when the signature changes.
- Invalidating the prompt cache when the generation bumps.
- Announcing the new generation to subscribers via `advisor_status` response metadata.
- Holding a single-writer lease (`mcp_server/lib/daemon/lease.ts`) so concurrent advisor processes do not race on the SQLite file.

The daemon is NOT responsible for:

- Rebuilding the index automatically. Only `advisor_rebuild` mutates the SQLite database.
- Validating skill content. Only `skill_graph_validate` checks edge integrity.
- Caching MCP responses across processes. Each MCP server process maintains its own cache.

---

## 6. FAILURE MODES

| Failure | Symptom | Recovery |
|---|---|---|
| Daemon dies | `advisor_status.daemon = "down"`, trustState may stay `live` until next file change but freshness detection lags | Restart the MCP server (`mk_skill_advisor` restarts the daemon on boot) |
| Lease contention | `advisor_rebuild` fails with lease-busy error | Wait for current rebuild to finish, then retry. If stuck, kill the process holding the lease |
| SQLite corruption | `advisor_status.trustState = "absent"` even after rebuild attempts | Delete `mcp_server/database/skill-graph.sqlite{,-wal,-shm}`, run `advisor_rebuild --force` |
| File watcher overflow (too many files) | Daemon stops detecting changes | Restart MCP server. Long-term: prune `.opencode/skills/` excludes |
| Cache poisoning (stale entry survives generation bump) | Recommendations return outdated skill names | Run `advisor_rebuild --force` to invalidate caches |
| Source-hash regression (rebuild succeeds but state stays stale) | trustState stays `stale` after `advisor_rebuild` | File a bug. The hash computation is broken |

---

## 7. RELATED

- [`tool_ids_reference.md`](./tool_ids_reference.md), `advisor_status` returns trustState, `advisor_rebuild` transitions stale → live.
- [`advisor_scorer.md`](../scoring/advisor_scorer.md), confidence calibration depends on trust state for some routes.
- [`db_path_policy.md`](../config/db_path_policy.md), where the SQLite file lives.
- [`feature_catalog/01--daemon-and-freshness/`](../../feature_catalog/01--daemon-and-freshness/), feature inventory for daemon + freshness components.
- [`manual_testing_playbook/05--auto-update-daemon/`](../../manual_testing_playbook/05--auto-update-daemon/), operator scenarios for daemon validation.
- `mcp_server/lib/freshness/`, trust-state source-of-truth.
- `mcp_server/lib/daemon/`, daemon implementation.
