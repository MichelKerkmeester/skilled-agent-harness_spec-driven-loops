---
title: "Feature Specification: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Deferred follow-up from packet 030: the embedder sidecar goes unreachable after daemon re-election adoption because the demand listener never re-arms, and the orphan-mcp-sweeper process killer needs hardening before its staged live activation."
trigger_phrases:
  - "embedder demand listener re-arm"
  - "hf-embed socket missing after adoption"
  - "orphan sweeper hardening"
  - "daemon reaper maintenance marker"
  - "032 embedder relisten reaper hardening"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T11:16:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "WS1-WS5 implemented + verified; two adversarial-review rounds resolved"
    next_safe_action: "Path-scoped commit + push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "WS1 is P0 and shipped first; it unblocks the memory-index scan of packet 025's docs once merged."
      - "WS5 owner-reap timeout: real fixture-staleness bug, not env timing (production heartbeat guard correctly refuses to reap a live owner)."
      - "WS1 re-arm placement: central chokepoint in bridgeOrReportLeaseHeld on action bridge, not inline per call site nor a periodic self-heal."
---
# Feature Specification: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `scaffold/032-embedder-relisten-and-reaper-hardening` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/028-memory-search-intelligence/001-speckit-memory` |
| **Predecessor** | `030-opencode-temp-worker-reaping` (Done, `90a2462721` + `d4be07abbc`) |
| **Successor** | None |
| **Handoff Criteria** | WS1-WS5 shipped + verified (84/84, two adversarial rounds); post-merge stress + `memory_index_scan` remain |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the Spec-Kit Memory MCP phase-parent's child map, and the direct follow-up to **030-opencode-temp-worker-reaping** (Done, committed `90a2462721` + `d4be07abbc`, pushed).

**Scope Boundary**: Everything deliberately deferred out of 030's scope — the production embedder demand-listener lifecycle gap that daemon re-election surfaces, and the process-killer hardening `orphan-mcp-sweeper.sh` needs before its staged live activation. This phase does not touch 030's already-shipped test-leak fix or its sweeper embedder-sidecar awareness.

**Dependencies**:
- `.opencode/bin/mk-spec-memory-launcher.cjs` (owner/daemon lease lifecycle, bridge/adopt paths, demand listener)
- `.opencode/bin/hf-model-server.cjs` sidecar and `shared/embeddings/providers/hf-local.ts` client
- `.opencode/scripts/orphan-mcp-sweeper.sh` and `.opencode/scripts/session-cleanup.sh`
- `SPECKIT_DAEMON_REELECTION` (on by default) — the re-election behavior that surfaces the WS1 gap

**Deliverables**:
- WS1: embedder demand-listener re-arm on adoption (P0, ships first).
- WS2: hf-local fail-fast that distinguishes an absent socket with no live owner from a launcher still spawning.
- WS3: three `orphan-mcp-sweeper.sh` hardening patches, adversarially reviewed before live mode.
- WS4: a documented staged-activation runbook (no code change).
- WS5: root-cause or fix the pre-existing `launcher-lease.vitest.ts` owner-reap timeout.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 030 fixed the chronic orphan-daemon accumulation at its source (a test leak) and taught the orphan sweeper about the embedder sidecar, but it deliberately deferred two harder problems. First: the embedder sidecar (`hf-model-server.cjs`, listening on `/tmp/mk-spec-memory/hf-embed.sock`) is only ever spawned by the demand listener armed at `.opencode/bin/mk-spec-memory-launcher.cjs:1781`, which fires exactly once, only for the launcher instance whose own `launchServer` call succeeded. Under default-on daemon re-election (`SPECKIT_DAEMON_REELECTION`), that owner exits minutes later and a sibling launcher adopts the live daemon through the bridge/adopt call sites (confirmed at `mk-spec-memory-launcher.cjs:1656-1691`; none of them call `startModelServerDemandListener`). The new owner never re-arms the listener. If `hf-embed.sock` later goes missing, nothing respawns the sidecar, and every embedder call (`memory_index_scan`, `embedder_status`) retries the readiness loop (`shared/embeddings/providers/hf-local.ts:501-504` classifies which errors are retryable, `:718-785` runs the retry loop against `readyTimeout`/`loadTimeout`) for 45-150s before failing — which reads as a hang, while SQLite reads stay healthy the whole time. Second: `orphan-mcp-sweeper.sh` is a process killer with a staged live-activation plan already in the repo (a `--dry-run`-only, not-installed launchd plist, and an off-by-default stop-hook env var), and it needs three specific hardening patches reviewed before that activation can be trusted.

