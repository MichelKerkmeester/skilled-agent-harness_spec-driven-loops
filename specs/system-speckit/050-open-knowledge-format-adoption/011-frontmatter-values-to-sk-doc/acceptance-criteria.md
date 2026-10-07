---
title: "Acceptance Criteria: Phase 11: frontmatter-values-to-sk-doc"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "frontmatter values to sk doc acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc"
    last_updated_at: "2026-10-04T19:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All eight criteria met with evidence"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: frontmatter-values-to-sk-doc

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new file, When its lists are compared with the old file's, Then the document values, document aliases, tiers and tier aliases match and no session list is present | JSON comparison: document values, document aliases, tiers and tier aliases equal to the old file; keys `contextType`, `importanceTier` only (implementation-summary.md, Verification) | Met | - |
| AC-002 | REQ-002 | Given the move is done, When `rg` searches for the old path outside `specs/`, Then nothing matches and the old file is absent | `test -e` on the old path exits 1; `rg` outside `specs/` finds nothing (`scratch/after/old-path-rg.txt`) | Met | - |
| AC-003 | REQ-003 | Given `context-types.ts`, When its exports are listed, Then every set and map holds the baseline values and `SESSION_CONTEXT_TYPES` holds the same 11 values | `scratch/after/exports-src.json` byte-identical to `scratch/baseline/exports-src.json`, `SESSION_CONTEXT_TYPES` 11 values | Met | - |
| AC-004 | REQ-004 | Given the spec-kit build, When it runs and `dist/context-types.js` is loaded, Then the build exits 0 and the loaded exports match the baseline | `tsc --build` exit 0; `scratch/after/exports-dist.json` byte-identical to the baseline | Met | - |
| AC-005 | REQ-005 | Given the four test sets, When they run after the move, Then each passes with no fewer passing tests than its baseline | Shared 18/18, CLI vitest 1,671 passed 19 skipped, sk-doc 7/7, advisor 2/2, each equal to `scratch/baseline/` | Met | - |
| AC-006 | REQ-006 | Given the file is missing, When each reader runs, Then the TypeScript module, the rule helper and the advisor checker fail naming the new path, and `validate_document.py` stays silent | `scratch/missing-file.txt`: module throws naming `sk-doc/sk-create-frontmatter/assets/frontmatter-values.json` from source and `dist`, helper exits 2 and advisor throws ENOENT naming the full path, `validate_document.py` loads `None` with no warning | Met | - |
| AC-007 | REQ-007 | Given phase 008's corpus sweep, When it reruns, Then both checkers print the same warnings as their baseline | `scratch/after/corpus.json`: the same 7 warnings per checker as `scratch/baseline/corpus.json`, all in phase 008 model-writer docs | Met | - |
| AC-008 | REQ-008 | Given the move, When the owner docs are read, Then `sk-create-frontmatter`'s `SKILL.md` and `README.md` name the list and root decision D1 carries an amendment | `sk-create-frontmatter/README.md` "What It Owns" and `SKILL.md` integration points name the file; `002/decision-record.md` ADR-001 carries the Amended row | Met | - |

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

All eight criteria are met. Past phase docs and `scratch/` evidence that name the old path were left as written, since they record what was true then.
<!-- /ANCHOR:closure -->
