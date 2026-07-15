---
title: "Implementation Summary: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Implemented WS1-WS5: embedder demand-listener re-arm on daemon adoption, hf-local fail-fast, orphan-sweeper hardening (maintenance-marker + macOS singleton + reclassify + tri-state socket probe), activation runbook, and the owner-reap test-fixture fix. Two adversarial-review rounds resolved."
trigger_phrases:
  - "implementation"
  - "summary"
  - "embedder relisten reaper hardening"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/004-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T11:16:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented WS1-WS5, fixed 2 adversarial-review rounds, full regression 84/84 green"
    next_safe_action: "Path-scoped commit + push"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "WS5 owner-reap timeout: real fixture-staleness bug, not env timing (production heartbeat guard correctly refuses to reap a live owner)"
      - "WS1 re-arm placement: central chokepoint in bridgeOrReportLeaseHeld on action bridge, not inline at each call site nor a periodic self-heal"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-embedder-relisten-and-reaper-hardening |
| **Completed** | 2026-07-11 — WS1-WS5 implemented + verified; two adversarial-review rounds resolved |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All five workstreams shipped. Orchestrated with `openai/gpt-5.6-sol-fast --variant high` as advisor + implementers (via cli-opencode), each change independently re-verified (real diff read + real test run) before acceptance.

