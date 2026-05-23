---
title: "Implementation Plan: sun_path socket-dir + stale-lease reclaim followups [template:level_1/plan.md]"
description: "Plan capturing already-shipped runtime-config fix (commit 9ae9a6f4e) plus this packet's doc-alignment + recipe + arc-parent updates, and identifying the follow-on packet for dead-PID lease reclaim."
trigger_phrases:
  - "011 plan"
  - "sun_path socket dir plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/011-sun-path-and-stale-lease-followups"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored for retroactive packet"
    next_safe_action: "Run strict validate"
    blockers: []
---
# Implementation Plan: sun_path socket-dir + stale-lease reclaim followups

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three-phase plan capturing the post-010 macOS handshake-failure work.

| Phase | What | Status |
|-------|------|--------|
| **A** | Pin `SPECKIT_IPC_SOCKET_DIR` to `/tmp/<service>` across 4 runtime configs | Shipped (`9ae9a6f4e`) |
| **B** | Correct env-var documentation in `ENV_REFERENCE.md` + `embedder_architecture.md` | Shipped in this packet's commit |
| **C** | Document the operational lease-clear recipe; backfill arc parent; capture REQ-006 as follow-on | This packet |
| D (follow-on) | Implement `kill(pid, 0)` revalidation in `skill_graph_daemon_lease` + mkdir-on-listen for the two non-spec-memory launchers | **Out of scope** — see §3 |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. **Strict validate exits 0** on this packet via `validate.sh --strict`.
2. **All 3 launchers cold-start** under the pinned env-var and return a clean `initialize` JSON-RPC response. Smoke-evidence captured in `implementation-summary.md` §5.
3. **`ENV_REFERENCE.md` + `embedder_architecture.md` doc text** mentions "required on macOS" and the 104-byte `sun_path` limit.
4. **No regressions to in-flight runtimes**: doc edits are surgical (one row each); config edits already on main were exercised by the operator session that produced this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Affected surfaces

- **4 runtime configs** (Claude Code's `.mcp.json`, OpenCode's `opencode.json`, Gemini CLI's `.gemini/settings.json`, Codex CLI's `.codex/config.toml`): each gains 3 `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` env entries, one per MCP launcher.
- **2 reference docs** under `system-spec-kit`: `mcp_server/ENV_REFERENCE.md:181` and `references/memory/embedder_architecture.md:144`.
- **1 arc parent** (`006-mcp-launcher-concurrency/spec.md` + `graph-metadata.json`): phase-map row for 011 plus backfill of 005, 007, 010 into `children_ids` (previous saves drifted).

### Surfaces explicitly NOT touched

- `.opencode/bin/lib/launcher-ipc-bridge.cjs` — only the docstring near `getIpcSocketPath` could plausibly need a comment; left untouched to avoid scope creep. Follow-on packet will revisit.
- `mcp_server/lib/ipc/socket-server.ts` — already does mkdir-on-listen for `mk-spec-memory`. The parity work for the other two launchers is the follow-on.
- `mcp_server/lib/daemon/lease.ts` — REQ-006's eventual home. Touching now would balloon scope.

### Deferred follow-on

**Title (proposed):** `012-launcher-lease-reclaim-dead-pid` under the same arc.

**Why deferred:** Implementing the proper fix would touch 4 files with non-trivial test surface (race conditions around PID recycling, EPERM vs ESRCH semantics, start-time fingerprinting on macOS vs Linux). That's a separate concern warranting its own evaluation.

**Recommended scope:**
1. `process.kill(pid, 0)` revalidation in `skill_graph_daemon_lease` reclaim — on `ESRCH`, delete the row and let the new launcher acquire.
2. Parity check for `.mk-*-launcher.json` reclaim across all 3 launchers.
3. Pull `fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 })` from `socket-server.ts:102` into `launcher-ipc-bridge.cjs` so it runs for `mk-skill-advisor` + `mk-code-index` too.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Runtime-config fix (already shipped)
- Edit `.mcp.json` block-by-block to add the 3 socket-dir entries with `_NOTE_SOCKET` on the spec-memory entry.
- Mirror into `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`.
- Verify with `grep -l SPECKIT_IPC_SOCKET_DIR`.

### Phase B — Documentation alignment (this packet's commit)
- Edit `ENV_REFERENCE.md:181`: replace "Testing override" wording with the "required on macOS" description that references the `sun_path` limit.
- Edit `embedder_architecture.md:144`: replace "can relocate the socket for tests" with the same correction.

### Phase C — Recipe + arc-parent updates (this packet)
- Author spec/plan/tasks/implementation-summary with canonical anchors and frontmatter continuity blocks.
- Author description.json + graph-metadata.json with `parent_id`, `manual.depends_on=[010]`, `related_to=[007]`, and `level=1`.
- Update arc parent's phase-map (`spec.md`) with rows for 006, 007, 008, 009, 010, and 011.
- Update arc parent's `children_ids` to include 005, 007, 010, 011 (the missing entries).
- Set arc parent's `last_active_child_id` to 011.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Strict validate | `validate.sh --strict` on packet | Exit 0 |
| Config presence | `grep -l SPECKIT_IPC_SOCKET_DIR` in 4 configs | 4 hits |
| Doc text | `grep -n "required on macOS"` in both docs | ≥1 hit each |
| Cold launcher smoke | spawn each of the 3 launcher binaries with `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` + a synthetic `initialize` JSON-RPC | Each prints a valid `initialize` response |
| Recipe replay | Apply the recipe, then re-spawn launchers | Cold-start succeeds in <30s |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: `010-multi-client-stdio-socket-bridge` introduced the bridge socket whose default path overflowed `sun_path`. This packet documents the fallout.
- **Sideways**: arc parent `006-mcp-launcher-concurrency` is the phase-parent control file; its `spec.md` phase-map and `graph-metadata.json` children-list need backfill.
- **Downstream**: proposed follow-on `012-launcher-lease-reclaim-dead-pid` (not yet created) inherits REQ-006 from this packet.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Runtime configs (`9ae9a6f4e`) | `git revert 9ae9a6f4e` — restores the pre-pin state. The MCP servers will then fail to handshake on macOS until a manual env-var is provided. |
| Doc text (this packet) | `git checkout HEAD~1 -- <doc-paths>` — restores the previous "Testing override" wording. Cosmetic only. |
| Arc parent updates | `git checkout HEAD~1 -- <arc-parent>/spec.md <arc-parent>/graph-metadata.json` — restores the pre-011 state with stale children list and missing phase-map rows. Cosmetic only. |
| Packet folder | `rm -rf 011-sun-path-and-stale-lease-followups/` — removes the retroactive doc. Index will re-mirror on next `memory_index_scan`. |
<!-- /ANCHOR:rollback -->
