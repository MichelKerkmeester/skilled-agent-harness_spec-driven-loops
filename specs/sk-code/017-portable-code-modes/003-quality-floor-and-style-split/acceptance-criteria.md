---
title: "Acceptance Criteria: Phase 3: quality-floor-and-style-split"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "quality floor and style split acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/003-quality-floor-and-style-split"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every acceptance criterion with observed evidence"
    next_safe_action: "Land the phase and wire it into the parent's phase map"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
      - ".skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: quality-floor-and-style-split

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/017-portable-code-modes/003-quality-floor-and-style-split
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the floor tables, When the linter suite runs, Then every rule has an id and a mark and the FIXED ids equal the non-review fixed ids of `rule-overrides.json` | `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs:182`. Against the old floor: fail 1, `the universal floor tables carry no Id column`. After: pass 12, fail 0 | Met | - |
| AC-002 | REQ-002 | Given the floor, When a reader looks for how a surface changes a rule, Then it finds the contract's precedence and no docstring, strict-typing, naming-scheme or wiring rule | `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:82`. `rg -n "adds rules\|without .any.\|camelCase\|post-edit-quality" <file>` prints nothing | Met | - |
| AC-003 | REQ-003 | Given six SKILLED sample files, When `quality-gate.cjs --explain` runs before and after, Then each lists the same checklists | `specs/sk-code/017-portable-code-modes/003-quality-floor-and-style-split/tasks.md:63` (T014): SAME on the `.cjs`, `.css`, `.ts`, `.py`, `.sh` and `.json` samples | Met | - |
| AC-004 | REQ-004 | Given a foreign repository with `specs/demo/notes.js`, When the runner runs, Then the file gets only the universal floor, and the quality defaults hold no extension row | `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:968` and `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs:69`. Before: F21 fail 1 with the three old rows, map test fail 3. After: pass | Met | - |
| AC-005 | REQ-005 | Given the style guide, When a reader looks for house style, Then it finds only universal rules, CHK-CMT-07 and a MAY for a ceiling marker, and sk-code-skilled defines `ceiling:` | `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md:114` and `:160`, `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md:233` | Met | - |
| AC-006 | REQ-006 | Given Iron Law 3 and the UNKNOWN rows, When read, Then they name the floor, the runner's checks and the repository config's checks and checklists with overrides applied, and no default JavaScript or CSS checklist | `.skilled/skills/sk-code/shared/references/phase-detection.md:109`, `.skilled/skills/sk-code/shared/references/stack-detection.md:32` and `:49`. `rg -n "surface-neutral"` over the hub outside changelogs prints nothing | Met | - |
| AC-007 | REQ-007 | Given the quality SKILL.md, When a reader asks which checklists apply, Then it points at `--explain <path>` and the map lives in sk-code-skilled with a test | `.skilled/skills/sk-code/sk-code-quality/SKILL.md:124`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md:200`, map test pass 3 | Met | - |
| AC-008 | REQ-008 | Given the moved content, When the drift guards, verify-doc-claims and the playbook validator run, Then each passes | `specs/sk-code/017-portable-code-modes/003-quality-floor-and-style-split/tasks.md:54` (T012) and `:65` (T016): `run-all-drift-guards.sh` prints PASS for alignment-drift, stack-folders, router-sync legs 1a to 4 and doc-claims. Playbook validator exit 0 on both packages | Met | - |
| AC-010 | REQ-010 | Given a hub repository whose `.skilled/plugins` links to `../.opencode/plugins`, When the runner reads `.opencode/plugins/a.js`, Then it resolves to SKILLED and lists every JavaScript and CSS house row, and a SKILLED `.js` and `.css` file list them too | `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:986` and `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:1002`. F21b before fail 1, after pass. F21a before fail 1, after pass. F21c (a link to `..` or `../..`) fails 2 on the unguarded code and passes after, F21d (dangling and looping links) passes. `--explain` on the 43 files: 43 SUPERSET | Met | - |
| AC-009 | REQ-009 | Given the three changelog entries, When validated, Then each has 0 issues, the carriers match and Hermes is in sync | `.skilled/skills/sk-code/changelog/v3.9.9.0.md:11`, `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.5.0.md:11` and `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.1.7.0.md:11`: `validate_document.py` 0 issues on each. `parent-skill-check.cjs` OK. `sync-skills-hermes.cjs --check` PASS | Met | - |

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

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
