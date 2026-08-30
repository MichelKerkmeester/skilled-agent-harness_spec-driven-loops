---
title: "Feature Specification: Runtime-Neutral Goal Dispatch"
description: "Make the speckit goal offer dispatch by runtime instead of calling one runtime's tool, and make the stale-filename assertion path-specific so a spec document named goal.md stops colliding with it."
trigger_phrases:
  - "runtime neutral goal"
  - "goal offer dispatch"
  - "stale filename assertion"
  - "goal_prompt_choice"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/003-runtime-neutral-goal-dispatch"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the dispatch table and tighten the assertion"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/"
    session_dedup:
      fingerprint: "sha256:f9c9ff88c169cd83fa2c5606a0c1b221ad4aca883ea7392363d617b65515ee2a"
      session_id: "2026-08-29-042-003-runtime-neutral-goal-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The offer stays tool-free; only the set action dispatches, and it dispatches per runtime"
---

# Feature Specification: Runtime-Neutral Goal Dispatch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/042-nested-goal-template-addon |
| **Predecessor** | 002-durable-slice-validator |
| **Successor** | 004-parent-set-string-playbook |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The speckit commands already offer to set a session goal, and the offer calls one runtime's tool by name. That tool has no adapter in three of the runtimes this repository supports, including the one whose native goal surface is the reason the offer exists. Separately, a contract test forbids the substring `goal.md` anywhere in the touched command files, so a document of that name cannot be referenced from the surface that should reference it.

### Purpose
The goal offer works in whichever runtime the operator is actually in, and a document named goal.md can be named.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A dispatch table for the set action, resolved by runtime rather than hard-coded to one tool.
- The offer stays tool-free, as it already is.
- The objective passed through stays pointer-sized rather than carrying a file body.
- The stale-filename assertion narrowed to the command path it was written to guard.

### Out of Scope
- Building a goal adapter for any runtime that documents its absence as by-design - a different decision with its own blast radius.
- Changing what the offer asks the operator - offer, skip and set stay as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/assets/*.yaml` | Modify | Runtime-resolved dispatch for the set action |
| `.opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | Modify | Stale-filename assertion made path-specific |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The set action resolves its dispatch by runtime rather than naming one runtime's tool unconditionally |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A spec document named goal.md can be referenced from a command file without failing the contract test |
| REQ-004 | The objective carried through the offer stays a pointer, never a file body |
| REQ-005 | No runtime gains a fabricated adapter; a runtime without one hands off instead |
| REQ-002 | The offer continues to call no tool at all |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The contract test passes with a command file that names the goal document.
- **SC-002**: The offer path calls no tool, before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The goal document shape from phase 1 | Nothing to check or point at | Phase 1 lands first |
| Risk | Narrowing the assertion weakens the guard it was written for | Med | Narrow to the command path, so a real stale command reference still fails |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Cost is a few file reads, matching the sibling rules and references.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Reads packet documents only; writes nothing.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: A packet without a goal document is unaffected.
- **NFR-R02**: An unreadable document degrades to a reported finding rather than a crash.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty durable slice is reported as shape, not silently accepted.
- Maximum length: the durable slice has a budget; the file as a whole does not.
- Invalid format: a document whose headings cannot be found is reported rather than skipped.

### Error Scenarios
- Not applicable; nothing external is called.
- Not applicable.
- Concurrent access: not applicable; these are authored files.

### State Transitions
- Partial completion: a half-authored document reports its missing parts by name.
- Not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eight command assets and one contract test |
| Risk | 10/25 | Auth: N, API: N, Breaking: N; the offer is operator-facing |
| Research | 4/20 | Runtime surfaces already mapped |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


