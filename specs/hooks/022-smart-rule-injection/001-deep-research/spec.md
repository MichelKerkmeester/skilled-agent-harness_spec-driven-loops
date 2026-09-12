---
title: "Feature Specification: Prompt-time rule injection research"
description: "Ask whether repo rules should be injected at prompt time keyed on what the user typed, and name the bar an injection candidate must clear to earn a slot."
trigger_phrases:
  - "prompt-time rule injection research"
  - "inject repo rules on a prompt"
  - "reach a read-only turn"
  - "injection candidate bar"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/022-smart-rule-injection/001-deep-research"
    last_updated_at: "2026-09-12T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Research closed: prompt-time injection refused, corpus stays at the gate"
    next_safe_action: "Read the decision record and carry the refused set forward"
    blockers: []
    key_files:
      - "decisions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-12-smart-rule-injection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Prompt-time rule injection research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `022-smart-rule-injection` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Successor** | `002-event-triggered-injection` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the prompt-keyed question: should a repo rule be injected when the user's text calls for it? It ran ten research iterations with no early convergence on DeepSeek V4.1 Flash at max thinking through `cli-pi`, refused eighteen candidates, and returned a deciding bar plus one uncovered read-side obligation with its promotion target.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Repo rules load at Gate 5, which fires on the first write of a session. A read-only turn never fires it, so a rule whose obligation binds while reading is silent at exactly the moment it is needed. An earlier round hit this twice, refusing a context-gathering rule and a design-loading rule for the same reason.

### Purpose

Decide from repository evidence whether prompt-time injection is the right surface for any rule, and name the bar a candidate must clear so the question is settled rather than re-litigated.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The prompt-keyed question: does a rule earn a slot by being injected when the user's text matches, and if so which rule.
- The deciding bar, stated against this repository's own precedent.
- Every refused candidate with the test that refused it.

### Out of Scope

- Building a hook. This phase decides whether any rule qualifies; a hook for a set that empties is scaffolding.
- Writes to the rule corpus or the resident layer, which belong to the operator decision this phase names.

### Files to Change

None. The phase output is evidence: ten iteration records and a refused-candidate set that feed the parent decision record.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every refused candidate names the test that refused it | The refusal set lists eighteen candidates, each with its deciding test |
| REQ-002 | The bar states why a restatement of an always-loaded disposition does not qualify | The bar sentence names the gate whose prohibition a candidate must carry |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Any read-side obligation left uncovered is named with its promotion target and owner | One item names the clause, the resident-layer location, and the operator as owner |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries.
- **SC-002**: The corpus stays at Gate 5; a rule with no gate behind it is not injectable.
- **SC-003**: The one uncovered read-side obligation is promoted into the resident layer rather than carried by a hook; the promotion is an operator decision, not a build step here.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A candidate looks eligible because its prohibition is already covered by a gate | A dead rule occupies a slot | Apply the bar against the gate that enforces the prohibition, not against the candidate's wording |
| Dependency | The always-loaded resident document and the gate corpus | The bar cannot be applied without both texts | Read both before judging a candidate; cite the line each candidate would duplicate |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The promotion of the delegation self-lens clause into the resident layer is owned by the operator, and it shares a table with the evidence-boundary fix from phase 3, so the two should land deliberately together.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Decision record:** `../decisions.md`
- **Successor:** `../002-event-triggered-injection/spec.md`
