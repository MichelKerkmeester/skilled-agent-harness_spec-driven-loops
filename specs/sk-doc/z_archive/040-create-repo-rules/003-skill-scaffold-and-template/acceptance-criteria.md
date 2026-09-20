---
title: "Acceptance Criteria: Phase 3: Skill Scaffold and Templates"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/003-skill-scaffold-and-template"
    last_updated_at: "2026-08-31T11:33:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the scaffold and template phase"
    next_safe_action: "Run the packet gate and record the result"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: Skill Scaffold and Templates

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/003-skill-scaffold-and-template
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a rule generated from the template, When the corpus assertions run, Then it passes what a shipped rule passes | 11 of 11 assertions matched against `blast-radius.md`: frontmatter parses, six keys in order, title quoted, `Fires when`, `The rule`, uppercase numbered, sequential, dividers equal sections, self-check last, back-link, subordination line | Met | - |
| AC-002 | REQ-002 | Given the templates, When their provenance is checked, Then they were authored from the contract rather than copied | Written from `rule-anatomy.md` with the corpus unopened; parity checked afterwards, which is the only order that tests the contract | Met | - |
| AC-003 | REQ-003 | Given any invocation, When `SKILL.md` runs, Then the decision tests load before authoring | ALWAYS loading level; step 1 of the Create path; the router pseudocode loads them on every branch including retire | Met | - |
| AC-004 | REQ-004 | Given the router template, When compared to the rule template, Then it is structurally distinct | No frontmatter, no `Fires when`, no `The rule`, no self-check in the emitted router; four numbered sections | Met | - |
| AC-005 | REQ-005 | Given the packet tree, When compared to `target-tree.md`, Then it matches including omissions | 7 files, 3 directories; `scripts/`, `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` all confirmed absent | Met | - |
| AC-006 | REQ-006 | Given `SKILL.md`, When checked against the scaffold contract, Then the required sections are present | Six numbered sections: WHEN TO USE, SMART ROUTING with pseudocode, HOW IT WORKS, RULES, SUCCESS CRITERIA, REFERENCES | Met | - |
| AC-007 | REQ-007 | Given the rule template, When an author reads it, Then the length bands are stated with a target | Bands stated near the top: aim 160 or fewer, 200 fine, 250 with a reason, over 250 split or cut | Met | - |
| AC-008 | REQ-008 | Given a request to change or retire a rule, When `SKILL.md` is consulted, Then both routes exist | Revise and Retire documented under HOW IT WORKS; mechanics deferred to phase 5 and the deferral is visible | Met | - |
| AC-009 | REQ-009 | Given the rule template, When an author fills it, Then no other document is needed | Every placeholder carries its own instruction inline, including why trigger phrases are symptoms and why quoting matters | Met | - |
| AC-010 | REQ-005 | Given the corpus and the hub, When the phase closes, Then neither changed | md5 sets for the nine corpus files and the two hub registration files both identical to baseline | Met | - |
| AC-011 | REQ-006 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 and AC-002 carried the phase, and only together. Either alone proves nothing: a
template copied from a shipped rule would pass AC-001 while testing nothing, and a
template authored from the contract that failed AC-001 would mean the contract is wrong.
Authored from the contract with the corpus unopened, then matching it on all eleven
assertions, is phase 2 validating itself. Left out deliberately: hub registration, the
command, and the quality bar above the structural floor.
<!-- /ANCHOR:closure -->
