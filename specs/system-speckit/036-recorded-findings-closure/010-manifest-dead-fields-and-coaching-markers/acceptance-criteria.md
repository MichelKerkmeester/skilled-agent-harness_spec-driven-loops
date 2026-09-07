---
title: "Acceptance Criteria: Phase 10: manifest-dead-fields-and-coaching-markers"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "manifest dead field acceptance"
  - "scaffold marker closure gate"
  - "extension guide ac traceability"
  - "coaching marker waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/010-manifest-dead-fields-and-coaching-markers"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-010-manifest-dead-fields-and-coaching-markers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: manifest-dead-fields-and-coaching-markers

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-recorded-findings-closure/010-manifest-dead-fields-and-coaching-markers
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given spec-kit-docs.json's 16 documents[] entries, When creationTrigger and absenceBehavior are removed, Then EXTENSION-GUIDE.md's description of them is removed in the same change | `grep -c "creationTrigger\|absenceBehavior" .opencode/skills/system-spec-kit/templates/spec-kit-docs.json .opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` returns 0 | Met | - |
| AC-002 | REQ-002 | Given create.sh's two scaffold marker blocks, When they are removed, Then a freshly scaffolded packet's spec.md and plan.md carry neither block | A throwaway `create.sh` scaffold run at Level 3+, output inspected for the two marker strings | Met | - |
| AC-003 | REQ-003 | Given the manifest and create.sh edits, When the three named suites run, Then all three pass at the same count as before the edit | `npx vitest run scaffold-golden-snapshots.vitest.ts template-version-parity.vitest.ts level-contract-resolver.vitest.ts` | Met | - |
| AC-004 | REQ-004 | Given the edited tree, When a repo-wide grep runs for the four removed names, Then no hit appears outside git history | `rg -n -e creationTrigger -e absenceBehavior -e SCAFFOLD_VALIDATION_COUNTS -e SCAFFOLD_AI_PROTOCOL_MARKERS .opencode/skills/system-spec-kit` returns nothing | Met | - |

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

Not started. This packet stays Planned until the four criteria above move from Unmet to Met, Waived or Superseded.
<!-- /ANCHOR:closure -->
