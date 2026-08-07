---
title: "MCP Launcher: sun_path socket-dir pin + stale-lease reclaim followups"
description: "Pinned all three MCP launcher services to short /tmp socket paths to clear the macOS sun_path 104-byte limit. Corrected two doc files that mislabelled the env-var as a test hook. Documented the manual lease-clear recipe for stale-residue recovery."
trigger_phrases:
  - "sun_path socket dir pin"
  - "speckit_ipc_socket_dir runtime configs"
  - "stale skill_graph_daemon_lease cleanup"
  - "mcp handshake einval launcher fix"
  - "launcher lease clear recipe"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

After `010-multi-client-stdio-socket-bridge` shipped, codex could not complete the MCP handshake for `mk_skill_advisor` and `mk_code_index`, with `mk-spec-memory` failing intermittently as well. Two distinct root causes were found: the bridge launcher binds its IPC socket at the service's database directory by default, which resolves to 134+ characters on this workspace and exceeds the 104-byte macOS `sun_path` cap, causing `listen()` to return `EINVAL`. Separately, stale file-based pid locks and SQLite daemon-lease rows from prior non-clean shutdowns caused fresh launchers to refuse startup with `LEASE_HELD_BY:<dead-pid>`.

Three phases of remediation shipped. Phase A (commit `9ae9a6f4e`) added `SPECKIT_IPC_SOCKET_DIR` entries to all four runtime configs, pinning each service to a short `/tmp/<service>` directory to eliminate the overflow at cold start. Phase B corrected two documentation files that mislabelled the env-var as a testing override when it is a production prerequisite on macOS. Phase C authored this packet, documented the manual lease-clear recipe for future recovery. It also backfilled 6 missing phase-map rows and 4 missing `children_ids` in the arc parent.

### Added

- `SPECKIT_IPC_SOCKET_DIR` env-var entries in `.mcp.json`, `opencode.json`, `.gemini/settings.json` and `.codex/config.toml`, one per MCP service (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`)
- Operational lease-clear recipe in `implementation-summary.md` covering pid-lock files plus SQLite daemon-lease rows in both historical DB locations plus `/tmp` socket dropouts
- `_NOTE_SOCKET` block in the `mk-spec-memory` runtime config entries explaining the 104-char `sun_path` rationale for future maintainers

### Changed

- `ENV_REFERENCE.md` line 181: re-described `SPECKIT_IPC_SOCKET_DIR` from "Testing override" to "required on macOS" with a reference to the 104-byte `sun_path` limit
- `references/memory/embedder_architecture.md` line 144: same correction, now identifies the three pinned `/tmp/<service>` directories by name
- Arc parent `006-mcp-launcher-concurrency/spec.md`: backfilled 6 missing phase-map rows (006-011) and set `last_active_child_id` to 011
- Arc parent `graph-metadata.json`: appended 4 missing `children_ids` (005, 007, 010, 011)

### Fixed

- MCP handshake failure (`connection closed: initialize response`) for `mk_skill_advisor` and `mk_code_index` on macOS caused by `EINVAL` from a 134-char socket path exceeding the 104-byte `sun_path` limit
- Cold-start blocked by stale `LEASE_HELD_BY:<dead-pid>` after non-clean launcher shutdown, recoverable via the documented recipe until the dead-PID auto-reclaim follow-on ships

### Verification

| Check | Result |
|-------|--------|
| Config presence: `grep -l SPECKIT_IPC_SOCKET_DIR .mcp.json opencode.json .gemini/settings.json .codex/config.toml` | 4 paths returned (PASS) |
| Doc text: `grep -n "required on macOS" ENV_REFERENCE.md` | At least 1 hit (PASS) |
| Doc text: `grep -n "required on macOS" embedder_architecture.md` | At least 1 hit (PASS) |
| Smoke test on 2026-05-20: `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor node mk-skill-advisor-launcher.cjs` | Clean initialize response (PASS) |
| Smoke test on 2026-05-20: `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index node mk-code-index-launcher.cjs` | Clean initialize response (PASS) |

### Files Changed

| File | What changed |
|------|--------------|
| `.mcp.json` | Added `SPECKIT_IPC_SOCKET_DIR` for `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`. Added `_NOTE_SOCKET` block on `mk-spec-memory` entry (shipped in commit `9ae9a6f4e`). |
| `opencode.json` | Added `SPECKIT_IPC_SOCKET_DIR` for all three MCP services (shipped in commit `9ae9a6f4e`). |
| `.gemini/settings.json` | Added `SPECKIT_IPC_SOCKET_DIR` for all three MCP services (shipped in commit `9ae9a6f4e`). |
| `.codex/config.toml` | Added `SPECKIT_IPC_SOCKET_DIR` for all three MCP services (shipped in commit `9ae9a6f4e`). |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Line 181 re-labelled from "Testing override" to "required on macOS" with `sun_path` rationale. |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Line 144 corrected to identify the pinned `/tmp/<service>` directories. |

### Follow-Ups

- Implement dead-PID auto-reclaim in the daemon-lease path. The `skill_graph_daemon_lease` reclaim guard should call `process.kill(pid, 0)` before treating a row as "held". Proposed as a follow-on packet (REQ-006).
- Lift the `fs.mkdirSync(..., { recursive: true })` mkdir-on-listen pattern from `socket-server.ts:102` into `launcher-ipc-bridge.cjs` for `mk-skill-advisor` and `mk-code-index`. On a fresh boot those directories do not exist and `listen()` will fail with `ENOENT`.
