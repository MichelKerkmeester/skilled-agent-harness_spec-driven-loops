---
title: "Cross-Launcher Lease Propagation — mk-code-index + mk-spec-memory"
description: "Mirror the 006 launcher-boundary single-writer lease pattern into mk-code-index-launcher.cjs and mk-spec-memory-launcher.cjs. Same multi-daemon smell, different SQLite files."
trigger_phrases:
  - "cross-launcher lease propagation"
  - "mk-code-index single writer"
  - "mk-spec-memory single writer"
  - "008/007 launcher lease"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/013-cross-launcher-lease-propagation"
    last_updated_at: "2026-05-18T07:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Filed packet for code-graph + spec-memory launcher lease"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast for implementation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/lib/"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-cross-launcher-lease-propagation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Single packet vs two — single packet, parallel propagation of the same pattern"
      - "Lease primitive — inline PID-file approach (neither launcher has its own lease.ts)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Cross-Launcher Lease Propagation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-concurrent-daemon-corruption-fix |
| **Successor** | None |
| **Handoff Criteria** | Both mk-code-index and mk-spec-memory launchers refuse duplicate-start when a live sibling holds the lease; spawn-twice test green on both; reference docs + changelog updated. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the 008-skill-advisor track, directly propagating Phase 6's launcher-boundary lease into the two sibling MCP launchers that have the same architectural smell. Investigation after 006 shipped found `mk_code_index` running 3 concurrent daemons and `mk-spec-memory` running 4. Both already had WAL + busy_timeout from day one, which is why they accumulated zero `.corrupt` files despite the racing — but they have the same "launcher does not refuse to start when a sibling is alive" smell. Fixing it eliminates ~7 zombie processes worth of resource cost and aligns the three launchers on one concurrency model.

**Scope Boundary** — only the two `.opencode/bin/mk-*-launcher.cjs` files, one ref doc each, one changelog, and tests under each skill's `mcp_server/tests/`. No DB schema, scorer, query, or context-server.js changes.

**Dependencies** — none. The 006 lease.ts module is skill-graph-specific (SQLite-backed lease) and is NOT reused; each launcher gets a small inline PID-file primitive. Intentional divergence so the two sibling skills do not gain new lib infrastructure they did not previously have.

**Deliverables**:
- `mk-code-index-launcher.cjs` exits cleanly on live-sibling detection (gated by `MK_CODE_INDEX_STRICT_SINGLE_WRITER`, default true).
- `mk-spec-memory-launcher.cjs` does the same (gated by `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER`, default true).
- Each launcher writes a `.<name>-launcher.json` file at startup with `{pid, startedAt}`. Cleans it on SIGTERM/SIGINT/normal exit.
- Spawn-twice integration tests added under each skill's `mcp_server/tests/`.
- Reference docs and `changelog/007-cross-launcher-lease-propagation.md`.

