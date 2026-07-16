

---
title: "Changelog: Wire skill-advisor to the shared hf model server [010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring]"
description: "Extracted hf-model-server supervision into a shared CommonJS lib that both launchers drive. F1 daemon path stays byte-equivalent. skill-advisor gains a gated shared-socket spawn capability behind SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED (default off). ENV_REFERENCE documents the new envs, sidecar deprecations, single-resident-model contract, and health-state troubleshooting."
trigger_phrases:
  - "skill-advisor shared model server wiring"
  - "hf model server supervision lib"
  - "cross-launcher spawn coordination"
  - "SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED"
  - "hf-embed.pid single-winner channel"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

Both mk-spec-memory and skill-advisor already consumed the same @spec-kit/shared hf-local HTTP client pointing at the memory daemon bound socket, so they shared one resident server by construction. This phase extracted the hf-model-server supervision into a shared `.opencode/bin/lib/model-server-supervision.cjs` factory that both launchers drive. mk-spec-memory preserves its F1 byte-equivalence and 23-symbol surface. skill-advisor gains a gated shared-socket spawn capability behind `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` (default OFF) using a socket-adjacent `hf-embed.pid` single-winner channel. A 4-lens adversarial review found 5 defects (1 P1 plus 4 P2) and all were fixed.

### Added

- Shared supervision lib (`.opencode/bin/lib/model-server-supervision.cjs`) exporting `createModelServerControl(deps)` factory with per-control closure state, pure generic primitives, and demand-listener helpers.
- Cross-launcher single-winner channel via socket-adjacent `hf-embed.pid` file (atomic temp plus rename, read under respawn lock) that both launchers share.
- `CHILD_ENV_ALLOWLIST` entries for `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` and `HF_EMBED_SERVER_URL` in mk-skill-advisor-launcher.cjs.
- 6 cross-launcher tests covering shared-socket precedence, single-winner election, absent-daemon spawn, pid round-trip, spawn-to-bind back-off, and dead-pid fall-through.

### Changed

- mk-spec-memory-launcher.cjs requires the shared lib, re-exports primitives under the same local names its F1 daemon path calls, replaces 4 globals with one `hfControl`, and keeps its 23-symbol `module.exports` surface unchanged.
- mk-skill-advisor-launcher.cjs gates shared-socket spawn behind `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` (default OFF), reaps an owned child on shutdown, and never self-exits on RSS breach.
- ENV_REFERENCE.md documents 5 new envs (`HF_EMBED_SERVER_URL`, `HF_EMBED_SERVER_READY_TIMEOUT_MS`, `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`, `_RSS_SELF_EXIT`, `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`), moves 3 dead sidecar execution envs to the Deprecated section, and adds a health-state troubleshooting table.

### Fixed

- Spawn-to-bind clobber window: the no-socket fast-path now backs off on a live recorded pid because `launch()` writes `hf-embed.pid` synchronously before releasing the respawn lock.
- EADDRINUSE reclaim refuses to clobber a live socket.
- mk-skill-advisor-launcher `createModelServerSupervisor` and `launchModelServer(options)` seam pre-seeds launcher-aware defaults.
- 16 dead destructured imports removed from mk-skill-advisor-launcher.cjs.
- `hf-embed.pid` filename became a shared lib constant.

### Verification

- `node --check` on model-server-supervision.cjs plus both launchers (3/3) PASS.
- Stale-symbol grep for 4 removed globals in mk-spec-memory-launcher.cjs returns ZERO references.
- `module.exports` keyset count matches pre-extraction HEAD at 23 symbols.
- vitest run F1 launcher-watchdog plus F3 ipc-bridge-probe plus 004 launcher-model-server plus lease plus idle (34 passed, 8 skipped) PASS.
- vitest run cross-launcher suite (6/6) PASS.
- vitest run skill-advisor launcher (bootstrap/lease/rename) plus hf-local/embeddings (25 plus 33) PASS.
- 4-lens opus adversarial review returned 5 defects (1 P1 plus 4 P2), all fixed, with a focused P1 re-review returning 0 new defects.
- `validate.sh --strict` on this packet PASS.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/model-server-supervision.cjs` | Create | Shared supervision lib with `createModelServerControl(deps)` factory, moved pure primitives, demand-listener closure methods, and socket/lock/pid helpers |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Requires the shared lib, re-exports same-name primitives plus 3 stateful wrappers, replaces 4 globals with `hfControl`, uses shared `hf-embed.pid` reader/writer, F1 byte-equivalent, 23 exports preserved |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Gated shared-socket spawn (`SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` default OFF), reap-on-shutdown, no self-exit, `CHILD_ENV_ALLOWLIST` adds the flag plus `HF_EMBED_SERVER_URL` |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | 5 new envs documented, 3 dead sidecar envs moved to Deprecated section, single-resident-model 404 contract and health-state troubleshooting table added |
| `mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | Create | 6 tests covering shared-socket precedence, single-winner, absent-daemon spawn, pid round-trip, spawn-to-bind back-off, dead-pid fall-through |

### Follow-Ups

- skill-advisor spawn is opt-in (default OFF). `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` must be set to 1 for skill-advisor to win the shared-server spawn when the memory daemon is absent. Flipping the default to ON is a one-line change once live-validated.
- Live two-launcher residency not exercised end-to-end. Single-winner, spawn-to-bind back-off, and pid round-trip are covered by injected-spawn/fake-http tests. A live daemon plus skill-advisor plus model server is the natural follow-up (shared with the 002 to 005 live-spawn deferral).
- Respawn-lock lifetime differs from phase 004 by design. The demand lock is now held across the bind plus idle-listener window so a second launcher loses cleanly. The wx-open plus UDS-bind single-winner primitives themselves are unchanged.
