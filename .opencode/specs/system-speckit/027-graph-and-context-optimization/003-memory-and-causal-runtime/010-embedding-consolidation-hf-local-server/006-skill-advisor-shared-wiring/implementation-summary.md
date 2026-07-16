---
title: "Implementation Summary: Wire skill-advisor to the shared hf model server"
description: "Implemented. Extracted hf-model-server supervision into a shared bin/lib/model-server-supervision.cjs factory both launchers drive; F1 daemon path stays byte-equivalent; skill-advisor gains a gated (SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED, default off) shared-socket spawn capability with a socket-adjacent hf-embed.pid single-winner channel; ENV_REFERENCE documents new envs, sidecar deprecations, the single-resident-model 404 contract, and health-state troubleshooting. A 4-lens adversarial review's P1 (spawn->bind clobber window) plus 4 P2s were fixed; cross-launcher + F1/F3/004 suites green."
trigger_phrases:
  - "skill-advisor shared model-server wiring implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring"
    last_updated_at: "2026-05-29T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shared model-server supervisor extracted; both launchers wired; 5 review fixes; tests green"
    next_safe_action: "Reconcile parent 029 packet; Option B 6/6 complete"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000596"
      session_id: "029-006-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-skill-advisor-shared-wiring |
| **Completed** | 2026-05-29 (shared lib + both launchers wired; 5 review fixes; cross-launcher + F1/F3/004 green) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**REQ-001 already held by construction**: both mk-spec-memory and skill-advisor consume the same `@spec-kit/shared` hf-local HTTP client, which resolves the default socket to `<system-spec-kit>/mcp_server/database/hf-embed.sock` — exactly what the memory daemon binds — so when the daemon is up they already share one resident server.

**REQ-002 (full extraction)**: the hf-model-server supervision was lifted out of the 1560-line core launcher into a single shared CommonJS lib, `.opencode/bin/lib/model-server-supervision.cjs`, exported as a `createModelServerControl(deps)` factory with per-control closure state. The pure generic primitives (crash-loop guard, RSS watchdog, `superviseChildExit`, reap, liveness, respawn-lock helpers) co-locate there. `mk-spec-memory-launcher.cjs` requires the lib, destructures the primitives under the **same local names** its F1 daemon path calls (so context-server supervision is **byte-equivalent**), keeps thin local wrappers for the 3 stateful-default fns (injecting its globals), and replaces 4 module globals with one `hfControl`. Its 23-symbol `module.exports` surface is preserved so F1/F3/004 tests pass unmodified.

`mk-skill-advisor-launcher.cjs` gains the same capability behind `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` (**default OFF** — conservative opt-in until field-validated): it resolves the **shared** system-spec-kit socket dir (never its own), lazily wins the spawn via the existing socket-keyed `hf-embed-respawn.lock`, reaps an owned child on shutdown, and never self-exits on an RSS breach. Cross-launcher single-owner coordination uses a socket-adjacent **`hf-embed.pid`** file (atomic temp+rename; read under the respawn lock), the additive channel both launchers share.

