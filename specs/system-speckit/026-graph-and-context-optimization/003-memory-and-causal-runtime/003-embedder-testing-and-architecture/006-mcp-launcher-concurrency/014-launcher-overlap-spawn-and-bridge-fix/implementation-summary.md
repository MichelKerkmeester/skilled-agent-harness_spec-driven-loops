---
title: "Implementation Summary: Launcher-overlap spawn & bridge fix"
description: "What was built for T1 (probe-marker so the launcher liveness probe never spawns a model server) and T2 (race-safe canUnlinkExistingSocket so the daemon IPC bridge bind survives a benign concurrent-primary socket race), plus verification and deploy evidence."
trigger_phrases:
  - "launcher overlap fix implementation summary"
  - "probe marker race safe reclaim done"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix"
    last_updated_at: "2026-06-04T20:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + built + verified both fixes; recycled code-index + advisor daemons"
    next_safe_action: "Reconnect MCP to activate; confirm bridges serve"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
---
# Implementation Summary: Launcher-overlap spawn & bridge fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implemented + verified; full activation pending fresh launcher respawn |
| **Date** | 2026-06-04 |
| **Files changed** | 4 (2 `.cjs`, 2 `.ts`) — ~53 net LOC |
| **Research** | `027-launcher-concurrency-spawn-and-bridge-investigation/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### T2 — race-safe bridge reclaim (not permissive)
`canUnlinkExistingSocket` in both the code-index and skill-advisor `socket-server.ts` copies now wraps `realpathSync`/`lstatSync` in try/catch: an ENOENT (a racing peer removed the node between the EADDRINUSE failure and the stat) returns reclaimable instead of throwing and aborting the bind. The allowed-root, `isSocket`, and same-uid refusals are unchanged — the foreign/hijacked-node security fence is fully preserved. A pre-existing finding-id comment in the code-index copy was reworded to keep its durable WHY without the id (hygiene).

### T1 — probe marker so liveness ≠ embed demand
`probeModelServer` (`launcher-ipc-bridge.cjs`) now sends `X-Speckit-Probe: liveness` on its `GET /api/health` request. `handleModelServerDemand` (`model-server-supervision.cjs`) returns a non-spawning reply when that header is present, before the `launch()`. Genuine consumers (`hf-local.ts`) do not send the header, so their lazy wake-on-demand path is unchanged. spec-memory's permissive socket copy was intentionally left untouched (it is not the wedge; hardening it is a follow-up — see Decisions).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read all three `socket-server.ts` copies to confirm divergence before editing.
2. Edited the two failing copies (T2) + the two launcher libs (T1).
3. Rebuilt both TS packages (`tsc`) to regenerate `dist/`.
4. Ran targeted tests + syntax + hygiene + alignment + diff-isolation checks.
5. Recycled the code-index + advisor daemon children (graceful SIGTERM) so a fresh launcher respawn loads both the new `.cjs` and new `dist`. The memory daemon was deliberately not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:smoke -->
## Smoke Evidence (2026-06-04 session)

- **Build:** `tsc --build` (code-index) and shared build + `tsc -p tsconfig.build.json` (advisor) — both clean, no TS errors.
- **dist emitted:** code-index + advisor `dist/.../socket-server.js` each contain the new ENOENT-reclaim branches.
- **T1 suites:** `launcher-ipc-bridge` + `launcher-ipc-bridge-probe` — 13 passed, 8 skipped, 0 failed.
- **`.cjs` syntax:** `node --check` OK for both launcher libs.
- **Hygiene:** clean on all 4 modified files after the finding-id comment fix.
- **Alignment drift:** PASS (the 1 warning is a pre-existing `worktree-guard.sh` issue, unrelated).
- **Deploy:** code-index + advisor daemon children SIGTERM'd; their launchers exited (they do not self-respawn the child) → MCP disconnected, awaiting fresh respawn. Memory daemon (pid 61626) remained serving throughout.
<!-- /ANCHOR:smoke -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Race-safe, NOT permissive
The naive fix ("make the failing copies match spec-memory's permissive unlink") would reopen the foreign-node socket-hijack hole, because spec-memory's copy is the older un-hardened one. Decision: keep the security fence; only stop aborting the bind on a benign ENOENT.

### D-002: Probe marker, not health-path suppression
Genuine consumers also wake via `GET /api/health`, so the demand listener cannot discriminate by path/method. Decision: a dedicated `X-Speckit-Probe` header that only the launcher's internal probe sends.

### D-003: Defer spec-memory hardening + 3-copy consolidation
spec-memory is not the wedge and hosts the live memory MCP; hardening it (and merging the three drifted `socket-server.ts` copies into one shared module — 012's deferred D-001) is a separate, lower-urgency packet, kept out of a "go live now" change.

### D-004: Level 1
~53 net LOC across 4 files, surgical and defensive. Deep design rationale is in the sibling research packet, so this packet stays lean.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Diff isolation (T2 security)
`git diff` confirms the code-index change touches only `canUnlinkExistingSocket` (the EADDRINUSE-recovery path) + the one comment. The `err.code !== 'EADDRINUSE'` rethrow guard is untouched, so the security-suite failures (`mkdtemp` cwd; macOS/Node-25 `listen()`-on-regular-file returning EINVAL instead of EADDRINUSE) are pre-existing environmental issues, not regressions — they occur in unchanged code before `canUnlinkExistingSocket` is reached.

### Commands
```
npm --prefix .opencode/skills/system-code-graph run build          # tsc clean
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build  # tsc clean
<spec-kit vitest> run --config <spec-kit cfg> launcher-ipc-bridge  # 13 passed / 8 skipped
node --check .opencode/bin/lib/launcher-ipc-bridge.cjs             # OK
node --check .opencode/bin/lib/model-server-supervision.cjs        # OK
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/bin  # PASS
```

### Residual / follow-up
Live confirmation that the bridges serve happens on fresh launcher respawn (`/mcp` reconnect or next session); the new daemon binds the bridge on a clean start exactly as before (normal startup path is unchanged by this fix). The N-way-primary regression test and the spec-memory hardening + copy consolidation are tracked in `spec.md §7`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- spec-memory's `socket-server.ts` is not levelled to the race-safe hardened fence here (it is permissive, but it is not the wedge); tracked as a follow-up.
- The three `socket-server.ts` copies remain separate (012's deferred consolidation); this packet achieves behavioral convergence only, not a shared module.
- T1 `.cjs` changes activate only on a fresh launcher respawn; the served bridges are confirmed on `/mcp` reconnect, not in-session.
- The security-fence vitest cannot pass on macOS/Node-25 (pre-existing EINVAL-vs-EADDRINUSE in unchanged code); fence preservation is verified by diff instead.
<!-- /ANCHOR:limitations -->
