---
title: "Implementation Summary: Template Conformance Gaps"
description: "Two authoring templates now carry the element their own contract required; two more were accused on the same kind of evidence and cleared by control, unedited."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "template conformance gaps implementation"
  - "cleared template negative control summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/032-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening/001-template-conformance-gaps"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped two template fixes and withdrew two accusations that failed control"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-template.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md"
      - ".opencode/commands/design/extract.md"
    session_dedup:
      fingerprint: "sha256:e480484338d164fdf0d8d1716a4acdc55d55dd2f709de196d66421a59095ea22"
      session_id: "2026-08-29-sk-code-032-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Template Conformance Gaps

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-template-conformance-gaps |
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — two templates fixed at their source, two accusations withdrawn after failing their controls |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four templates were accused of omitting an element their own contract required. Two of the accusations held and were fixed. Two did not, and the templates were left alone. Both outcomes are the deliverable.

1. **The agent template now carries the section its own contract required.** `sk-create-agent/SKILL.md` "Required Body Shape" item 7 requires a related-resources section, and `agent-template.md`'s skeleton ran from section 0 straight to a final `## 8. SUMMARY` without one. Ten of the twelve shipped agents inherited that omission, which is what a template defect looks like from the outside: not twelve independent oversights, but one defect wearing twelve costumes. `## 8. RELATED RESOURCES` now sits at line 682 ahead of a renumbered `## 9. SUMMARY` at line 696.

2. **The insertion was placed inside the fenced skeleton, and that was checked rather than assumed.** `agent-template.md` already owns sections numbered 8 and 9 of its own. A fence walk confirms line 682 falls inside the fence opened at line 505, under `## 8. COMPLETE TEMPLATE` at line 501, while the template's own `## 9. PRODUCTION EXAMPLES` sits at line 721, outside it. The inserted numbering belongs to the artifact the skeleton generates, not to the template that carries it, so the two do not collide.

3. **The command template now carries a mandatory input gate.** `sk-create-command/SKILL.md` Step 7 requires a gate whenever `argument-hint` declares a required `<argument>`, and `command-template.md` declared `argument-hint: "<required> [optional]"` with no gate at all. It now carries `### MANDATORY INPUT GATE` at line 227, introduced by a `REQUIRED-ARGUMENT GATE` retention instruction at line 223 telling the author to keep the block whenever the hint declares a required argument. Downstream, `.opencode/commands/design/extract.md` had shipped a required `<live-url>` with no gate; it now carries its own at line 14, explicitly forbidding the command from inferring the URL from conversation history, open files, or repository contents.

4. **Two templates were accused on the same kind of evidence and cleared.** This is recorded in full below because it is the more useful half of the phase.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase began from a grep sweep that named four templates as non-conforming. Two of those four accusations were false, and the only reason that is known is that each one was graded against a control before any file was edited.

The first withdrawal concerns `sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`. The claim was that it omitted `### Commands` and `Pass / Fail`, which are required elements of every scenario. A scenario file was built from the shipped scaffold and run through `validate-playbook-package.cjs` — the same instrument that grades real playbook packages — and it scored PASS with 0 violations. The template was fine. The measurement was not: the scaffold implements those elements as a 9-column scenario table whose header carries `Exact Command Sequence` and `Pass/Fail Criteria` (template lines 142 and 416), and the validator accepts exactly that form through its `tableFieldPresent()` check at line 241. A grep for a heading cannot see a table that satisfies the same requirement. Had the accusation been trusted, a correct template would have been edited to satisfy a pattern rather than a contract, and the next author would have inherited the damage.

The second withdrawal concerns `command-router-template.md`, accused of omitting the required-argument gate. It already teaches that gate, as an HTML placeholder comment at lines 53 and 54 instructing the author to add the mandatory input gate before the router contract when `argument-hint` declares a required `<argument>`. The original search was case-sensitive and heading-shaped, so it never matched. The template was left untouched.

The two confirmed defects were handled the same way in reverse: the contract clause was read directly from its SKILL.md rather than recalled, the template was checked against it, and only then was the fix written — placed where the template's own structure allowed, and verified in position rather than assumed to be correct.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Grade every accusation with a control before editing | Two of the four accusations were false. Editing a correct template is not a harmless error: it damages a document that already worked and propagates the damage into every artifact authored from it afterwards. The cost of one control run is far below the cost of one wrong edit. |
| Record the two clearances as a first-class part of the phase, not a footnote | The withdrawn accusations carry the transferable lesson: a heading-shaped grep cannot see a table-shaped or comment-shaped implementation of the same requirement. A record that reported only the two successful fixes would have taught the opposite of what happened. |
| Place the agent-template fix inside the fenced skeleton, and verify the fence | The template owns its own sections 8 and 9. Inserting a second pair without checking the fence boundary would have produced duplicate numbering in the template itself. The fence walk turned that from an assumption into a checked fact. |
| Fix the template rather than only the artifacts that inherited the gap | Ten of twelve agents shared one omission with identical shape. Repairing only the artifacts would have left the next agent authored from the template free to reproduce it. |
| Leave both governing SKILL.md contracts unchanged | In both confirmed cases the contract was already right and only the template disagreed with it. Changing the contract to match a defective template would have ratified the defect. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Agent template carries the required section | PASS — `## 8. RELATED RESOURCES` at line 682, renumbered `## 9. SUMMARY` at line 696 |
| Insertion is inside the fenced skeleton | PASS — fence walk puts line 682 inside the fence opened at line 505 under `## 8. COMPLETE TEMPLATE`; the template's own `## 9. PRODUCTION EXAMPLES` at line 721 is outside and unaffected |
| Command template carries the mandatory gate | PASS — `### MANDATORY INPUT GATE` at line 227 behind the `REQUIRED-ARGUMENT GATE` retention instruction at line 223 |
| Downstream ungated command is fixed | PASS — `.opencode/commands/design/extract.md` declares required `<live-url>` at line 3 and gates it at line 14, forbidding inference from history, open files, or repository contents |
| Playbook-template accusation, negative control | WITHDRAWN — a scenario built from the shipped scaffold scored PASS with 0 violations under `validate-playbook-package.cjs`; template unedited |
| Playbook-template accusation, cause of the error | PASS — `tableFieldPresent()` at validator line 241 accepts the scaffold's 9-column table, whose header carries `Exact Command Sequence` and `Pass/Fail Criteria` at template lines 142 and 416 |
| Router-template accusation | WITHDRAWN — the gate is already taught as an HTML placeholder comment at lines 53 and 54; template unedited |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The downstream artifacts are not all repaired by this phase.** Fixing `agent-template.md` stops the omission from recurring; it does not retroactively edit the agents that already inherited it. That remediation is tracked separately and is not claimed here.
2. **Only the four accused templates were examined.** The same class of defect — a template quietly disagreeing with its own SKILL.md — is plausible elsewhere in `sk-doc` and was not swept for. Nothing in this phase should be read as a clean bill of health for the templates it never opened.
3. **The template edits were uncommitted at the time this summary was written.** Committing them is a separate action outside this phase's documentation scope.
<!-- /ANCHOR:limitations -->
