---
title: "Acceptance Criteria: Phase 2: Inventory and Skill Contract"
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
    packet_pointer: "sk-doc/040-create-repo-rules/002-inventory-and-skill-contract"
    last_updated_at: "2026-08-31T11:33:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the inventory and contract phase"
    next_safe_action: "Capture the corpus baseline, then parse all nine files"
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
# Acceptance Criteria: Phase 2: Inventory and Skill Contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/040-create-repo-rules/002-inventory-and-skill-contract
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
| AC-001 | REQ-001 | Given any element in the anatomy contract, When its citation is followed, Then it resolves to a shipped rule that uses it | Every MUST element in `rule-anatomy.md` section 1 carries a count from the element table: 10 elements at 8/8, the divider invariant at 9/9 | Met | - |
| AC-002 | REQ-002 | Given a structural divergence between rules, When the contract is read, Then it is recorded and classified | The line-ceiling breach recorded with all five files named, and resolved by operator-set bands (250/200/160) that the corpus fits three-two-three-none; the cross-reference sparsity recorded as a finding that changes the default to zero | Met | - |
| AC-003 | REQ-003 | Given content that must bind on every turn, When the decision tests are applied, Then it is refused and routed to `AGENTS.md` | Test 1 states it and cites the research phase finding that 18 `AGENTS.md` row-groups "reduce to one property - always-loaded force" | Met | - |
| AC-004 | REQ-004 | Given a proposed rule the router's scope excludes, When the tests are applied, Then it is refused with the scope clause quoted | Test 2 quotes the router's section 4 In/Out text verbatim; Test 3 states the four-part test and cites the adoption phase that used it | Met | - |
| AC-005 | REQ-005 | Given a task a sibling mode already owns, When the boundary is consulted, Then it names the sibling | `mode-boundary.md` section 2: ten exclusions, each naming the sibling mode that owns it | Met | - |
| AC-006 | REQ-006 | Given the contract, When a generator reads it, Then MUST-carry and MAY-carry are distinguishable | Sections 1 and 2 of `rule-anatomy.md` are separate MUST and MAY sets; each MAY element records why it varies | Met | - |
| AC-007 | REQ-007 | Given the frontmatter schema, When a generated rule uses it, Then the result parses as YAML | Section 5 records the six-key schema and the quoting rule, with the reason: all eight failed to parse on first authoring because `title` always contains a colon | Met | - |
| AC-008 | REQ-008 | Given a generated rule, When the integration surface is read, Then every file it must touch is named | `mode-boundary.md` section 1 names the rule file, both router rows, and the pointer from the governed section | Met | - |
| AC-009 | REQ-009 | Given the target tree, When it is compared to a sibling mode, Then every directory is inherited or justified | `target-tree.md` cites `sk-create-command` as the inherited layout and justifies all four omissions, three with a named precedent | Met | - |
| AC-010 | REQ-001 | Given the decision tests, When applied to the ten candidates phase 1 refused, Then all ten fail for the same recorded reason | `scratch/refusal-reproduction.md`: 10 of 10 candidates still refused, each by the test its original recorded reason names. The original (a)-(d) conditions map one-to-one onto the recovered four-part test | Met | - |
| AC-011 | REQ-002 | Given the corpus, When the phase closes, Then it is byte-unchanged | md5 set of the nine corpus files identical to the baseline captured before any tool ran | Met | - |
| AC-012 | REQ-006 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

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

AC-001 and AC-010 carried the phase. Every MUST element carries a measured count rather
than a citation to one example, and the recovered decision tests refuse all ten original
candidates by the tests their original reasons name - which is what separates a recovery
from a plausible reconstruction. The inventory also earned its cost twice over: it found a
ceiling exceeded by five of eight files, and it settled the router-generation question by
measurement instead of preference. Left open and named: nothing validates a generated rule
against this contract, and the router template is specified but not yet examined at depth.
<!-- /ANCHOR:closure -->
