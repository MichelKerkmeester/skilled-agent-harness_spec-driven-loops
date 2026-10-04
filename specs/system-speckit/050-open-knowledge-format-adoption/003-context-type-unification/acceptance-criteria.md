---
title: "Acceptance Criteria: Phase 3: context-type-unification"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/003-context-type-unification"
    last_updated_at: "2026-10-04T08:04:51Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
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
# Acceptance Criteria: Phase 3: context-type-unification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/003-context-type-unification
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the shared JSON exists, When the CLI, the new rule, the Python validator and the advisor checker load their lists, Then none of them holds a literal copy of a value list | `frontmatter-values.json` is read by `context-types.ts`, the rule helper, `validate_document.py` and `check-skill-doc-frontmatter.mjs`; no literal list remains (implementation-summary.md:102) | Met | - |
| AC-002 | REQ-002 | Given a save payload with `review`, `debugging`, `planning` or `decision`, When the CLI processes it, Then project phase, importance tier and memory type match the baseline | Probe of the built CLI: `review`, `debugging`, `planning`, `decision` behave as at HEAD in the normalizer and the session extractor, 0 mismatches (implementation-summary.md:120). `discovery` is the one recorded deviation (implementation-summary.md:134) | Met | - |
| AC-003 | REQ-003 | Given the `FRONTMATTER_VALUES` rule, When it meets a value outside the list, Then it warns and the packet still passes | Registered at warn severity; a planted `architecture` returns `warn`, and strict passes on warnings because `passed` counts errors only (implementation-summary.md:121) | Met | - |
| AC-004 | REQ-004 | Given the outlier docs, When they are cleaned, Then the distinct spec-doc count falls from 33 to the canonical four plus aliases still present, with before and after counts recorded | 33 distinct values before, 12 after, all canonical or listed aliases (implementation-summary.md:122) | Met | - |
| AC-005 | REQ-005 | Given the advisor suite, When it runs before and after, Then its result is identical | Advisor suite 1082 to 1084 passed, the delta being the two new tests; `--coverage` 101 docs and 0 violations both times (implementation-summary.md:117) | Met | - |
| AC-006 | REQ-006 | Given an edited skill doc, When the phase closes, Then it has a bumped four-part version and a changelog entry | Changelog entries written and skill versions bumped in phase 007. Each doc's fourth version digit counts its commits, so it comes from `frontmatter-version.mjs apply` in the commit, and root D4 holds the commit (implementation-summary.md:139) | Unmet | - |
| AC-007 | REQ-007 | Given the warning is about to ship, When the sweep runs over every packet and skill doc, Then it prints zero warnings, and a doc from each generator passes | Sweep 102 warnings before, 0 after; 96 generator templates and assets, 0 warnings (implementation-summary.md:123) | Met | - |

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

Six of seven rows are met. AC-006 waits for the commit, which root decision D4 leaves to the operator. The changelogs and skill versions exist, and each edited doc's own version is derived in that commit.
<!-- /ANCHOR:closure -->
