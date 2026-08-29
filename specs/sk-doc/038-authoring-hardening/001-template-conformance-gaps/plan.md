---
title: "Plan: Template Conformance Gaps"
description: "Read each governing SKILL.md contract directly, test every accusation against a control before editing, fix only the templates that fail their contract, and record the ones that pass."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "template conformance gaps plan"
  - "authoring template control-first plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/001-template-conformance-gaps"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Ran a control per accusation; edited two templates and cleared two"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-template.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md"
    session_dedup:
      fingerprint: "sha256:ea9343400f14261b3d6dbebebc598644bab8caed5e401d9998b17c5f26bf3292"
      session_id: "2026-08-29-sk-code-032-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Template Conformance Gaps

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Each `sk-doc` creation packet pairs a `SKILL.md` contract with an `assets/` template. The contract states what an artifact must contain; the template is what an author actually copies. When the two disagree, the template wins in practice, and the disagreement propagates into every artifact authored from it. Two such disagreements were confirmed here: `sk-create-agent/SKILL.md` "Required Body Shape" item 7 against `agent-template.md`, and `sk-create-command/SKILL.md` Step 7 against `command-template.md`.

### Overview

Read each governing contract directly rather than from memory, test every template accusation against a control before touching the file, edit only the templates that genuinely fail their own contract, and record in full the accusations that did not survive their controls.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Both governing SKILL.md contracts read directly, with the specific clause identified: "Required Body Shape" item 7, and Step 7's required-argument rule.
- A control instrument chosen for each accusation that can grade the template the way real artifacts are graded, rather than the pattern that raised the accusation.

### Definition of Done

- Both confirmed templates carry the element their contract requires, in a position that does not disturb the template's own structure.
- Both cleared templates are unedited, and each clearance names the specific measurement error that produced the false accusation.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Control before edit. A template defect is a costly thing to get wrong in either direction: leaving a real one in place reproduces it in every future artifact, and editing an innocent one damages a document that was already correct and teaches the wrong lesson. Every accusation in this phase was therefore graded against a control first, and two of the four did not survive.

### Key Components

- `sk-create-agent/SKILL.md` "Required Body Shape" item 7: the clause requiring a related-resources section, and the rule `agent-template.md`'s skeleton contradicted.
- `sk-create-agent/assets/agent-template.md`: its `## 8. COMPLETE TEMPLATE` section opens a fenced skeleton; the fix belongs inside that fence, where the numbering is the generated artifact's, not the template's own.
- `sk-create-command/SKILL.md` Step 7: the rule that a required `<argument>` in `argument-hint` obliges a mandatory input gate.
- `tableFieldPresent()` in `validate-playbook-package.cjs`: the check that accepts the playbook scaffold's 9-column scenario table, and the reason the heading-shaped grep against the playbook template measured the wrong thing.

### Data Flow

Read the governing clause → locate the template that is supposed to satisfy it → build a control that grades the template the way a real artifact is graded → if the control fails, fix the template at the position its own structure allows → if the control passes, withdraw the accusation, leave the file untouched, and record why the original evidence was wrong.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read "Required Body Shape" item 7 and Step 7 directly from their SKILL.md files. Enumerate the four templates under accusation and map each to the clause it is claimed to violate.

### Phase 2: Core Implementation

Insert the related-resources section into `agent-template.md`'s fenced skeleton with the skeleton's summary heading renumbered behind it. Add the mandatory input gate block, and the instruction that governs when to retain it, to `command-template.md`. Build a scenario file from the shipped playbook scaffold and grade it with the real validator. Re-read `command-router-template.md` for a non-heading form of the same gate.

### Phase 3: Verification

Confirm the inserted agent-template pair sits inside the fenced skeleton and does not collide with the template's own later sections. Confirm the command-template gate and its downstream instance. Confirm both cleared templates carry no edit.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Controlled: a scenario file built from the shipped playbook scaffold and run through `validate-playbook-package.cjs`, which is the same instrument that grades real playbook packages, so a PASS is a measurement rather than an opinion. Structural: fence-boundary inspection of `agent-template.md` to prove the inserted headings live inside the skeleton block rather than in the template's own numbering. Presence: direct inspection of the gate block in `command-template.md`, of the placeholder-comment form in `command-router-template.md`, and of the gate in the downstream command that had shipped an ungated required argument.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-create-agent/SKILL.md` and `sk-create-command/SKILL.md` as the governing contracts.
- `validate-playbook-package.cjs` as the control instrument for the playbook-template accusation.
- No new packages and no network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible and narrow: `git checkout --` on the two edited templates restores the prior state in one step. Both edits are additive — a new section inside a fenced skeleton, and a new gate block — with the only deletion being a summary heading renumber. The two cleared templates need no rollback because they were never written to.

<!-- /ANCHOR:rollback -->
