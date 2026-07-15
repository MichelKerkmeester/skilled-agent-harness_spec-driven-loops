---
title: "Implementation Summary: sun_path socket-dir + stale-lease reclaim followups [template:level_1/implementation-summary.md]"
description: "Narrative summary of the retroactive packet capturing commit 9ae9a6f4e, the documentation alignment, and the operational lease-clear recipe used to recover."
trigger_phrases:
  - "011 implementation summary"
  - "sun_path workaround recipe"
  - "lease cleanup recipe"
  - "skill_graph_daemon_lease delete"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Retroactive packet authored; documentation aligned with shipped commit"
    next_safe_action: "Run strict validate; commit packet"
    blockers: []
    completion_state: "complete"
    key_files:
      - ".mcp.json"
      - "opencode.json"
      - ".gemini/settings.json"
      - ".codex/config.toml"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
---
# Implementation Summary: sun_path socket-dir + stale-lease reclaim followups

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete (Phases A-C); 1 follow-on advisory open |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `006-mcp-launcher-concurrency` |
| **Predecessor** | `010-multi-client-stdio-socket-bridge` |
| **Originating commit** | `9ae9a6f4e fix(mcp): pin SPECKIT_IPC_SOCKET_DIR to short /tmp paths to clear macOS sun_path limit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two distinct fixes were applied during a debugging session that began with codex failing to handshake 2-of-5 MCP servers (intermittently 3-of-5 with `mk-spec-memory` joining the failures). Both fixes had already been applied operationally before this retroactive packet was authored; this packet captures the work so resume / search / future maintainers see it as a tracked deliverable.

### Phase A — Runtime-config pin (shipped in commit `9ae9a6f4e`)

`SPECKIT_IPC_SOCKET_DIR` was added to three launcher entries (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`) in four runtime config files (`.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`), pinning each service to a short `/tmp/<service>` directory. The spec-memory entry also got a `_NOTE_SOCKET` block explaining the 104-char `sun_path` limit so future maintainers don't wonder why the env-var is set.

### Phase B — Documentation alignment (this packet's commit)

- `ENV_REFERENCE.md:181` — was labelled "Testing override". Re-described as **required on macOS** with a reference to the 104-byte `sun_path` limit.
- `references/memory/embedder_architecture.md:144` — was "can relocate the socket for tests". Re-described identically and now identifies the three pinned `/tmp/<service>` directories.

### Phase C — Operational recipe + arc-parent backfill (this packet)

- Documented the manual recipe used to recover the system (§3 below).
- Backfilled the arc parent: 6 missing phase-map rows (006-011) + 4 missing `children_ids` (005, 007, 010, 011) + `last_active_child_id` set to 011.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two failure modes were diagnosed and remediated in a single debugging session on 2026-05-20. The phase split mirrors the natural sequencing of the work:

1. **Phase A landed first as commit `9ae9a6f4e`** during the debugging session. Single config-only commit touching the 4 runtime files in lock-step — there was no point splitting it because the failure required all three launchers to be pinned at once for cold-start to succeed cleanly. Commit message captures the `sun_path` rationale so future bisects don't need to read this packet.
2. **Phase B ships in this packet's commit.** Two surgical doc edits (`ENV_REFERENCE.md:181`, `embedder_architecture.md:144`) plus the arc-parent backfill. Doc edits are independent of any code path; rollback is `git revert` on this commit.
3. **Phase C ships in this packet's commit.** Authoring the 5 packet docs + metadata; documenting the lease-clear recipe so it's reusable; capturing REQ-006 follow-on with concrete file/function pointers so the next packet can start from a clean brief.

The follow-on packet (`012-launcher-lease-reclaim-dead-pid`, proposed) is deliberately deferred — see `plan.md` §3 for the reasoning and scope sketch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:recipe -->
## OPERATIONAL LEASE-CLEAR RECIPE

Use when MCP handshake fails with `LEASE_HELD_BY:<pid>` after a non-clean shutdown of one of the runtimes.

**Precondition:** all MCP runtimes using these launchers must be stopped. Running this against a live daemon causes reclaim contention.

### 3.1 Kill any in-flight launcher processes
```bash
pkill -TERM -f "mk-spec-memory-launcher|mk-skill-advisor-launcher|mk-code-index-launcher|context-server" 2>/dev/null || true
sleep 2
# Survivors (stuck epoll): SIGKILL by PID.
```

### 3.2 Clear file-based pid leases (3 files)
```bash
rm -f .opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json
rm -f .opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json
rm -f .opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json
```

### 3.3 Clear SQLite daemon-lease rows (2 DBs — both locations matter)
```bash
sqlite3 .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph-daemon-lease.sqlite \
  "DELETE FROM skill_graph_daemon_lease;"
sqlite3 .opencode/skills/.advisor-state/skill-graph-daemon-lease.sqlite \
  "DELETE FROM skill_graph_daemon_lease;"
```