**Changelog**: `016-embedder-testing-and-architecture/changelog/013-cross-launcher-lease-propagation.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`mk_code_index` was running 3 concurrent launcher processes at the time of audit (PIDs 60648 1d 15h, 52517 1d 17h, 12919 8h elapsed). `mk-spec-memory` was running 4 (2 launcher + 2 context-server.js children). Each runtime that registers these MCP servers in its config (Claude Code via `.claude/mcp.json`, OpenCode via `opencode.json`, Codex via `.codex/config.toml`, Devin via global `devin mcp add`, VSCode, Gemini) spawns its own; none of the launchers refuses to start when a live sibling is detected. Both sets of daemons are racing the same SQLite files, but the WAL+busy_timeout combo absorbs the contention — zero `.corrupt` files generated on either. The visible cost is zombie processes (RSS, file descriptors, in-process cache divergence) and "which daemon answered" debugging confusion. The hidden cost is a latent failure window where, if the WAL+busy_timeout combo ever degrades under unusual load, both servers would skip directly into corruption-amplification with no defense.

### Purpose

Each of the two launchers becomes single-writer at the process boundary, mirroring what 006 just shipped for skill-advisor. Three launchers, one concurrency model, zero zombies after a fresh restart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Inline PID-file primitive in each launcher (write `.<name>-launcher.json` with `{pid, startedAt}`; check on startup; exit if a live sibling holds it).
- Env-var gate for each launcher (`MK_CODE_INDEX_STRICT_SINGLE_WRITER`, `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER`, both default `1`).
- Stale-PID reclaim — if the PID file lists a dead PID, log `staleReclaimed: true` and proceed.
- Cleanup hooks — delete the PID file on SIGTERM, SIGINT, and normal exit (`process.on('exit', ...)`).
- Tests — spawn-twice integration test under each skill's `mcp_server/tests/`.
- Reference doc — new `launcher-lease.md` under each skill's `references/`.
- Changelog entry — `016-embedder-testing-and-architecture/changelog/013-cross-launcher-lease-propagation.md`.

### Out of Scope

- Refactoring the bootstrap-lock mechanism — both launchers already have it (filesystem `.lockdir` + STALE_LOCK_MS reclaim for code-graph). It is complementary; do not touch it.
- Introducing a shared `lib/daemon/lease.ts` module across skills — too invasive; each launcher gets a small inline primitive.
- Tuning `busy_timeout` on spec-memory's varied DBs (1s on checkpoints, 5s on most, 10s on vector-index-store) — values are intentional per-DB.
- Touching `context-server.js` — the lease lives in the launcher; if the launcher exits before spawn, no child appears.
- Reusing skill-advisor's `lib/daemon/lease.ts` — it is SQLite-backed and skill-graph-specific; cross-skill import would couple things that should stay independent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Add PID-file check at top of `main()` before bootstrap lock + write+cleanup. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Same pattern. |
| `.opencode/skills/system-code-graph/references/launcher-lease.md` | Create | Document the PID-file lease + env-var override + stale-reclaim. |
| `.opencode/skills/system-spec-kit/references/launcher-lease.md` | Create | Equivalent for spec-memory. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Create | Spawn-twice test for code-graph launcher. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Create | Spawn-twice test for spec-memory launcher. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/changelog/013-cross-launcher-lease-propagation.md` | Create | Changelog entry. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | code-graph launcher refuses duplicate-start when live sibling exists | Spawn launcher #2 while #1 alive: #2 exits code 0 within 2s, prints `LEASE_HELD_BY:<pid>`, never opens code-graph.sqlite. |
| REQ-002 | spec-memory launcher refuses duplicate-start when live sibling exists | Same behavior for `mk-spec-memory-launcher.cjs` — exit before any child context-server.js spawn. |
| REQ-003 | Each launcher writes + cleans its PID file | `.mk-code-index-launcher.json` / `.mk-spec-memory-launcher.json` appears on bootstrap with `{pid, startedAt}` and is deleted on SIGTERM/SIGINT/exit. |
| REQ-004 | Stale PID reclaim | If the PID file lists a dead PID, new launcher reclaims with log `staleReclaimed: true`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Env-var dev override | `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0` and `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=0` disable the exit behavior (with a warning log). |
| REQ-006 | Tests added | New vitest `launcher-lease.vitest.ts` under each skill covers spawn-twice + stale-PID reclaim. |
| REQ-007 | Reference docs | New `launcher-lease.md` under each skill's `references/`. |
| REQ-008 | Changelog entry | `016-embedder-testing-and-architecture/changelog/013-cross-launcher-lease-propagation.md` documents the patch + upgrade notes (zero migration). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three launchers (skill-advisor + code-graph + spec-memory) consistently exit-on-held when a sibling holds the lease. Manual restart probe confirms.
- **SC-002**: 24-hour zombie audit — `ps aux | grep -E 'mk-(skill-advisor|code-index|spec-memory)-launcher'` shows at most 3 PIDs (one per launcher) regardless of how many runtimes are connected.
- **SC-003**: All three launchers share the same observable contract: env var gate + `LEASE_HELD_BY:<pid>` exit line + `staleReclaimed: true` log line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate dev-workflow breakage | Med | Env-var gate `MK_*_STRICT_SINGLE_WRITER=0` lets devs run parallel launchers intentionally for testing. |
| Risk | PID-file write race (two launchers start within milliseconds) | Low | The bootstrap lock (already in place) absorbs short windows. Lease check happens after the bootstrap lock so only one launcher writes the PID file at a time. |
| Risk | PID-file cleanup misses on SIGKILL | Med | Stale-PID reclaim handles this — next launcher sees the dead PID and overwrites. |
| Dependency | None | n/a | n/a |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the PID file include a heartbeat timestamp + age cutoff (like skill-advisor's sqlite-backed lease) to handle clock-skew edge cases? Lean no for v1 — `kill -0 <pid>` is the source of truth.
- Should both launchers share a single combined ref doc? Lean two separate so each skill's docs stay self-contained.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | How Verified |
|-----|--------|--------------|
| Launcher-exit latency on lease-held | <2 seconds | vitest timing assertion |
| PID-file write atomicity | Atomic rename (write to temp + rename) | code review + manual race test |
| Backward compat | All existing code-graph + spec-memory tests pass | `vitest --run` across both packages |
| Zombie count after fresh restart | 0 extras (one launcher per server) | 24-hour soak with all 6 runtimes connected |
| Cross-launcher behavioral parity | Same env var pattern + same `LEASE_HELD_BY:` line + same `staleReclaimed` log | Manual comparison + `grep -c 'LEASE_HELD_BY' .opencode/bin/mk-*-launcher.cjs` returns 3 |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Stale PID file with reused PID** — OS recycled the recorded PID. `kill -0` returns success, new launcher exits silently. Acceptable; operator can `rm` the PID file to recover.
- **Missing PID file** — no `.mk-*-launcher.json`. New launcher claims fresh, no exit.
- **Corrupt JSON in PID file** — new launcher treats as stale, logs `staleReclaimed: true` with reason `corrupt-pid-file`.
- **Concurrent spawn within ms** — bootstrap lock absorbs; only one writes the PID file. Other waits, sees the just-written PID, exits.
- **SIGKILL of running owner** — PID file lingers with dead PID. Next launcher reclaims via stale path.
- **Workspace move while launcher is running** — PID file path is relative to workspace root; moving the workspace invalidates the lease state. Operator removes stale files.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|------:|-----------|
| Lines of code | 60-120 | ~30 LOC of new logic per launcher × 2 + ~30 LOC test scaffolding × 2 |
| Files touched | 7 | 2 launchers + 2 ref docs + 2 tests + 1 changelog |
| Cross-skill blast radius | Low | Edits in 2 sibling skill folders, no shared module changes |
| Test surface | Medium | Spawn-twice tests for each launcher; can borrow the test scaffold from skill-advisor's `launcher-bootstrap.vitest.ts` |
| Reviewer hours | 1 | Single pass; logic is local and inline |
| Risk of regression | Low | New code path; gated by env var with default-true. Existing bootstrap-lock behavior untouched. |
<!-- /ANCHOR:complexity -->
