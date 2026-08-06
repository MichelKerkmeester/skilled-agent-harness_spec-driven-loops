---
title: "Implementation Plan: Guardrail Controls and Activation Gate"
description: "Plan to build the three named behavioral negative controls, the per-runtime-per-candidate activation matrix with a fail-open default, and the per-block rollback procedure that closes out candidates 002-006."
trigger_phrases:
  - "guardrail activation gate plan"
  - "behavioral negative control plan"
  - "activation matrix rollback plan"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for the guardrail negative-control and activation gate"
    next_safe_action: "Begin Phase 1 (control specification) once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:465090ae1643f68ae982951dbafc5ec6cf8acca1e3c45e51dbfa75a5effe0eae"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Guardrail Controls and Activation Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / JavaScript (matches the six runtime hook adapters under test) |
| **Framework** | Cross-runtime behavioral test harness spanning `render.ts`, `spec-gate-core.mjs`, and `prompt-advisor.ts` |
| **Storage** | Activation matrix as a versioned artifact (format decided in Phase 1); no database |
| **Testing** | New behavioral negative-control suite; existing per-runtime adapter test suites |

### Overview
Build three named behavioral negative controls (forbidden-comment reject, unsupported-completion block, governor scored scenarios) and a per-runtime-per-candidate activation matrix that activates a cell only when both behavioral and delivery evidence pass, defaulting every unknown or ambiguous cell to full emission. Document a per-block/per-runtime rollback procedure and map each of the seven named central risks to a control or monitoring entry. This packet defines and specifies the gate; it does not itself activate any of candidates 002-006.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (terminal negative-control suite and fail-open activation gate)
- [x] Success criteria measurable (three controls specified, six-runtime x five-candidate matrix, seven risks mapped, one worked rollback example)
- [x] Dependencies identified (Phase 001 receipts; candidates 002-006 supplying their own evidence)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-007)
- [ ] Tests passing (three behavioral negative controls, activation matrix schema validated)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary, this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-gated activation: a documented schema requires both a behavioral-control result and a delivery-receipt result before any runtime x candidate cell may activate; any missing, stale, or ambiguous input defaults the cell to full baseline emission (fail-open).

### Key Components
- **Behavioral negative-control suite (new)**: Forbidden-comment reject, unsupported-completion block, governor scored scenarios — each runs against the real guard, not a simulation.
- **Per-runtime-per-candidate activation matrix (new)**: A six-runtime x five-candidate grid; each cell records behavioral evidence, delivery evidence, and an activation/fail-open verdict.
- **Risk register (new)**: Maps each of the seven named central risks to a specific control or monitoring entry.
- **Rollback procedure (new)**: Per-cell disable-flag / clear-delivery-state / full-baseline-emission steps, worked through for one hypothetical cell as proof.

### Data Flow
1. Each candidate phase (002-006) runs its own shadow, negative-control, and delivery-receipt work and produces evidence in the schema this packet defines.
2. The activation matrix consumes that evidence per runtime x candidate cell.
3. A cell activates only when both behavioral and delivery evidence are present and passing; any other state (missing, stale, ambiguous, failing) defaults the cell to full baseline emission.
4. If a rollback trigger fires post-activation, the per-block/per-runtime procedure disables the flag, clears delivery state, and restores full baseline emission for that cell only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Specify the forbidden-comment reject negative control against a real comment-hygiene guard
- [ ] Specify the unsupported-completion-claim block negative control against a real guard
- [ ] Draft the governor scored-scenario rubric (not exact-string matching)

### Phase 2: Core Implementation
- [ ] Design the per-runtime-per-candidate activation matrix schema (fields, required evidence types, fail-open default)
- [ ] Map each of the seven named central risks to a control or monitoring entry
- [ ] Draft the per-block/per-runtime rollback procedure template

### Phase 3: Verification
- [ ] Execute the three behavioral negative controls and confirm each rejects/blocks the real case
- [ ] Populate the activation matrix with placeholder unknown-state cells and confirm every one defaults to emit
- [ ] Work one hypothetical candidate cell through the rollback procedure end-to-end as proof
- [ ] Confirm the evidence schema is consumable by 002-006 without modification
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral negative control | Forbidden-comment reject, unsupported-completion block, governor scored scenarios | New guardrail test suite |
| Fail-open default | Every activation matrix cell without both evidence types defaults to emit | Matrix schema validation |
| Worked rollback example | One hypothetical cell disabled end-to-end | Manual walkthrough, documented in checklist.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-measurement-and-receipts-foundation | Internal (sibling phase) | Not yet built | Activation cannot happen without shared receipt fields; the gate schema itself can still be designed now |
| Candidates 002-006 evidence | Internal (sibling phases) | Not yet built | No cell can activate until its owning candidate supplies both behavioral and delivery evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any activated cell regresses on a behavioral negative control, or delivery evidence for an activated cell is found to be stale or unproven.
- **Procedure**: Disable that cell's candidate flag for that runtime, clear its delivery state, and confirm the runtime returns to full baseline emission for that candidate; other cells are unaffected.
<!-- /ANCHOR:rollback -->
