---
title: "Acceptance Criteria: Phase 6: docs-and-release"
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
    packet_pointer: "sk-git/028-crawlable-commit-history/006-docs-and-release"
    last_updated_at: "2026-09-11T07:16:33Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-skgit-028"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: docs-and-release

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/028-crawlable-commit-history/006-docs-and-release
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the release, When README, changelog and SKILL.md are validated, Then each is VALID and both versions read 1.6.0.0 | three VALID lines, `dcdf2f8441` | Met | - |
| AC-002 | REQ-002 | Given the vocabulary edit, When the metadata gate and package check run, Then both pass | gate checked 13 passed 13 fixed 1; Result: PASS; `8d5acf93d5` | Met | - |
| AC-003 | REQ-003 | Given ADR-005, When the rule and AGENTS.md are edited, Then the freeze paragraph and the identity row exist with the version bumped | `581e2862a5`, diff reviewed in full | Met | - |
| AC-004 | US-002 | Given a commit-id prompt, When the advisor scores it on the main checkout, Then sk-git is recommended at or above the bar | skill-advisor.cjs on the main checkout after the merge: sk-git first, confidence 0.95, score 0.80 | Met | - |

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

AC-001 to AC-003 carried the packet, and AC-004 closed after the merge with the advisor routing a commit-id prompt to sk-git.
<!-- /ANCHOR:closure -->
