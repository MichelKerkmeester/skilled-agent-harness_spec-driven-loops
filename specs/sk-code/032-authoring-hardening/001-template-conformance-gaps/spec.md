---
title: "Spec: Template Conformance Gaps"
description: "Two authoring templates omitted the element their own SKILL.md contract required, so every artifact generated from them inherited the omission; a third template was blamed on grep evidence and then cleared by a negative control."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "template conformance gaps"
  - "agent template related resources gap"
  - "command template mandatory input gate"
  - "cleared template hypothesis"
importance_tier: "high"
contextType: "spec"
parent: "sk-code/032-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening/001-template-conformance-gaps"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed two authoring templates and cleared a third by negative control"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-template.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md"
      - ".opencode/commands/design/extract.md"
    session_dedup:
      fingerprint: "sha256:eb9a477fb6cd7964d570eee40b343af16f9650a5f81ff5904788fe3825e3c8db"
      session_id: "2026-08-29-sk-code-032-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Template Conformance Gaps

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-template-conformance-gaps |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-code/032-authoring-hardening` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | `002-validator-false-positives` |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

An authoring template is the highest-leverage document in a documentation system: it is copied, not read, so any element it omits is omitted everywhere downstream, silently and identically. Two templates in `sk-doc` shipped skeletons that left out the very element their own governing SKILL.md required, and the omission then appeared in the artifacts authored from them. `sk-create-agent/assets/agent-template.md` shipped a skeleton running from section 0 straight to a final `## 8. SUMMARY` with no related-resources section anywhere in between, while `sk-create-agent/SKILL.md`'s "Required Body Shape" item 7 required one; 10 of the 12 shipped agents lacked it. `sk-create-command/assets/command-template.md` declared `argument-hint: "<required> [optional]"` with no input gate at all, while `sk-create-command/SKILL.md` Step 7 requires a mandatory gate whenever `argument-hint` carries a required `<argument>`; downstream, `.opencode/commands/design/extract.md` shipped a required `<live-url>` with no gate, so the command was free to infer the one input it must be given.

The second and larger purpose of this phase is a correction, and it matters more than either fix. A third template was blamed and then cleared. The claim was that `sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` omitted `### Commands` and `Pass / Fail`. A negative control disproved it: a scenario file was built from the shipped scaffold and run through the validator, and it scored PASS with 0 violations. The validator accepts the scaffold's 9-column table form through its `tableFieldPresent()` check, so the heading-shaped grep that produced the accusation had measured the wrong thing. The playbook template needed no change. `command-router-template.md` was cleared the same way: it already teaches the gate as an HTML placeholder comment that an uppercase grep never saw. Two of the four templates accused in this phase were innocent, and the only reason that is known is that each accusation was run against a control before an edit was made.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `sk-create-agent/assets/agent-template.md` and `sk-create-command/assets/command-template.md`, the two templates confirmed to contradict their own SKILL.md contracts; the negative controls that tested the same accusation against `manual-testing-playbook-template.md` and `command-router-template.md`; and confirmation that the two confirmed fixes are present in the shipped templates.

Out of scope: editing `manual-testing-playbook-template.md` or `command-router-template.md`, both cleared by control; re-authoring the downstream agents and commands that inherited the agent-template omission, which is separate remediation; changing either governing SKILL.md contract, since in both confirmed cases the contract was already correct and only the template disagreed with it.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** `agent-template.md` carries a related-resources section ahead of its skeleton's final summary heading, so an agent authored from it satisfies "Required Body Shape" item 7 by default rather than by the author remembering.
- **REQ-002 [P1]** The inserted section sits inside the template's own fenced skeleton block, so it does not collide with the template's own numbered sections outside the fence.
- **REQ-003 [P1]** `command-template.md` carries a mandatory input gate wherever `argument-hint` declares a required `<argument>`, matching `sk-create-command/SKILL.md` Step 7.
- **REQ-004 [P1]** Every template accused of a gap is tested against a control before it is edited. A template that passes its control is left untouched and its clearance is recorded.
- **REQ-005 [P2]** The clearance record names why the original evidence was wrong, not merely that it was wrong, so the same measurement error is not repeated.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `agent-template.md` contains `## 8. RELATED RESOURCES` followed by a renumbered `## 9. SUMMARY`, both inside the fenced skeleton opened by `## 8. COMPLETE TEMPLATE`, with the template's own `## 9. PRODUCTION EXAMPLES` still outside that fence and unaffected.
- **SC-002** `command-template.md` contains a `MANDATORY INPUT GATE` block together with the retained-when-required instruction that governs it, and the downstream command that shipped an ungated required argument now carries its own gate.
- **SC-003** A scenario file built from the shipped playbook scaffold and run through the validator scores PASS with 0 violations, disproving the accusation against `manual-testing-playbook-template.md` rather than arguing it away.
- **SC-004** `command-router-template.md` is shown to already teach the required-argument gate, so it too is left unedited.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Editing an innocent template.** This was the live risk, and it nearly happened twice. Mitigated by requiring a control run before any template edit: the playbook template and the router template were both accused on grep evidence and both survived their controls untouched.
- **Trusting a grep as a measurement.** A heading-shaped search cannot see a table-shaped or comment-shaped implementation of the same requirement. Mitigated by grading the accusation with the same validator that grades real artifacts, rather than with the pattern that raised it.
- **Renumbering colliding with the template's own sections.** `agent-template.md` already had its own sections 8 and 9 outside the skeleton. Mitigated by confirming the inserted pair sits inside the fenced skeleton block, where the numbering belongs to the generated artifact and not to the template.
- **Dependencies.** `sk-create-agent/SKILL.md` "Required Body Shape" and `sk-create-command/SKILL.md` Step 7 as the governing contracts, and `validate-playbook-package.cjs` as the control instrument for the playbook accusation. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Both confirmed defects were checked against the written contract before being fixed, and both accusations that did not survive their controls were withdrawn and recorded rather than quietly dropped.

<!-- /ANCHOR:questions -->
