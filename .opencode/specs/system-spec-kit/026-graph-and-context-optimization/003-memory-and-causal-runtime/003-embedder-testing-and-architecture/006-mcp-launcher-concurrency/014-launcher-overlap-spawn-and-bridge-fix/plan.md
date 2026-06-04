---
title: "Implementation Plan: Launcher-overlap spawn & bridge fix"
description: "Plan for the T1 probe-marker + T2 race-safe reclaim fix across two .cjs launcher libs and two TypeScript IPC socket-server copies."
trigger_phrases:
  - "launcher overlap fix plan"
  - "probe marker race safe plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix"
    last_updated_at: "2026-06-04T20:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored alongside completed implementation"
    next_safe_action: "Reconnect MCP to activate"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
---
# Implementation Plan: Launcher-overlap spawn & bridge fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two surgical, independent fixes in the launcher-coordination layer, both addressing launcher-overlap-under-concurrency. T2 (active wedge) ships first; T1 second. Total ~53 net LOC across 4 files. Design rationale and evidence live in the sibling research packet (`027`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `tsc` builds clean for system-code-graph and system-skill-advisor packages.
- T1 launcher-ipc-bridge vitest suites pass.
- `.cjs` files pass `node --check`.
- Comment hygiene clean on all modified files.
- The change is confined to the EADDRINUSE-recovery path (T2) and the probe request/handler (T1); the security fence returns are preserved.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### T2 — race-safe reclaim (not permissive)

`canUnlinkExistingSocket` wraps `realpathSync`/`lstatSync` so an ENOENT (a racing peer removed the node between the EADDRINUSE failure and the stat) returns reclaimable instead of throwing and aborting the bind. The allowed-root, `isSocket`, and same-uid refusals are unchanged — the security fence (refuse a foreign/hijacked node) is preserved. spec-memory's copy is intentionally NOT levelled here (it works because it is permissive; hardening it is a follow-up so the working memory daemon is not risked under "go live now").

### T1 — probe marker, not health suppression

The launcher's internal probe is the only caller that should be non-spawning. Genuine consumers (`hf-local.ts`) also wake via `GET /api/health`, so the path/method cannot discriminate. Instead the probe carries `X-Speckit-Probe: liveness`; the demand listener returns a non-spawning reply when that header is present. The respawn lock (held by a live demand-listener owner) already makes a new launcher defer — so removing the spurious spawn restores the intended coordination.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — T2 race-safe guard
Rewrite `canUnlinkExistingSocket` in the code-index and skill-advisor copies; drop the pre-existing finding-id comment in code-index.

### Phase B — T1 probe marker
Add the header to `probeModelServer`; honor it in `handleModelServerDemand` before `launch()`.

### Phase C — build
`tsc --build` (code-index) and shared build + `tsc -p tsconfig.build.json` (advisor) to regenerate `dist/`.

### Phase D — verify
Run T1 suites, syntax-check the `.cjs`, comment hygiene, alignment drift, confirm `dist` emitted the change.

### Phase E — deploy
Graceful SIGTERM the code-index + advisor daemon children so launchers respawn from the new code (full activation needs a fresh launcher, which the respawn provides).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- T1: `launcher-ipc-bridge` + `launcher-ipc-bridge-probe` vitest suites (probe request unchanged behavior).
- T2: `git diff` proof of isolation to the EADDRINUSE-recovery path; the security-suite fence test is blocked by a pre-existing macOS/Node-25 EINVAL-vs-EADDRINUSE mismatch (documented), so isolation + preserved returns are the evidence.
- Follow-up: a deterministic N-way-primary regression test (tracked in spec §7).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Builds use the system-spec-kit `node_modules` toolchain (tsc, vitest) and the shared `@spec-kit/shared` build.
- Activation depends on a fresh launcher respawn (`/mcp` reconnect or next session).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout` the four files and rebuild the two packages; recycle the daemons. The changes are additive/defensive (ENOENT branch + header check), so rollback restores prior behavior exactly.
<!-- /ANCHOR:rollback -->
