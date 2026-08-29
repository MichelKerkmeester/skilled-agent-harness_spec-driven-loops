---
title: "Tasks: Template Conformance Gaps"
description: "Ordered tasks: read the governing clauses, grade each accusation against a control, fix the two templates that failed, and record the two that were cleared."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "template conformance gaps tasks"
  - "authoring template control tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code/032-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening/001-template-conformance-gaps"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the template tasks; two templates fixed, two cleared by control"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-template.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md"
    session_dedup:
      fingerprint: "sha256:3c9906c0bcb187b0f9d08769baf3de603efc6d44495a81fc6601d8d4793e0ee8"
      session_id: "2026-08-29-sk-code-032-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Template Conformance Gaps

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the two governing clauses directly rather than from memory. Evidence: `sk-create-agent/SKILL.md` "Required Body Shape" item 7 requires a related-resources section; `sk-create-command/SKILL.md` Step 7 requires a mandatory gate whenever `argument-hint` carries a required `<argument>`.
- [x] T-002 Enumerate the four templates under accusation and map each to the clause it is claimed to violate. Evidence: `agent-template.md` and `command-template.md` against the two clauses above; `manual-testing-playbook-template.md` accused of omitting `### Commands` and `Pass / Fail`; `command-router-template.md` accused of omitting the required-argument gate.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 Confirm the agent-template gap against its own contract before editing. Evidence: the skeleton ran from section 0 to a final `## 8. SUMMARY` with no related-resources section in between, and 10 of the 12 shipped agents inherited that omission.
- [x] T-004 Insert `## 8. RELATED RESOURCES` into the skeleton with the summary heading renumbered to `## 9. SUMMARY`. Evidence: `grep -n` on `agent-template.md` reports `## 8. RELATED RESOURCES` at line 682 and `## 9. SUMMARY` at line 696.
- [x] T-005 Confirm the insertion sits inside the fenced skeleton and not in the template's own numbering. Evidence: an `awk` fence walk reports line 682 inside the fence opened at line 505 under `## 8. COMPLETE TEMPLATE` (line 501), with the template's own `## 9. PRODUCTION EXAMPLES` at line 721 outside it.
- [x] T-006 Confirm the command-template gap and add the mandatory input gate. Evidence: the template declared `argument-hint: "<required> [optional]"` with no gate; it now carries `### MANDATORY INPUT GATE` at line 227 behind the `REQUIRED-ARGUMENT GATE` retention instruction at line 223.
- [x] T-007 Confirm the downstream command that inherited the missing gate now carries one. Evidence: `.opencode/commands/design/extract.md` declares a required `<live-url>` at line 3 and carries `### MANDATORY INPUT GATE` at line 14, which forbids inferring the input from history, open files, or repository contents.
- [x] T-008 Run the negative control against the playbook-template accusation before editing it. Evidence: a scenario file built from the shipped scaffold and graded by `validate-playbook-package.cjs` scored PASS with 0 violations, so the accusation was withdrawn and the template left untouched.
- [x] T-009 Identify why the playbook accusation was wrong, not merely that it was. Evidence: `tableFieldPresent()` at line 241 of the validator accepts the scaffold's 9-column scenario table, whose header carries `Exact Command Sequence` and `Pass/Fail Criteria` (template lines 142 and 416); the heading-shaped grep could not see a table-shaped implementation.
- [x] T-010 Re-check the router-template accusation in a non-heading form. Evidence: `command-router-template.md` already teaches the gate as an HTML placeholder comment at lines 53 and 54, which an uppercase grep never matched; the template was cleared unedited.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-011 Verify both confirmed fixes are present in the shipped templates. Evidence: `grep -n` confirms the renumbered related-resources pair in `agent-template.md` and the `MANDATORY INPUT GATE` block in `command-template.md`.
- [x] T-012 Verify both cleared templates carry no edit and record the clearances as part of the phase record. Evidence: `manual-testing-playbook-template.md` and `command-router-template.md` were never written to; both clearances are recorded in `implementation-summary.md` under their own section rather than as a footnote.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- `agent-template.md` carries the related-resources section its own contract requires, inside its fenced skeleton and clear of the template's own numbering.
- `command-template.md` carries the mandatory input gate for required arguments, and the downstream command that had shipped without one now has it.
- Both templates cleared by control are unedited, and each clearance records the specific measurement error that produced the false accusation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent phase map: `../spec.md`.
- Successor phase: `../002-validator-false-positives/`.
<!-- /ANCHOR:cross-refs -->
