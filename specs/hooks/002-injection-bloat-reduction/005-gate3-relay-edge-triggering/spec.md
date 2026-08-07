---
title: "Feature Specification: Gate-3 Relay Edge-Triggering"
description: "Planning spec: suppress delivery of an unchanged, repeated Gate-3 relay while gate state remains open, preserving first-ask, invalid-answer re-ask, task/scope-change re-ask, and recovery-reset behavior, so identical re-asks stop consuming per-turn budget without touching classification or enforcement."
status: complete
completion_pct: 100
trigger_phrases:
  - "gate 3 relay suppression"
  - "edge-triggered gate delivery"
  - "gate open-epoch dedup"
  - "suppress repeated gate question"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/005-gate3-relay-edge-triggering"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified Gate-3 shadow controls"
    next_safe_action: "Keep the consuming activation branch deferred pending runtime-specific delivery evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The scoped predicate uses confirmed session, lifecycle epoch, and a structured gate-state hash; the collision test proves the fallback components cannot alias."
      - "The observer remains shadow-only, so no gate row commits a consuming suppression decision without later runtime-specific delivery evidence."
---
# Feature Specification: Gate-3 Relay Edge-Triggering

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (shadow-only; candidate flag remains off) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 004-full-first-route-only-repeats |
| **Successor** | 006-pi-dispatch-and-compaction |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate-3 relay (`GATE_3_QUESTION` in `spec-gate-core.mjs`) re-delivers the identical question on every mutation-positive turn while gate state remains open, even when nothing about the task, scope, or answer state has changed since the last ask. The research measured this repeat at 521-522 bytes per later mutation-positive repeat and ranked it 5th of six reductions: medium-high guardrail risk, six configured/implemented runtimes plus a qualified Cursor lane, and "no universal activation" as its confidence verdict (research.md §5 Measured Baseline, §9 Ranked Reductions rank 5).

### Purpose
Suppress DELIVERY of an unchanged repeated Gate-3 relay while state is open, without touching classification or enforcement, so identical re-asks stop consuming per-turn budget while every genuine trigger — first ask, invalid answer, task/scope change, recovery — still emits in full.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Design a delivery-state suppression predicate for `GATE_3_QUESTION`, scoped by session, lifecycle epoch, and gate-state hash, gated behind an independent flag never combined with candidates 002-004 or 006 (research.md §11 rollout step 5: "shadow route-only/full-replay, Gate, and Pi candidates independently... do not combine flags")
- Preserve every already-conditionalized path exactly as-is: first-ask, invalid-answer re-ask, task/scope-change re-ask, recovery reset, and the existing read-only/terminal/self-bound/prebound/disabled/child silence
- Plan the shadow-first delivery-receipt instrumentation required before any output-affecting activation (research.md §10 Target Architecture: commit "delivered" only after a host receipt or pinned behavioral probe proves acceptance)
- Define the 11-row gate-matrix negative-control suite that must pass before activation

### Out of Scope
- Any change to `classifyIntent` or Gate enforcement outcomes — suppression is delivery-only, never classification
- Combining this flag with 002-opencode-route-line-bounding, 003-opencode-transform-dedup, 004-full-first-route-only-repeats, or 006-pi-dispatch-and-compaction
- Universal first-open-only suppression — the research explicitly rules this out because it "could weaken advisory/off-mode visibility" (research.md §7)
- Activation itself — this packet plans and shadows the candidate; the per-runtime-per-candidate activation gate is owned by 007-guardrail-controls-and-activation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Add a delivery-state suppression predicate for `GATE_3_QUESTION`, gated behind an independent flag, shadow-first |
| Adjacent spec-gate test file (exact path confirmed in Phase 1) | Modify | Add the 11-row gate-matrix negative-control suite |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delivery suppression predicate is scoped by session + lifecycle epoch + gate-state hash | Predicate function accepts and hashes all three inputs; unit-testable in isolation |
| REQ-002 | Suppression applies ONLY to delivery of an unchanged repeated relay while gate state is open | `classifyIntent` and enforcement code paths are provably untouched (`rg` shows no suppression-predicate call sites inside them) |
| REQ-003 | Every preserved path continues to emit exactly as before | First-ask, invalid-answer re-ask, task/scope-change re-ask, recovery reset, child bypass, disabled, and error paths pass unchanged in the gate-matrix suite |
| REQ-004 | The candidate ships shadow-first, off by default | An independent flag gates the suppression; shadow receipts show zero output diff before any activation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | An 11-row gate-matrix negative-control suite is authored | Suite covers: read-only, first positive, repeated-unchanged positive, invalid answer, valid A-E, new task/scope, recovery, enforcement denial, child bypass, disabled, error |
| REQ-006 | A per-block rollback path is documented | Disabling the candidate flag clears delivery state and returns to full baseline emission |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shadow receipts show zero output diff against baseline before activation
- **SC-002**: All 11 gate-matrix negative-control rows pass
- **SC-003**: The repeated-unchanged-positive row suppresses to ~0 B while every other row still emits its full baseline bytes (521-522 B where applicable)
- **SC-004**: `rg` confirms the suppression predicate has no call sites inside `classifyIntent` or the enforcement branch, proving delivery and enforcement stay separate
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Suppressing too broadly weakens advisory/off-mode visibility | Medium-high (research-flagged) | 11-row negative-control matrix gates activation; per-runtime-per-candidate activation gate (007) |
| Risk | A false-negative relevance classifier treats a genuine scope change as "unchanged" and wrongly suppresses | Medium | Suppression key includes gate-state + task/scope fingerprint, not a bare open/closed boolean |
| Dependency | Phase 001 canonical block IDs, hashes, and delivery-receipt fields | High - hard prerequisite per parent Phase Transition Rules | Do not activate until 001 lands; this packet can still shadow-plan against the current interface |
| Dependency | 004-full-first-route-only-repeats' shadow instrumentation pattern | Medium | If 004 has not landed first, this candidate builds the same receipt fields directly rather than reusing an unshipped helper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is a session+epoch+gate-state-hash key sufficient, or does the suppression predicate also need turn/message identity to avoid cross-turn aliasing? (research.md §10 Target Architecture)
- Which of the 11 gate-matrix rows require a live host receipt vs. a pinned behavioral probe before "delivered" can be committed?
<!-- /ANCHOR:questions -->
