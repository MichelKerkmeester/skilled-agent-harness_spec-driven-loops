---
title: "Feature Specification: Full-First + Route-Only Repeats"
description: "Planning spec: full policy on first delivery and verified lifecycle replay, route-only (~43 B) on eligible repeats for Claude/Codex/Devin and the OpenCode component, via a delivery-state machine gated shadow-first behind an independent flag until behavioral negative controls pass."
status: complete
completion_pct: 100
trigger_phrases:
  - "full first route only repeats"
  - "delivery state machine unseen delivered suppressed"
  - "lifecycle epoch policy replay"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-07T04:39:14Z"
    last_updated_by: "codex"
    recent_action: "Verified receipt-gated shadow reduction proof"
    next_safe_action: "Keep route-only delivery disabled pending activation review"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Full-First + Route-Only Repeats

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (shadow-only; candidate flag remains off) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `003-opencode-transform-dedup` |
| **Successor** | `005-gate3-relay-edge-triggering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Today every qualifying turn on Claude Code, Codex, Devin, and the OpenCode advisor component delivers the full ~806-byte advisor-plus-directives payload (`D=763 B` directives + `R=43 B` representative route), regardless of whether the exact same policy set was already delivered and accepted earlier in the same session/lifecycle epoch. Research's cost model shows a representative 10-turn session carries `N*806 + g*522 + c*389` shared configured bytes (~9,626 B), and the corrected recommended envelope - full policy on first delivery and verified lifecycle replay, route-only `43 B` on eligible repeats - models an 82.2% reduction on that same scenario (9,626 -> 1,715 B). This is the research's rank-4 candidate: "bytes high, behavior low; shadow/eval only," because unlike ranks 1-3 it changes what a runtime actually receives on a repeat turn, and a false suppression would silently drop a guardrail the fail-open contract requires. [SOURCE: research.md §6 Before/After Cost Model] [SOURCE: research.md §9 Ranked Reductions, rank 4] [SOURCE: research.md §10 Target Architecture]

### Purpose
Ship a delivery-state machine (`UNSEEN` -> `DELIVERED(hash, epoch)` -> `SUPPRESSED_SAME`) that delivers full policy on first delivery and on every verified lifecycle replay, and route-only (~43 B) delivery on a proven-eligible repeat, for Claude/Codex/Devin and the OpenCode component (with Cursor and Pi qualified but not activated by this phase). The machine must mark a block dirty on any semantic content change, advance the epoch on lifecycle/compaction/scope/policy/goal change, and never share dedup state across unknown sessions. This phase ships shadow-first behind an independent flag and stays shadow/eval-only until the named behavioral negative controls pass - it does not activate on its own schedule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A delivery-state machine per session + block ID: `UNSEEN` (never delivered this epoch) -> `DELIVERED(hash, epoch)` (delivered and the delivery is receipt-confirmed per phase 001) -> `SUPPRESSED_SAME` (a later identical-content, identical-epoch repeat is eligible for route-only delivery).
- Dirty-marking: any semantic content change to a block (a directive text edit, a different advisor route, a changed Gate question) immediately returns that block to a deliverable state regardless of prior `DELIVERED`/`SUPPRESSED_SAME` status.
- Epoch advancement: a lifecycle event (SessionStart source `startup`/`resume`/`compact`), a scope change, a policy-set change, or a goal change advances the epoch, and an epoch advance resets every block in that session to require full redelivery.
- Session isolation: state is keyed by a real, confirmed session identity; an unknown, unresolved, or ambiguous session identity NEVER shares or reads another session's dedup state, and always defaults to full delivery.
- Route-only rendering (~43 B) for Claude/Codex/Devin's shared path and the OpenCode advisor component, selected only when the state machine reports `SUPPRESSED_SAME` for the current epoch and block hash - Cursor and Pi are qualified in this phase's design but their route-only activation is out of scope (research marks them "qualified," not implementation-ready).
- Shadow-first rollout: the state machine and its route-only selection run in shadow (computed, logged, not consumed by the emitted response) until every named behavioral negative control passes; only then does the independent flag gate a real activation, and that activation decision belongs to phase `007-guardrail-controls-and-activation`, not this phase.
- Legacy renderers stay in place and are the default path throughout this phase's migration.

### Out of Scope
- Gate-3 open-epoch repeat suppression (phase `005-gate3-relay-edge-triggering`).
- Pi compact-serializer arbitration and a shorter Pi dispatch directive (phase `006-pi-dispatch-and-compaction`).
- Default-on activation of route-only delivery for any runtime - this phase ships shadow/eval-only; activation is gated by phase `007-guardrail-controls-and-activation`'s per-runtime-per-candidate rollout.
- Route-only delivery for Cursor or Pi - both are qualified by research but their runtime-specific delivery/receipt evidence is incomplete; this phase's route-only activation covers Claude/Codex/Devin and the OpenCode component only.
- Treating provider prompt-cache placement as a source of savings - unrelated to this state machine, already ruled out program-wide.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modify | Add the delivery-state machine, dirty-marking, and epoch-advancement logic on top of phase 001's block registry and receipts |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Add a shadow-first route-only rendering path selected by the state machine; legacy full rendering remains the default and only active path until activation |
| `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | Pass lifecycle/session-identity signals into the state machine for the Claude/Codex/Devin shared path |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Pass lifecycle/session-identity signals into the state machine for the OpenCode advisor component |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts` | Modify | Extend with state-machine transition tests |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts` | Create | The named behavioral negative-control suite gating activation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The state machine delivers full policy on first delivery and on every verified lifecycle replay | A fixture for a brand-new session and a fixture for a post-compaction/resume session both show full-policy delivery, never route-only |
| REQ-002 | Route-only delivery requires `SUPPRESSED_SAME` for the exact current epoch and block hash | A fixture with a changed block hash (dirty) or an advanced epoch shows full delivery, not route-only, even if the block was previously `DELIVERED` |
| REQ-003 | Unknown sessions never share or read another session's dedup state | A fixture with an unresolved/ambiguous session identity shows full delivery and no cross-session state read |
| REQ-004 | This phase's route-only path stays shadow-only (not consumed by the emitted response) until every named behavioral negative control passes | The negative-control suite (`policy-plan-negative-controls.vitest.ts`) enumerates long-context, advisor-failure, no-match, comment-writing, completion-proof, resume, and compaction cases, and the emitted response is unaffected by the shadow path in every one of them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Route-only rendering is implemented for Claude/Codex/Devin's shared path and the OpenCode advisor component | Fixtures for all four surfaces produce the modeled ~43 B route-only payload when `SUPPRESSED_SAME` applies |
| REQ-006 | Cursor and Pi are design-qualified but not activated by this phase | `plan.md`/`spec.md` document their qualification; no runtime code path activates route-only delivery for either in this phase |
| REQ-007 | Legacy full-policy renderers remain the default and only consumed path throughout this phase | Every fixture without an explicit activation flag set shows byte-identical output to the pre-phase-004 baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 10-turn representative scenario (`N=10, g=3, c=0, r=1`) computed against the shadow state machine reproduces research.md's modeled 9,626 -> 1,715 B (82.2%) reduction in shadow logs, without changing any emitted response.
- **SC-002**: Every negative-control case in `policy-plan-negative-controls.vitest.ts` passes with the shadow path active and the emitted response unchanged from the legacy baseline.
- **SC-003**: A dirty-marking fixture (content change) and an epoch-advancement fixture (lifecycle/compaction/scope/policy/goal change) both force full redelivery even immediately after a `DELIVERED` state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A false `SUPPRESSED_SAME` suppresses policy on a turn that actually needed full delivery (long-context drift, compaction loss, advisor failure) | Silently drops a guardrail; the exact failure mode research.md's Eliminated Alternatives section warns against | REQ-004/SC-002 - shadow-only until all seven named negative controls pass; activation is a separate phase-007 decision, not automatic |
| Risk | Epoch advancement is missed for a real lifecycle/compaction/scope/policy/goal change | A session would incorrectly suppress full delivery across a boundary that should have reset it | REQ-002/SC-003 fixtures cover lifecycle/compaction/scope/policy/goal changes explicitly; any missed trigger is a P0 defect, not an accepted gap |
| Risk | Cross-session state leakage for unresolved session identity | Would deliver route-only to a session that never actually received the full policy | REQ-003 - unknown sessions always default to full delivery, verified by fixture |
| Dependency | Phases `001-measurement-and-receipts-foundation`, `002-opencode-route-line-bounding`, and `003-opencode-transform-dedup` all shipped first | The state machine depends on canonical block IDs/hashes/receipts (001), a stable OpenCode compiled-route block identity (002), and stable message identity for the OpenCode component (003) | This phase's implementation does not start until all three predecessors are shipped and green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the delivery form a single ~292-byte consolidated capsule or per-directive IDs with independent lifecycle replay? Research.md leaves this open (parent spec.md Open Question 2); resolved during this phase's implementation and proven by the negative-control suite either way.
- What is the exact epoch-boundary signal set per runtime (SessionStart source values for Claude-derived runtimes; the equivalent for OpenCode's transform-scoped continuity)? Resolved from phase 001's fixture inventory before this phase's state machine is finalized.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Program Parent**: See `../spec.md`
- **Predecessor Phase**: See `../003-opencode-transform-dedup/spec.md`
- **Research Source**: See `../../001-per-prompt-injection-audit/research/research.md`

<!-- /ANCHOR:related-docs -->
