---
title: "Acceptance Criteria: Phase 3: check-and-template-canon"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "check and template canon acceptance criteria"
  - "phase 3 check and template canon closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon"
    last_updated_at: "2026-10-29T07:52:43Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for the phase plan"
    next_safe_action: "Meet, waive or supersede the open criteria after the build"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: check-and-template-canon

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-check-and-template-canon
**Level:** 1
**Status:** Draft
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a mode packet with a sibling `ROUTER.md`, When `package_skill.py --strict` and check 12b read it, Then neither reports RS-004, and the same packet with the file removed reports it | `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` and `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` print the two cases | Unmet | - |
| AC-002 | REQ-001 | Given a `ROUTER.md` whose real path leaves the skill folder, When either check reads it, Then RS-004 names the escape instead of passing the file | The fixture case asserts `routing shape RS-004` on a symlinked router | Unmet | - |
| AC-003 | REQ-002 | Given the current hub `SKILL.md`, When the pointer rule runs, Then it passes, and a copy with the `ROUTER.md` link removed fails RS-005 | The new RS-005 case in `test_routing_shape.py` and the doctor suite | Unmet | - |
| AC-004 | REQ-003 | Given a `SKILL.md` that still ends with a `## MACHINE ROUTER` section, When RS-002 runs, Then it reports the section and names the sibling `ROUTER.md` as its home, with or without a code block | The restated message in both suites, including a fixture with prose only | Unmet | - |
| AC-005 | REQ-004 | Given the fleet tree, When the root-router gate runs, Then `sk-git` gets a router result, and 12a prints one line per declared packet | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` | Unmet | - |
| AC-006 | REQ-005 | Given the unmoved tree, When the ledger is read, Then it holds 54 entries and the ratchet suite accepts the raised ceiling | `rg -c '"lines":' .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` prints 54, `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` prints `pass 4` | Unmet | - |
| AC-007 | REQ-006 | Given the templates, workflows and canon docs, When they are searched for the old packet rule, Then no current document keeps it | `rg 'mode packet carries its own ROUTER.md' .skilled/skills/sk-doc/sk-create-skill` prints only the changelog history | Unmet | - |
| AC-008 | REQ-007 | Given a fresh standalone scaffold, When `init_skill.py` finishes, Then the skill folder holds `ROUTER.md` beside `SKILL.md` | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py router-fixture --path /tmp/router-fixture-root` then `ls /tmp/router-fixture-root/router-fixture` | Unmet | - |
| AC-009 | REQ-008 | Given the final tree, When the changelog and the suites run, Then `validate_document.py` reports 0 issues and every suite prints at least its baseline count | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/changelog/v1.8.0.0.md` and the nine suites | Unmet | - |

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

**Closeable:** No

The phase has not started, and AC-001 is the first criterion the build must meet.
<!-- /ANCHOR:closure -->
