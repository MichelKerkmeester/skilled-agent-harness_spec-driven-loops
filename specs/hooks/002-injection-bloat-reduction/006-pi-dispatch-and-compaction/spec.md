---
title: "Feature Specification: Pi Dispatch and Compaction"
description: "Planning spec: design a semantic-preserving compact rewrite of Pi's subagent-dispatch directive and a compaction-aware dedup reset, behind a prototype flag, while retaining the full dispatch guard until an executed, size-proven, semantics-preserving replacement exists."
status: complete
completion_pct: 100
trigger_phrases:
  - "pi dispatch directive compaction"
  - "pi subagent dispatch shrink"
  - "compact pi arbitration"
  - "pi dedup reset after compaction"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified Pi shadow controls"
    next_safe_action: "Keep the prototype disabled pending activation review"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The five semantic markers are covered by the focused Pi test matrix; the 165-byte candidate remains shadow-only and is never emitted."
      - "The tested session_compact and resume/fork session_start paths reset the shadow epoch; without an observed host receipt, confirmation remains UNSEEN and fail-open."
---
# Feature Specification: Pi Dispatch and Compaction

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
| **Predecessor** | 005-gate3-relay-edge-triggering |
| **Successor** | 007-guardrail-controls-and-activation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`PI_SUBAGENT_DISPATCH_DIRECTIVE` in `prompt-advisor.ts` emits a 554-byte dispatch directive on every non-empty parent input, even on advisor failure, and by policy is never copied into child prompts. The research measured a Pi-only composite of 1,362/1,885 bytes (non-Gate/Gate) and ranked a semantic-preserving compact rewrite 6th of six reductions: "Less than modeled 424 B until executed," high guardrail risk, prototype-only confidence (research.md §5, §9 rank 6). A naive 130-byte reminder / 177-byte replacement was explicitly eliminated because it "omits/unproves native default, explicit current-turn override, preload, anti-signal, and child exclusion semantics" (research.md Eliminated Alternatives).

### Purpose
Design, but do not yet execute, a semantic-preserving compact rewrite of the Pi dispatch directive and a compaction-aware dedup reset, behind a prototype flag, while the full 554-byte directive remains the unconditional fallback on Pi advisor failure until an executed, size-proven, five-semantics-preserving replacement exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate the five dispatch semantics the eliminated 130-byte reminder lost: native default behavior, explicit current-turn override, preload, anti-signal, and child-prompt exclusion
- Map each of the five semantics to a concrete test case before any prototype serializer is written
- Design a prototype-flag-gated compact directive candidate, shadow-only, never combined with candidates 002-005
- Design a compaction-aware dedup reset so a Pi compact/session boundary resets delivery state and triggers full-directive replay (research.md §10 Target Architecture: "Compaction/resume resets delivery state and triggers full replay")
- Retain the existing full `PI_SUBAGENT_DISPATCH_DIRECTIVE` as the fail-open baseline on every Pi advisor-failure path

### Out of Scope
- Executing or shipping the compact serializer on any emitted or live dispatch path — research confidence for this candidate is "Low-medium; prototype only". The one-time shadow computation required to record its executed byte count is in scope and never reaches an emitted path
- Citing the ~424 B modeled saving as realized before an executed measurement exists
- Weakening or removing the dispatch guard on Pi advisor-failure paths
- Copying the dispatch directive into child prompts — already excluded by existing policy, unchanged by this packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Add a prototype-flag-gated compact directive candidate and a compaction-aware dedup reset, shadow-first |
| Adjacent Pi advisor test file (exact path confirmed in Phase 1) | Modify | Add the five-semantics test matrix and the fail-open negative control |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The five preserved semantics are explicitly enumerated as acceptance gates | Native default, explicit current-turn override, preload, anti-signal, and child exclusion each have a named test case |
| REQ-002 | The existing full `PI_SUBAGENT_DISPATCH_DIRECTIVE` remains the unconditional fallback on advisor failure | A negative control proves the full directive still emits when the Pi advisor fails, with the prototype flag both on and off |
| REQ-003 | Any compact-directive prototype ships behind its own flag, shadow-only | Flag is independent of candidates 002-005; shadow mode produces zero output diff against the 554 B baseline |
| REQ-004 | Compaction/session-boundary resets dispatch dedup state | The next turn after a compaction/session boundary replays the full directive, not a suppressed repeat |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | An executed byte measurement is required before citing any modeled-savings figure | No document in this packet claims the ~424 B saving as realized without an executed measurement |
| REQ-006 | A per-block rollback path is documented | Disabling the prototype flag clears dedup state and returns to the full 554 B directive |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five preserved semantics is mapped to a specific test case before any prototype code is written
- **SC-002**: A shadow-mode prototype, once built in a later phase, shows zero output diff against the 554 B baseline until explicitly activated
- **SC-003**: An executed byte count for the compact candidate is recorded and compared against the 177 B ceiling and 424 B modeled saving, with the gap explained
- **SC-004**: A negative control proves Pi advisor failure still emits the full directive with the prototype flag both on and off
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A compact directive silently drops one of the five preserved semantics | High (research eliminated this exact failure mode once already) | Explicit per-semantic test case required before any prototype ships |
| Risk | The modeled 424 B saving gets cited as realized before execution | Medium | SC-003 requires an executed measurement before any savings claim anywhere in this packet |
| Dependency | Phase 001 canonical block IDs, hashes, and delivery-receipt fields | High - hard prerequisite per parent Phase Transition Rules | Do not activate until 001 lands; semantics-mapping and design work can proceed now |
| Dependency | 005-gate3-relay-edge-triggering's shadow-and-negative-control pattern | Low (informs design, not required) | Reuse the same shadow-first discipline; no hard coupling |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can a Pi compact serializer preserve all five current dispatch semantics, with parent/child and explicit-user-override receipts, and what is its executed exact size? (research.md §12)
- Does compaction reliably signal a fresh epoch for every Pi adapter path, or are there compaction variants that skip the reset?
<!-- /ANCHOR:questions -->
