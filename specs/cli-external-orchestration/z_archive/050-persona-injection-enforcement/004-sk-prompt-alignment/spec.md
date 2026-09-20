---
title: "Feature Specification: sk-prompt Persona-Injection Alignment"
description: "Install the canonical Persona Injection section into sk-prompt-models/assets/cli-prompt-quality-card.md — the single home every cli-* mode SKILL persona rule references — and confirm no other sk-prompt dispatch-packaging reference needs the step."
trigger_phrases:
  - "sk-prompt persona injection alignment"
  - "cli-prompt-quality-card persona section"
  - "canonical persona injection home"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/004-sk-prompt-alignment"
    last_updated_at: "2026-08-19T11:31:00Z"
    last_updated_by: "claude"
    recent_action: "Installed canonical Persona Injection section in the card; cline-verified APPROVE 96/100"
    next_safe_action: "Author P5 verification sweep (005-verification)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md"
      - "../002-persona-injection-contract/scratch/persona-injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-004-skprompt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-prompt Persona-Injection Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The six mode `SKILL.md` persona rules added in P3 each reference a canonical "Persona Injection" section in `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`, but that section did not yet exist — the references were forward-looking. Until the canonical section is present, the mode rules point at nothing and an orchestrator following a reference lands on a card with no persona guidance.

### Purpose
Install the canonical Persona Injection section into the CLI Prompt Quality Card (the single source all six cli-* thin cards and six mode SKILLs already reference), so every P3 reference resolves to authoritative guidance. Confirm no other `sk-prompt` dispatch-packaging reference needs the step; add it only where a real dispatch-packaging contract exists (scope-locked — no unrelated card cleanup).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`: add a canonical "Persona Injection" section (rule, runtime-aware resolution, native-vs-inline mechanism, inline block format, guard + exceptions).
- `sk-prompt/sk-prompt-improve/**`: audit for any dispatch-packaging reference that must also carry the persona step; align only if one genuinely owns dispatch packaging.

### Out of Scope
- The pre-existing MIRROR SYNC drift in the card ("three cards"; `cli-opencode` listed twice): unrelated to persona injection; left untouched and flagged for the operator (SCOPE LOCK — no adjacent cleanup).
- The six mode `SKILL.md` files and the hub (that was P3).
- Agent `.md` personas, `mode-registry.json`, routing behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | Modify | Add canonical §6 Persona Injection; renumber trailing sections 6/7/8 → 7/8/9 |
| `.opencode/skills/sk-prompt/sk-prompt-improve/**` | Audit | Confirmed no persona-owning dispatch-packaging ref; no edit made |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical section added | The card has a "Persona Injection" section covering rule, resolution, mechanism, inline block, guard, exceptions |
| REQ-002 | Section matches the contract | Content matches `persona-injection-contract.md` `§1`–`§6` (resolution table, native-vs-inline table, inline block, exceptions) |
| REQ-003 | P3 references resolve | The section title matches what the six mode rules reference ("Persona Injection") |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | sk-prompt-improve audited | Any dispatch-packaging ref that owns persona injection is aligned; if none, the determination is recorded |
| REQ-005 | Renumber-only elsewhere | Sections 1–5 unchanged; only the three trailing section headers renumbered |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "PERSONA INJECTION" cli-prompt-quality-card.md` finds the new §6.
- **SC-002**: The card diff is insertion + renumber only (`64 insertions(+)`, `3 deletions(-)` = the three renumbered headers).
- **SC-003**: An independent review confirms the section matches the contract with no P0/P1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renumbering corrupts a trailing section | Broken card structure | Pre-written edits anchored on unique headers; diff + independent verify + section-order check |
| Risk | Scope creep into the MIRROR SYNC drift | Out-of-scope change | Left untouched; flagged for the operator instead |
| Dependency | P2 contract + P3 references | Supplies section content + the reference target name | `002` and `003` complete + validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The section is the single canonical copy; mode SKILLs reference it by path, so there is no duplicated content to drift.

### Maintainability
- **NFR-M01**: Placing the canonical section in the card (already the single CLI prompt-craft source) keeps the hub thin and the mode rules short.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Devin path shape**: the inline-block placeholder is `<dir>/<name>.md`; Devin's is `<name>/AGENT.md`. The §6.1 table is authoritative; the block carries a one-line note after reconciliation.
- **Forward references from P3**: the mode rules referenced this section before it existed; installing it closes those references within the same packet before merge.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium. Single-file change, but it installs canonical content that seven other files reference, and it renumbers sections — so accuracy of the section body and clean renumbering both matter.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The pre-existing MIRROR SYNC drift is recorded for the operator as a separate, out-of-scope cleanup.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Previous phase**: See `../003-cli-mode-enforcement/spec.md`
- **Next phase**: See `../005-verification/spec.md`
- **Contract (input)**: See `../002-persona-injection-contract/scratch/persona-injection-contract.md`
