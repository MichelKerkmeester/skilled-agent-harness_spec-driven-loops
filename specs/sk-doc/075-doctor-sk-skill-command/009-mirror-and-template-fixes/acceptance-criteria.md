---
title: "Acceptance Criteria: Phase 9: mirror-and-template-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "mirror and template fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T05:21:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: mirror-and-template-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/009-mirror-and-template-fixes
**Level:** 2
**Status:** Planned
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited route and YAML, When `rg -c "sync-skills-hermes.cjs --check"` runs on both and `route-validate.sh` runs, Then each file prints 1 or more and route-validate exits 0 | rg and route-validate output | Unmet | - |
| AC-002 | REQ-002 | Given the new contract test, When it runs on the edited files and again with the YAML line removed, Then it passes and then fails | Two `node --test` runs | Unmet | - |
| AC-003 | REQ-003 | Given the fixed template, When `rg -n "in-SKILL.md router" .skilled/skills` runs and the template is JSON-parsed, Then rg exits 1 and the parse exits 0 | rg and node output | Unmet | - |
| AC-004 | REQ-004 | Given `.hermes/` absent (a temp copy), When the route runs, Then the Hermes row prints n/a and no `.hermes/` is created | Transcript and `ls` | Unmet | - |
| AC-006 | REQ-006 | Given the edited route and YAML, When `rg -c "sync-prompts-hermes.cjs --check"` runs on both and the contract test runs with that line removed, Then each file prints 1 or more and the test fails | rg and `node --test` output | Unmet | - |
| AC-005 | REQ-005 | Given both fixes, When `run-all.sh` and `create-journey-proof.test.cjs` run, Then both pass | Test output | Unmet | - |

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

No criterion is met yet, because the phase is planned and not started.
<!-- /ANCHOR:closure -->
