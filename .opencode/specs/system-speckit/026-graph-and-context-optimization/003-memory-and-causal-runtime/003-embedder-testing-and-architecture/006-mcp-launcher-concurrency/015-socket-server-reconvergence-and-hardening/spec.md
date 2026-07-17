---
title: "Feature Specification: socket-server reconvergence + spec-memory hardening"
description: "Level spec-memory's IPC socket-server.ts UP to the race-safe + security-hardened bridge contract, consolidate the three drifted copies behind one shared module (hybrid: shared import for spec-kit + advisor, byte-identical + drift-check for code-index), and add TOCTOU-race + probe-no-spawn regression tests. Follow-up to 014."
trigger_phrases:
  - "socket-server reconvergence"
  - "spec-memory socket hardening"
  - "shared ipc socket-server module"
  - "socket-server drift check"
  - "consolidate socket-server copies"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening"
    last_updated_at: "2026-06-04T22:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + reviewed (Opus pair); GO verdict"
    next_safe_action: "Activates on daemon restart; optional commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
---
# Feature Specification: socket-server reconvergence + spec-memory hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Implements the deferred follow-ups recorded in `014-launcher-overlap-spawn-and-bridge-fix` §7 and the research packet `027`: bring the weakest IPC `socket-server.ts` copy up to the hardened contract and stop the three copies from drifting again. Implemented by an Opus implementation sub-agent and independently verified by an Opus review sub-agent (GO, zero P0/P1).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Implemented + reviewed (GO); activates on daemon restart |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | `014-launcher-overlap-spawn-and-bridge-fix` (race-safe fix); `012` (built the bridge, deferred consolidation) |
| **Research** | `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After 014, the IPC bridge `socket-server.ts` existed in three drifted copies. The code-index + skill-advisor copies were race-safe + security-hardened, but **the spec-memory copy was the oldest and weakest**: it unconditionally unlinked on EADDRINUSE (no `canUnlinkExistingSocket` fence) and had no allowed-root/dir-ownership hardening — a latent socket-hijack exposure on shared hosts. The three copies also had no guard against future drift (012's deferred D-001).

### Purpose

Level the spec-memory copy UP to the full hardened + race-safe contract, consolidate the shared bridge logic so the security contract cannot drift between services, and lock the behavior with regression tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A canonical shared bridge module `@spec-kit/shared/ipc/socket-server.ts` carrying the union (race-safe fence + dir-ownership hardening + the TCP retry helper).
- spec-kit + skill-advisor `socket-server.ts` → thin re-exports of the shared module.
- code-index `socket-server.ts` → byte-identical local copy + a drift-check test (it has no `@spec-kit/shared` coupling — forcing the dep is the 012 deferral).
- A structural `McpServerLike` type so each package's separate MCP-SDK install satisfies `createServer`.
- Tests: TOCTOU race regression + probe-no-spawn assertion.

### Out of Scope

- Fully importing the shared module into code-index (requires adding the `@spec-kit/shared` dep + install; deferred — drift-check guards parity meanwhile).
- The pre-existing macOS/Node-25 `security-hardening.vitest.ts` EINVAL quirk and an orthogonal advisor shared-embeddings test failure (both pre-existing, unrelated).
- Daemon recycling / deploy (activates on next restart).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | spec-memory levelled up | spec-memory bridge carries the race-safe `canUnlinkExistingSocket` fence (allowed-root + isSocket + same-uid; ENOENT→reclaimable) + dir-ownership/mode hardening; TCP retry helper preserved |
| REQ-002 | Drift stopped | spec-kit + advisor import one canonical module; code-index copy is byte-identical with a drift-check test that fails on divergence |
| REQ-003 | Security not weakened | foreign-node/non-socket/foreign-uid refusals intact in all copies; never permissive (verified by review + diff) |
| REQ-004 | Builds + tests green | all affected packages build (tsc exit 0); new TOCTOU + probe tests pass; pre-existing failures confirmed unrelated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four packages build (shared, code-index, advisor, spec-kit mcp_server) exit 0.
- **SC-002**: New tests pass (TOCTOU race: 2; drift-check: 1; probe-no-spawn: 3); the security fence is a net hardening for spec-memory (review-confirmed).
- **SC-003**: Independent review verdict GO with zero P0/P1; scope clean (no deletions, allowed paths only).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Consolidation could regress a daemon's bridge load | secondary sessions wedge | All builds verified; each daemon loads from its own dist; re-exports are API-faithful (review item 4) |
| Risk | Inlined containment check diverges from the original | security hole | Review item 2 proved `isWithinRoot` ≡ `isWithinWorkspace` |
| Risk | code-index copy drifts from canonical | silent inconsistency | drift-check test fails on any divergence |
| Dependency | Activation requires daemon restart (new dist) | delayed effect | Documented; lands with the 014 fix on next reconnect |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Finish code-index unification (add the `@spec-kit/shared` dep + install) in a future packet — the `McpServerLike` change already removed the SDK type-identity blocker; only module resolution/symlink work remains.
- An orthogonal pre-existing advisor failure (`@spec-kit/shared/embeddings` dist `MANIFESTS.length=1`, 29 tests) was observed during review — worth a separate look; unrelated to this packet.
<!-- /ANCHOR:questions -->
