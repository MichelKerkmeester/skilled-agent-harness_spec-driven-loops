---
title: "Implementation Summary: socket-server reconvergence + hardening"
description: "Levelled spec-memory's IPC bridge UP to the race-safe + security-hardened contract, consolidated the 3 drifted socket-server.ts copies behind one shared module (hybrid), added TOCTOU + probe-no-spawn tests. Built by an Opus implement sub-agent, independently verified GO by an Opus review sub-agent."
trigger_phrases:
  - "socket-server reconvergence implementation summary"
  - "spec-memory hardening done"
  - "shared ipc socket-server consolidation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening"
    last_updated_at: "2026-06-04T22:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + reviewed (Opus pair); GO; first-hand re-verified"
    next_safe_action: "Activates on daemon restart; optional commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
---
# Implementation Summary: socket-server reconvergence + hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implemented + reviewed (GO); activates on daemon restart |
| **Date** | 2026-06-04 |
| **Built by** | Opus implementation sub-agent |
| **Reviewed by** | Opus review sub-agent (independent, adversarial) + orchestrator first-hand re-run |
| **Diff** | 146 insertions / 589 deletions across 3 `socket-server.ts` (net de-duplication) + 1 new shared module (402 LOC) + 3 new tests (402 LOC) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Canonical shared bridge module
`@spec-kit/shared/ipc/socket-server.ts` — the union contract: race-safe `canUnlinkExistingSocket` (allowed-root + isSocket + same-uid refusals; ENOENT → reclaimable, never throw-to-abort), the mkdir dir-ownership/mode hardening, the TCP retry helper (`retryTcpListenAfterEaddrInUse`), an inlined containment check (`isWithinRoot`, equivalent to the original `isWithinWorkspace`), and a structural `McpServerLike { connect(transport): Promise<void> }` type so each package's separate MCP-SDK install satisfies `createServer`.

### Consumers wired (hybrid)
- `system-spec-kit/mcp_server/lib/ipc/socket-server.ts` and `system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` → thin re-exports of the shared module. This LEVELS spec-memory UP — its copy previously had no fence (unguarded `unlinkSync`) and no allowed-root check.
- `system-code-graph/mcp_server/lib/ipc/socket-server.ts` → byte-identical local copy (it has zero `@spec-kit/shared` coupling), guarded by a drift-check test.

### Tests
- `ipc-socket-toctou.vitest.ts` — TOCTOU race regression (real EADDRINUSE→reclaim + mocked-ENOENT survivor; avoids the macOS regular-file EINVAL quirk).
- `ipc-socket-drift.vitest.ts` — fails if code-index's copy diverges from canonical.
- `model-server-demand-probe.vitest.ts` — probe-no-spawn: `x-speckit-probe: liveness` → no `launch()`; no marker → spawn path reached.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The user directed implementation via Opus sub-agents (after gpt-5.5 became OpenAI-quota-blocked across codex + opencode). An Opus implementation sub-agent (loaded `sk-code`, scoped to allowed write paths, banned destructive/git ops) built all three tasks + ran builds + tests. An Opus review sub-agent then independently re-ran every build + the relevant suites and traced the security fence, the inlined containment equivalence, the structural typing, re-export fidelity, module-state safety, and byte-identity — returning **GO (zero P0/P1)**. The orchestrator re-ran the new tests first-hand. No git/daemon/MCP mutations; all edits left in the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Hybrid consolidation (shared import for 2; byte-identical + drift-check for code-index)
code-index has zero `@spec-kit/*` coupling and a single-project `tsconfig` (`verbatimModuleSyntax`); importing `@spec-kit/shared` empirically fails `TS2307` without adding the dep + `npm install` (the exact 012 deferral). Per the fallback, code-index keeps a byte-identical copy with a drift-check test. spec-kit + advisor (which already resolve `@spec-kit/shared`) import the canonical module.

### D-002: Level spec-memory UP, never permissive
spec-memory's copy was the weakest (unguarded unlink, no allowed-root check). It is brought up to the full hardened race-safe contract — NOT down to permissive. The foreign-node/non-socket/foreign-uid refusals are preserved everywhere (review-confirmed net hardening).

### D-003: Structural `McpServerLike` instead of a concrete `Server` import
The three daemons each install `@modelcontextprotocol/sdk` separately; private members make the `Server` classes nominally distinct, so a concrete import would reject across package boundaries (`TS2322`). Typing `createServer` against a method-bearing structural interface (bivariant param) lets every package satisfy it with its own SDK copy. Runtime behavior unchanged (only `.connect()` is called).

### D-004: Level 1
The net source change is a de-duplication (−443 lines); the new logic is the spec-memory hardening + the type + the tests. Decision rationale captured here rather than a separate decision-record.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Builds (dependency order, all exit 0)
`@spec-kit/shared`, `system-code-graph`, `system-skill-advisor/mcp_server`, `system-spec-kit/mcp_server` — re-run independently by the review sub-agent.

### Tests
- New (orchestrator first-hand re-run): code-index `ipc-socket` (toctou + drift + resolve) = 5 passed; `model-server-demand-probe` = 3 passed.
- Existing socket/ipc/launcher-ipc-bridge suites: passed (launcher-ipc-bridge is a pre-existing source-level `describe.skip`).
- Security fence: `shared/ipc/socket-server.ts` refusals at allowed-root, non-socket, foreign-uid; ENOENT branches short-circuit only a genuinely-vanished node (review-traced).
- Comment hygiene: zero violations on all 7 `.ts`; sk-code alignment-drift PASS.
- Scope: 0 deletions; only the 3 `socket-server.ts` + 3 tests + the new shared module changed.

### Independent review verdict
**GO — zero P0, zero P1.** One P2 (an unrelated `AGENTS.md` doc edit from a concurrent session rides in the working tree; deliberately excluded from this packet's scope).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- code-index is NOT yet importing the shared module (byte-identical copy + drift-check by design — the 012 deferral). A future packet can finish the unification by adding the `@spec-kit/shared` dep + install; the `McpServerLike` change already removed the SDK type-identity blocker, leaving only module-resolution work.
- Activation requires a daemon restart (new dist); it lands with the 014 fix on the next `/mcp` reconnect or fresh session — not live in-session.
- A pre-existing macOS/Node-25 `security-hardening.vitest.ts` failure (regular-file `listen()` → EINVAL not EADDRINUSE) and an orthogonal advisor `@spec-kit/shared/embeddings` (`MANIFESTS.length=1`, ~29 tests) failure were both observed and traced to causes unrelated to this packet; left as-is.
<!-- /ANCHOR:limitations -->
