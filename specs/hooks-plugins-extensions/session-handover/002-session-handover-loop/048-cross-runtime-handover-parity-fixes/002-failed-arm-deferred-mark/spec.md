---
title: "Feature Specification: Phase 2: failed-arm-deferred-mark"
description: "On Codex, Pi and OpenCode a turn end that cannot arm its record leaves it pending with no deferred mark, and their withdraw accepts only an armed record, so a later turn end can arm from a stale note. This phase marks every failed arm deferred and lets the next prompt withdraw it, as Claude and Vibe do."
trigger_phrases:
  - "failed arm deferred mark"
  - "codex pi opencode deferred record"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: failed-arm-deferred-mark

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/420-cross-runtime-handover-parity-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-pi-opencode-history-lookup |
| **Successor** | 003-nudge-parity-and-hop-scoring |
| **Handoff Criteria** | Every failed arm on Codex, Pi and OpenCode leaves a deferred record that the next operator prompt withdraws |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cross-runtime hand-over parity fixes. Claude marks a record deferred on each failed arm branch, and phase 047 copied that to Vibe. This phase copies it to Codex, Pi and OpenCode.

**Scope Boundary**: the arm paths and the operator-prompt withdraw of the Codex, Pi and OpenCode adapters. The shared `markDeferred` and `withdrawHandOver` stay unchanged.

**Dependencies**:
- `markDeferred` in `relaunch-core.cjs` and the `deferred` policy in `lib/withdraw.cjs`.

**Deliverables**:
- A deferred mark and a log line on each failed arm branch.
- The default `deferred` withdraw policy on the operator-prompt paths.
- Tests for each branch and for the withdraw.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Codex `stop-arm.mjs` returns with the record still pending when the payload has no transcript path, when no session process is found below the loop and when `arm` throws. Pi's `armRelaunch` and OpenCode's `armOnIdle` leave it pending when `arm` throws. All three withdraw on an operator prompt with `pending: 'none'`, which accepts only an armed record. A record that could not arm therefore stays pending until a later turn end arms it from a note the operator has since moved past.

### Purpose
On every looped runtime, a hop that could not arm is called off by the operator's next prompt.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 104,126p .skilled/hooks/session-handover/codex/stop-arm.mjs
  if (typeof payload.transcript_path !== 'string' || !payload.transcript_path) {
    logEvent('missing-transcript-path', { loopId, sessionId: record.sessionId }, env);
    return null;
  }
  ...
  if (targetPid === null) {
    logEvent('stop-arm-error', { stage: 'target-pid', loopId }, env);
    return null;
  }
  ...
    logEvent('stop-arm-error', { stage: 'arm', loopId, message: error.message }, env);
    return null;
$ rg -n "pending: 'none'" .skilled/hooks/session-handover
codex/shared.mjs:67:      pending: 'none',
pi/session-handover.ts:683:        pending: 'none',
.opencode/plugins/session-handover.js:291:      pending: 'none',
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Codex: mark deferred on the three failed branches and print the same notice Claude prints.
- Pi and OpenCode: mark deferred when `arm` throws, and log it.
- Codex, Pi and OpenCode: withdraw with the default `deferred` policy.

### Out of Scope
- The OpenCode busy-child hold, which retries in memory by design.
- An arm that returns no armed record, which found nothing it could arm.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/codex/stop-arm.mjs` | Modify | Deferred mark and notice on three branches |
| `.skilled/hooks/session-handover/codex/shared.mjs` | Modify | Default withdraw policy |
| `.skilled/hooks/session-handover/pi/session-handover.ts` | Modify | Deferred mark on an arm error, default withdraw policy |
| `.opencode/plugins/session-handover.js` (linked from `.skilled/hooks/session-handover/opencode/`) | Modify | Deferred mark on an arm error, default withdraw policy |
| Adapter tests and README | Modify | Coverage and docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the three failed Codex Stop branches leaves the record pending with a `deferredAt` stamp |
| REQ-002 | A Pi or OpenCode arm that throws leaves the record pending with a `deferredAt` stamp |
| REQ-003 | An operator prompt on Codex, Pi or OpenCode withdraws a deferred record of its own session and still leaves a never-deferred pending record alone |
| REQ-004 | The existing handover suite passes with no edited expectation for Claude or Vibe |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A failed Codex Stop prints one `systemMessage` naming the cause and saying the next prompt withdraws the hand-over |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` and the Pi suite pass with 0 failing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The default policy withdraws a prepared record before its first turn end | High: no hop | The `deferred` policy accepts a pending record only with `deferredAt`, and a test proves a fresh one stays |
| Risk | Codex rejects an unknown Stop envelope | Med: hook error | The notice uses `systemMessage`, the Stop envelope Codex accepts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: No new process spawn on any arm path.

### Reliability
- **NFR-R01**: A failure while marking is logged and never fails the hook.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `SKILLED_LOOP_ID` marks nothing.
- Maximum input: a record of another session is never marked or withdrawn.
- Failure path: `markDeferred` that throws logs `stage=defer` and returns.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | About 40 lines over four adapters plus tests |
| Risk | 10/25 | Arm paths of three runtimes |
| Research | 3/20 | Copies the Claude shape |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
