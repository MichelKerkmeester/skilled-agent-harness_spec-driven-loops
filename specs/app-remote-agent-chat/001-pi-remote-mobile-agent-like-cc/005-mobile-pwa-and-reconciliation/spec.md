---
title: "Feature Specification: Mobile PWA and Reconciliation"
description: "Builds the installable foreground mobile experience for sessions, streaming work, reconnect reconciliation, explicit controls, and offline read-only state."
trigger_phrases:
  - "pi remote mobile pwa and reconciliation"
  - "pi mobile phase 5"
  - "mobile pwa and reconciliation"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented PWA, transcript, command UI, and cache"
    next_safe_action: "Use phase 009 for physical-device and accessibility release evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
---

# Feature Specification: Mobile PWA and Reconciliation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

Builds the installable foreground mobile experience for sessions, typed streaming work, reconnect reconciliation, foreground command controls, and offline read-only state. The PWA is implemented and component-tested.

**Key Decisions**: Keep connection, mutation, run, message, tool, approval, and queue state separate and reconcile them through epoch-sequenced relay envelopes. The client is an installable PWA built with Vite, React 19, and Untitled UI (React Aria + Tailwind), using explicit state machines for run and approval lifecycles and a virtualized transcript. It is organized as four surfaces — Home, Session, Review, and Attention Inbox — and renders the transcript as typed blocks: assistant text, thinking summary, plan/todo, tool call with inputs, file-edit diff, tool result, and usage/cost.

**Critical Dependencies**: Relay core from phase 003; Read-only auth boundary from phase 004; Harness/browser lane from phase 002

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Created** | 2026-08-10 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 9 |
| **Predecessor** | `../004-auth-and-tailnet-boundary/spec.md` |
| **Successor** | `../006-approval-and-remote-mutation/spec.md` |
| **Handoff Criteria** | All P0 checks pass with exact command evidence and the successor's inputs are versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Builds the installable foreground mobile experience for sessions, streaming work, reconnect reconciliation, explicit controls, and offline read-only state. Without a separate boundary, evidence and ownership would be mixed with adjacent implementation work and failures could be hidden by aggregate progress.

### Purpose

Deliver a bounded, independently verifiable workstream whose outputs and stop conditions are explicit before its successor relies on them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Installable responsive PWA with session cards, connection state, thread hydration, streamed message/tool rendering, and explicit run controls.
- Orthogonal reducers for connection, mutation, run, message, tool, approval, and queue state.
- Replay plus state/entry snapshot reconciliation and timestamped redacted offline read-only cache.

