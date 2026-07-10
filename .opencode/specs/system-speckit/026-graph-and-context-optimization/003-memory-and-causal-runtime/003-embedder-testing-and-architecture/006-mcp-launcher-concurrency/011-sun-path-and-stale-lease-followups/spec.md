---
title: "Feature Specification: sun_path socket-dir + stale-lease reclaim followups"
description: "Retroactive packet documenting the two post-010 MCP-handshake failures (macOS sun_path overflow + stale launcher-lease state) and the workarounds applied. Flags one open follow-on: dead-PID auto-reclaim in the daemon lease table."
trigger_phrases:
  - "sun_path socket dir followup"
  - "macOS daemon-ipc.sock einval"
  - "stale skill_graph_daemon_lease"
  - "mk-skill-advisor handshake failure"
  - "mk-code-index handshake failure"
  - "speckit_ipc_socket_dir runtime configs"
  - "launcher lease reclaim dead pid"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created retroactive packet documenting commit 9ae9a6f4e + the operational lease-clear recipe"
    next_safe_action: "Validate with strict mode and commit"
    blockers: []
    key_files:
      - ".mcp.json"
      - "opencode.json"
      - ".gemini/settings.json"
      - ".codex/config.toml"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
---
# Feature Specification: sun_path socket-dir + stale-lease reclaim followups

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Two post-010 MCP startup failures observed on macOS, plus the workaround applied and the one outstanding robustness gap that should follow.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (core fix shipped); 1 follow-on advisory open |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | `010-multi-client-stdio-socket-bridge` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After `010-multi-client-stdio-socket-bridge` shipped (`feat(016/006/010)` at `088cb82a0`), the codex runtime could not complete the MCP handshake for `mk_skill_advisor`, `mk_code_index`, and intermittently `mk-spec-memory`. Two distinct failure modes were observed:

1. **macOS `sun_path` overflow.** The bridge launcher binds its IPC socket at `<service-db-dir>/daemon-ipc.sock` by default. On this workspace, that resolves to paths 134+ characters long. macOS caps `struct sockaddr_un.sun_path` at **104 bytes**, so `listen()` fails with `EINVAL` and the launcher never reaches the MCP `initialize` response. `mk-spec-memory` survives only because its TypeScript socket-server runs an explicit `fs.mkdirSync(path.dirname(socketPath), { mode: 0o700 })` ahead of binding and the launcher's startup path is slightly different; the other two launchers don't.

2. **Stale lease residue across restarts.** Across launcher restarts, the file-based pid lock (`.mk-*-launcher.json`) and the SQLite daemon-lease row (`skill_graph_daemon_lease` table, in both `.opencode/skills/system-skill-advisor/mcp_server/database/` and `.opencode/skills/.advisor-state/`) ended up pointing at PIDs that had already exited. The current reclaim path treats "row present" as "lease held" without revalidating the PID, so codex's freshly-spawned launcher refuses to start and prints `LEASE_HELD_BY:<dead-pid>`.