### Purpose
Land the demand-listener re-arm and the hf-local fail-fast so a dead embedder sidecar recovers automatically after adoption instead of appearing to hang, harden the sweeper with adversarial review before it ever runs live, document the staged-activation runbook precisely, and resolve or root-cause the one pre-existing test failure this area surfaced.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- WS1: demand-listener re-arm/verify on daemon adoption in `mk-spec-memory-launcher.cjs`.
- WS2: a fail-fast branch in `hf-local.ts` for the socket-absent-no-owner-lease case.
- WS3: three `orphan-mcp-sweeper.sh` hardening patches (maintenance-marker respect, singleton rule, pid-reuse re-classification before SIGKILL).
- WS4: a documented staged-activation runbook for `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` and the launchd cron reaper plist.
- WS5: investigate and either fix, or root-cause as environment-only, the `launcher-lease.vitest.ts` owner-reap timeout.

### Out of Scope
- Re-litigating 030's already-shipped test-leak fix or its sweeper embedder-sidecar awareness.
- Actually running the memory-index scan of packet 025's docs (separately tracked; this packet only unblocks it).
- Changing `SPECKIT_DAEMON_REELECTION`'s default-on posture.
- Installing the launchd cron reaper live — WS4 documents the runbook; an operator executes it after reviewing a dry-run window.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | WS1: re-arm/verify the `hf-embed.sock` demand listener when a launcher adopts/bridges an existing daemon and the socket is absent |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modify | WS2: fail fast (<=5s) when the socket is absent and no live owner lease exists, vs. the current 45-150s retry while a launcher is still spawning |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modify | WS3: maintenance-marker respect in `preserve_reason`, a singleton rule against `daemon-ipc.sock`, and pid re-classification before `terminate_candidates`'s SIGKILL escalation |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` or a new runbook doc | Create/Modify | WS4: staged-activation runbook (dry-run to live, for both the stop-hook sweep and the launchd cron reaper) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Modify (only if a real bug) | WS5: fix, or document the root cause of, the owner-reap-before-respawn timeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WS1: a launcher that adopts/bridges an existing daemon (call sites at `mk-spec-memory-launcher.cjs:1656-1691`) must (re-)arm or verify the `hf-embed.sock` demand listener when the socket is absent | A live durability test: arm the listener on launcher A, kill A, have launcher B adopt the daemon, confirm `hf-embed.sock` respawns on the next embedder call without a fresh `launchServer`/`startModelServerDemandListener()` call from B's own boot path |
| REQ-002 | WS1: `memory_index_scan` and `embedder_status` complete (pass or a real, fast failure) instead of retrying for 45-150s after an adoption event | Timed integration run: trigger adoption, call `memory_index_scan`, measure wall-clock time to first response before and after the fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | WS2: `hf-local.ts` distinguishes "socket absent, no live owner lease" (fail in <=5s with an actionable error) from "launcher still spawning" (current 45-150s retry preserved) | Unit test covers both branches; the fail-fast path never fires while a real spawn is genuinely in progress |
| REQ-004 | WS3(a): the sweeper must not reap a daemon holding a fresh maintenance marker, mirroring `readMaintenanceMarker(maintenanceMarkerDir())` and `activeUntilMs` at `mk-spec-memory-launcher.cjs:819-821` | Sweeper unit test: a process with a fresh marker survives a sweep pass; an expired marker no longer protects it |
| REQ-005 | WS3(b): at most one `spec-memory-context-server` may hold the `daemon-ipc.sock` listener per canonical DB dir; every other same-DB-dir instance is a reap candidate | Sweeper unit test with two same-DB-dir daemons: the listener-holder survives, the other is flagged for reap |
| REQ-006 | WS3(c): `terminate_candidates` re-classifies a pid immediately before the SIGKILL escalation, closing the pid-reuse window between the TERM and the 5-second-later KILL | Adversarial test: a pid exits and is reused by an unrelated process between the TERM and the KILL check; the sweeper must not KILL the reused pid |
| REQ-007 | WS4: the staged-activation runbook documents the exact dry-run to review to live sequence for both `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` and the launchd cron reaper plist | The runbook names the env var, the dry-run log path, the plist path, and states plainly that live activation never happens without a reviewed dry-run window first |
| REQ-008 | WS5: the `launcher-lease.vitest.ts` "reaps the recorded owner before taking over a dead socket" test (line 344) either passes reliably after a fix, or is root-caused in writing as an environment-timing artifact unrelated to 030's source fix | Either a green re-run of that specific test 5/5 times, or a written root cause citing the exact mechanism (for example the `waitForPidExit` grace window vs. CI scheduling) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: WS1 and WS2 land so `memory_index_scan` completes (not hangs) across a daemon-adoption event, which in turn unblocks the separately-tracked memory-index scan of packet 025's docs.
- **SC-002**: WS3 lands with adversarial review, green sweeper unit tests for all three patches, and a dry-run pass that still preserves the live daemon (no false-positive reap).
- **SC-003**: WS4 exists as a documented runbook; no "shipped" claim is made for a code change that did not happen.
- **SC-004**: WS5 is either fixed (test green 5/5) or root-caused in writing as environment-only; it is never silently left red without an explanation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | WS1 touches the production launcher/daemon lifecycle shared by every session | High | Adversarial review plus a fresh-engineer implementation pass before merge; a live durability test with two real launchers, not just unit mocks |
| Risk | WS3 is a process killer; a bug in it reaps a process that should have survived | High | Adversarial review required before live mode; every patch ships with a sweeper unit test proving the false-positive-reap case it closes |
| Risk | WS4's launchd cron reaper currently ships `--dry-run` only, template-only, not installed | Med | The runbook explicitly requires a reviewed dry-run window before an operator removes `--dry-run` |
| Dependency | `SPECKIT_DAEMON_REELECTION` default-on behavior (the re-election path that surfaces the WS1 gap) | Med | WS1 does not change this default; it closes the gap re-election exposes |
| Risk | WS5's root cause is unknown going in; it could be environment-timing or a real bug in `reapOwnerBeforeRespawn` (`mk-spec-memory-launcher.cjs:776-779`) | Low-Med | Time-box the investigation; an honest environment-only root cause is a valid outcome per REQ-008 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Post-adoption embedder calls resolve in normal single-digit-second time once WS1 lands, not the current 45-150s retry ceiling.

