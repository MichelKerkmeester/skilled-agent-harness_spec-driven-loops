---
title: "Implementation Plan: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Sequence WS1 (embedder re-arm) first because it is the only item blocking packet 025's memory-index scan, then WS2 (fail-fast), then the adversarially-reviewed WS3 sweeper hardening, then the WS4 runbook and the WS5 test investigation."
trigger_phrases:
  - "implementation"
  - "plan"
  - "embedder relisten reaper hardening"
  - "plan core"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Deferred-work spec authored"
    next_safe_action: "Implement WS1 (embedder re-listen) first"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launcher, TypeScript embedder client), bash (sweeper, session-cleanup hook) |
| **Framework** | None (spec-kit MCP server internals) |
| **Storage** | None (process lifecycle and lease/marker files only, no schema change) |
| **Testing** | Vitest (`launcher-lease.vitest.ts`, sweeper unit tests to be added), manual live-durability runs with two real launcher processes |

### Overview
Close the gap default-on daemon re-election opened: an adopting launcher never re-arms the embedder demand listener, so `hf-embed.sock` can go missing and stay missing (WS1), and every embedder call pays a 45-150s retry before failing (WS2 closes that symptom independently). In parallel, harden `orphan-mcp-sweeper.sh` with three adversarially-reviewed patches before its already-staged live activation (WS3), write down the exact staged-activation runbook (WS4), and settle the one pre-existing test failure this area surfaced (WS5).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (this packet's spec.md)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (launcher, hf-local client, sweeper, session-cleanup hook)

### Definition of Done
- [ ] WS1+WS2 acceptance criteria met (REQ-001 through REQ-003)
- [ ] WS3's three patches pass adversarial review and their own unit tests (REQ-004 through REQ-006)
- [ ] WS4 runbook written and cross-checked against the actual env var and plist (REQ-007)
- [ ] WS5 resolved, either fixed or root-caused in writing (REQ-008)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary all reconciled to the real end state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Process-lifecycle hardening across three existing subsystems (launcher lease/adoption, embedder sidecar client, orphan sweeper) — no new architectural pattern is introduced.

### Key Components
- **Demand listener (`startModelServerDemandListener`, `mk-spec-memory-launcher.cjs:1277`)**: currently armed once, only from the `launched` boot path (`:1781`). WS1 adds a re-arm/verify call at the bridge/adopt call sites (`:1656-1691`).
- **hf-local client (`shared/embeddings/providers/hf-local.ts`)**: currently treats `ENOENT` as always-retryable (`:501-504`) inside a 45-150s wait loop (`:718-785`). WS2 adds an owner-lease check to short-circuit the no-owner case.
- **`orphan-mcp-sweeper.sh`**: `preserve_reason` (`:354`) and `terminate_candidates` (`:451`) get three targeted patches (WS3a/b/c).

### Data Flow
A launcher boots -> arms the demand listener on success -> the sidecar spawns on the first embedder request. On re-election, a sibling launcher's bridge/adopt path takes over the daemon lease but currently skips re-arming the demand listener. WS1 inserts a check at that hand-off: if `hf-embed.sock` is absent, (re-)arm the listener before returning control to the adopting launcher's normal request path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

WS1 is a fix for a real, reproduced production gap (adoption skips re-arming the demand listener), so this addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `startModelServerDemandListener` (`mk-spec-memory-launcher.cjs:1277`) | Arms the one-shot demand listener for the owning launcher | Update: made re-entrant/idempotent so a second call from the adopt path is safe | `rg -n "startModelServerDemandListener" .opencode/bin/mk-spec-memory-launcher.cjs` — confirm all call sites after the fix |
| Boot path call site (`:1781`) | Only existing caller, fires once after a successful `launchServer` | Unchanged | Existing boot-path tests still pass |
| Bridge/adopt call sites (`:1656-1691`, `bridgeOrReportLeaseHeldAndExit` and its callers) | Adopt/bridge to a live or busy daemon, currently never touch the demand listener | Update: add the re-arm/verify check when `hf-embed.sock` is absent | New live-durability test: adopt, then confirm the sidecar respawns on demand |
| `hf-local.ts` retry loop (`:718-785`) | Retries all `ENOENT`/`ECONNREFUSED`/etc. for up to `readyTimeout`/`loadTimeout` | Update (WS2): add an owner-lease check to fail fast when there is no live owner | Unit test: no-owner case fails in <=5s; genuine-spawn case still retries the full window |
| `orphan-mcp-sweeper.sh` (`preserve_reason`, `terminate_candidates`) | Decides what a sweep pass reaps | Update (WS3a/b/c) | Sweeper unit tests per REQ-004 through REQ-006 |

Required inventories:
- Same-class producers: `rg -n "startModelServerDemandListener" .opencode/bin/mk-spec-memory-launcher.cjs` confirms exactly one production call site today (`:1781`); no other file calls it, so the fix is centralized in the launcher.
- Consumers of changed symbols: `rg -n "startModelServerDemandListener|hf-embed.sock" .opencode/bin .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.cjs'` before merge, to confirm no other lifecycle path assumes the current one-shot behavior.
- Matrix axes for WS1: {owner boots fresh, owner exits and daemon dies, owner exits and daemon survives via adoption} x {`hf-embed.sock` present-live, present-stale, absent} — 6 rows, all must be covered by the live-durability test plan in tasks.md.
- Algorithm invariant: the demand listener must be armed exactly once per live daemon lifetime, never zero times (WS1's bug) and never leaking a duplicate listener process (WS1's regression risk) — adversarial cases: rapid adopt/re-adopt churn, and adoption racing a genuine fresh boot.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-confirm the current call-site inventory for `startModelServerDemandListener` and the bridge/adopt paths against HEAD (line numbers may drift)
- [ ] Stand up a two-launcher live-durability harness (or extend the existing `launcher-lease.vitest.ts` harness) for WS1/WS5

### Phase 2: Core Implementation
- [ ] WS1: implement the demand-listener re-arm/verify check at the bridge/adopt call sites
- [ ] WS2: implement the hf-local fail-fast branch for the no-owner-lease case
- [ ] WS3: implement all three sweeper hardening patches (maintenance-marker respect, singleton rule, pid re-classification)
- [ ] WS5: investigate the `launcher-lease.vitest.ts` owner-reap timeout and fix or root-cause it

### Phase 3: Verification
- [ ] Run the live-durability test for WS1 (two real launchers, adoption, sidecar respawn)
- [ ] Run WS2's unit tests (fail-fast vs. genuine-spawn branches)
- [ ] Run WS3's sweeper unit tests plus a dry-run pass that preserves the live daemon
- [ ] Re-run `launcher-lease.vitest.ts` 5/5 for WS5's targeted test
- [ ] Write WS4's runbook and cross-check it against the actual env var default and plist contents
- [ ] Adversarial review of WS1 and WS3 before merge/live activation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | hf-local fail-fast branches (WS2); sweeper `preserve_reason`/`terminate_candidates` patches (WS3) | Vitest, bash test harness for the sweeper |
| Integration | Two-launcher adoption then embedder call, confirming sidecar respawn (WS1) | Vitest live-durability harness, real child processes |
| Manual | Dry-run review of the sweeper and the launchd plist before any live flip (WS4) | `~/.local/share/session-cleanup.log` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mk-spec-memory-launcher.cjs` bridge/adopt paths | Internal | Green | WS1 cannot land without a stable adoption code path to hook into |
| `shared/embeddings/providers/hf-local.ts` | Internal | Green | WS2 depends on WS1's understanding of the owner-lease state, but can ship independently as a symptom mitigation |
| `orphan-mcp-sweeper.sh` and its (to-be-added) unit test harness | Internal | Yellow | WS3 needs adversarial review before it can be trusted for live mode; treat as gated, not blocked |
| Adversarial reviewer availability for WS1/WS3 | External (process) | Yellow | Both high-blast-radius workstreams should not merge without a second reviewer pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live-durability or sweeper unit test regresses after WS1/WS3 land; or a dry-run window shows a false-positive reap candidate.
- **Procedure**: Revert the specific workstream's commit (WS1, WS2, WS3, WS5 are independently revertible since they touch different files); WS4 is documentation-only and carries no rollback risk. For WS3 specifically, never flip `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` past `dry-run` or install the launchd plist until the dry-run window is clean.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Adversarial review, then merge/activation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Re-confirm line citations, extend test harness |
| Core Implementation | High | WS1 (launcher) and WS3 (sweeper) are both high-blast-radius; WS2/WS5 are smaller and more contained |
| Verification | Med | Live-durability run plus adversarial review adds real wall-clock time beyond unit tests |
| **Total** | | Not estimated in hours; gated by adversarial review readiness, not calendar time |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] WS1's live-durability test passes with two real launcher processes, not just mocks
- [ ] WS3's sweeper unit tests all pass and a dry-run window shows no false-positive reap
- [ ] Adversarial review sign-off recorded for WS1 and WS3 before any merge to a shared branch

### Rollback Procedure
1. Revert the specific workstream's commit; each workstream touches a disjoint file set.
2. For WS3, if already past dry-run into live: immediately reset `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` to `off` and `launchctl unload` the plist if installed.
3. Verify rollback: re-run the affected workstream's tests to confirm the prior (pre-change) behavior is restored.
4. Notify: this is internal tooling only, no user-facing notification required.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
