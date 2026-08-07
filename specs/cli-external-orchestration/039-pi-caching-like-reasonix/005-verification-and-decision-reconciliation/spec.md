---
title: "Feature Specification: Cross-Extension Verification + Superseding Decision Record"
description: "Verify zero functional overlap between the patched pi-cache-optimizer and deep-pi via real payload diffs (not stats visibility), confirm no regression via a controlled A/B workload, and author a superseding decision record under ADR-001's documented re-entry contract."
trigger_phrases:
  - "cache split verification"
  - "superseding decision record deepseek"
  - "deepseek cache overlap check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/005-verification-and-decision-reconciliation"
    last_updated_at: "2026-08-07T14:54:04Z"
    last_updated_by: "spec-author"
    recent_action: "Composition verified; decision Accepted; optional phase 6 added"
    next_safe_action: "None — this phase's own scope is closed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REVIEW FIX: this phase's decision record is called 'the superseding decision record' in prose (not 'ADR-002') to stop contradicting decision-record.md's own ADR-001 heading, which the template's fixed anchor contract requires."
      - "Direct wire-payload capture via extension instrumentation was attempted; produced no observable output; the cause was not conclusively diagnosed (deep-pi's own code successfully uses `fs`/`process` elsewhere, e.g. `hashlines.ts`, so a blanket sandboxing explanation is not fully supported — treat this as an inconclusive negative result). Composition proof uses the observable pi-cache-optimizer-stats.json channel plus source-level predicate equivalence instead — documented as a limitation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Cross-Extension Verification + Superseding Decision Record

---

## EXECUTIVE SUMMARY

Phases 003 and 004 each patch and install one extension in isolation. This closing phase runs them together, proves the DeepSeek/non-DeepSeek split holds with zero overlap and zero regression using real payload diffs (not stats visibility), and records the packet's superseding decision record so the re-entry into `002-synthesis-and-decision`'s ADR-001 build-gate closure is evidence-backed, not assumed.

**Key Decisions**: Verification-only scope (no new code changes here); the superseding decision record narrowly supersedes ADR-001's build-gate closure, grounded in the operator's materially increased DeepSeek usage, not force-fit into an unrelated revisit trigger.