**Docs (REQ-003/004/005/006)**: `ENV_REFERENCE.md` documents the 5 new envs (`HF_EMBED_SERVER_URL`, `HF_EMBED_SERVER_READY_TIMEOUT_MS`, `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`, `_RSS_SELF_EXIT`, `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`), moves the 3 dead sidecar/execution envs to §17 Deprecated, and adds a "Local HF model server (single resident model)" subsection with the single-resident-model + 404-on-mismatch contract and a health-state troubleshooting table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/model-server-supervision.cjs` | Create | Shared supervision lib: `createModelServerControl(deps)` factory + moved pure primitives + demand-listener (closure methods) + socket/lock/pid helpers |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Require the lib; same-name primitive re-exports + 3 stateful wrappers; replace 4 globals with `hfControl`; shared `hf-embed.pid` writer/reader; F1 byte-equivalent; 23 exports preserved |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Gated (`SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, default OFF) shared-socket spawn; reap-on-shutdown; no self-exit; `CHILD_ENV_ALLOWLIST` += the flag + `HF_EMBED_SERVER_URL` |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | New envs, sidecar deprecations (→ §17), single-resident-model 404 contract, health-state troubleshooting |
| `mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | Create | 6 tests: shared-socket precedence, single-winner, absent-daemon spawn, pid round-trip, spawn→bind back-off, dead-pid fall-through |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An opus design workflow (2 candidates → synthesis) settled the module boundary (one lib, not two — the primitives are pure), the cross-launcher pid model (socket-adjacent `hf-embed.pid`, both candidates converged), and the F1 byte-equivalence/re-export plan, then emitted a codex prompt. A `cli-codex` dispatch (`gpt-5.5`, xhigh, fast, `--sandbox workspace-write`) implemented the extraction + both-launcher wiring + the cross-launcher test with staged GATE 0–3 verification. Independent verification (the real vitest runner; codex's env lacked `npx vitest`) confirmed zero dangling globals, 23 exports preserved, and F1/F3/004 + skill-advisor + hf-local suites green. A 4-lens opus adversarial review (find → adversarially-verify pipeline) confirmed **5 defects**: one **P1** (the demand-lock was released after a synchronous spawn but before the child bound the socket, and the no-socket fast-path skipped the shared-pid liveness check — a second launcher could clobber a booting resident) and four P2s. The orchestrator fixed all five: the no-socket branch now backs off on a live recorded pid (`launch()` writes `hf-embed.pid` synchronously before releasing the lock), the EADDRINUSE reclaim refuses to clobber a live socket, the launcher's `createModelServerSupervisor`/`launchModelServer(options)` seam pre-seeds HEAD's launcher-aware defaults, 16 dead destructured imports were removed, and the `hf-embed.pid` filename became a shared lib constant. A focused adversarial re-review of the P1 fix returned **0 new defects**.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared lib, not two (generic + model-server split) | The generic primitives are pure (default-to-globals but never close over mutable state), so co-locating is a smaller core-launcher diff than injecting 6 primitives through every call site |
| Socket-adjacent `hf-embed.pid` as the cross-launcher single source of truth | mk-spec-memory's reap-before-respawn reads its OWN lease; a skill-advisor-spawned pid would be invisible there → orphaned double-resident. A shared pid file (read under the respawn lock) is the only race-safe channel both launchers see |
| Gate skill-advisor's spawn behind `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` (default OFF) | The capability is built + tested, but the new cross-launcher spawn-ownership path is opt-in until field-validated; the steady state (daemon up) already shares the resident server via REQ-001 |
| Fix the P1 via the no-socket pid-liveness back-off (not an async hold-until-bound) | `launch()` writes the pid synchronously before the lock releases, so a passive liveness recheck closes the spawn→bind window with far less change than making `handleModelServerDemand` async |
| Drop the spec's `HF_EMBED_SERVER_IDLE_MS` from the docs | It does not exist in the code; documenting it would fabricate an env |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on the lib + both launchers | PASS (3/3) |
| Stale-symbol grep (4 removed globals) in mk-spec-memory-launcher.cjs | ZERO references |
| `module.exports` keyset count | 23 (identical to pre-extraction HEAD) |
| `vitest run` F1 launcher-watchdog + F3 ipc-bridge-probe + 004 launcher-model-server + lease + idle | PASS (34 passed \| 8 skipped; the 2 skips are pre-existing `describe.skip`) |
| `vitest run` new cross-launcher suite | PASS (6/6: precedence, single-winner, absent-daemon spawn, pid round-trip, spawn→bind back-off, dead-pid fall-through) |
| `vitest run` skill-advisor launcher (bootstrap/lease/rename) + hf-local/embeddings | PASS (25 + 33) |
| 4-lens opus adversarial review + per-finding verify | 5 defects (1 P1 + 4 P2) — ALL fixed; focused P1 re-review 0 new defects |
| `validate.sh --strict` on this packet | PASS |
| SC: live two-launcher shared resident on running daemons | DEFERRED — needs running daemons + model server (shared with 002–005 live-spawn deferral) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **skill-advisor spawn is opt-in (default OFF)** — `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` must be set to `1` for skill-advisor to win the shared-server spawn when the memory daemon is absent. The capability is built + tested; flipping the default to ON is a one-line follow-up once live-validated.
2. **Live two-launcher residency not exercised end-to-end** — single-winner, the spawn→bind back-off, and the pid round-trip are covered by injected-spawn/fake-http tests; a live daemon + skill-advisor + model server is the natural follow-up (shared with the 002–005 live-spawn deferral).
3. **Respawn-lock lifetime differs from phase 004 by design** — the demand lock is now held across the bind + idle-listener window so a second launcher loses cleanly; the wx-open + UDS-bind single-winner primitives themselves are unchanged.
<!-- /ANCHOR:limitations -->