> **Why two locations:** the skill-advisor launcher historically wrote its lease DB into `.opencode/skills/.advisor-state/` and was later migrated to `.opencode/skills/system-skill-advisor/mcp_server/database/`. Both directories can hold a stale row.

### 3.4 Clear /tmp socket dropouts (defensive)
```bash
rm -f /tmp/mk-spec-memory/daemon-ipc.sock
rm -f /tmp/mk-skill-advisor/daemon-ipc.sock
rm -f /tmp/mk-code-index/daemon-ipc.sock
```

### 3.5 Restart the runtime
Codex / opencode / gemini / claude-code now cold-spawn the launchers; each binds its `/tmp/<service>/daemon-ipc.sock`, writes a fresh pid file, and inserts a live `skill_graph_daemon_lease` row.
<!-- /ANCHOR:recipe -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Env-var pin in runtime configs, not a default-path change in source
**Decision:** Set `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` in all 4 runtime configs rather than changing the default path inside `launcher-ipc-bridge.cjs`.
**Rationale:** Linux's `sun_path` limit (108 bytes) is typically enough for the canonical DB paths, so a hard-coded `/tmp` default would regress Linux behavior in subtle ways (different temp-dir semantics, multi-user collisions). The config override is the documented escape hatch and remains overridable per-environment.

### D-002: Document the recipe, defer the auto-reclaim fix
**Decision:** Capture the manual lease-clear recipe in this packet's §3, but defer the `process.kill(pid, 0)` revalidation to a follow-on packet.
**Rationale:** The robust fix touches 4 files with non-trivial test surface (PID-recycling race, ESRCH vs EPERM semantics, start-time fingerprinting). That warrants its own packet with its own review. The recipe restores cold-start in <30s, so the gap is recoverable without code changes.

### D-003: Backfill the arc parent's phase-map opportunistically
**Decision:** Update `006-mcp-launcher-concurrency/spec.md` to include rows for 006-011 (not just 011), and add 005/007/010 to `children_ids` (the existing list was stale).
**Rationale:** The arc parent already had drift from previous packets. Touching it for 011 was already in scope; fixing the in-flight drift in the same touch costs ~10 lines of doc text and leaves the arc consistent for /spec_kit:resume.

### D-004: Downgrade packet level from 2 to 1
**Decision:** Initially scaffolded as Level 2; downgraded to Level 1 after the strict validator surfaced expectations the L2 template enforces (e.g. `complexity` anchor on spec, `phase-deps`/`effort`/`enhanced-rollback` anchors on plan).
**Rationale:** This packet's actual change footprint is doc-only and small (LOC well under 100). Level 1's required anchor set matches the work; Level 2 would have demanded sections (NFR detail, edge-case matrix, complexity scoring) that don't apply to a retroactive doc packet.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Strict validate
```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups \
  --strict
# Expect: Exit 0
```

### Config presence
```bash
grep -l SPECKIT_IPC_SOCKET_DIR .mcp.json opencode.json .gemini/settings.json .codex/config.toml
# Expect: 4 paths
```

### Doc text
```bash
grep -n "required on macOS" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
grep -n "required on macOS" .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md
# Expect: ≥1 hit each
```

### Smoke (2026-05-20 session evidence)
```text
$ SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor node .opencode/bin/mk-skill-advisor-launcher.cjs <<< '{"jsonrpc":"2.0","id":1,"method":"initialize",...}'
[mk-skill-advisor-launcher] Skill graph daemon active=true
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"mk_skill_advisor","version":"0.1.0"}},...}

$ SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index node .opencode/bin/mk-code-index-launcher.cjs <<< '...'
[mk-code-index-launcher] ready: {...}
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"mk-code-index","version":"1.0.0"}},...}
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dead-PID auto-reclaim still required.** REQ-006 captures the underlying robustness gap. Until the follow-on ships, the operational recipe in §3 is the only recovery path.
2. **`/tmp/<service>` precondition is implicit.** mk-spec-memory's `socket-server.ts:102` does `fs.mkdirSync(..., recursive: true)` before binding; the other two launchers don't, so on a freshly-rebooted machine where `/tmp/mk-skill-advisor` doesn't exist yet, the launcher may fail at `listen()` with `ENOENT`. Captured for the same follow-on packet.
3. **Arc parent phase-map row for 011 lists Status=Complete with a "1 follow-on open" parenthetical.** This is slightly different from how earlier rows (001-005) record status — they don't carry a follow-on parenthetical because their follow-on packets (e.g. 003 → 005, 004 → 005) had already shipped. Future readers should treat "Complete (1 follow-on open)" as functionally equivalent to "Complete with a sibling-arc-debt pointer".
<!-- /ANCHOR:limitations -->