### Out of Scope
- Background prompt submission, offline approvals, or decision-bearing notifications.
- Protected mutation enablement before phase 006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/pi-remote/apps/pi-remote-web/src/App.tsx` | Relocated and implemented | Session, transcript, composer, review, attention, and responsive UI surfaces |
| `.pi/pi-remote/apps/pi-remote-web/src/state.ts` and `relay.ts` | Relocated and implemented | Transcript reducers, relay commands, snapshots, and reconnect flow |
| `.pi/pi-remote/apps/pi-remote-web/src/auth.ts` and `cache.ts` | Relocated and implemented | Device authentication and timestamped read-only cache |
| `.pi/pi-remote/apps/pi-remote-web/src/style.css` | Relocated and implemented | React Aria/Tailwind-derived visual system and typed-block presentation |
| `.pi/pi-remote/apps/pi-remote-web/public/` | Relocated and implemented | Manifest, icon, service worker, and offline shell assets |
| `.pi/pi-remote/apps/pi-remote-web/tests/App.test.tsx` | Implemented | Typed-block rendering and phone-to-relay command component evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The browser displays authoritative monotonic state. | Deltas assemble by content index, terminal messages replace drafts, tool updates replace partial state, and late acknowledgements cannot regress newer events. |
| REQ-002 | Reconnect is loss-aware. | Reauthentication, retained replay, state/entry recovery, snapshot barriers, and live handoff produce no duplicate visible content. |
| REQ-003 | User intent is explicit. | Prompt, steer, follow-up, abort, queued, rejected, and indeterminate states are distinct and no connection retry resubmits a mutation. |
| REQ-004 | Host-private data stays server-side. | Session cards use opaque IDs and redacted metadata; browser-supplied filesystem paths are rejected. |
| REQ-007 | The client is an installable PWA on the fixed stack. | Built with Vite, React 19, and Untitled UI (React Aria + Tailwind); run and approval lifecycles use explicit state machines; long transcripts are virtualized; the installable manifest, service worker, and offline shell pass an install check on a supported device. |
| REQ-008 | Four surfaces compose the information architecture. | Home (redacted session cards), Session (the typed block graph), Review (fetched approvals and policy), and Attention Inbox (mirroring the three attention classes) exist as distinct surfaces with no navigation dead ends and offline read-only parity. |
| REQ-009 | The transcript renders authoritative typed blocks. | Assistant text, thinking summary, plan/todo, tool call with inputs, file-edit diff, tool result, and usage/cost render as distinct typed blocks; unknown block kinds degrade to a safe placeholder without breaking ordering. |
| REQ-010 | Reconnect applies a coversThrough barrier. | The client applies a snapshot atomically, resumes deltas strictly after the snapshot's covered sequence, and never interleaves late pre-snapshot deltas; a retention miss or epoch change forces a fresh snapshot rather than a blend. |
| REQ-011 | The offline read-only cache has a lifecycle. | Cached content has retention bounds and eviction, and clears on logout, revocation, or epoch change; stale cache is visibly timestamped and never presented as live or decision-capable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Offline state is visibly stale and read-only. | Cached content has timestamps; prompt, approval, session mutation, and background queues are disabled while offline; local drafts never transmit automatically. |
| REQ-006 | Streaming remains accessible and bounded. | Rendering is frame-coalesced, announcements are rate-limited, focus is stable, and keyboard/touch basics pass before final device verification. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions and unresolved uncertainty. | The phase rollback is exercised safely and never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit compatibility handoff. | Parent, successor, testing, documentation, and release packets name the final outputs and limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status, policy, and operator guidance never present a failed or unrun boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An installed phone PWA can list sessions, open a thread, follow a real run, reconnect, and stop or steer it through explicit foreground controls.
- **SC-002**: Retention misses and old epochs force a snapshot barrier instead of silently blending states.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable relay envelope and auth contracts | Reducers churn or encode server internals | Freeze contracts at phase handoffs |
| Risk | Browser background behavior | Stale UI appears authoritative | Foreground revalidation, visible timestamps, read-only offline mode |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Evidence-producing checks have bounded timeouts and report the stated environment.

### Security
- Raw credentials, host paths, transcripts, tool payloads, and approval inputs never enter remote or durable evidence unless explicitly redacted.

### Reliability
- Every failure produces a named state and keeps dependent capability disabled.

---

## 8. EDGE CASES

### Data Boundaries
- Empty, oversized, malformed, foreign-workspace, stale-epoch, and retention-expired inputs have explicit outcomes.

### Error Scenarios
- Dependency unavailable: stop the phase and preserve the last known-safe capability set.
- Evidence conflict: mark the claim unresolved and re-run against the pinned target.

### State Transitions
- The implementation is built; physical-device and rollout evidence remain separate.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 5 owned surface groups and cross-phase consumers |
| Risk | 22/25 | Release- or security-critical boundary |
| Research | 12/20 | Research exists; live implementation evidence remains pending |
| Multi-Agent | 5/15 | Single owner by default; delegation requires explicit authorization |
| Coordination | 12/15 | 3 dependency groups |
| **Total** | **71/100** | **Level 3** |


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Browser background behavior | H | M | Foreground revalidation, visible timestamps, read-only offline mode |

---

## 11. USER STORIES

### US-001: Execute this phase safely (Priority: P0)

**As a** Pi remote-control implementer, **I want** this phase's boundary and evidence gates to be explicit, **so that** downstream capabilities cannot silently depend on unverified behavior.

**Acceptance Criteria**:
1. Given the phase dependencies are satisfied, when every P0 acceptance check passes, then the documented handoff is usable by the successor without widening scope.

### US-002: Stop on a failed boundary (Priority: P1)

**As an** operator, **I want** failed gates to keep dependent capability disabled, **so that** planning progress cannot be mistaken for release readiness.

**Acceptance Criteria**:
1. Given any P0 check fails, when status is reconciled, then the phase remains incomplete and the rollback or containment action is recorded.


---

## 12. OPEN QUESTIONS

- Which exact repository package paths and commands does implementation preflight confirm?
- Which P1 items, if any, does the operator explicitly defer after seeing evidence?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Decision record**: [decision-record.md](decision-record.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