### Reliability
- **NFR-R01**: The sweeper must never reap the daemon holding the live `daemon-ipc.sock` listener; a false-positive reap here breaks MCP transport for every concurrent session.
- **NFR-R02**: WS1's re-arm check must be idempotent, safe to run on every adoption including when the sidecar is already healthy.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two same-DB-dir daemons both appear to be candidates for the `daemon-ipc.sock` listener: WS3(b) must resolve to exactly one survivor via the actual listener check, not a heuristic guess.

### Error Scenarios
- Adoption happens and `hf-embed.sock` exists as a file but the process behind it is dead: WS1's re-arm logic must detect this, not just check file existence.
- A pid the sweeper TERM'd exits and is reused by an unrelated process before the 5-second KILL escalation fires: WS3(c) must not KILL the reused pid.

### State Transitions
- A daemon mid-maintenance (holding a fresh marker per `mk-spec-memory-launcher.cjs:819-821`) during a sweep pass: WS3(a) must preserve it, matching the launcher's own busy-not-dead semantics.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 4-5 files across the launcher, the embedder client, the sweeper, and docs; no schema changes |
| Risk | 22/25 | Production launcher/daemon lifecycle (WS1) and a process killer (WS3) — both high blast radius, both need adversarial review before merge or live activation |
| Research | 12/20 | WS5's root cause is unknown going in; WS1/WS3's mechanisms are already located and cited above |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

All resolved during implementation:

- **WS5 owner-reap timeout** — Resolved: a real test-fixture staleness bug, not an environment-timing artifact. The production `reapOwnerBeforeRespawn` heartbeat guard correctly refuses to reap a heartbeat-fresh live owner; the fixture never aged out the recorded owner lease, so the reap path could not proceed. Fix aged out the lease in the fixture; production guard unchanged.
- **WS1 re-arm placement** — Resolved: a single central chokepoint in `bridgeOrReportLeaseHeld()` gated on `decision.action === 'bridge'`, not inline at each call site nor a periodic self-heal. It fires only after the deep liveness probe, is idempotent and respawn-lock-arbitrated, and leaves the fresh-owner boot path untouched.
- **WS3(b) singleton grace window** — Resolved: no separate grace window needed. The singleton decision is derived from the affirmative path-named unix-socket fd (the macOS listener discriminator), and the reap is gated on a tri-state probe that preserves on any ambiguous/annotated/failed lsof result — a transient hand-off reads as ambiguous and is preserved, not reaped.
<!-- /ANCHOR:questions -->