### Purpose
1. Pin all three MCP services to short `/tmp/<service>` socket paths via `SPECKIT_IPC_SOCKET_DIR` in the four runtime configs so the macOS `sun_path` limit can never trip a cold start.
2. Correct the documentation for `SPECKIT_IPC_SOCKET_DIR` — it was previously labelled "Testing override" in `ENV_REFERENCE.md` and "can relocate the socket for tests" in `references/memory/embedder_architecture.md`. The env-var is now a production prerequisite on macOS, not a test hook.
3. Document the operational lease-clear recipe used to recover from the stale-residue case, and flag the underlying reclaim gap as a follow-on packet candidate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SPECKIT_IPC_SOCKET_DIR` entries in `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml` (shipped in commit `9ae9a6f4e`).
- `ENV_REFERENCE.md:181` description fix.
- `references/memory/embedder_architecture.md:144` description fix.
- Documenting the manual lease-clear recipe (this packet's `implementation-summary.md`).
- Updating the arc parent `spec.md` phase-map and `graph-metadata.json` children list to include this packet.

### Out of Scope
- **Auto-reclaim of dead-PID rows in the `skill_graph_daemon_lease` table.** The robust fix is a `process.kill(pid, 0)` revalidation before treating the row as "held"; this is captured as a follow-on packet under §7. Touching the lease-reclaim path now would balloon the scope.
- Changing the default socket path inside `launcher-ipc-bridge.cjs`. The env-var override is the documented escape hatch.
- Pre-creating `/tmp/mk-*` socket dirs in code. mkdir-on-listen lives inside `mcp_server/lib/ipc/socket-server.ts` for `mk-spec-memory`; the other two launchers can follow the same pattern in a separate packet if needed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.mcp.json` | Modify | Add `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` (shipped in `9ae9a6f4e`) |
| `opencode.json` | Modify | Same (shipped) |
| `.gemini/settings.json` | Modify | Same (shipped) |
| `.codex/config.toml` | Modify | Same (shipped) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Re-describe `SPECKIT_IPC_SOCKET_DIR` as macOS-required |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modify | Same correction |
| `006-mcp-launcher-concurrency/spec.md` | Modify | Append phase 011 (and backfill 005-010) to phase-map |
| `006-mcp-launcher-concurrency/graph-metadata.json` | Modify | Append missing children IDs |
| `011-sun-path-and-stale-lease-followups/` | Create | This packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pin `SPECKIT_IPC_SOCKET_DIR` to `/tmp/<service>` in all 4 runtime configs | `grep -l SPECKIT_IPC_SOCKET_DIR .mcp.json opencode.json .gemini/settings.json .codex/config.toml` returns 4 paths |
| REQ-002 | `ENV_REFERENCE.md` reflects macOS-required status, not "Testing override" | Description includes "required on macOS" and references the 104-char `sun_path` limit |
| REQ-003 | `references/memory/embedder_architecture.md` reflects same correction | Same wording present at the launcher-bridge section |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document the operational lease-clear recipe | `implementation-summary.md` lists the sqlite + filesystem cleanup commands and identifies the two lease DB locations |
| REQ-005 | Update arc parent `spec.md` + `graph-metadata.json` so resume/validate can see this child | Arc parent's phase-map includes the new row; `children_ids` includes the new packet path |

### P2 - Open (follow-on)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Auto-reclaim dead-PID rows in `skill_graph_daemon_lease` | Captured as a follow-on packet idea under §7 Open Questions; **deliberately not implemented here** |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cold codex startup from a clean lease state handshakes all 5 registered MCP servers without `EINVAL` or `LEASE_HELD_BY` errors. Verified manually on 2026-05-20 after committing `9ae9a6f4e` + clearing residue.
- **SC-002**: `ENV_REFERENCE.md` and `embedder_architecture.md` no longer describe `SPECKIT_IPC_SOCKET_DIR` as a testing override.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `/tmp/<service>` socket dir is not auto-created. On a fresh boot, `/tmp/mk-skill-advisor` may not exist. | Launcher fails at `listen()` with `ENOENT` instead of `EINVAL`. | mk-spec-memory's `socket-server.ts:102` already runs `fs.mkdirSync(...)`; same pattern should be lifted into `launcher-ipc-bridge.cjs` for the other two launchers (follow-on). Until then, the runtime configs implicitly assume `/tmp` is writable (universal on macOS/Linux). |
| Risk | Dead-PID rows in the SQLite daemon lease table block fresh launchers. | MCP handshake silently fails with `LEASE_HELD_BY:<dead-pid>`. | Documented operational recipe (see `implementation-summary.md`); permanent fix is REQ-006 follow-on. |
| Dependency | Linux `sun_path` is 108 bytes — slightly larger than macOS's 104, but still tight. | Same overflow could appear on Linux with deeply-nested checkouts. | Same `/tmp/<service>` pin works on Linux; no platform-specific branch needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `mk-skill-advisor-launcher.cjs` and `mk-code-index-launcher.cjs` adopt the same mkdir-on-listen pattern that `socket-server.ts:102` uses for `mk-spec-memory`? **PROPOSED: yes, as a follow-on packet (small surface, removes the `/tmp` precondition).**
- Should the daemon-lease reclaim path call `process.kill(pid, 0)` before honoring a `skill_graph_daemon_lease` row? **PROPOSED: yes, as REQ-006 follow-on. The current behavior of trusting the row indefinitely is the root cause of the second failure mode observed in §2.**
- Should we pre-create `/tmp/mk-*` directories at install time? **DEFERRED: the mkdir-on-listen follow-on solves this more cleanly.**
<!-- /ANCHOR:questions -->


Dispatch A correction: read-path liveness probing already exists in `lease.ts`; the remaining follow-on is acquisition-time stale-owner reclaim semantics, not another passive liveness probe.
