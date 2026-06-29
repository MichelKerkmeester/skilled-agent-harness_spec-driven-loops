---
title: "Feature Specification: D5-R8 — Treat Agent I/O as advisory-only; name the real design gate"
description: "The general Agent I/O contract declares optional-advisory and that absence is never a refusal condition, but it never names the design gate; a reader could mistake an Agent I/O header for the enforcement mechanism in either direction."
trigger_phrases:
  - "d5-r8 agent io advisory only"
  - "agent io not the design gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/008-agent-io-advisory-only"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r8-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R8 — Treat Agent I/O as advisory-only; name the real design gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `008-agent-io-advisory-only` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The general Agent I/O contract declares `status: optional-advisory` and states that absence of any dispatch header or result envelope is never a refusal condition, but it never names what the actual design-enforcement gate is. A reader who lands on that contract can therefore mistake an Agent I/O header for the enforcement mechanism in either direction: read a present envelope as proof of a valid design handoff, or read an absent envelope as a clean pass. The scoped deny rule already exists in `cli_child_pairing.md` "Agent I/O Is Not The Gate", but a reader on the general contract is never pointed to it, so the gap is open at the exact place a reader is misled.

### Purpose
Append a single, single-sourced advisory-status note to the general Agent I/O contract that closes the gap. The note states that Agent I/O is advisory-only — a convenience header that may opportunistically carry manifest or result digests as data, never as authority — and names the enforceable design gate by reference: the design proof token plus the guarded boundary (guarded-proxy classification, the structured Open Design transport result, and parent re-validation). It states both failure directions (presence never substitutes for the gate; absence never passes a design handoff) and points by name to the `cli_child_pairing.md` "Agent I/O Is Not The Gate" section as the canonical scoped statement. This is a prose clarification only: it names what is not the gate and points to what is, adding no new checker, schema, or refusal reason. It completes the D5 cross-CLI survival dimension.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append a short advisory-status note to the general Agent I/O contract, immediately after the Contract Status section.
- State the advisory-only status, name the real gate (proof token + guarded boundary), and state both failure directions.
- Add a by-name pointer to the `cli_child_pairing.md` "Agent I/O Is Not The Gate" section so the scoped deny rules stay single-sourced.

### Out of Scope
- Any restatement of the full scoped deny prose, which remains owned by `cli_child_pairing.md` (referenced, not cloned).
- Any per-CLI sentence cloned into the three cli-* design contracts — they inherit the clarification through their existing cross-reference.
- Any new checker, schema, refusal reason, or change to the proof token, guarded-proxy classification, transport-result schema, or parent re-validation algorithm.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modified (append-only) | Append one "Advisory Status For Design Handoffs" note after the Contract Status section: advisory-only status, the real-gate naming, both failure directions, and a by-name pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate". 4 insertions, 0 deletions — every pre-existing section preserved byte-identical |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Advisory-only status stated in the general contract | the note states Agent I/O is a convenience header that may carry manifest/result digests as data, never as authority |
| REQ-002 | The real gate named | the note names the design proof token plus the guarded boundary (guarded-proxy classification, structured Open Design transport result, parent re-validation) as the authority |
| REQ-003 | Both failure directions stated | presence never substitutes for the gate; absence never passes a design handoff — neither direction can invert the gate |
| REQ-004 | Append-only — every pre-existing section preserved | `git diff` shows 4 insertions, 0 deletions; the Dispatch/Result/Handoff/Pre-Execution/Advisory/Evidence/Compatibility sections are byte-identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | By-name pointer single-sources the scoped deny rules | the note points to `cli_child_pairing.md` "Agent I/O Is Not The Gate"; the full deny prose is not restated |
| REQ-006 | No new enforcement introduced | the change adds no checker, schema, or refusal reason; the note states so explicitly |
| REQ-007 | cli-* contracts inherit by reference, no orphaned clone | no per-CLI sentence cloned into the three cli-* design contracts |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the appended note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who lands on the general Agent I/O contract is told that Agent I/O is advisory-only, is shown the real gate (proof token + guarded boundary) by reference, and is told both failure directions, so neither a present nor an absent Agent I/O header can be mistaken for a design handoff result.
- **SC-002**: The scoped deny rules stay single-sourced — the note references `cli_child_pairing.md` "Agent I/O Is Not The Gate" by name rather than cloning it — and the change introduces no new checker, schema, or refusal reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The note could be read as new enforcement rather than a prose clarification | Over-claiming a new gate would be dishonest and could imply behavior that does not exist | Frame it as a prose clarification that names what is not the gate and points to the existing authority; the note states it adds no checker, schema, or refusal reason |
| Risk | Cloning the deny rules into each cli-* contract would create drift | Three copies would diverge from the canonical statement | Single-source by a by-name pointer to `cli_child_pairing.md`; the cli-* contracts inherit through their existing cross-reference (decision recorded in §10) |
| Risk | The by-name pointer could break if the target section is renamed or moved | A reader would be sent to a missing section | The pointer names the section title verbatim; the target resolves today at `cli_child_pairing.md` line 174 and is untouched by this phase |
| Dependency | `agent-io-contract.md` `optional-advisory` status (landed) | Extended | Green — the advisory baseline the note extends |
| Dependency | `cli_child_pairing.md` "Agent I/O Is Not The Gate" (landed) | Referenced | Green — the canonical scoped statement, single-sourced by reference, read-only |
| Dependency | Design proof token + guarded boundary contracts (landed) | Named by reference | Green — the actual gate the note points to; not redefined |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The scoped deny rules have a single source of truth in `cli_child_pairing.md`; the note references them by name so they cannot drift, at the deliberate cost of keeping the pointer in sync if that section moves.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: The note does not weaken the gate. Nothing in it implies Agent I/O can authorize a design handoff; the gate authority (proof token + guarded boundary) is named by reference and not redefined or re-minted.
- **NFR-S02**: The change is append-only and adds no checker, schema, or refusal reason, so the enforceable behavior is byte-for-byte unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Present Agent I/O envelope, no transport result
- A handoff that carries an Agent I/O envelope but no structured transport result must still be denied by the gate. The note states presence never substitutes for the gate; the scoped deny rule in `cli_child_pairing.md` is the authority.

### Absent Agent I/O envelope
- A design handoff with no Agent I/O header is not thereby passed. The note states absence never passes a design handoff; the gate is the proof token plus the guarded boundary, independent of the header.

### Reader lands on the general contract first
- A reader who arrives at `agent-io-contract.md` (not the pairing contract) is now told the advisory-only status and is pointed by name to the canonical scoped deny rules, so the gap is closed at the place a reader is actually misled.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One appended H3 note (4 lines): advisory-only status + real-gate naming + both directions + by-name pointer, no running code |
| Risk | 9/25 | No code/DB; risk is the honest clarification-not-enforcement framing and keeping the single-source pointer accurate |
| Research | 5/20 | Consumes the landed proof-token + guarded-boundary gate and the existing `cli_child_pairing.md` deny rules; references rather than redefines |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. Two design choices are recorded rather than left open: (1) the clarification is single-sourced via a by-name pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate" and is NOT restated per-CLI — the three cli-* design contracts inherit it through their existing cross-reference, so no clone was added; (2) the change is a prose clarification, not enforcement — it names what is not the gate (Agent I/O headers) and points to the authority (the proof token plus the guarded boundary), adding no new checker, schema, or refusal reason. This is the last D5 phase; D5 cross-CLI survival is complete after it.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
