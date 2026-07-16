---
title: "Implementation Plan: socket-server reconvergence + hardening"
description: "Plan for leveling spec-memory's IPC bridge up, consolidating the 3 copies (hybrid), and adding TOCTOU + probe-no-spawn tests."
trigger_phrases:
  - "socket-server reconvergence plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/015-socket-server-reconvergence-and-hardening"
    last_updated_at: "2026-06-04T22:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored alongside completed implementation"
    next_safe_action: "Activates on daemon restart"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/ipc/socket-server.ts"
---
# Implementation Plan: socket-server reconvergence + hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Consolidate the three drifted IPC `socket-server.ts` copies behind one canonical `@spec-kit/shared/ipc/socket-server.ts`, leveling the weakest (spec-memory) UP to the race-safe + security-hardened contract, with a hybrid strategy for the package that cannot take the shared dep. Implemented by an Opus sub-agent, independently reviewed by an Opus review sub-agent (GO). Net source change is a de-duplication (146 insertions / 589 deletions).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All affected packages build (tsc exit 0): shared, code-index, advisor, spec-kit mcp_server.
- New tests pass (TOCTOU race, drift-check, probe-no-spawn); pre-existing failures confirmed unrelated.
- Security fence preserved in every copy (allowed-root + isSocket + same-uid refusals); never permissive.
- Comment hygiene zero violations; no deletions; allowed paths only.
- Independent review verdict GO (zero P0/P1).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

One canonical module owns the bind/reclaim/serve LOGIC; each service keeps its own socket/db PATH resolution. spec-kit + advisor re-export the shared module (both already resolve `@spec-kit/shared`). code-index keeps a byte-identical local copy guarded by a drift-check test, because it has zero `@spec-kit/shared` coupling and a single-project tsconfig (adding the dep = the 012 deferral; empirically `TS2307`). `createServer` is typed against a structural `McpServerLike { connect(transport): Promise<void> }` so each package's separate `@modelcontextprotocol/sdk` install satisfies it (method bivariance), avoiding cross-package nominal `Server` type conflicts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — canonical shared module
Create `@spec-kit/shared/ipc/socket-server.ts` as the union: race-safe `canUnlinkExistingSocket` fence + dir-ownership/mode hardening + the TCP retry helper + inlined containment check + the `McpServerLike` structural type.

### Phase B — wire the consumers
spec-kit + advisor `socket-server.ts` → thin re-exports. code-index → byte-identical local copy.

### Phase C — tests
TOCTOU race regression (real EADDRINUSE→reclaim + mocked-ENOENT survivor), a drift-check (byte-identity), and a probe-no-spawn assertion.

### Phase D — verify
Build all four packages; run new + existing socket/ipc/launcher-ipc-bridge suites; comment hygiene; independent review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- TOCTOU: pre-bind a real stale UNIX socket to force genuine EADDRINUSE, and mock `lstatSync` to throw ENOENT once — assert the bind survives and serves. Deliberately avoids the macOS regular-file EINVAL quirk.
- Probe: assert `launch()` is NOT called when the request carries `x-speckit-probe: liveness` (case-insensitive), and IS reached without it.
- Drift: assert code-index's copy is byte-identical to the canonical source.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `@spec-kit/shared` build toolchain (tsc); each package's vitest.
- Activation depends on daemon restart (new dist), landing with the 014 fix.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout` the three `socket-server.ts` + remove the new shared module + tests, then rebuild. Recovery baseline + backup recorded at `/tmp/dr-014-backup` (HEAD `448ffc25`). Changes are additive/de-duplicating, so rollback restores the prior per-copy behavior.
<!-- /ANCHOR:rollback -->