- **WS1 [P0] — embedder demand-listener re-arm on daemon adoption.** A launcher that adopts an already-running daemon (the stdio-bridge path) now arms the lazy `hf-model-server` demand listener, so the embedder sidecar is respawned after re-election instead of hanging. Central chokepoint in `bridgeOrReportLeaseHeld()` gated on `decision.action === 'bridge'` (fires only after the deep liveness probe; idempotent + respawn-lock-arbitrated). Includes two follow-up fixes from adversarial review: (a) bridge launchers no longer overwrite the adopted daemon's context lease (`writeLeaseForOwnedContextChild` guards on `isChildRunning(childProcess)`), which had risked deleting a live daemon's lease and causing duplication; (b) the re-arm uses this launcher's own resolved socket so the demand listener and the resident it spawns stay consistent (no split).
- **WS2 [P1] — hf-local fail-fast.** `waitForReady()` now aborts in <=5s with an actionable error when the embed socket is absent AND no live spawn authority exists (owner lease heartbeat, respawn-lock PID, or sidecar PID), instead of retrying the full 45-150s deadline. `ENOENT` stays globally retryable; owner-absence alone never fail-fasts (a bridged launcher holding only the respawn lock keeps retrying); TCP targets unaffected.
- **WS3 [P2] — orphan-sweeper hardening (a process killer).** Three patches plus two review fixes, all false-positive-safe: (a) maintenance-marker respect (preserve a daemon whose DB dir holds a fresh `.maintenance-active.json` naming it); (b) same-DB singleton rule (preserve the socket-binding daemon, reap leaked duplicates) — the listener is identified by the path-named unix-socket fd, the correct macOS discriminator (macOS lsof emits no `TST=LISTEN` for unix sockets); (c) reclassify before both SIGTERM and SIGKILL to close the pid-reuse window; plus a mis-group guard (a duplicate holding ANY daemon socket is preserved) and a tri-state socket probe (an ambiguous/annotated/`(deleted)`/failed lsof result preserves — only an affirmative "no daemon socket" is reap-eligible).
- **WS4 — activation runbook.** `.opencode/scripts/README.md` gained a staged-activation section (Stop-hook rollout and LaunchAgent rollout, each dry-run -> review -> live with rollback), verified against `session-cleanup.sh` and the plist template.
- **WS5 — owner-reap test fixture.** `launcher-lease.vitest.ts` "reaps ... owner before taking over a dead socket" no longer times out: the fixture now ages out the recorded owner lease before the takeover, so the production reap path (which correctly refuses to kill a heartbeat-fresh live owner) can proceed. Production guard unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `bin/mk-spec-memory-launcher.cjs` | Modified | WS1 bridge re-arm + `writeLeaseForOwnedContextChild` lease guard |
| `skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modified | WS2 fail-fast + spawn-authority probe |
| `scripts/orphan-mcp-sweeper.sh` | Modified | WS3 marker/singleton/reclassify + mis-group guard + tri-state probe |
| `scripts/README.md` | Modified | WS4 staged-activation runbook |
| `.../tests/launcher-lease.vitest.ts` | Modified | WS5 fixture fix + WS1 lease/re-arm regression coverage |
| `.../tests/embedders/hf-local-client.vitest.ts` | Modified | WS2 branch coverage (6 new cases) |
| `.../tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | Modified | WS1 idempotency assertion |
| `.../tests/orphan-sweeper-ipc-preserve.vitest.ts` | Modified | WS3 marker/singleton/reclassify/tri-state coverage |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Advisor-first: a read-only GPT-5.6-sol advisor produced a code-grounded design for WS1-WS5; every load-bearing claim was independently confirmed against the launcher/hf-local/sweeper source before implementing. Each workstream was implemented by a single-dispatch GPT-sol agent with hard write-scope guardrails, then verified by running the actual vitest suites and reading the real diff. Because WS1 and WS3 are high-blast (shared daemon lifecycle; a process killer), two dedicated adversarial-review passes ran over the final diffs; the first found 3 real defects (1 P0 reap + 2 P1) and the second found 2 refinements — all resolved and re-verified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| WS1 re-arm lives centrally in `bridgeOrReportLeaseHeld` on `action:'bridge'` | Covers every successfully-bridged adoption path after the liveness probe, skips report/respawn/maintenance-refusal, and leaves the fresh-owner boot path untouched |
| Bridge launchers must not rewrite the context lease | A bridge has no context child, so `writeLeaseFile()` would stamp `childPid:null` + the bridge's ownerPid and break future adoption — guarded by `writeLeaseForOwnedContextChild` |
| Divergent-`SPECKIT_IPC_SOCKET_DIR` adoption is a documented limitation, not a split | Threading the adopted target through the supervisor launch + child env + PID file was disproportionately invasive for a rare non-default config; the re-arm keeps listener and resident consistent on the local socket instead |
| macOS listener discriminator is the path-named unix-socket fd, not `TST=LISTEN` | Empirically confirmed macOS lsof emits no `TST` for unix sockets; the binder holds the path-named fd, clients hold `->0x…` peers |
| Sweeper reaps a same-DB duplicate only on an affirmative "no daemon socket" | For a process killer, an ambiguous/annotated/failed lsof result must preserve; the tri-state probe enforces this |
| WS5 is a test-fixture fix, not a production change | The owner-reap timeout was fixture staleness — the production heartbeat guard correctly refuses to reap a live owner |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full regression (launcher-lease, 3x model-server, hf-local-client, orphan-sweeper) | 84/84 passed, twice, under load |
| `npm run typecheck` (mcp_server) | Clean |
| WS3 tri-state probe, empirical | `daemon_socket_fd_state` correct across 5 real lsof shapes (clean/`(deleted)`/lsof-fail/empty/none) |
| WS3 macOS discriminator, empirical | Real unix-socket listener -> LISTENER=YES; non-holder -> NO |
| WS3 live dry-run on this host | Live daemon (pid 42293) preserved; zero context-server kills |
| Adversarial review round 1 / round 2 | 3 findings -> fixed; 2 findings -> fixed (1 CLOSED outright); all re-verified |
| `validate.sh 032... --strict` | See this session's finalize run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Divergent `SPECKIT_IPC_SOCKET_DIR` adoption does not restore embedding for owner-side clients.** When an adopting launcher's socket dir differs from the owner's, the re-arm binds the local dir (consistent listener+resident) rather than the adopted dir; full target propagation is deferred. Rare non-default config.
2. **WS1 adoption-live stress test not run in this worktree.** `stress_test/durability/daemon-reelection-adoption-live.vitest.ts` requires a built `mcp_server/dist/` (real daemon copy) absent here; WS1 verified via unit suites (24/24) + code inspection + the launcher-lease bridge-re-arm assertion. Run the stress suite post-merge in the main checkout.
3. **Deferred `memory_index_scan` of packet 025's docs is post-merge.** The daemon MCP bridge is currently down and the fix is not yet on `main`; the scan benefits only after the fix reaches `main` and the daemon restarts.
4. **Sweeper live activation stays gated.** WS4 documents the staged rollout; `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` remains `off` and the LaunchAgent stays a dry-run template until an operator reviews a clean dry-run window.
<!-- /ANCHOR:limitations -->