**Critical Dependencies**: Phases 003 and 004 must both be complete before this phase's checks are meaningful.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-adopt-deep-pi-deepseek |
| **Successor** | 006-fork-and-improve-deep-pi (optional hardening pass, added 2026-08-07; not a required continuation of this phase's scope) |
| **Handoff Criteria** | Zero-overlap verified live via the observable stats-file channel plus source-level predicate equivalence (a raw wire-payload capture attempt produced no observable output, cause not conclusively diagnosed — see Known Limitations); no regression against a fresh A/B baseline; superseding decision record Accepted; parent 039 phase map and completion status reconciled — met |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5**, the closing phase of the "Split DeepSeek vs. non-DeepSeek Pi cache-optimization ownership" work.

**Scope Boundary**: Verification and documentation only. No new code changes — phases 003 and 004 already made every code/install change; this phase proves they compose correctly and reconciles the packet's decision trail.

**Dependencies**:
- `003-fork-and-guard-cache-optimizer` complete (patched fork active, narrow `isDeepPiOwned` guard on all 6 model-specific hooks)
- `004-adopt-deep-pi-deepseek` complete (`deep-pi` installed and DeepSeek-activation confirmed)

**Deliverables**:
- Cross-extension overlap verification via real payload/prompt diffs (patched optimizer no-ops on `deepseek-v4-flash`/`deepseek-v4-pro`; deep-pi no-ops elsewhere)
- Non-regression confirmation against a fresh A/B baseline, not the historical cumulative 89% figure
- `decision-record.md` (this file's own ADR-001), superseding `002-synthesis-and-decision`'s ADR-001 build-gate closure
- Parent `../spec.md` phase map and `../graph-metadata.json` reconciled to reflect this re-entry
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 003 and 004 each verify their own piece in isolation (the fork's diff scope; deep-pi's self-gating). Neither phase proves the two extensions actually compose correctly when installed together, and neither phase reconciles this re-entry against `002-synthesis-and-decision`'s ADR-001, which explicitly closed the build gate and required "a new phase child and a superseding ADR" to reopen it. A fresh review also found that comparing live stats-counter visibility isn't sufficient proof of zero overlap — it doesn't diff the actual outbound system prompt or provider payload, so a subtler double-mutation could pass a shallow check.

### Purpose
Close the loop: run the DeepSeek and non-DeepSeek smoke tests with both extensions installed simultaneously, diff real request payloads (not just stats visibility) to confirm no double-mutation, confirm no regression against a controlled A/B baseline, and record the superseding decision — a narrow supersession of ADR-001's build-gate closure grounded in the operator's materially increased DeepSeek usage (this is a fork-and-split of an existing package plus adoption of a second narrowly-scoped one, not the broad greenfield Reasonix-parity plugin ADR-001 rejected).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Live verification with a request/payload capture harness: DeepSeek-direct-API session (`deepseek-v4-flash`/`deepseek-v4-pro`) shows only `deep-pi`'s prompt/payload mutation, zero `pi-cache-optimizer` mutation
- Live verification: non-DeepSeek session (including `opencode/deepseek-v4-flash-free`, the confirmed real edge case from phase 003) shows only `pi-cache-optimizer` activity, zero `deep-pi` activity
- Exercise both extension load orders and a mid-session model switch (DeepSeek to non-DeepSeek and back), not just a single static session per provider
- Author `decision-record.md` (this file's own ADR-001) superseding `002-synthesis-and-decision`'s ADR-001 build-gate closure, grounded explicitly in the changed premise (materially increased DeepSeek usage), not force-fit into an unrelated revisit trigger
- Reconcile `../spec.md` Phase Documentation Map (mark 003/004/005 with real status) and top-level METADATA Status field, and `../graph-metadata.json` `children_ids`/`derived.status`

### Out of Scope
- Any further code changes to either extension — that would be new work, not verification
- Re-litigating whether `pi-cache-optimizer` or `deep-pi` should exist at all — ADR-001 already settled that; this decision record only settles the narrower split-and-adopt question

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | This file's own ADR-001, superseding `002-synthesis-and-decision`'s ADR-001 |
| `../spec.md` (parent) | Modify | Phase Documentation Map status update; top-level Status field (should already be updated at phase 003 start, not deferred to here — verify, don't re-author) |
| `../graph-metadata.json` (parent) | Modify | `derived.status` / `last_active_child_id` refresh |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero-overlap verified with both extensions installed simultaneously, via real payload diffs | A request-capture harness (or manual payload log comparison) shows the DeepSeek-direct-API session's outbound system prompt/payload was touched only by `deep-pi`; the non-DeepSeek session's was touched only by the patched `pi-cache-optimizer` |
| REQ-002 | No regression to non-DeepSeek behavior, measured via a controlled A/B workload | An identical scripted workload run before and after the patch, with session-scoped (not cumulative) counters, shows hit-rate/token-cache delta within an agreed tolerance — not a comparison against the historical 89% figure |
| REQ-003 | The superseding decision record is authored and resolves the re-entry honestly | `decision-record.md` states the actual grounding premise (materially increased DeepSeek usage) rather than forcing the claim into an unrelated ADR-001 revisit trigger, and explicitly notes which of ADR-001's three original triggers does or doesn't apply |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Parent packet metadata reconciled | `../spec.md` Phase Documentation Map AND top-level METADATA Status field, plus `../graph-metadata.json`, show phases 003-005 with accurate status, not left at "Complete" from before this re-entry |
| REQ-005 | Non-DeepSeek regression check cites the exact fresh baseline it was compared against | `checklist.md` CHK-021 records the literal before/after session-scoped figures, not the historical cumulative `pi-cache-optimizer-stats.json` totals |
| REQ-006 | ADR-001 in `002-synthesis-and-decision/decision-record.md` is cross-referenced, not edited | `git diff` on that file shows no changes originating from this phase |
| REQ-007 | The `lumo.md` originating capture stays untouched | File content/hash unchanged from before this phase started |
| REQ-009 | Mid-session model switch (DeepSeek to non-DeepSeek and back) exercised, not just static per-provider sessions | A single live session that switches models mid-conversation shows correct hand-off with no stale-extension activity |

### P2 - Optional (defer with reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `checklist.md` verification-summary counts match the actual checked items after execution | Manual reconciliation: P0/P1/P2 totals in the summary table equal the count of `[x]` items in each priority tier |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single Pi environment with both extensions installed shows exactly one active cache-optimization path per provider (never zero, never both), proven via payload diff, not stats visibility alone
- **SC-002**: The packet's documentation trail is internally consistent — ADR-001's NO-GO, the superseding decision record's narrow supersession, and the three phases' real status all agree, with no "ADR-002 vs. this-file's-ADR-001" naming contradiction anywhere in the packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 and 004 both complete | Cannot verify composition of work that doesn't exist yet | Explicit `Predecessor` chain enforces order |
| Risk | Verification finds a real overlap or regression | Would mean phase 003's guard or phase 004's gating assumption was wrong | Route back to the relevant phase's tasks.md rather than patching around it here (verification-only scope) |
| Risk | Stats-visibility check alone hides a subtler payload-level double-mutation | A prior draft relied on `/cache-optimizer stats` visibility only; confirmed insufficient by review | REQ-001 requires an actual payload/prompt diff, not just counter visibility |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Composition verification adds no measurable latency to normal Pi session startup — both extensions already self-gate by provider, so co-installing them should not introduce a new per-request check beyond each extension's existing model-match test

### Security
- **NFR-S01**: Neither extension's stats/telemetry file gains secret or credential exposure from running together (mirrors the existing `pi-cache-optimizer` guarantee: dates and counters only)

### Reliability
- **NFR-R01**: A composition-verification failure must never be silently absorbed — REQ-001/REQ-002 failing routes back to phase 003 or 004, not a quiet Accepted stamp on the decision record

---

## 8. EDGE CASES

### Data Boundaries
- Model switched mid-session (DeepSeek to non-DeepSeek or back): REQ-009 now requires this be actively exercised, not just assumed safe because each extension re-evaluates its own model-match per request

### Error Scenarios
- `deep-pi` fails to install or load: phase 004's rollback plan applies; this phase's verification simply cannot proceed and must report BLOCKED, not skip ahead
- Patched `pi-cache-optimizer` fork is unreachable (network/host issue): local Pi install falls back to whatever was last resolved; this phase's non-DeepSeek regression check would surface it as a stats anomaly

### State Transitions
- Partial rollback (only one of the two extensions reverted): explicitly out of scope for a clean Accepted state on the decision record — it only closes when both phases 003 and 004 are complete together

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Verification (now including a payload-diff harness, not just stats) + one decision-record file; no new source files |
| Risk | 18/25 | Live composition test on daily-driver Pi tooling; a false PASS would hide a real double-mutation regression |
| Research | 5/20 | Evidence already gathered this session (source reads of both extensions, confirmed via live grep); no new research needed |
| Multi-Agent | 0/15 | Single-thread verification, no parallel workstreams |
| Coordination | 10/15 | Hard-sequenced after phases 003 and 004; no other dependencies |
| **Total** | **45/100** | **Level 3** (architecture-decision documentation, not scope size, drives the level) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Composition verification passes on a shallow check but a real overlap exists on an untested code path | H | M | REQ-001 requires an actual payload/prompt diff harness, not stats visibility; REQ-009 requires a mid-session model switch |
| R-002 | The superseding decision record gets marked Accepted before verification actually runs | H | L | `checklist.md` CHK-040 explicitly gates the status flip on CHK-020/021/022 passing first |
| R-003 | Parent packet metadata reconciliation (REQ-004) is skipped, leaving `graph-metadata.json` inconsistent with real folder state | M | M | T007/T008 in `tasks.md` make this an explicit, separately-tracked task |

---

## 11. USER STORIES

### US-001: Confirm the split actually holds (Priority: P0)

**As the** operator increasing DeepSeek usage, **I want** proof — from an actual payload diff, not just stats visibility — that `deep-pi` and the patched `pi-cache-optimizer` never both touch the same request, **so that** I can trust the caching setup instead of discovering a silent double-mutation later.

**Acceptance Criteria**:
1. Given both extensions installed, When a DeepSeek-direct-API session runs, Then a payload diff shows only `deep-pi`'s mutation.
2. Given both extensions installed, When a non-DeepSeek session runs, Then a payload diff shows only the patched `pi-cache-optimizer`'s mutation, and its hit rate matches a fresh A/B baseline, not the historical 89% figure.

---

### US-002: Get an honest decision record, not a rubber stamp (Priority: P1)

**As the** operator, **I want** the superseding decision record to only claim Accepted once real verification evidence exists, and to state its actual grounding premise honestly rather than force-fitting an unrelated trigger, **so that** the packet's decision trail stays trustworthy for future re-entry decisions.

**Acceptance Criteria**:
1. Given verification has not yet run, When `decision-record.md` is read, Then its status reads Proposed, not Accepted.
2. Given verification passes, When the status is updated, Then it cites the specific checklist items that passed as evidence, and its stated premise is "materially increased DeepSeek usage," not a stretched fit to an unrelated ADR-001 trigger.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None outstanding at planning time — this phase's job is to answer the open questions phases 003/004 raised (fork hosting choice, `after_provider_response` guard scope) with real evidence, not to raise new ones.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Predecessor**: `../004-adopt-deep-pi-deepseek/spec.md`
- **Superseded decision**: `../002-synthesis-and-decision/decision-record.md` (ADR-001)
